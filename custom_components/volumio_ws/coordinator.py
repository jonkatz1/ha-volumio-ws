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
        # Request initial state
        await self._transport.emit(WS_GET_STATE)

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
        self.hass.loop.call_soon_threadsafe(self._notify_queue_listeners)

    def _on_push_playlists(self, data: Any) -> None:
        """Handle pushListPlaylist event."""
        self._playlists = data if isinstance(data, list) else []

    def _on_push_browse_sources(self, data: Any) -> None:
        """Handle pushBrowseSources event."""
        self._browse_sources = data if isinstance(data, list) else []
        # Resolve pending future if someone is awaiting this
        future = self._pending_responses.pop("getBrowseSources", None)
        if future and not future.done():
            future.set_result(self._browse_sources)

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
