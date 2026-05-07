"""WebSocket API endpoints for the Volumio panel (Layer 3).

These endpoints provide real-time data to the panel frontend.
They complement Layer 2 services by adding push-based subscriptions
for data that changes frequently and isn't on entities (e.g., queue),
and by exposing the integration's device list to the panel for
multi-device support.

Endpoints:
  volumio_ws/list_devices — Return all configured Volumio devices
    with config_entry_id, name, host/port, volumio_url, and the
    media_player entity_id for each entry. The panel uses this to
    build its device selector and resolve the active device.
  volumio_ws/subscribe_queue — Subscribe to real-time queue updates
    for a specific Volumio device (selected by config_entry_id).
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_PORT
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er

from .const import DEFAULT_PORT, DOMAIN
from .coordinator import VolumioWebSocketCoordinator

_LOGGER = logging.getLogger(__name__)


@callback
def async_register_ws_api(hass: HomeAssistant) -> None:
    """Register WebSocket API commands for the panel."""
    websocket_api.async_register_command(hass, ws_list_devices)
    websocket_api.async_register_command(hass, ws_subscribe_queue)


def _get_coordinator(
    hass: HomeAssistant, config_entry_id: str
) -> VolumioWebSocketCoordinator | None:
    """Resolve a coordinator by config_entry_id."""
    return hass.data.get(DOMAIN, {}).get(config_entry_id)


def _entry_to_device_record(
    entry: ConfigEntry, registry: er.EntityRegistry
) -> dict[str, Any]:
    """Build the panel-facing device record for one config entry."""
    host: str = entry.data.get(CONF_HOST, "")
    port: int = entry.data.get(CONF_PORT, DEFAULT_PORT)

    # Find the media_player entity for this entry. The integration also
    # creates sensor entities under the same entry, so filter by domain.
    entity_id: str | None = None
    for ent in er.async_entries_for_config_entry(registry, entry.entry_id):
        if ent.domain == "media_player":
            entity_id = ent.entity_id
            break

    return {
        "config_entry_id": entry.entry_id,
        "name": entry.title,
        "host": host,
        "port": port,
        "volumio_url": f"http://{host}:{port}" if host else "",
        "entity_id": entity_id,
    }


@websocket_api.websocket_command(
    {
        vol.Required("type"): "volumio_ws/list_devices",
    }
)
@websocket_api.async_response
async def ws_list_devices(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all configured Volumio devices.

    Each record carries the config_entry_id, entry title (display name),
    host/port, composed volumio_url, and the media_player entity_id.
    Entries are listed regardless of load state so the panel can show
    devices that are currently offline; service calls against an
    unloaded coordinator will surface their own errors.
    """
    registry = er.async_get(hass)
    entries = hass.config_entries.async_entries(DOMAIN)
    devices = [_entry_to_device_record(entry, registry) for entry in entries]
    connection.send_result(msg["id"], {"devices": devices})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "volumio_ws/subscribe_queue",
        vol.Required("config_entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_subscribe_queue(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Subscribe to queue updates for a specific Volumio device.

    Sends the current queue immediately, then pushes updates whenever
    the coordinator's queue changes (via pushQueue from Volumio).

    Message format sent to the panel:
      { "id": <sub_id>, "type": "event", "event": { "queue": [...] } }
    """
    config_entry_id: str = msg["config_entry_id"]
    coordinator = _get_coordinator(hass, config_entry_id)
    if coordinator is None:
        connection.send_error(
            msg["id"],
            "not_found",
            f"No Volumio device found for config entry '{config_entry_id}'.",
        )
        return

    msg_id = msg["id"]

    @callback
    def _on_queue_change() -> None:
        """Push queue update to the subscribed panel."""
        connection.send_message(
            websocket_api.event_message(
                msg_id,
                {"queue": coordinator.queue},
            )
        )

    # Register the listener on the coordinator
    unregister = coordinator.register_queue_listener(_on_queue_change)

    # Clean up when the WS connection closes or panel navigates away
    @callback
    def _on_disconnect() -> None:
        """Remove the queue listener when the subscription ends."""
        unregister()
        _LOGGER.debug("Queue subscription %s disconnected", msg_id)

    connection.subscriptions[msg_id] = _on_disconnect

    # Confirm the subscription is active
    connection.send_result(msg_id)

    # Immediately send the current queue so the panel doesn't start empty
    connection.send_message(
        websocket_api.event_message(
            msg_id,
            {"queue": coordinator.queue},
        )
    )
