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
SERVICE_SEARCH = "search"
SERVICE_BROWSE = "browse"
SERVICE_GET_BROWSE_SOURCES = "get_browse_sources"
# Queue
SERVICE_QUEUE_GET = "queue_get"
SERVICE_QUEUE_ADD = "queue_add"
SERVICE_QUEUE_REMOVE = "queue_remove"
SERVICE_QUEUE_MOVE = "queue_move"
SERVICE_QUEUE_CLEAR = "queue_clear"
SERVICE_QUEUE_PLAY_INDEX = "queue_play_index"
SERVICE_REPLACE_AND_PLAY = "replace_and_play"
# Playlist
SERVICE_PLAYLIST_LIST = "playlist_list"
SERVICE_PLAYLIST_CREATE = "playlist_create"
SERVICE_PLAYLIST_DELETE = "playlist_delete"
SERVICE_PLAYLIST_ADD_TRACK = "playlist_add_track"
SERVICE_PLAYLIST_REMOVE_TRACK = "playlist_remove_track"
SERVICE_PLAYLIST_PLAY = "playlist_play"
SERVICE_PLAYLIST_ENQUEUE = "playlist_enqueue"
SERVICE_SAVE_QUEUE_TO_PLAYLIST = "save_queue_to_playlist"
# Favorites
SERVICE_FAVORITES_LIST = "favorites_list"
SERVICE_FAVORITES_ADD = "favorites_add"
SERVICE_FAVORITES_REMOVE = "favorites_remove"
# Plugin endpoint (REST proxy)
SERVICE_PLUGIN_ENDPOINT = "plugin_endpoint"

# Endpoints the panel actually uses. Restricts the plugin_endpoint service
# (a generic REST proxy) to known-safe metadata read endpoints. Non-admin
# users calling this service from automations or developer tools cannot
# proxy arbitrary endpoints to Volumio's /api/v1/pluginEndpoint gateway.
ALLOWED_PLUGIN_ENDPOINTS = frozenset({"metavolumio", "getSimilarArtists"})

# ── Field constants ──────────────────────────────────────────────────
ATTR_CONFIG_ENTRY_ID = "config_entry_id"
ATTR_QUERY = "query"
ATTR_URI = "uri"
ATTR_TITLE = "title"
ATTR_SERVICE = "service"
ATTR_ALBUM = "album"
ATTR_ARTIST = "artist"
ATTR_ALBUMART = "albumart"
ATTR_INDEX = "index"
ATTR_FROM_INDEX = "from_index"
ATTR_TO_INDEX = "to_index"
ATTR_NAME = "name"
ATTR_TYPE = "type"
ATTR_ENDPOINT = "endpoint"
ATTR_DATA = "data"

# ── Schemas ──────────────────────────────────────────────────────────
# Server-side validation; services.yaml handles the UI side.

# -- Search --
SERVICE_SEARCH_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_QUERY): vol.All(cv.string, vol.Length(min=1)),
    }
)

SERVICE_BROWSE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Optional(ATTR_URI, default=""): cv.string,
    }
)

SERVICE_GET_BROWSE_SOURCES_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
    }
)

# -- Queue --
SERVICE_QUEUE_GET_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
    }
)

SERVICE_QUEUE_ADD_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_URI): vol.All(cv.string, vol.Length(min=1)),
        vol.Optional(ATTR_TITLE): cv.string,
        vol.Optional(ATTR_SERVICE): cv.string,
        vol.Optional(ATTR_ALBUM): cv.string,
        vol.Optional(ATTR_ARTIST): cv.string,
        vol.Optional(ATTR_ALBUMART): cv.string,
    }
)

SERVICE_QUEUE_REMOVE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_INDEX): vol.All(vol.Coerce(int), vol.Range(min=0)),
    }
)

SERVICE_QUEUE_MOVE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_FROM_INDEX): vol.All(vol.Coerce(int), vol.Range(min=0)),
        vol.Required(ATTR_TO_INDEX): vol.All(vol.Coerce(int), vol.Range(min=0)),
    }
)

SERVICE_QUEUE_CLEAR_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
    }
)

