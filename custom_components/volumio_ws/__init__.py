"""Volumio WebSocket integration for Home Assistant."""

from __future__ import annotations

import logging

import aiohttp

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_PORT, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, CONF_NAME, DEFAULT_PORT, DEFAULT_NAME
from .coordinator import VolumioWebSocketCoordinator
from .services import register_services

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.MEDIA_PLAYER, Platform.SENSOR]


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

    Registers services once for all config entries.
    Called before any async_setup_entry.
    """
    register_services(hass)
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
        _LOGGER.error("Failed to connect to Volumio at %s:%s: %s", host, port, err)
        return False

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a Volumio WebSocket config entry."""
    coordinator: VolumioWebSocketCoordinator = hass.data[DOMAIN][entry.entry_id]
    await coordinator.async_disconnect()

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok
