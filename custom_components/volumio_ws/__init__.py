"""Volumio WebSocket integration for Home Assistant."""

from __future__ import annotations

import logging
import os

import aiohttp

from homeassistant.config_entries import ConfigEntry
from homeassistant.components import panel_custom
from homeassistant.components.frontend import async_remove_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.const import CONF_HOST, CONF_PORT, Platform
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, CONF_NAME, DEFAULT_PORT, DEFAULT_NAME
from .art_proxy import async_register_art_proxy
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

# Key to track whether the static path for the panel JS has been registered
# (survives panel unregister/re-register cycles within a single HA lifetime).
_PANEL_STATIC_KEY = f"{DOMAIN}_panel_static"


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
    async_register_art_proxy(hass)
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

    # Platform forwarding is core — failure here rolls back the entry so HA
    # retries cleanly. Without this rollback, a failed platform setup would
    # leave the coordinator connected and stored in hass.data with no
    # corresponding loaded entry.
    try:
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    except Exception:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        await coordinator.async_disconnect()
        raise

    # Panel is best-effort — failure here must NOT fail the setup. Entities
    # and services are the contract; the panel is opt-in UX. If registration
    # breaks for environment-specific reasons, we log and continue so the
    # user still gets a working integration.
    if entry.options.get("enable_panel", True):
        try:
            await _async_register_panel(hass, entry)
        except Exception as err:
            _LOGGER.warning("Failed to register sidebar panel: %s", err)

    # Listen for option changes (panel toggle)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    return True


# ── Panel helpers ────────────────────────────────────────────────────


async def _async_ensure_static_path(hass: HomeAssistant) -> bool:
    """Register the static path for the panel JS bundle (once per HA lifetime).

    Returns True if the static path is available, False on failure.
    This survives panel unregister/re-register cycles — the JS file
    stays served even when the sidebar entry is removed.
    """
    if hass.data.get(_PANEL_STATIC_KEY):
        return True

    panel_dir = os.path.join(os.path.dirname(__file__), "frontend")
    static_url = f"/{DOMAIN}_panel"

    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(static_url, panel_dir, cache_headers=False)]
        )
        hass.data[_PANEL_STATIC_KEY] = True
        return True
    except Exception as err:
        _LOGGER.error("Failed to register panel static path: %s", err)
        return False


async def _async_register_panel(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Register the Volumio sidebar panel.

    Ensures the static path is registered, then adds the sidebar entry.
    Skips if the panel is already present (handles multiple config entries).
    """
    # Already in the sidebar — nothing to do
    if PANEL_URL_PATH in hass.data.get("frontend_panels", {}):
        _LOGGER.debug("Panel already registered, skipping")
        return

    if not await _async_ensure_static_path(hass):
        return

    host = entry.data[CONF_HOST]
    port = entry.data.get(CONF_PORT, DEFAULT_PORT)
    static_url = f"/{DOMAIN}_panel"

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


@callback
def _async_unregister_panel(hass: HomeAssistant) -> None:
    """Remove the Volumio sidebar panel (if present)."""
    if PANEL_URL_PATH in hass.data.get("frontend_panels", {}):
        async_remove_panel(hass, PANEL_URL_PATH)
        _LOGGER.info("Volumio panel removed from sidebar")


def _any_entry_has_panel_enabled(hass: HomeAssistant) -> bool:
    """Return True if any loaded config entry has the panel enabled."""
    for entry_id in hass.data.get(DOMAIN, {}):
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry and entry.options.get("enable_panel", True):
            return True
    return False


# ── Update listener ──────────────────────────────────────────────────


async def _async_update_listener(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Handle config entry options update (panel toggle)."""
    if _any_entry_has_panel_enabled(hass):
        # Find the first entry with panel enabled to use for registration
        for entry_id in hass.data.get(DOMAIN, {}):
            e = hass.config_entries.async_get_entry(entry_id)
            if e and e.options.get("enable_panel", True):
                await _async_register_panel(hass, e)
                break
    else:
        _async_unregister_panel(hass)


# ── Unload ───────────────────────────────────────────────────────────


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a Volumio WebSocket config entry.

    Unload order: platforms first, coordinator disconnect after. Platform
    teardown (async_will_remove_from_hass on entities) may still need the
    coordinator. Disconnecting first would leave platforms operating against
    a dead transport during their teardown. If platform unload fails, we
    keep the coordinator alive so HA can retry — disconnecting in that case
    would leave HA in a broken state (entry still loaded, transport dead).
    """
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        coordinator: VolumioWebSocketCoordinator = hass.data[DOMAIN].pop(entry.entry_id)
        await coordinator.async_disconnect()

        # Remove panel if no remaining entries have it enabled
        if not _any_entry_has_panel_enabled(hass):
            _async_unregister_panel(hass)

    return unload_ok