SERVICE_QUEUE_PLAY_INDEX_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_INDEX): vol.All(vol.Coerce(int), vol.Range(min=0)),
    }
)

SERVICE_REPLACE_AND_PLAY_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_URI): vol.All(cv.string, vol.Length(min=1)),
        vol.Optional(ATTR_TITLE): cv.string,
        vol.Optional(ATTR_SERVICE): cv.string,
        vol.Optional(ATTR_ALBUM): cv.string,
        vol.Optional(ATTR_ARTIST): cv.string,
        vol.Optional(ATTR_ALBUMART): cv.string,
        vol.Optional(ATTR_TYPE): cv.string,
    }
)

# -- Playlist --
SERVICE_PLAYLIST_LIST_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
    }
)

SERVICE_PLAYLIST_CREATE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_NAME): vol.All(cv.string, vol.Length(min=1)),
    }
)

SERVICE_PLAYLIST_DELETE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_NAME): vol.All(cv.string, vol.Length(min=1)),
    }
)

SERVICE_PLAYLIST_ADD_TRACK_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_NAME): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_URI): vol.All(cv.string, vol.Length(min=1)),
        vol.Optional(ATTR_SERVICE): cv.string,
    }
)

SERVICE_PLAYLIST_REMOVE_TRACK_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_NAME): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_URI): vol.All(cv.string, vol.Length(min=1)),
        vol.Optional(ATTR_SERVICE): cv.string,
    }
)

SERVICE_PLAYLIST_PLAY_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_NAME): vol.All(cv.string, vol.Length(min=1)),
    }
)

SERVICE_PLAYLIST_ENQUEUE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_NAME): vol.All(cv.string, vol.Length(min=1)),
    }
)

SERVICE_SAVE_QUEUE_TO_PLAYLIST_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_NAME): vol.All(cv.string, vol.Length(min=1)),
    }
)

# -- Favorites --
SERVICE_FAVORITES_LIST_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
    }
)

SERVICE_FAVORITES_ADD_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_URI): vol.All(cv.string, vol.Length(min=1)),
        vol.Optional(ATTR_TITLE): cv.string,
        vol.Optional(ATTR_SERVICE): cv.string,
    }
)

SERVICE_FAVORITES_REMOVE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_URI): vol.All(cv.string, vol.Length(min=1)),
        vol.Optional(ATTR_SERVICE): cv.string,
    }
)

# Plugin endpoint (generic REST proxy)
SERVICE_PLUGIN_ENDPOINT_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CONFIG_ENTRY_ID): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_ENDPOINT): vol.All(cv.string, vol.Length(min=1)),
        vol.Required(ATTR_DATA): dict,
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

# -- Search --

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


# -- Browse --

