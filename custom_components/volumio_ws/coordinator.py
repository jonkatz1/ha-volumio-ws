"""WebSocket coordinator for Volumio integration."""

from __future__ import annotations

import asyncio
import logging
from typing import Any, Callable

import socketio

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

_LOGGER = logging.getLogger(__name__)

RECONNECT_INTERVAL = 10  # seconds


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

        self._sio: socketio.AsyncClient | None = None
        self._connected = False
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

    @property
    def connected(self) -> bool:
        """Return True if connected to Volumio."""
        return self._connected

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

    def register_state_listener(self, listener: Callable[[], None]) -> Callable[[], None]:
        """Register a callback for state changes. Returns unregister function."""
        self._state_listeners.append(listener)

        def unregister():
            self._state_listeners.remove(listener)

        return unregister

    def register_queue_listener(self, listener: Callable[[], None]) -> Callable[[], None]:
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

    async def async_connect(self) -> None:
        """Establish WebSocket connection to Volumio."""
        self._sio = socketio.AsyncClient(
            reconnection=True,
            reconnection_attempts=0,  # infinite
            reconnection_delay=RECONNECT_INTERVAL,
            logger=False,
            engineio_logger=False,
        )

        @self._sio.event
        async def connect():
            _LOGGER.info("Connected to Volumio at %s", self.base_url)
            self._connected = True
            # Request initial state
            await self._sio.emit(WS_GET_STATE)

        @self._sio.event
        async def disconnect():
            _LOGGER.warning("Disconnected from Volumio at %s", self.base_url)
            self._connected = False
            self._notify_state_listeners()

        @self._sio.on(WS_PUSH_STATE)
        async def on_push_state(data):
            _LOGGER.debug("Received pushState: %s", data.get("title", ""))
            self._state = data
            self.hass.loop.call_soon_threadsafe(self._notify_state_listeners)

        @self._sio.on(WS_PUSH_QUEUE)
        async def on_push_queue(data):
            _LOGGER.debug("Received pushQueue: %d items", len(data) if isinstance(data, list) else 0)
            self._queue = data if isinstance(data, list) else []
            self.hass.loop.call_soon_threadsafe(self._notify_queue_listeners)

        @self._sio.on(WS_PUSH_LIST_PLAYLIST)
        async def on_push_playlists(data):
            self._playlists = data if isinstance(data, list) else []

        @self._sio.on(WS_PUSH_BROWSE_SOURCES)
        async def on_push_browse_sources(data):
            self._browse_sources = data if isinstance(data, list) else []
            # Resolve pending future if someone is awaiting this
            future = self._pending_responses.pop("getBrowseSources", None)
            if future and not future.done():
                future.set_result(self._browse_sources)

        @self._sio.on(WS_PUSH_MULTI_ROOM)
        async def on_push_multiroom(data):
            self._multiroom_devices = data.get("list", []) if isinstance(data, dict) else []

        @self._sio.on(WS_PUSH_BROWSE_LIBRARY)
        async def on_push_browse_library(data):
            """Handle browse library response for request/reply pattern."""
            future = self._pending_responses.pop("browseLibrary", None)
            if future and not future.done():
                future.set_result(data)

        @self._sio.on("pushMethod")
        async def on_push_method(data):
            """Handle callMethod response."""
            future = self._pending_responses.pop("callMethod", None)
            if future and not future.done():
                future.set_result(data)

        try:
            await self._sio.connect(self.base_url, transports=["websocket"])
        except Exception as err:
            _LOGGER.error("Failed to connect to Volumio at %s: %s", self.base_url, err)
            raise

    async def async_disconnect(self) -> None:
        """Disconnect from Volumio."""
        if self._sio:
            await self._sio.disconnect()
            self._connected = False

    async def async_emit(self, event: str, data: Any = None) -> None:
        """Emit an event to Volumio."""
        if not self._sio or not self._connected:
            _LOGGER.warning("Cannot emit %s: not connected", event)
            return
        if data is not None:
            await self._sio.emit(event, data)
        else:
            await self._sio.emit(event)

    async def async_emit_and_wait(
        self, event: str, data: Any = None, response_key: str | None = None, timeout: float = 10.0
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
            _LOGGER.warning("No response from getBrowseSources, using cached data")
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
