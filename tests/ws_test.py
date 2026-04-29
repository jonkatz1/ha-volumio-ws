#!/usr/bin/env python3
"""Standalone Socket.io test — connect to Volumio and dump pushState.

Usage: python ws_test.py [host] [port]
Defaults: host=192.168.0.24, port=3000
"""

import asyncio
import json
import sys

import socketio

HOST = sys.argv[1] if len(sys.argv) > 1 else "192.168.0.24"
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 3000
URL = f"http://{HOST}:{PORT}"

sio = socketio.AsyncClient(logger=False, engineio_logger=False)
state_received = asyncio.Event()
push_state_data = {}


@sio.event
async def connect():
    print(f"[OK] Connected to {URL}")
    print("[>>] Emitting getState...")
    await sio.emit("getState")


@sio.event
async def disconnect():
    print("[--] Disconnected")


@sio.on("pushState")
async def on_push_state(data):
    global push_state_data
    push_state_data = data
    state_received.set()


async def main():
    print(f"Connecting to Volumio at {URL} ...")
    try:
        await sio.connect(URL, wait_timeout=10)
    except Exception as e:
        print(f"[FAIL] Connection failed: {e}")
        sys.exit(1)

    # Wait for pushState response
    try:
        await asyncio.wait_for(state_received.wait(), timeout=10)
    except asyncio.TimeoutError:
        print("[FAIL] Timed out waiting for pushState")
        await sio.disconnect()
        sys.exit(1)

    # Dump full pushState
    print("\n" + "=" * 60)
    print("FULL pushState RESPONSE")
    print("=" * 60)
    print(json.dumps(push_state_data, indent=2, ensure_ascii=False))

    # Key fields analysis
    print("\n" + "=" * 60)
    print("KEY FIELDS ANALYSIS")
    print("=" * 60)
    fields_of_interest = [
        "status", "title", "artist", "album", "albumart",
        "uri", "trackType", "service",
        "volume", "mute", "random", "repeat", "repeatSingle",
        "seek", "duration",
        "samplerate", "bitdepth", "channels",
        "stream", "volatile",
    ]
    for field in fields_of_interest:
        val = push_state_data.get(field, "<MISSING>")
        val_type = type(val).__name__ if field in push_state_data else "n/a"
        print(f"  {field:20s} = {val!r:40s}  (type: {val_type})")

    # Check for any fields we DON'T expect
    print("\n" + "=" * 60)
    print("ALL KEYS IN pushState (for completeness)")
    print("=" * 60)
    for key in sorted(push_state_data.keys()):
        print(f"  {key}")

    await sio.disconnect()
    print("\n[OK] Done.")


if __name__ == "__main__":
    asyncio.run(main())
