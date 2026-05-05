"""WebSocket coordinator for Volumio integration."""

from __future__ import annotations

import asyncio
import logging
from typing import Any, Callable

from homeassistant.core import HomeAssistant, callback

from .const import (
    DOMAIN,
    WS_GET_STATE,
    WS_GET_BROWSE_SOURCES,
    WS_GET_QUEUE,
    WS_ADD_TO_QUEUE,
    WS_REMOVE_FROM_QUEUE,
    WS_CLEAR_QUEUE,
    WS_MOVE_QUEUE,
    WS_PLAY,
    WS_REPLACE_AND_PLAY,
    WS_LIST_PLAYLIST,
    WS_CREATE_PLAYLIST,
    WS_DELETE_PLAYLIST,
    WS_ADD_TO_PLAYLIST,
    WS_REMOVE_FROM_PLAYLIST,
    WS_PLAY_PLAYLIST,
    WS_ENQUEUE,
    WS_SAVE_QUEUE_TO_PLAYLIST,
    WS_ADD_TO_FAVOURITES,
    WS_REMOVE_FROM_FAVOURITES,
    WS_PUSH_STATE,
    WS_PUSH_QUEUE,
    WS_PUSH_BROWSE_LIBRARY,
    WS_PUSH_BROWSE_SOURCES,
    WS_PUSH_LIST_PLAYLIST,
    WS_PUSH_MULTI_ROOM,
)
from .transport import EIO3Transport

_LOGGER = logging.getLogger(__name__)


class VolumioWebSocketCoordinator:
    """Manage WebSocket connection to a Volumio device."""

    def __init__(
        self,
        hass: HomeAssistant,
        host: str,
        port: int,
        name: str,
    ) -> None:
        """Initialize the coordinator."""
        self.hass = hass
        self.host = host
        self.port = port
        self.name = name
        self.base_url = f"http://{host}:{port}"

        self._transport = EIO3Transport(hass, host, port)
        self._state: dict[str, Any] = {}
        self._queue: list[dict[str, Any]] = []
        self._playlists: list[str] = []
        self._browse_sources: list[dict[str, Any]] = []
        self._multiroom_devices: list[dict[str, Any]] = []

        # Device metadata (populated during setup, not runtime)
        self.sw_version: str | None = None

        # Listeners
        self._state_listeners: list[Callable[[], None]] = []
        self._queue_listeners: list[Callable[[], None]] = []

        # Response futures for request/reply pattern
        self._pending_responses: dict[str, asyncio.Future] = {}

        # Register event handlers on transport
        self._register_handlers()

    def _register_handlers(self) -> None:
        """Register Socket.IO event handlers on the transport."""
        self._transport.on_connect(self._on_connect)
        self._transport.on_disconnect(self._on_disconnect)

        self._transport.on(WS_PUSH_STATE, self._on_push_state)
        self._transport.on(WS_PUSH_QUEUE, self._on_push_queue)
        self._transport.on(WS_PUSH_LIST_PLAYLIST, self._on_push_playlists)
        self._transport.on(WS_PUSH_BROWSE_SOURCES, self._on_push_browse_sources)
        self._transport.on(WS_PUSH_MULTI_ROOM, self._on_push_multiroom)
        self._transport.on(WS_PUSH_BROWSE_LIBRARY, self._on_push_browse_library)
        self._transport.on("pushMethod", self._on_push_method)

    # ── Transport event handlers ─────────────────────────────────────

    async def _on_connect(self) -> None:
        """Handle transport connection established."""
        _LOGGER.info("Connected to Volumio at %s", self.base_url)
        # Request initial state and browse sources
        await self._transport.emit(WS_GET_STATE)
        await self._transport.emit(WS_GET_BROWSE_SOURCES)

    def _on_disconnect(self) -> None:
        """Handle transport connection lost."""
        _LOGGER.warning("Disconnected from Volumio at %s", self.base_url)
        self._notify_state_listeners()

    def _on_push_state(self, data: dict[str, Any]) -> None:
        """Handle pushState event."""
        _LOGGER.debug("Received pushState: %s", data.get("title", "") if isinstance(data, dict) else "")
        self._state = data if isinstance(data, dict) else {}
        self.hass.loop.call_soon_threadsafe(self._notify_state_listeners)

    def _on_push_queue(self, data: Any) -> None:
        """Handle pushQueue event."""
        _LOGGER.debug(
            "Received pushQueue: %d items",
            len(data) if isinstance(data, list) else 0,
        )
        self._queue = data if isinstance(data, list) else []
        # Resolve pending future if someone is awaiting this
        future = self._pending_responses.pop("getQueue", None)
        if future and not future.done():
            future.set_result(self._queue)
        self.hass.loop.call_soon_threadsafe(self._notify_queue_listeners)

    def _on_push_playlists(self, data: Any) -> None:
        """Handle pushListPlaylist event."""
        self._playlists = data if isinstance(data, list) else []
        # Resolve pending future if someone is awaiting this
        future = self._pending_responses.pop("listPlaylist", None)
        if future and not future.done():
            future.set_result(self._playlists)

    def _on_push_browse_sources(self, data: Any) -> None:
        """Handle pushBrowseSources event."""
        self._browse_sources = data if isinstance(data, list) else []
        _LOGGER.debug(
            "Received pushBrowseSources: %d items: %s",
            len(self._browse_sources),
            [s.get("name") for s in self._browse_sources],
        )
        # Resolve pending future if someone is awaiting this
        future = self._pending_responses.pop("getBrowseSources", None)
        if future and not future.done():
            future.set_result(self._browse_sources)
        self.hass.loop.call_soon_threadsafe(self._notify_state_listeners)

    def _on_push_multiroom(self, data: Any) -> None:
        """Handle pushMultiRoomDevices event."""
        self._multiroom_devices = (
            data.get("list", []) if isinstance(data, dict) else []
        )

    def _on_push_browse_library(self, data: Any) -> None:
        """Handle browse library response for request/reply pattern."""
        future = self._pending_responses.pop("browseLibrary", None)
        if future and not future.done():
            future.set_result(data)

    def _on_push_method(self, data: Any) -> None:
        """Handle callMethod response."""
        future = self._pending_responses.pop("callMethod", None)
        if future and not future.done():
            future.set_result(data)

    # ── Public properties (unchanged) ────────────────────────────────

    @property
    def connected(self) -> bool:
        """Return True if connected to Volumio."""
        return self._transport.connected

    @property
    def state(self) -> dict[str, Any]:
        """Return the current player state."""
        return self._state

    @property
    def queue(self) -> list[dict[str, Any]]:
        """Return the current play queue."""
        return self._queue

    @property
    def playlists(self) -> list[str]:
        """Return available playlists."""
        return self._playlists

    @property
    def browse_sources(self) -> list[dict[str, Any]]:
        """Return the cached list of browse sources."""
        return self._browse_sources

    @property
    def browse_source_names(self) -> list[str]:
        """Return browse source names for source_list."""
        return [s.get("name", "") for s in self._browse_sources if s.get("name")]

    def source_name_for_service(self, service: str | None) -> str | None:
        """Map a Volumio service/plugin_name to its browse source display name.

        pushState reports 'service' as the plugin_name (e.g. 'qobuz', 'mpd').
        Browse sources have 'plugin_name' matching this value.
        Returns the human-friendly name (e.g. 'Qobuz', 'Music Library').
        """
        if not service:
            return None
        for source in self._browse_sources:
            if source.get("plugin_name") == service:
                return source.get("name")
        # Fallback: return raw service name if no match in browse sources
        return service

    def resolve_albumart(self, albumart: str | None) -> str | None:
        """Resolve relative albumart URLs to absolute."""
        if not albumart:
            return None
        if albumart.startswith("http"):
            return albumart
        return f"{self.base_url}{albumart}"

    # ── Listener management (unchanged) ──────────────────────────────

    def register_state_listener(
        self, listener: Callable[[], None]
    ) -> Callable[[], None]:
        """Register a callback for state changes. Returns unregister function."""
        self._state_listeners.append(listener)

        def unregister():
            self._state_listeners.remove(listener)

        return unregister

    def register_queue_listener(
        self, listener: Callable[[], None]
    ) -> Callable[[], None]:
        """Register a callback for queue changes."""
        self._queue_listeners.append(listener)

        def unregister():
            self._queue_listeners.remove(listener)

        return unregister

    def _notify_state_listeners(self) -> None:
        """Notify all state listeners."""
        for listener in self._state_listeners:
            try:
                listener()
            except Exception:
                _LOGGER.exception("Error in state listener")

    def _notify_queue_listeners(self) -> None:
        """Notify all queue listeners."""
        for listener in self._queue_listeners:
            try:
                listener()
            except Exception:
                _LOGGER.exception("Error in queue listener")

    # ── Connection lifecycle (unchanged signatures) ───────────────────

    async def async_connect(self) -> None:
        """Establish WebSocket connection to Volumio."""
        try:
            await self._transport.connect()
        except Exception as err:
            _LOGGER.error(
                "Failed to connect to Volumio at %s: %s", self.base_url, err
            )
            raise

    async def async_disconnect(self) -> None:
        """Disconnect from Volumio."""
        await self._transport.disconnect()

    # ── Emit methods (unchanged signatures) ───────────────────────────

    async def async_emit(self, event: str, data: Any = None) -> None:
        """Emit an event to Volumio."""
        await self._transport.emit(event, data)

    async def async_emit_and_wait(
        self,
        event: str,
        data: Any = None,
        response_key: str | None = None,
        timeout: float = 10.0,
    ) -> Any:
        """Emit an event and wait for the corresponding push response."""
        key = response_key or event
        future: asyncio.Future = self.hass.loop.create_future()
        self._pending_responses[key] = future

        await self.async_emit(event, data)

        try:
            return await asyncio.wait_for(future, timeout=timeout)
        except asyncio.TimeoutError:
            self._pending_responses.pop(key, None)
            _LOGGER.warning("Timeout waiting for response to %s", event)
            return None

    # ── High-level methods (unchanged signatures) ─────────────────────

    async def async_browse(self, uri: str = "") -> dict[str, Any] | None:
        """Browse library at the given URI."""
        return await self.async_emit_and_wait(
            "browseLibrary",
            {"uri": uri} if uri else None,
            response_key="browseLibrary",
        )

    async def async_get_browse_sources(self) -> list[dict[str, Any]]:
        """Get top-level browse sources from Volumio.

        Returns the list of sources (Qobuz, local library, etc.).
        """
        result = await self.async_emit_and_wait(
            WS_GET_BROWSE_SOURCES,
            response_key="getBrowseSources",
        )
        if result is None:
            _LOGGER.warning(
                "No response from getBrowseSources, using cached data"
            )
            return self._browse_sources
        return result

    async def async_search(self, query: str) -> dict[str, Any] | None:
        """Search the library."""
        # Search response comes back via browseLibrary push
        return await self.async_emit_and_wait(
            "search",
            {"value": query},
            response_key="browseLibrary",
        )

    # ── Queue methods ─────────────────────────────────────────────────

    async def async_get_queue(self) -> list[dict[str, Any]]:
        """Get the current play queue from Volumio.

        Emits getQueue, waits for pushQueue response.
        Returns the queue item list.
        """
        result = await self.async_emit_and_wait(
            WS_GET_QUEUE,
            response_key="getQueue",
        )
        if result is None:
            _LOGGER.warning(
                "No response from getQueue, using cached data"
            )
            return self._queue
        return result

    async def async_add_to_queue(self, item: dict[str, Any]) -> dict[str, Any]:
        """Add a track to the play queue.

        Args:
            item: Track data dict. Expected keys (needs verification):
                  uri (required), title, service, album, artist, albumart

        Returns:
            Acknowledgment dict. Caller should use async_get_queue()
            to get the updated queue.
        """
        await self.async_emit(WS_ADD_TO_QUEUE, item)
        return {"success": True, "command": "addToQueue"}

    async def async_remove_from_queue(self, index: int) -> dict[str, Any]:
        """Remove a track from the play queue by position.

        Args:
            index: Zero-based position in the queue.
                   Payload shape needs verification — may be
                   {value: index} or {index: N}.

        Returns:
            Acknowledgment dict.
        """
        await self.async_emit(WS_REMOVE_FROM_QUEUE, {"value": index})
        return {"success": True, "command": "removeFromQueue"}

    async def async_move_queue(
        self, from_index: int, to_index: int
    ) -> dict[str, Any]:
        """Move a queue item from one position to another.

        Args:
            from_index: Current position (zero-based).
            to_index: Target position (zero-based).
            Payload shape needs verification.

        Returns:
            Acknowledgment dict.
        """
        await self.async_emit(
            WS_MOVE_QUEUE, {"from": from_index, "to": to_index}
        )
        return {"success": True, "command": "moveQueue"}

    async def async_clear_queue(self) -> dict[str, Any]:
        """Clear the entire play queue.

        Returns:
            Acknowledgment dict.
        """
        await self.async_emit(WS_CLEAR_QUEUE)
        return {"success": True, "command": "clearQueue"}

    async def async_play_index(self, index: int) -> dict[str, Any]:
        """Play the track at a specific queue position.

        Args:
            index: Zero-based position in the queue.

        Returns:
            Acknowledgment dict.
        """
        await self.async_emit(WS_PLAY, {"value": index})
        return {"success": True, "command": "play"}

    async def async_replace_and_play(
        self, item: dict[str, Any]
    ) -> dict[str, Any]:
        """Atomically clear the queue, add item(s), and start playback.

        Uses Volumio's native replaceAndPlay WS event which handles
        the clear → add → play sequence server-side, avoiding the race
        condition that occurs when these are sent as separate events.

        Args:
            item: Track/album data dict. Expected keys:
                  uri (required), service, title, artist, album, albumart, type

        Returns:
            Acknowledgment dict.
        """
        await self.async_emit(WS_REPLACE_AND_PLAY, item)
        return {"success": True, "command": "replaceAndPlay"}

    # ── Playlist methods ──────────────────────────────────────────────

    async def async_list_playlists(self) -> list[str]:
        """Get the list of saved playlists from Volumio.

        Emits listPlaylist, waits for pushListPlaylist response.
        Returns a list of playlist name strings.
        """
        result = await self.async_emit_and_wait(
            WS_LIST_PLAYLIST,
            response_key="listPlaylist",
        )
        if result is None:
            _LOGGER.warning(
                "No response from listPlaylist, using cached data"
            )
            return self._playlists
        return result

    async def async_create_playlist(self, name: str) -> dict[str, Any]:
        """Create a new playlist.

        Args:
            name: Name for the new playlist.

        Returns:
            Acknowledgment dict.
        """
        await self.async_emit(WS_CREATE_PLAYLIST, {"name": name})
        return {"success": True, "command": "createPlaylist"}

    async def async_delete_playlist(self, name: str) -> dict[str, Any]:
        """Delete a playlist.

        Args:
            name: Name of the playlist to delete.

        Returns:
            Acknowledgment dict.
        """
        await self.async_emit(WS_DELETE_PLAYLIST, {"name": name})
        return {"success": True, "command": "deletePlaylist"}

    async def async_add_to_playlist(
        self, name: str, uri: str, service: str | None = None
    ) -> dict[str, Any]:
        """Add a track to a playlist.

        Args:
            name: Playlist name.
            uri: Track URI.
            service: Service/plugin name (e.g. 'mpd', 'qobuz').
                     Needs verification — may or may not be required.

        Returns:
            Acknowledgment dict.
        """
        payload: dict[str, Any] = {"name": name, "uri": uri}
        if service is not None:
            payload["service"] = service
        await self.async_emit(WS_ADD_TO_PLAYLIST, payload)
        return {"success": True, "command": "addToPlaylist"}

    async def async_remove_from_playlist(
        self, name: str, uri: str, service: str | None = None
    ) -> dict[str, Any]:
        """Remove a track from a playlist.

        Args:
            name: Playlist name.
            uri: Track URI to remove.
            service: Service/plugin name. Needs verification.

        Returns:
            Acknowledgment dict.
        """
        payload: dict[str, Any] = {"name": name, "uri": uri}
        if service is not None:
            payload["service"] = service
        await self.async_emit(WS_REMOVE_FROM_PLAYLIST, payload)
        return {"success": True, "command": "removeFromPlaylist"}

    async def async_play_playlist(self, name: str) -> dict[str, Any]:
        """Play a playlist (replaces current queue).

        Args:
            name: Playlist name.

        Returns:
            Acknowledgment dict.
        """
        await self.async_emit(WS_PLAY_PLAYLIST, {"name": name})
        return {"success": True, "command": "playPlaylist"}

    async def async_enqueue_playlist(self, name: str) -> dict[str, Any]:
        """Add all tracks from a playlist to the current queue.

        Args:
            name: Playlist name.

        Returns:
            Acknowledgment dict.
        """
        await self.async_emit(WS_ENQUEUE, {"name": name})
        return {"success": True, "command": "enqueue"}

    async def async_save_queue_to_playlist(self, name: str) -> dict[str, Any]:
        """Save the current play queue as a named playlist.

        Uses Volumio's native saveQueueToPlaylist command which reads the
        queue server-side and writes all tracks to the playlist atomically.

        Args:
            name: Name for the new playlist.

        Returns:
            Acknowledgment dict.
        """
        await self.async_emit(WS_SAVE_QUEUE_TO_PLAYLIST, {"name": name})
        return {"success": True, "command": "saveQueueToPlaylist"}

    # ── Favorites methods ─────────────────────────────────────────────

    async def async_list_favourites(self) -> list[dict[str, Any]]:
        """List favourite tracks.

        Returns:
            List of favourite items (each typically has uri, title, service).
        """
        result = await self.async_browse("favourites")
        if not isinstance(result, dict):
            return []
        nav = result.get("navigation") or {}
        lists = nav.get("lists") or []
        items: list[dict[str, Any]] = []
        for lst in lists:
            if isinstance(lst, dict) and isinstance(lst.get("items"), list):
                items.extend(lst["items"])
        return items

    async def async_add_to_favourites(
        self, item: dict[str, Any]
    ) -> dict[str, Any]:
        """Add a track to favourites.

        Args:
            item: Track data dict. Expected keys (needs verification):
                  uri (required), title, service

        Returns:
            Acknowledgment dict.
        """
        _LOGGER.debug("async_add_to_favourites called with: %s", item)
        await self.async_emit(WS_ADD_TO_FAVOURITES, item)
        return {"success": True, "command": "addToFavourites"}

    async def async_remove_from_favourites(
        self, item: dict[str, Any]
    ) -> dict[str, Any]:
        """Remove a track from favourites.

        Args:
            item: Track data dict. Expected keys (needs verification):
                  uri (required), service

        Returns:
            Acknowledgment dict.
        """
        _LOGGER.debug("async_remove_from_favourites called with: %s", item)
        await self.async_emit(WS_REMOVE_FROM_FAVOURITES, item)
        return {"success": True, "command": "removeFromFavourites"}
