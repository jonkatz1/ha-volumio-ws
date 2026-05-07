"""Volumio WebSocket integration for Home Assistant."""

from __future__ import annotations

import logging
import os

import aiohttp

from homeassistant.config_entries import ConfigEntry
from homeassistant.components import panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.const import CONF_HOST, CONF_PORT, Platform
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, CONF_NAME, DEFAULT_PORT, DEFAULT_NAME
from .coordinator import VolumioWebSocketCoordinator
from .services import register_services
from .ws_api import async_register_ws_api

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.MEDIA_PLAYER, Platform.SENSOR]

# Panel configuration
PANEL_ICON = "mdi:speaker"
PANEL_TITLE = "Volumio"
PANEL_URL_PATH = "volumio"
PANEL_COMPONENT_NAME = "volumio-panel"
PANEL_JS_FILENAME = "volumio-panel.js"


async def _fetch_system_version(hass: HomeAssistant, host: str, port: int) -> str | None:
    """Fetch Volumio system version via REST API (one-time call).

    GET http://{host}:{port}/api/v1/getSystemVersion
    Returns version string (e.g. '3.912') or None on failure.
    """
    url = f"http://{host}:{port}/api/v1/getSystemVersion"
    session = async_get_clientsession(hass)
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as resp:
            if resp.status == 200:
                data = await resp.json()
                # Expected fields: systemversion (and possibly others)
                version = data.get("systemversion")
                if version:
                    _LOGGER.debug("Volumio system version: %s", version)
                    return str(version)
                _LOGGER.debug("getSystemVersion response missing 'systemversion': %s", data)
            else:
                _LOGGER.warning("getSystemVersion returned status %s", resp.status)
    except Exception as err:
        _LOGGER.warning("Failed to fetch Volumio system version: %s", err)
    return None


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Volumio WebSocket integration (domain-level).

    Registers services and WS API commands once for all config entries.
    Called before any async_setup_entry.
    """
    register_services(hass)
    async_register_ws_api(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Volumio WebSocket from a config entry."""
    host = entry.data[CONF_HOST]
    port = entry.data.get(CONF_PORT, DEFAULT_PORT)
    name = entry.data.get(CONF_NAME, DEFAULT_NAME)

    coordinator = VolumioWebSocketCoordinator(hass, host, port, name)

    # Fetch system version via REST (one-time, non-blocking on failure)
    coordinator.sw_version = await _fetch_system_version(hass, host, port)

    try:
        await coordinator.async_connect()
    except Exception as err:
        _LOGGER.warning(
            "Cannot connect to Volumio at %s:%s: %s — will retry", host, port, err
        )
        raise ConfigEntryNotReady(
            f"Cannot connect to Volumio at {host}:{port}"
        ) from err

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Register the sidebar panel (once, first entry wins)
    await _async_register_panel(hass, entry)

    return True


async def _async_register_panel(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Register the Volumio sidebar panel (once).

    Serves the panel JS file via a static path and registers
    a custom panel in the HA sidebar. Skips if already registered
    (handles multiple config entries gracefully).
    """
    # Check if panel is already registered (avoid duplicates)
    if PANEL_URL_PATH in hass.data.get("frontend_panels", {}):
        _LOGGER.debug("Panel already registered, skipping")
        return

    host = entry.data[CONF_HOST]
    port = entry.data.get(CONF_PORT, DEFAULT_PORT)

    # Path to the built JS bundle
    panel_dir = os.path.join(os.path.dirname(__file__), "frontend")
    static_url = f"/{DOMAIN}_panel"

    # Register the static file path so HA serves the JS file
    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(static_url, panel_dir, cache_headers=False)]
        )
    except Exception as err:
        _LOGGER.error("Failed to register panel static path: %s", err)
        return

    # Register the custom panel in the sidebar
    try:
        await panel_custom.async_register_panel(
            hass,
            webcomponent_name=PANEL_COMPONENT_NAME,
            frontend_url_path=PANEL_URL_PATH,
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            module_url=f"{static_url}/{PANEL_JS_FILENAME}",
            embed_iframe=False,
            require_admin=False,
            config={
                "config_entry_id": entry.entry_id,
                "volumio_url": f"http://{host}:{port}",
            },
        )
        _LOGGER.info("Volumio panel registered in sidebar")
    except Exception as err:
        _LOGGER.error("Failed to register panel: %s", err)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a Volumio WebSocket config entry."""
    coordinator: VolumioWebSocketCoordinator = hass.data[DOMAIN][entry.entry_id]
    await coordinator.async_disconnect()

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok
