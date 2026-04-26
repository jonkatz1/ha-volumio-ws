"""Sensor entities for Volumio audio metadata."""

from __future__ import annotations

import logging

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, AUDIO_SENSORS
from .coordinator import VolumioWebSocketCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Volumio audio metadata sensors."""
    coordinator: VolumioWebSocketCoordinator = hass.data[DOMAIN][entry.entry_id]

    entities = [
        VolumioAudioSensor(coordinator, entry, key, config)
        for key, config in AUDIO_SENSORS.items()
    ]
    async_add_entities(entities)


class VolumioAudioSensor(SensorEntity):
    """Sensor for Volumio audio metadata (sample rate, bit depth, etc.)."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: VolumioWebSocketCoordinator,
        entry: ConfigEntry,
        key: str,
        config: dict,
    ) -> None:
        """Initialize the sensor."""
        self.coordinator = coordinator
        self._key = key
        self._attr_unique_id = f"{DOMAIN}_{entry.entry_id}_{key}"
        self._attr_name = config["name"]
        self._attr_icon = config["icon"]
        self._attr_native_unit_of_measurement = config["unit"]
        self._attr_device_info = {
            "identifiers": {(DOMAIN, entry.entry_id)},
        }
        self._unregister_listener: callable | None = None

    @property
    def available(self) -> bool:
        """Return True if available."""
        return self.coordinator.connected

    @property
    def native_value(self) -> str | None:
        """Return the sensor value."""
        value = self.coordinator.state.get(self._key)
        if value is not None:
            return str(value)
        return None

    async def async_added_to_hass(self) -> None:
        """Register state listener."""
        self._unregister_listener = self.coordinator.register_state_listener(
            self._handle_state_update
        )

    async def async_will_remove_from_hass(self) -> None:
        """Unregister listener."""
        if self._unregister_listener:
            self._unregister_listener()

    @callback
    def _handle_state_update(self) -> None:
        """Handle state update."""
        self.async_write_ha_state()
