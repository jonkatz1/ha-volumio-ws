"""
EIO3 Raw WebSocket Traffic Capture for Volumio
===============================================
Connects to Volumio using raw aiohttp WebSocket with EIO=3,
logs every packet for analysis. This tells us:

  - Exact format of the Open packet (sid, pingInterval, pingTimeout)
  - Whether Volumio sends "40" (SIO connect ack)
  - PING/PONG behavior (who sends what, timing)
  - How pushState events look as raw strings
  - Whether there are namespace packets or surprises

Usage:
  python eio3_raw_test.py [host] [port] [duration_seconds]

Defaults:
  host = 192.168.0.24
  port = 3000
  duration = 90 seconds

Requirements:
  pip install aiohttp
"""

import asyncio
import json
import sys
import time

import aiohttp


# ── EIO3 packet type reference ──────────────────────────────────────
# Type 0: Open        - server sends session params (sid, pingInterval, etc.)
# Type 1: Close       - connection close
# Type 2: Ping        - in EIO3, CLIENT sends ping "2"
# Type 3: Pong        - in EIO3, SERVER responds with pong "3"
# Type 4: Message     - Socket.IO layer packet
#   "40"  = SIO CONNECT ack
#   "42"  = SIO EVENT (the main one — pushState, pushQueue, etc.)
#   "41"  = SIO DISCONNECT
#   "43"  = SIO ACK
# Type 5: Upgrade
# Type 6: Noop
# ─────────────────────────────────────────────────────────────────────

EIO_TYPES = {
    "0": "OPEN",
    "1": "CLOSE",
    "2": "PING",
    "3": "PONG",
    "4": "MESSAGE",
    "5": "UPGRADE",
    "6": "NOOP",
}


def classify_packet(raw: str) -> str:
    """Classify a raw EIO3 packet string for logging."""
    if not raw:
        return "EMPTY"
    prefix = raw[0]
    base = EIO_TYPES.get(prefix, f"UNKNOWN({prefix})")

    # Sub-classify SIO messages (type 4x)
    if prefix == "4" and len(raw) > 1:
        sio_type = raw[1]
        if sio_type == "0":
            return "SIO_CONNECT"
        elif sio_type == "1":
            return "SIO_DISCONNECT"
        elif sio_type == "2":
            # Extract event name from JSON array
            try:
                payload = json.loads(raw[2:])
                event_name = payload[0] if isinstance(payload, list) else "?"
                return f"SIO_EVENT({event_name})"
            except (json.JSONDecodeError, IndexError):
                return "SIO_EVENT(?)"
        elif sio_type == "3":
            return "SIO_ACK"
    return base


def truncate(s: str, max_len: int = 200) -> str:
    """Truncate a string for display."""
    if len(s) <= max_len:
        return s
    return s[:max_len] + f"... ({len(s)} total chars)"


def log(msg: str) -> None:
    """Print with timestamp."""
    elapsed = time.time() - START_TIME
    print(f"[{elapsed:7.2f}s] {msg}")


START_TIME = time.time()