async def _async_handle_browse(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the browse service call."""
    coordinator = _get_coordinator(hass, call)
    uri: str = call.data.get(ATTR_URI, "")

    result = await coordinator.async_browse(uri)

    if call.return_response:
        return result if isinstance(result, dict) else {"navigation": {"lists": []}}
    return None


# -- Browse Sources --

async def _async_handle_get_browse_sources(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the get_browse_sources service call."""
    coordinator = _get_coordinator(hass, call)
    sources = await coordinator.async_get_browse_sources()

    if call.return_response:
        return {"sources": sources if isinstance(sources, list) else []}
    return None


# -- Queue --

async def _async_handle_queue_get(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the queue_get service call."""
    coordinator = _get_coordinator(hass, call)
    result = await coordinator.async_get_queue()

    if call.return_response:
        return {"queue": result if isinstance(result, list) else []}
    return None


async def _async_handle_queue_add(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the queue_add service call."""
    coordinator = _get_coordinator(hass, call)

    # Build item dict from service fields (exclude config_entry_id)
    item: dict = {"uri": call.data[ATTR_URI]}
    for field in (ATTR_TITLE, ATTR_SERVICE, ATTR_ALBUM, ATTR_ARTIST, ATTR_ALBUMART):
        if field in call.data:
            item[field] = call.data[field]

    result = await coordinator.async_add_to_queue(item)

    if call.return_response:
        return result
    return None


async def _async_handle_queue_remove(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the queue_remove service call."""
    coordinator = _get_coordinator(hass, call)
    index: int = call.data[ATTR_INDEX]
    result = await coordinator.async_remove_from_queue(index)

    if call.return_response:
        return result
    return None


async def _async_handle_queue_move(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the queue_move service call."""
    coordinator = _get_coordinator(hass, call)
    from_index: int = call.data[ATTR_FROM_INDEX]
    to_index: int = call.data[ATTR_TO_INDEX]
    result = await coordinator.async_move_queue(from_index, to_index)

    if call.return_response:
        return result
    return None


async def _async_handle_queue_clear(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the queue_clear service call."""
    coordinator = _get_coordinator(hass, call)
    result = await coordinator.async_clear_queue()

    if call.return_response:
        return result
    return None


async def _async_handle_queue_play_index(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the queue_play_index service call."""
    coordinator = _get_coordinator(hass, call)
    index: int = call.data[ATTR_INDEX]
    result = await coordinator.async_play_index(index)

    if call.return_response:
        return result
    return None


async def _async_handle_replace_and_play(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the replace_and_play service call.

    Atomically clears queue, adds item(s), and starts playback using
    Volumio's native replaceAndPlay WS event.
    """
    coordinator = _get_coordinator(hass, call)

    item: dict = {"uri": call.data[ATTR_URI]}
    for field in (ATTR_TITLE, ATTR_SERVICE, ATTR_ALBUM, ATTR_ARTIST, ATTR_ALBUMART, ATTR_TYPE):
        if field in call.data:
            item[field] = call.data[field]

    result = await coordinator.async_replace_and_play(item)

    if call.return_response:
        return result
    return None


# -- Playlist --

async def _async_handle_playlist_list(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the playlist_list service call."""
    coordinator = _get_coordinator(hass, call)
    result = await coordinator.async_list_playlists()

    if call.return_response:
        return {"playlists": result if isinstance(result, list) else []}
    return None


async def _async_handle_playlist_create(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the playlist_create service call."""
    coordinator = _get_coordinator(hass, call)
    name: str = call.data[ATTR_NAME]

    if not name.strip():
        raise ServiceValidationError("Playlist name cannot be empty")

    result = await coordinator.async_create_playlist(name.strip())

    if call.return_response:
        return result
    return None


async def _async_handle_playlist_delete(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the playlist_delete service call."""
    coordinator = _get_coordinator(hass, call)
    name: str = call.data[ATTR_NAME].strip()
    if not name:
        raise ServiceValidationError("Playlist name cannot be empty or whitespace")
    result = await coordinator.async_delete_playlist(name)

    if call.return_response:
        return result
    return None


async def _async_handle_playlist_add_track(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the playlist_add_track service call."""
    coordinator = _get_coordinator(hass, call)
    name: str = call.data[ATTR_NAME].strip()
    uri: str = call.data[ATTR_URI].strip()
    if not name:
        raise ServiceValidationError("Playlist name cannot be empty or whitespace")
    if not uri:
        raise ServiceValidationError("URI cannot be empty or whitespace")
    service: str | None = call.data.get(ATTR_SERVICE)
    result = await coordinator.async_add_to_playlist(name, uri, service)

    if call.return_response:
        return result
    return None


async def _async_handle_playlist_remove_track(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the playlist_remove_track service call."""
    coordinator = _get_coordinator(hass, call)
    name: str = call.data[ATTR_NAME].strip()
    uri: str = call.data[ATTR_URI].strip()
    if not name:
        raise ServiceValidationError("Playlist name cannot be empty or whitespace")
    if not uri:
        raise ServiceValidationError("URI cannot be empty or whitespace")
    service: str | None = call.data.get(ATTR_SERVICE)
    result = await coordinator.async_remove_from_playlist(name, uri, service)

    if call.return_response:
        return result
    return None


async def _async_handle_playlist_play(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the playlist_play service call."""
    coordinator = _get_coordinator(hass, call)
    name: str = call.data[ATTR_NAME].strip()
    if not name:
        raise ServiceValidationError("Playlist name cannot be empty or whitespace")
    result = await coordinator.async_play_playlist(name)

    if call.return_response:
        return result
    return None


async def _async_handle_playlist_enqueue(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the playlist_enqueue service call."""
    coordinator = _get_coordinator(hass, call)
    name: str = call.data[ATTR_NAME].strip()
    if not name:
        raise ServiceValidationError("Playlist name cannot be empty or whitespace")
    result = await coordinator.async_enqueue_playlist(name)

    if call.return_response:
        return result
    return None


async def _async_handle_save_queue_to_playlist(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the save_queue_to_playlist service call.

    Uses Volumio's native saveQueueToPlaylist command which reads the
    current queue server-side and saves it atomically as a playlist.
    """
    coordinator = _get_coordinator(hass, call)
    name: str = call.data[ATTR_NAME].strip()
    if not name:
        raise ServiceValidationError("Playlist name cannot be empty or whitespace")
    result = await coordinator.async_save_queue_to_playlist(name)

    if call.return_response:
        return result
    return None


# -- Favorites --

async def _async_handle_favorites_list(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the favorites_list service call."""
    coordinator = _get_coordinator(hass, call)
    items = await coordinator.async_list_favourites()

    if call.return_response:
        return {"items": items}
    return None


async def _async_handle_favorites_add(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the favorites_add service call."""
    coordinator = _get_coordinator(hass, call)

    item: dict = {"uri": call.data[ATTR_URI]}
    for field in (ATTR_TITLE, ATTR_SERVICE):
        if field in call.data:
            item[field] = call.data[field]

    result = await coordinator.async_add_to_favourites(item)

    if call.return_response:
        return result
    return None


async def _async_handle_favorites_remove(
    hass: HomeAssistant, call: ServiceCall
) -> ServiceResponse:
    """Handle the favorites_remove service call."""
    coordinator = _get_coordinator(hass, call)

    item: dict = {"uri": call.data[ATTR_URI]}
    if ATTR_SERVICE in call.data:
        item["service"] = call.data[ATTR_SERVICE]

    result = await coordinator.async_remove_from_favourites(item)

    if call.return_response:
        return result
    return None


# Plugin endpoint
async def _async_handle_plugin_endpoint(hass, call):
    coordinator = _get_coordinator(hass, call)
    endpoint: str = call.data[ATTR_ENDPOINT]
    if endpoint not in ALLOWED_PLUGIN_ENDPOINTS:
        raise ServiceValidationError(
            f"plugin_endpoint '{endpoint}' is not allowed"
        )
    data: dict = call.data[ATTR_DATA]
    result = await coordinator.async_plugin_endpoint(endpoint, data)
    if call.return_response:
        return result if isinstance(result, dict) else {"success": False, "error": "unknown"}
    return None


# ── Registration ─────────────────────────────────────────────────────

@callback
def register_services(hass: HomeAssistant) -> None:
    """Register all Volumio WS services.

    Called from async_setup (domain-level, once per HA instance).
    Services persist for the HA lifetime — no unregistration needed.

    Each handler is an async closure (not a lambda) so that
    asyncio.iscoroutinefunction() returns True. HA needs this to
    properly await the handler and capture response data for
    SupportsResponse.
    """

    # -- async closures (capture hass) --------------------------------

    async def handle_search(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_search(hass, call)

    async def handle_browse(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_browse(hass, call)

    async def handle_get_browse_sources(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_get_browse_sources(hass, call)

    async def handle_queue_get(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_queue_get(hass, call)

    async def handle_queue_add(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_queue_add(hass, call)

    async def handle_queue_remove(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_queue_remove(hass, call)

    async def handle_queue_move(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_queue_move(hass, call)

    async def handle_queue_clear(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_queue_clear(hass, call)

    async def handle_queue_play_index(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_queue_play_index(hass, call)

    async def handle_replace_and_play(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_replace_and_play(hass, call)

    async def handle_playlist_list(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_playlist_list(hass, call)

    async def handle_playlist_create(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_playlist_create(hass, call)

    async def handle_playlist_delete(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_playlist_delete(hass, call)

    async def handle_playlist_add_track(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_playlist_add_track(hass, call)

    async def handle_playlist_remove_track(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_playlist_remove_track(hass, call)

    async def handle_playlist_play(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_playlist_play(hass, call)

    async def handle_playlist_enqueue(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_playlist_enqueue(hass, call)

    async def handle_save_queue_to_playlist(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_save_queue_to_playlist(hass, call)

    async def handle_favorites_list(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_favorites_list(hass, call)

    async def handle_favorites_add(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_favorites_add(hass, call)

    async def handle_favorites_remove(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_favorites_remove(hass, call)

    async def handle_plugin_endpoint(call: ServiceCall) -> ServiceResponse:
        return await _async_handle_plugin_endpoint(hass, call)

    # -- registrations ------------------------------------------------

    # Search
    hass.services.async_register(
        DOMAIN,
        SERVICE_SEARCH,
        handle_search,
        schema=SERVICE_SEARCH_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )

    # Browse
    hass.services.async_register(
        DOMAIN,
        SERVICE_BROWSE,
        handle_browse,
        schema=SERVICE_BROWSE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )

    # Browse Sources
    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_BROWSE_SOURCES,
        handle_get_browse_sources,
        schema=SERVICE_GET_BROWSE_SOURCES_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )

    # Queue
    hass.services.async_register(
        DOMAIN,
        SERVICE_QUEUE_GET,
        handle_queue_get,
        schema=SERVICE_QUEUE_GET_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_QUEUE_ADD,
        handle_queue_add,
        schema=SERVICE_QUEUE_ADD_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_QUEUE_REMOVE,
        handle_queue_remove,
        schema=SERVICE_QUEUE_REMOVE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_QUEUE_MOVE,
        handle_queue_move,
        schema=SERVICE_QUEUE_MOVE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_QUEUE_CLEAR,
        handle_queue_clear,
        schema=SERVICE_QUEUE_CLEAR_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_QUEUE_PLAY_INDEX,
        handle_queue_play_index,
        schema=SERVICE_QUEUE_PLAY_INDEX_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_REPLACE_AND_PLAY,
        handle_replace_and_play,
        schema=SERVICE_REPLACE_AND_PLAY_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )

    # Playlist
    hass.services.async_register(
        DOMAIN,
        SERVICE_PLAYLIST_LIST,
        handle_playlist_list,
        schema=SERVICE_PLAYLIST_LIST_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_PLAYLIST_CREATE,
        handle_playlist_create,
        schema=SERVICE_PLAYLIST_CREATE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_PLAYLIST_DELETE,
        handle_playlist_delete,
        schema=SERVICE_PLAYLIST_DELETE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_PLAYLIST_ADD_TRACK,
        handle_playlist_add_track,
        schema=SERVICE_PLAYLIST_ADD_TRACK_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_PLAYLIST_REMOVE_TRACK,
        handle_playlist_remove_track,
        schema=SERVICE_PLAYLIST_REMOVE_TRACK_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_PLAYLIST_PLAY,
        handle_playlist_play,
        schema=SERVICE_PLAYLIST_PLAY_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_PLAYLIST_ENQUEUE,
        handle_playlist_enqueue,
        schema=SERVICE_PLAYLIST_ENQUEUE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_SAVE_QUEUE_TO_PLAYLIST,
        handle_save_queue_to_playlist,
        schema=SERVICE_SAVE_QUEUE_TO_PLAYLIST_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )

    # Favorites
    hass.services.async_register(
        DOMAIN,
        SERVICE_FAVORITES_LIST,
        handle_favorites_list,
        schema=SERVICE_FAVORITES_LIST_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_FAVORITES_ADD,
        handle_favorites_add,
        schema=SERVICE_FAVORITES_ADD_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_FAVORITES_REMOVE,
        handle_favorites_remove,
        schema=SERVICE_FAVORITES_REMOVE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )

    # Plugin endpoint (REST proxy)
    hass.services.async_register(
        DOMAIN,
        SERVICE_PLUGIN_ENDPOINT,
        handle_plugin_endpoint,
        schema=SERVICE_PLUGIN_ENDPOINT_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )

    _LOGGER.debug("Registered %s services", DOMAIN)
