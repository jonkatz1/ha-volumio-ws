"""Volumio WebSocket integration for Home Assistant."""

from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_PORT, Platform
from homeassistant.core import HomeAssistant

from .const import DOMAIN, CONF_NAME, DEFAULT_PORT, DEFAULT_NAME
from .coordinator import VolumioWebSocketCoordinator

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.MEDIA_PLAYER, Platform.SENSOR]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Volumio WebSocket from a config entry."""
    host = entry.data[CONF_HOST]
    port = entry.data.get(CONF_PORT, DEFAULT_PORT)
    name = entry.data.get(CONF_NAME, DEFAULT_NAME)

    coordinator = VolumioWebSocketCoordinator(hass, host, port, name)

    try:
        await coordinator.async_connect()
    except Exception as err:
        _LOGGER.error("Failed to connect to Volumio at %s:%s: %s", host, port, err)
        return False

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # TODO: Register custom services (search, playlist CRUD, etc.)
    # await async_register_services(hass)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a Volumio WebSocket config entry."""
    coordinator: VolumioWebSocketCoordinator = hass.data[DOMAIN][entry.entry_id]
    await coordinator.async_disconnect()

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok
