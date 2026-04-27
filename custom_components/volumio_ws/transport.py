"""Raw aiohttp WebSocket transport implementing Engine.IO v3 protocol.

Replaces python-socketio (which only speaks EIO4) with a direct WebSocket
connection that handles EIO3 keepalive correctly. Volumio 3 runs Socket.IO
server v2.3 which requires client-initiated PINGs (EIO3 model).

Wire protocol observed from Volumio (captured in tests/eio3_raw_test.py):
  - Open packet:  0{"sid":"...","upgrades":[],"pingInterval":25000,"pingTimeout":5000}
  - SIO connect:  40                      (plain, no namespace)
  - Client ping:  2                       (sent every pingInterval - 2s)
  - Server pong:  3
  - SIO event:    42["eventName", data]   (no namespace prefix)
"""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Callable, Coroutine

import aiohttp
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

# Reconnect backoff: 5s, 10s, 20s, 40s, 60s (capped)
RECONNECT_BASE = 5
RECONNECT_MAX = 60

# Safety margin subtracted from pingInterval for sending pings
PING_MARGIN_MS = 2000


class EIO3Transport:
    """Engine.IO v3 transport over raw aiohttp WebSocket.

    Provides a socketio-like API for the coordinator:
      - on(event, handler)     — register event handler
      - on_connect(handler)    — called when SIO connection established
      - on_disconnect(handler) — called when connection lost
      - emit(event, data)      — send SIO event
      - connect()              — initial connection (raises on failure)
      - disconnect()           — clean shutdown
    """

    def __init__(self, hass: HomeAssistant, host: str, port: int) -> None:
        """Initialize transport."""
        self._hass = hass
        self._host = host
        self._port = port
        self._ws_url = (
            f"ws://{host}:{port}/socket.io/?EIO=3&transport=websocket"
        )

        self._ws: aiohttp.ClientWebSocketResponse | None = None
        self._connected = False
        self._shutting_down = False

        # EIO3 session params (updated from Open packet)
        self._sid: str | None = None
        self._ping_interval_ms: int = 25000
        self._ping_timeout_ms: int = 5000

        # Background tasks
        self._reader_task: asyncio.Task | None = None
        self._ping_task: asyncio.Task | None = None
        self._reconnect_task: asyncio.Task | None = None

        # Pong tracking
        self._pong_received: asyncio.Event = asyncio.Event()

        # Event handlers: event_name -> handler callable
        self._event_handlers: dict[str, Callable] = {}
        self._connect_handler: Callable | None = None
        self._disconnect_handler: Callable | None = None

        # Reconnect state
        self._reconnect_attempts: int = 0

    @property
    def connected(self) -> bool:
        """Return True if SIO connection is established."""
        return self._connected

    # ── Handler registration ─────────────────────────────────────────

    def on(self, event: str, handler: Callable) -> None:
        """Register a handler for a Socket.IO event (e.g. pushState)."""
        self._event_handlers[event] = handler

    def on_connect(self, handler: Callable) -> None:
        """Register a handler called when SIO connection is established."""
        self._connect_handler = handler

    def on_disconnect(self, handler: Callable) -> None:
        """Register a handler called when connection is lost."""
        self._disconnect_handler = handler

    # ── Connection lifecycle ─────────────────────────────────────────

    async def connect(self) -> None:
        """Establish initial connection to Volumio.

        Blocks until SIO connect ack (packet "40") is received.
        Raises on failure (so integration setup can fail gracefully).
        """
        self._shutting_down = False
        await self._do_connect()

    async def disconnect(self) -> None:
        """Cleanly shut down the transport."""
        self._shutting_down = True
        self._connected = False

        # Cancel background tasks
        for task in (self._ping_task, self._reader_task, self._reconnect_task):
            if task and not task.done():
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass

        self._ping_task = None
        self._reader_task = None
        self._reconnect_task = None

        # Close WebSocket
        if self._ws and not self._ws.closed:
            await self._ws.close()
        self._ws = None

    async def _do_connect(self) -> None:
        """Low-level connect: open WS, parse Open, wait for SIO ack.

        Used by both initial connect() and reconnection loop.
        """
        session = async_get_clientsession(self._hass)
        ws_timeout = aiohttp.ClientWSTimeout(ws_close=10.0)

        try:
            self._ws = await session.ws_connect(
                self._ws_url,
                timeout=ws_timeout,
            )
        except Exception as err:
            _LOGGER.error(
                "Failed to open WebSocket to %s:%s: %s",
                self._host, self._port, err,
            )
            raise

        # Wait for Open packet (type "0") and SIO connect ack ("40")
        open_received = False
        sio_connected = False

        try:
            async for msg in self._ws:
                if msg.type != aiohttp.WSMsgType.TEXT:
                    continue

                raw = msg.data

                if raw.startswith("0") and not open_received:
                    # EIO3 Open packet
                    self._parse_open_packet(raw)
                    open_received = True

                elif raw == "40" and open_received:
                    # SIO connect ack — connection fully established
                    sio_connected = True
                    break

                elif raw.startswith("42"):
                    # Some servers send events before we're "ready" —
                    # Volumio sends closeAllModals and pushMultiRoomDevices
                    # during handshake. Route them normally.
                    self._dispatch_event(raw)

                # Safety: don't loop forever waiting
                if open_received and not sio_connected:
                    # We got Open but waiting for 40 — keep reading
                    continue

        except Exception as err:
            _LOGGER.error("Error during EIO3 handshake: %s", err)
            if self._ws and not self._ws.closed:
                await self._ws.close()
            raise

        if not sio_connected:
            msg = "EIO3 handshake incomplete: did not receive SIO connect ack"
            _LOGGER.error(msg)
            if self._ws and not self._ws.closed:
                await self._ws.close()
            raise ConnectionError(msg)

        self._connected = True
        self._reconnect_attempts = 0
        _LOGGER.info(
            "EIO3 connected to Volumio at %s:%s (sid=%s, "
            "pingInterval=%dms, pingTimeout=%dms)",
            self._host, self._port, self._sid,
            self._ping_interval_ms, self._ping_timeout_ms,
        )

        # Start background tasks
        self._reader_task = self._hass.async_create_background_task(
            self._read_loop(), "volumio_ws_reader"
        )
        self._ping_task = self._hass.async_create_background_task(
            self._ping_loop(), "volumio_ws_ping"
        )

        # Notify connect handler
        if self._connect_handler:
            try:
                result = self._connect_handler()
                if asyncio.iscoroutine(result):
                    await result
            except Exception:
                _LOGGER.exception("Error in connect handler")

    def _parse_open_packet(self, raw: str) -> None:
        """Parse EIO3 Open packet: 0{json}."""
        try:
            data = json.loads(raw[1:])
            self._sid = data.get("sid")
            self._ping_interval_ms = data.get("pingInterval", 25000)
            self._ping_timeout_ms = data.get("pingTimeout", 5000)
            _LOGGER.debug(
                "EIO3 Open: sid=%s, pingInterval=%d, pingTimeout=%d",
                self._sid, self._ping_interval_ms, self._ping_timeout_ms,
            )
        except (json.JSONDecodeError, KeyError) as err:
            _LOGGER.warning("Failed to parse EIO3 Open packet: %s", err)

    # ── Message reading ──────────────────────────────────────────────

    async def _read_loop(self) -> None:
        """Read messages from WebSocket and dispatch."""
        try:
            async for msg in self._ws:
                if self._shutting_down:
                    break

                if msg.type == aiohttp.WSMsgType.TEXT:
                    self._handle_raw_message(msg.data)

                elif msg.type in (
                    aiohttp.WSMsgType.CLOSED,
                    aiohttp.WSMsgType.CLOSING,
                    aiohttp.WSMsgType.ERROR,
                ):
                    _LOGGER.warning(
                        "WebSocket message type %s — connection lost", msg.type
                    )
                    break

        except asyncio.CancelledError:
            raise
        except Exception as err:
            _LOGGER.warning("Read loop error: %s", err)

        # If we get here, the connection is lost
        if not self._shutting_down:
            self._handle_connection_lost()

    def _handle_raw_message(self, raw: str) -> None:
        """Parse and route a raw EIO3 message."""
        if not raw:
            return

        packet_type = raw[0]

        if packet_type == "3":
            # PONG — server responding to our ping
            _LOGGER.debug("EIO3 PONG received")
            self._pong_received.set()

        elif packet_type == "2":
            # Server sending PING — unexpected in EIO3 client-ping model
            # but respond defensively
            _LOGGER.debug("EIO3 server PING received (unexpected), sending PONG")
            if self._ws and not self._ws.closed:
                asyncio.create_task(self._ws.send_str("3"))

        elif packet_type == "4":
            # Socket.IO message layer
            if len(raw) > 1 and raw[1] == "2":
                # SIO EVENT: 42["eventName", data]
                self._dispatch_event(raw)
            elif len(raw) > 1 and raw[1] == "1":
                _LOGGER.warning("Received SIO disconnect (41)")
                if not self._shutting_down:
                    self._handle_connection_lost()
            else:
                _LOGGER.debug("SIO packet (unhandled): %s", raw[:50])

        elif packet_type == "1":
            # EIO Close
            _LOGGER.warning("Received EIO close (1)")
            if not self._shutting_down:
                self._handle_connection_lost()

        else:
            _LOGGER.debug("Unknown EIO packet type '%s': %s", packet_type, raw[:80])

    def _dispatch_event(self, raw: str) -> None:
        """Parse a 42-type packet and call the registered handler."""
        try:
            payload = json.loads(raw[2:])
        except json.JSONDecodeError:
            _LOGGER.warning("Failed to parse SIO event JSON: %s", raw[:100])
            return

        if not isinstance(payload, list) or len(payload) < 1:
            _LOGGER.warning("SIO event payload is not a list: %s", raw[:100])
            return

        event_name = payload[0]
        event_data = payload[1] if len(payload) > 1 else None

        handler = self._event_handlers.get(event_name)
        if handler:
            try:
                result = handler(event_data)
                if asyncio.iscoroutine(result):
                    asyncio.create_task(result)
            except Exception:
                _LOGGER.exception("Error in handler for event '%s'", event_name)
        else:
            _LOGGER.debug("No handler for SIO event '%s'", event_name)

    # ── Keepalive (PING/PONG) ────────────────────────────────────────

    async def _ping_loop(self) -> None:
        """Client-initiated PING loop per EIO3 spec."""
        interval_sec = max(
            (self._ping_interval_ms - PING_MARGIN_MS) / 1000,
            1.0,
        )
        timeout_sec = self._ping_timeout_ms / 1000

        _LOGGER.debug(
            "Ping loop started: interval=%.1fs, timeout=%.1fs",
            interval_sec, timeout_sec,
        )

        try:
            while not self._shutting_down:
                await asyncio.sleep(interval_sec)

                if self._shutting_down:
                    break

                if not self._ws or self._ws.closed:
                    _LOGGER.debug("Ping loop: WebSocket closed, stopping")
                    break

                # Send PING
                self._pong_received.clear()
                try:
                    await self._ws.send_str("2")
                    _LOGGER.debug("EIO3 PING sent")
                except Exception as err:
                    _LOGGER.warning("Failed to send PING: %s", err)
                    break

                # Wait for PONG
                try:
                    await asyncio.wait_for(
                        self._pong_received.wait(),
                        timeout=timeout_sec,
                    )
                except asyncio.TimeoutError:
                    _LOGGER.warning(
                        "PONG timeout (%ds) — treating as disconnected",
                        timeout_sec,
                    )
                    break

        except asyncio.CancelledError:
            raise

        # If we exit the loop without shutdown, connection is lost
        if not self._shutting_down:
            self._handle_connection_lost()

    # ── Emitting events ──────────────────────────────────────────────

    async def emit(self, event: str, data: Any = None) -> None:
        """Send a Socket.IO event to Volumio.

        Formats as: 42["eventName"] or 42["eventName", data]
        """
        if not self._ws or self._ws.closed or not self._connected:
            _LOGGER.warning("Cannot emit '%s': not connected", event)
            return

        if data is not None:
            payload = json.dumps([event, data])
        else:
            payload = json.dumps([event])

        msg = f"42{payload}"

        try:
            await self._ws.send_str(msg)
            _LOGGER.debug("Emitted: %s", event)
        except Exception as err:
            _LOGGER.warning("Failed to emit '%s': %s", event, err)

    # ── Reconnection ─────────────────────────────────────────────────

    def _handle_connection_lost(self) -> None:
        """Handle unexpected connection loss — start reconnect loop."""
        if self._shutting_down:
            return

        was_connected = self._connected
        self._connected = False

        # Cancel ping task (reader task is ending on its own)
        if self._ping_task and not self._ping_task.done():
            self._ping_task.cancel()

        # Notify disconnect handler
        if was_connected and self._disconnect_handler:
            try:
                result = self._disconnect_handler()
                if asyncio.iscoroutine(result):
                    asyncio.create_task(result)
            except Exception:
                _LOGGER.exception("Error in disconnect handler")

        # Start reconnect if not already running
        if not self._reconnect_task or self._reconnect_task.done():
            self._reconnect_task = self._hass.async_create_background_task(
                self._reconnect_loop(), "volumio_ws_reconnect"
            )

    async def _reconnect_loop(self) -> None:
        """Attempt to reconnect with exponential backoff."""
        while not self._shutting_down:
            delay = min(
                RECONNECT_BASE * (2 ** self._reconnect_attempts),
                RECONNECT_MAX,
            )
            self._reconnect_attempts += 1

            _LOGGER.info(
                "Reconnecting to Volumio in %ds (attempt %d)",
                delay, self._reconnect_attempts,
            )
            await asyncio.sleep(delay)

            if self._shutting_down:
                break

            # Close stale WebSocket if still open
            if self._ws and not self._ws.closed:
                try:
                    await self._ws.close()
                except Exception:
                    pass
            self._ws = None

            try:
                await self._do_connect()
                _LOGGER.info(
                    "Reconnected to Volumio (attempt %d)",
                    self._reconnect_attempts,
                )
                return  # Success — _do_connect starts reader + ping tasks
            except Exception as err:
                _LOGGER.warning(
                    "Reconnect attempt %d failed: %s",
                    self._reconnect_attempts, err,
                )


async def async_test_connect(hass: HomeAssistant, host: str, port: int) -> bool:
    """Test connection to Volumio for config flow validation.

    Connects, waits for SIO ack, then disconnects. Returns True on success.
    Does NOT start background tasks or ping loop.
    """
    url = f"ws://{host}:{port}/socket.io/?EIO=3&transport=websocket"
    session = async_get_clientsession(hass)
    ws_timeout = aiohttp.ClientWSTimeout(ws_close=10.0)

    try:
        ws = await session.ws_connect(url, timeout=ws_timeout)
    except Exception as err:
        _LOGGER.debug("Test connection failed to open WebSocket: %s", err)
        return False

    try:
        open_received = False
        # Read up to 10 messages waiting for Open + 40
        for _ in range(10):
            msg = await asyncio.wait_for(ws.receive(), timeout=10.0)
            if msg.type != aiohttp.WSMsgType.TEXT:
                continue
            raw = msg.data
            if raw.startswith("0"):
                open_received = True
            elif raw == "40" and open_received:
                return True
    except (asyncio.TimeoutError, Exception) as err:
        _LOGGER.debug("Test connection handshake failed: %s", err)
        return False
    finally:
        if not ws.closed:
            await ws.close()

    return False