async def run_capture(host: str, port: int, duration: int) -> None:
    """Main capture loop."""
    url = f"ws://{host}:{port}/socket.io/?EIO=3&transport=websocket"
    log(f"Connecting to {url}")
    log(f"Will capture for {duration} seconds")
    log("=" * 70)

    ping_interval = 25000  # default, updated from Open packet
    ping_timeout = 60000   # default, updated from Open packet
    ping_task = None
    pong_received = asyncio.Event()
    packet_count = 0
    ping_count = 0
    pong_count = 0
    event_counts: dict[str, int] = {}

    async with aiohttp.ClientSession() as session:
        try:
            ws = await session.ws_connect(url, timeout=10)
            log("WebSocket connected!")
        except Exception as err:
            log(f"FAILED to connect: {err}")
            return

        async def send_pings():
            """Client-initiated ping loop (EIO3 pattern)."""
            nonlocal ping_count
            # Wait a moment for Open packet to arrive and update intervals
            await asyncio.sleep(1)
            interval_sec = (ping_interval - 2000) / 1000  # send slightly early
            if interval_sec < 1:
                interval_sec = ping_interval / 1000
            log(f"PING loop starting: sending '2' every {interval_sec:.1f}s "
                f"(pingInterval={ping_interval}ms, pingTimeout={ping_timeout}ms)")
            while True:
                await asyncio.sleep(interval_sec)
                try:
                    pong_received.clear()
                    await ws.send_str("2")
                    ping_count += 1
                    log(f"→ SENT PING (2)  [#{ping_count}]")

                    # Wait for pong
                    try:
                        await asyncio.wait_for(
                            pong_received.wait(),
                            timeout=ping_timeout / 1000,
                        )
                    except asyncio.TimeoutError:
                        log(f"⚠ PONG TIMEOUT after {ping_timeout}ms — server may disconnect us")
                except Exception as err:
                    log(f"⚠ PING send failed: {err}")
                    break

        async def emit_command(event: str, data=None):
            """Send a SIO event (42-type packet)."""
            if data is not None:
                payload = json.dumps([event, data])
            else:
                payload = json.dumps([event])
            msg = f"42{payload}"
            await ws.send_str(msg)
            log(f"→ SENT: {truncate(msg, 120)}")

        # Start reading messages
        end_time = time.time() + duration
        state_received = False
        getstate_sent = False

        try:
            # Start ping task
            ping_task = asyncio.create_task(send_pings())

            async for ws_msg in ws:
                if time.time() > end_time:
                    log("Duration reached — stopping capture.")
                    break

                if ws_msg.type == aiohttp.WSMsgType.TEXT:
                    raw = ws_msg.data
                    packet_count += 1
                    classification = classify_packet(raw)

                    # Track event counts
                    event_counts[classification] = event_counts.get(classification, 0) + 1

                    # ── Handle specific packet types ──

                    if raw.startswith("0"):
                        # Open packet — parse session params
                        log(f"← RECV [{classification}]: {truncate(raw)}")
                        try:
                            open_data = json.loads(raw[1:])
                            ping_interval = open_data.get("pingInterval", ping_interval)
                            ping_timeout = open_data.get("pingTimeout", ping_timeout)
                            sid = open_data.get("sid", "?")
                            log(f"   Open params: sid={sid}, "
                                f"pingInterval={ping_interval}ms, "
                                f"pingTimeout={ping_timeout}ms")
                            log(f"   Full Open payload: {json.dumps(open_data, indent=2)}")
                        except json.JSONDecodeError as err:
                            log(f"   ⚠ Failed to parse Open packet: {err}")

                    elif raw == "3":
                        # Pong from server
                        pong_count += 1
                        pong_received.set()
                        log(f"← RECV [PONG] (3)  [#{pong_count}]")

                    elif raw == "2":
                        # Server sending ping? (unexpected in EIO3 client-ping model)
                        log(f"← RECV [SERVER PING] (2) — UNEXPECTED in EIO3!")
                        # Respond with pong just in case
                        await ws.send_str("3")
                        log(f"→ SENT PONG (3) — responding to unexpected server ping")

                    elif raw.startswith("40"):
                        # SIO connect ack
                        log(f"← RECV [{classification}]: {truncate(raw)}")
                        if not getstate_sent:
                            # Request initial state after SIO connect
                            log("   SIO connected — requesting initial state...")
                            await emit_command("getState")
                            getstate_sent = True

                    elif raw.startswith("42"):
                        # SIO event — the main data channel
                        log(f"← RECV [{classification}]: {truncate(raw, 300)}")

                        # Track if we got a pushState
                        try:
                            payload = json.loads(raw[2:])
                            if isinstance(payload, list) and payload[0] == "pushState":
                                if not state_received:
                                    state_received = True
                                    log("   ✓ First pushState received — state keys:")
                                    if len(payload) > 1 and isinstance(payload[1], dict):
                                        keys = sorted(payload[1].keys())
                                        log(f"     {keys}")
                                        # Log a few key fields
                                        st = payload[1]
                                        log(f"     status={st.get('status')}, "
                                            f"title={st.get('title')}, "
                                            f"volume={st.get('volume')}, "
                                            f"mute={st.get('mute')}, "
                                            f"random={st.get('random')}, "
                                            f"repeat={st.get('repeat')}, "
                                            f"repeatSingle={st.get('repeatSingle')}")
                        except (json.JSONDecodeError, IndexError):
                            pass

                    else:
                        # Anything else
                        log(f"← RECV [{classification}]: {truncate(raw)}")

                elif ws_msg.type == aiohttp.WSMsgType.BINARY:
                    log(f"← RECV [BINARY]: {len(ws_msg.data)} bytes")

                elif ws_msg.type == aiohttp.WSMsgType.ERROR:
                    log(f"← RECV [ERROR]: {ws.exception()}")
                    break

                elif ws_msg.type == aiohttp.WSMsgType.CLOSED:
                    log("← RECV [CLOSED]: Server closed the connection")
                    break

            # ── Test command emission before closing ──
            if time.time() < end_time:
                log("")
                log("── Testing command emission ──")
                # Request browse sources
                await emit_command("getBrowseSources")
                log("   Waiting 3s for pushBrowseSources...")
                await asyncio.sleep(3)

        except asyncio.CancelledError:
            log("Capture cancelled.")
        except Exception as err:
            log(f"Error during capture: {err}")
        finally:
            if ping_task:
                ping_task.cancel()
                try:
                    await ping_task
                except asyncio.CancelledError:
                    pass

            # Read any remaining messages in buffer
            remaining_time = 2.0
            try:
                async for ws_msg in ws:
                    if ws_msg.type == aiohttp.WSMsgType.TEXT:
                        raw = ws_msg.data
                        classification = classify_packet(raw)
                        log(f"← RECV (drain) [{classification}]: {truncate(raw, 200)}")
                        remaining_time -= 0.1
                        if remaining_time <= 0:
                            break
            except Exception:
                pass

            await ws.close()
            log("WebSocket closed.")

    # ── Summary ──────────────────────────────────────────────────────
    log("")
    log("=" * 70)
    log("CAPTURE SUMMARY")
    log("=" * 70)
    log(f"Total packets received: {packet_count}")
    log(f"Pings sent: {ping_count}")
    log(f"Pongs received: {pong_count}")
    log(f"Ping/Pong success rate: {pong_count}/{ping_count} "
        f"({(pong_count/ping_count*100) if ping_count else 0:.0f}%)")
    log("")
    log("Packet type breakdown:")
    for ptype, count in sorted(event_counts.items(), key=lambda x: -x[1]):
        log(f"  {ptype}: {count}")
    log("")
    if pong_count == ping_count and ping_count > 0:
        log("✓ PING/PONG working — connection would stay alive")
    elif ping_count > 0:
        log("⚠ PING/PONG mismatch — investigate!")
    else:
        log("⚠ No pings sent — capture may have been too short")


if __name__ == "__main__":
    host = sys.argv[1] if len(sys.argv) > 1 else "192.168.0.24"
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 3000
    duration = int(sys.argv[3]) if len(sys.argv) > 3 else 90

    print(f"EIO3 Raw WebSocket Capture — {host}:{port} for {duration}s")
    print(f"Press Ctrl+C to stop early")
    print()

    try:
        asyncio.run(run_capture(host, port, duration))
    except KeyboardInterrupt:
        print("\nCapture interrupted by user.")
