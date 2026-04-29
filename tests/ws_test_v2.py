#!/usr/bin/env python3
"""Test Socket.IO connection with verbose logging and transport variants."""

import asyncio
import logging
import sys

HOST = sys.argv[1] if len(sys.argv) > 1 else "192.168.0.24"
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 3000
URL = f"http://{HOST}:{PORT}"

# Enable full debug logging
logging.basicConfig(level=logging.DEBUG, format="%(name)s %(levelname)s: %(message)s")


async def test_connect(label, **kwargs):
    """Try a connection with given kwargs."""
    import socketio

    print(f"\n{'=' * 60}")
    print(f"TEST: {label}")
    print(f"{'=' * 60}")

    sio = socketio.AsyncClient(logger=True, engineio_logger=True)
    connected = asyncio.Event()
    got_state = asyncio.Event()
    state_data = {}

    @sio.event
    async def connect():
        print(f"  [OK] Connected!")
        connected.set()

    @sio.event
    async def connect_error(data):
        print(f"  [FAIL] connect_error: {data}")

    @sio.on("pushState")
    async def on_push_state(data):
        nonlocal state_data
        state_data = data
        print(f"  [OK] Got pushState — title: {data.get('title', '?')}")
        got_state.set()

    try:
        await sio.connect(URL, wait_timeout=10, **kwargs)
        await asyncio.wait_for(connected.wait(), timeout=5)
        print("  Emitting getState...")
        await sio.emit("getState")
        await asyncio.wait_for(got_state.wait(), timeout=5)
        print(f"  [OK] Full round-trip succeeded")
    except asyncio.TimeoutError:
        print(f"  [FAIL] Timed out")
    except Exception as e:
        print(f"  [FAIL] {type(e).__name__}: {e}")
    finally:
        try:
            await sio.disconnect()
        except Exception:
            pass

    return state_data


async def main():
    print(f"Target: {URL}")
    print(f"Python: {sys.version}")

    # Test 1: Default (polling + websocket upgrade)
    data = await test_connect("Default transports (polling → websocket)")

    # Test 2: Polling only (no websocket upgrade)
    if not data:
        data = await test_connect(
            "Polling only (no websocket upgrade)",
            transports=["polling"],
        )

    # Test 3: Websocket only (skip polling)
    if not data:
        data = await test_connect(
            "WebSocket only (skip polling)",
            transports=["websocket"],
        )

    if data:
        import json
        print(f"\n{'=' * 60}")
        print("FULL pushState")
        print(f"{'=' * 60}")
        print(json.dumps(data, indent=2, ensure_ascii=False))
    else:
        print("\n[FAIL] All connection methods failed.")


if __name__ == "__main__":
    asyncio.run(main())
