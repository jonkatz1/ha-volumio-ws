#!/usr/bin/env python3
"""T39 — Capture raw pushBrowseLibrary responses for search and browseLibrary.

Connects directly to Volumio "office dev" at 192.168.0.24:3000 via the EIO3
WebSocket (same pattern as tests/ws_commands_test.py). Performs two captures
in a single connection:

  1. emit "search" {"value": "Beatles"}        -> docs/T39-search-response.json
  2. emit "browseLibrary" {"uri": "playlists"} -> docs/T39-browse-response.json

Each capture waits up to 10 s for the next pushBrowseLibrary event. If either
times out or the connection fails, the error is surfaced verbatim and the
script exits non-zero.

Usage: python tests/t39_capture_search_response.py [host] [port]
"""

import asyncio
import json
import os
import sys
from pathlib import Path

import socketio

HOST = sys.argv[1] if len(sys.argv) > 1 else "192.168.0.24"
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 3000
URL = f"http://{HOST}:{PORT}"

CAPTURE_TIMEOUT = 10  # seconds

REPO_ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = REPO_ROOT / "docs"
SEARCH_OUT = DOCS_DIR / "T39-search-response.json"
BROWSE_OUT = DOCS_DIR / "T39-browse-response.json"

sio = socketio.AsyncClient(logger=False, engineio_logger=False)

_browse_queue: asyncio.Queue = asyncio.Queue()


@sio.on("pushBrowseLibrary")
async def on_push_browse(data):
    await _browse_queue.put(data)


def _drain_queue() -> None:
    """Discard any pushBrowseLibrary events queued before the next emit."""
    while not _browse_queue.empty():
        try:
            _browse_queue.get_nowait()
        except asyncio.QueueEmpty:
            break


async def capture(label: str, event: str, payload: dict) -> dict:
    """Emit `event` then return the next pushBrowseLibrary payload.

    Drains any stale queued events first so we capture the one caused by *this*
    emit, not a leftover from an earlier exchange.
    """
    _drain_queue()
    print(f"[{label}] emit {event} {payload!r}")
    await sio.emit(event, payload)
    try:
        data = await asyncio.wait_for(_browse_queue.get(), timeout=CAPTURE_TIMEOUT)
    except asyncio.TimeoutError as err:
        raise RuntimeError(
            f"[{label}] timed out after {CAPTURE_TIMEOUT}s waiting for "
            f"pushBrowseLibrary in response to {event} {payload!r}"
        ) from err
    print(f"[{label}] received pushBrowseLibrary")
    return data


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")


def nav_top_keys(data: dict) -> list:
    nav = data.get("navigation", {}) if isinstance(data, dict) else {}
    if not isinstance(nav, dict):
        return []
    return sorted(nav.keys())


async def main() -> int:
    print(f"Connecting to Volumio at {URL} (EIO3, websocket only)...")
    try:
        await sio.connect(URL, transports=["websocket"], wait_timeout=10)
    except Exception as err:
        print(f"[FAIL] Connection failed: {err}", file=sys.stderr)
        return 2
    print("[connected] SIO connect ack received")

    try:
        search_data = await capture(
            "search", "search", {"value": "Beatles"}
        )
        write_json(SEARCH_OUT, search_data)

        browse_data = await capture(
            "browse", "browseLibrary", {"uri": "playlists"}
        )
        write_json(BROWSE_OUT, browse_data)
    except RuntimeError as err:
        print(f"[FAIL] {err}", file=sys.stderr)
        await sio.disconnect()
        return 3
    finally:
        if sio.connected:
            await sio.disconnect()

    print()
    print("=== T39 capture summary ===")
    print(f"search  -> {SEARCH_OUT}  navigation keys: {nav_top_keys(search_data)}")
    print(f"browse  -> {BROWSE_OUT}  navigation keys: {nav_top_keys(browse_data)}")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
