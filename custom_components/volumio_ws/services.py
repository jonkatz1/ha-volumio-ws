"""Service handlers for Volumio WebSocket integration."""

from __future__ import annotations

import logging

import voluptuous as vol

from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
    callback,
)
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv

from .const import DOMAIN
from .coordinator import VolumioWebSocketCoordinator

_LOGGER = logging.getLogger(__name__)

# ── Service names ────────────────────────────────────────────────────
# Future services (T12-T14, T21) add their names here.
SERVICE_SEARCH = "search"

# ── Field constants ──────────────────────────────────────────────────
ATTR_CONFIG_ENTRY_ID = "config_entry_id"
ATTR_QUERY = "query"

# ── Schemas ──────────────────────────────────────────────────────────
# Server-side validation; services.yaml handles the UI side.
SERVICE_SEARCH_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): cv.string,
        vol.Required(ATTR_QUERY): cv.string,
    }
)


# ── Coordinator lookup ───────────────────────────────────────────────

def _get_coordinator(
    hass: HomeAssistant, call: ServiceCall
) -> VolumioWebSocketCoordinator:
    """Resolve the coordinator from a service call via config_entry_id.

    The config_entry_id maps directly to hass.data[DOMAIN][entry_id].
    """
    config_entry_id: str = call.data[ATTR_CONFIG_ENTRY_ID]
    entries: dict[str, VolumioWebSocketCoordinator] = hass.data.get(DOMAIN, {})

    if not entries:
        raise HomeAssistantError(
            f"No {DOMAIN} integration entries loaded. "
            "Is the integration set up?"
        )

    coordinator = entries.get(config_entry_id)
    if coordinator is None:
        raise ServiceValidationError(
            f"No Volumio device found for config entry '{config_entry_id}'. "
            "Check that the device is configured and loaded."
        )
    return coordinator


# ── Service handlers ─────────────────────────────────────────────────

async def _async_handle_search(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the search service call."""
    coordinator = _get_coordinator(hass, call)
    query: str = call.data[ATTR_QUERY]

    if not query.strip():
        raise ServiceValidationError("Search query cannot be empty")

    result = await coordinator.async_search(query.strip())

    if call.return_response:
        return result if isinstance(result, dict) else {"results": []}
    return None


# ── Registration ─────────────────────────────────────────────────────

@callback
def register_services(hass: HomeAssistant) -> None:
    """Register all Volumio WS services.

    Called from async_setup (domain-level, once per HA instance).
    Services persist for the HA lifetime — no unregistration needed.

    Future services (queue, playlist, favorites, callMethod)
    add their registrations here following the same pattern:
      1. Define SERVICE_NAME and schema above.
      2. Write an _async_handle_* function.
      3. Register below with the appropriate SupportsResponse mode.
    """
    hass.services.async_register(
        DOMAIN,
        SERVICE_SEARCH,
        lambda call: _async_handle_search(hass, call),
        schema=SERVICE_SEARCH_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )

    _LOGGER.debug("Registered %s services", DOMAIN)
