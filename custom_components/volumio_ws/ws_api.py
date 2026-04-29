"""WebSocket API endpoints for the Volumio panel (Layer 3).

These endpoints provide real-time data to the panel frontend.
They complement Layer 2 services by adding push-based subscriptions
for data that changes frequently and isn't on entities (e.g., queue).

Endpoints:
  volumio_ws/subscribe_queue — Subscribe to real-time queue updates.
    Sends the current queue immediately, then pushes updates whenever
    the queue changes.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .coordinator import VolumioWebSocketCoordinator

_LOGGER = logging.getLogger(__name__)


@callback
def async_register_ws_api(hass: HomeAssistant) -> None:
    """Register WebSocket API commands for the panel."""
    websocket_api.async_register_command(hass, ws_subscribe_queue)


def _get_coordinator(hass: HomeAssistant) -> VolumioWebSocketCoordinator | None:
    """Get the first available coordinator.

    For multi-device setups this would need a device selector.
    For now, return the first (and typically only) coordinator.
    """
    coordinators = hass.data.get(DOMAIN, {})
    if not coordinators:
        return None
    # Return the first coordinator (single-device assumption)
    return next(iter(coordinators.values()), None)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "volumio_ws/subscribe_queue",
    }
)
@websocket_api.async_response
async def ws_subscribe_queue(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Subscribe to queue updates.

    Sends the current queue immediately, then pushes updates
    whenever the coordinator's queue changes (via pushQueue from Volumio).

    Message format sent to the panel:
      { "id": <sub_id>, "type": "event", "event": { "queue": [...] } }
    """
    coordinator = _get_coordinator(hass)
    if coordinator is None:
        connection.send_error(
            msg["id"],
            "not_found",
            "No Volumio coordinator found. Is the integration loaded?",
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
