#!/usr/bin/env python3
"""Step 2 — Test every WebSocket command the integration sends.

Records PASS/FAIL/UNEXPECTED for each command.
Usage: python ws_commands_test.py [host] [port]
"""

import asyncio
import json
import sys
import time

import socketio

HOST = sys.argv[1] if len(sys.argv) > 1 else "192.168.0.24"
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 3000
URL = f"http://{HOST}:{PORT}"

sio = socketio.AsyncClient(logger=False, engineio_logger=False)

# Collectors for push events
last_push_state = {}
last_push_queue = []
last_push_browse = {}
last_push_sources = []
last_push_playlists = []
state_event = asyncio.Event()
queue_event = asyncio.Event()
browse_event = asyncio.Event()
sources_event = asyncio.Event()
playlists_event = asyncio.Event()

results = []


@sio.event
async def connect():
    """Request initial state on connect."""
    print("[connected] Emitting getState...")
    await sio.emit("getState")


def record(test_name, status, detail=""):
    """Record a test result."""
    results.append({"test": test_name, "status": status, "detail": detail})
    icon = {"PASS": "✓", "FAIL": "✗", "UNEXPECTED": "⚠"}.get(status, "?")
    print(f"  [{icon}] {status}: {test_name}" + (f" — {detail}" if detail else ""))


@sio.on("pushState")
async def on_push_state(data):
    global last_push_state
    last_push_state = data
    state_event.set()


@sio.on("pushQueue")
async def on_push_queue(data):
    global last_push_queue
    last_push_queue = data if isinstance(data, list) else []
    queue_event.set()


@sio.on("pushBrowseLibrary")
async def on_push_browse(data):
    global last_push_browse
    last_push_browse = data
    browse_event.set()


@sio.on("pushBrowseSources")
async def on_push_sources(data):
    global last_push_sources
    last_push_sources = data if isinstance(data, list) else []
    sources_event.set()


@sio.on("pushListPlaylist")
async def on_push_playlists(data):
    global last_push_playlists
    last_push_playlists = data if isinstance(data, list) else []
    playlists_event.set()


async def wait_for(event, timeout=5):
    """Wait for an event, return True if received."""
    event.clear()
    try:
        await asyncio.wait_for(event.wait(), timeout=timeout)
        return True
    except asyncio.TimeoutError:
        return False


async def emit_and_wait_state(event_name, data=None, timeout=5):
    """Emit and wait for pushState response."""
    state_event.clear()
    if data is not None:
        await sio.emit(event_name, data)
    else:
        await sio.emit(event_name)
    return await wait_for(state_event, timeout)


async def main():
    print(f"Connecting to Volumio at {URL} (websocket only)...")
    try:
        await sio.connect(URL, transports=["websocket"], wait_timeout=10)
    except Exception as e:
        print(f"[FAIL] Connection failed: {e}")
        sys.exit(1)

    # Wait for initial pushState
    print("Waiting for initial pushState...")
    if not await wait_for(state_event, 5):
        print("[FAIL] No initial pushState received")
        sys.exit(1)
    print(f"Connected. Status: {last_push_state.get('status')}, "
          f"Title: {last_push_state.get('title')}\n")

    # Save initial state to restore later
    initial_volume = last_push_state.get("volume", 100)
    initial_random = last_push_state.get("random")
    initial_repeat = last_push_state.get("repeat")

    # ================================================================
    # PLAYBACK COMMANDS
    # ================================================================
    print("=" * 60)
    print("PLAYBACK COMMANDS")
    print("=" * 60)

    # --- play (no args) ---
    ok = await emit_and_wait_state("play")
    if ok:
        status = last_push_state.get("status")
        if status == "play":
            record("play (no args)", "PASS")
        else:
            record("play (no args)", "UNEXPECTED", f"status={status}")
    else:
        record("play (no args)", "FAIL", "no pushState response")

    await asyncio.sleep(1)

    # --- pause ---
    ok = await emit_and_wait_state("pause")
    if ok:
        status = last_push_state.get("status")
        if status == "pause":
            record("pause", "PASS")
        else:
            record("pause", "UNEXPECTED", f"status={status}")
    else:
        record("pause", "FAIL", "no pushState response")

    await asyncio.sleep(0.5)

    # --- play {value: 0} (play at queue index 0) ---
    ok = await emit_and_wait_state("play", {"value": 0})
    if ok:
        status = last_push_state.get("status")
        if status == "play":
            record("play {value: 0}", "PASS")
        else:
            record("play {value: 0}", "UNEXPECTED", f"status={status}")
    else:
        record("play {value: 0}", "FAIL", "no pushState response")

    await asyncio.sleep(1)

    # --- stop ---
    ok = await emit_and_wait_state("stop")
    if ok:
        status = last_push_state.get("status")
        if status == "stop":
            record("stop", "PASS")
        else:
            record("stop", "UNEXPECTED", f"status={status}")
    else:
        record("stop", "FAIL", "no pushState response")

    await asyncio.sleep(0.5)

    # Restart playback for next/prev/seek tests
    await emit_and_wait_state("play")
    await asyncio.sleep(1)

    # --- next ---
    old_title = last_push_state.get("title")
    ok = await emit_and_wait_state("next")
    if ok:
        new_title = last_push_state.get("title")
        if new_title != old_title:
            record("next", "PASS", f"'{old_title}' → '{new_title}'")
        else:
            record("next", "UNEXPECTED", f"title unchanged: '{new_title}'")
    else:
        record("next", "FAIL", "no pushState response")

    await asyncio.sleep(1)

    # --- prev ---
    old_title = last_push_state.get("title")
    ok = await emit_and_wait_state("prev")
    if ok:
        new_title = last_push_state.get("title")
        if new_title != old_title:
            record("prev", "PASS", f"'{old_title}' → '{new_title}'")
        else:
            record("prev", "UNEXPECTED", f"title unchanged: '{new_title}'")
    else:
        record("prev", "FAIL", "no pushState response")

    await asyncio.sleep(1)

    # --- seek ---
    ok = await emit_and_wait_state("seek", 30)
    if ok:
        seek_val = last_push_state.get("seek", 0)
        # seek is in ms, we sent seconds — check if Volumio expects seconds or ms
        record("seek (sent 30)", "PASS",
               f"seek={seek_val} (ms={seek_val}, ~{seek_val//1000}s)")
    else:
        record("seek (sent 30)", "FAIL", "no pushState response")

    # Pause before volume tests
    await emit_and_wait_state("pause")
    await asyncio.sleep(0.5)

    # ================================================================
    # VOLUME COMMANDS
    # ================================================================
    print("\n" + "=" * 60)
    print("VOLUME COMMANDS")
    print("=" * 60)
    print(f"  NOTE: disableVolumeControl={last_push_state.get('disableVolumeControl')}")

    # --- volume N (set to 50) ---
    ok = await emit_and_wait_state("volume", 50)
    if ok:
        vol = last_push_state.get("volume")
        record("volume 50", "PASS" if vol == 50 else "UNEXPECTED", f"volume={vol}")
    else:
        record("volume 50", "FAIL", "no pushState response")

    await asyncio.sleep(0.5)

    # --- volume + ---
    before_vol = last_push_state.get("volume", 0)
    ok = await emit_and_wait_state("volume", "+")
    if ok:
        after_vol = last_push_state.get("volume", 0)
        if after_vol > before_vol:
            record("volume +", "PASS", f"{before_vol} → {after_vol}")
        else:
            record("volume +", "UNEXPECTED", f"{before_vol} → {after_vol}")
    else:
        record("volume +", "FAIL", "no pushState response")

    await asyncio.sleep(0.5)

    # --- volume - ---
    before_vol = last_push_state.get("volume", 0)
    ok = await emit_and_wait_state("volume", "-")
    if ok:
        after_vol = last_push_state.get("volume", 0)
        if after_vol < before_vol:
            record("volume -", "PASS", f"{before_vol} → {after_vol}")
        else:
            record("volume -", "UNEXPECTED", f"{before_vol} → {after_vol}")
    else:
        record("volume -", "FAIL", "no pushState response")

    await asyncio.sleep(0.5)

    # --- mute ---
    ok = await emit_and_wait_state("mute", "")
    if ok:
        muted = last_push_state.get("mute")
        record("mute", "PASS" if muted else "UNEXPECTED", f"mute={muted}")
    else:
        record("mute", "FAIL", "no pushState response")

    await asyncio.sleep(0.5)

    # --- unmute ---
    ok = await emit_and_wait_state("unmute", "")
    if ok:
        muted = last_push_state.get("mute")
        record("unmute", "PASS" if not muted else "UNEXPECTED", f"mute={muted}")
    else:
        record("unmute", "FAIL", "no pushState response")

    # Restore original volume
    await asyncio.sleep(0.5)
    await emit_and_wait_state("volume", initial_volume)

    # ================================================================
    # SHUFFLE / REPEAT
    # ================================================================
    print("\n" + "=" * 60)
    print("SHUFFLE / REPEAT")
    print("=" * 60)

    # --- setRandom true ---
    ok = await emit_and_wait_state("setRandom", {"value": True})
    if ok:
        val = last_push_state.get("random")
        record("setRandom {value: true}", "PASS" if val is True else "UNEXPECTED",
               f"random={val!r} (type={type(val).__name__})")
    else:
        record("setRandom {value: true}", "FAIL", "no pushState response")

    await asyncio.sleep(0.5)

    # --- setRandom false ---
    ok = await emit_and_wait_state("setRandom", {"value": False})
    if ok:
        val = last_push_state.get("random")
        record("setRandom {value: false}", "PASS" if val is False else "UNEXPECTED",
               f"random={val!r} (type={type(val).__name__})")
    else:
        record("setRandom {value: false}", "FAIL", "no pushState response")

    await asyncio.sleep(0.5)

    # --- setRepeat true ---
    ok = await emit_and_wait_state("setRepeat", {"value": True})
    if ok:
        val = last_push_state.get("repeat")
        record("setRepeat {value: true}", "PASS" if val is True else "UNEXPECTED",
               f"repeat={val!r}")
    else:
        record("setRepeat {value: true}", "FAIL", "no pushState response")

    await asyncio.sleep(0.5)

    # --- setRepeat false ---
    ok = await emit_and_wait_state("setRepeat", {"value": False})
    if ok:
        val = last_push_state.get("repeat")
        record("setRepeat {value: false}", "PASS" if val is False else "UNEXPECTED",
               f"repeat={val!r}")
    else:
        record("setRepeat {value: false}", "FAIL", "no pushState response")

    # ================================================================
    # BROWSE
    # ================================================================
    print("\n" + "=" * 60)
    print("BROWSE")
    print("=" * 60)

    # --- getBrowseSources ---
    sources_event.clear()
    await sio.emit("getBrowseSources")
    if await wait_for(sources_event, 5):
        record("getBrowseSources", "PASS", f"{len(last_push_sources)} sources")
        for src in last_push_sources[:5]:
            print(f"    source: {src.get('name', '?')} — uri={src.get('uri', '?')}")
    else:
        record("getBrowseSources", "FAIL", "no pushBrowseSources response")

    await asyncio.sleep(0.5)

    # --- browseLibrary (root / no args) ---
    browse_event.clear()
    await sio.emit("browseLibrary", {"uri": ""})
    if await wait_for(browse_event, 5):
        nav = last_push_browse.get("navigation", {})
        lists = nav.get("lists", [])
        total_items = sum(len(l.get("items", [])) for l in lists)
        record("browseLibrary (root)", "PASS",
               f"{len(lists)} lists, {total_items} total items")
        # Show first few items
        for lst in lists[:2]:
            title = lst.get("title", "(untitled)")
            items = lst.get("items", [])
            print(f"    list '{title}': {len(items)} items")
            for item in items[:3]:
                print(f"      - {item.get('title', '?')} (type={item.get('type', '?')}, uri={item.get('uri', '?')[:60]})")
    else:
        record("browseLibrary (root)", "FAIL", "no pushBrowseLibrary response")

    # --- browseLibrary (one level deep) ---
    # Pick the first browseable URI from root
    first_uri = None
    if last_push_browse:
        nav = last_push_browse.get("navigation", {})
        for lst in nav.get("lists", []):
            for item in lst.get("items", []):
                uri = item.get("uri", "")
                if uri and item.get("type") not in ("song", "track", "webradio"):
                    first_uri = uri
                    break
            if first_uri:
                break

    if first_uri:
        browse_event.clear()
        await sio.emit("browseLibrary", {"uri": first_uri})
        if await wait_for(browse_event, 5):
            nav = last_push_browse.get("navigation", {})
            lists = nav.get("lists", [])
            total_items = sum(len(l.get("items", [])) for l in lists)
            record(f"browseLibrary (uri={first_uri[:50]})", "PASS",
                   f"{len(lists)} lists, {total_items} items")
            for lst in lists[:1]:
                for item in lst.get("items", [])[:3]:
                    print(f"      - {item.get('title', '?')} (type={item.get('type', '?')})")
        else:
            record(f"browseLibrary (uri={first_uri[:50]})", "FAIL", "no response")
    else:
        record("browseLibrary (one level deep)", "FAIL", "no browseable URI found")

    await asyncio.sleep(0.5)

    # --- search ---
    browse_event.clear()
    await sio.emit("search", {"value": "Beatles"})
    if await wait_for(browse_event, 5):
        nav = last_push_browse.get("navigation", {})
        lists = nav.get("lists", [])
        total_items = sum(len(l.get("items", [])) for l in lists)
        record("search {value: 'Beatles'}", "PASS",
               f"{len(lists)} lists, {total_items} results")
        for lst in lists[:2]:
            title = lst.get("title", "(untitled)")
            items = lst.get("items", [])
            print(f"    list '{title}': {len(items)} items")
            for item in items[:2]:
                print(f"      - {item.get('title', '?')} (type={item.get('type', '?')})")
    else:
        record("search {value: 'Beatles'}", "FAIL", "no pushBrowseLibrary response")

    # ================================================================
    # QUEUE
    # ================================================================
    print("\n" + "=" * 60)
    print("QUEUE")
    print("=" * 60)

    # --- getQueue ---
    queue_event.clear()
    await sio.emit("getQueue")
    if await wait_for(queue_event, 5):
        record("getQueue", "PASS", f"{len(last_push_queue)} items in queue")
        for item in last_push_queue[:3]:
            print(f"    - {item.get('name', item.get('title', '?'))} "
                  f"(uri={item.get('uri', '?')[:50]})")
        # Save a URI for addToQueue test
        queue_item_uri = None
        if last_push_queue:
            queue_item_uri = last_push_queue[0].get("uri")
    else:
        record("getQueue", "FAIL", "no pushQueue response")
        queue_item_uri = None

    await asyncio.sleep(0.5)

    # --- addToQueue (if we have a URI) ---
    if queue_item_uri:
        queue_before = len(last_push_queue)
        queue_event.clear()
        await sio.emit("addToQueue", {"uri": queue_item_uri})
        if await wait_for(queue_event, 5):
            record("addToQueue", "PASS",
                   f"queue {queue_before} → {len(last_push_queue)}")
        else:
            record("addToQueue", "FAIL", "no pushQueue response")
    else:
        record("addToQueue", "FAIL", "no URI available to add")

    await asyncio.sleep(0.5)

    # --- removeFromQueue ---
    if last_push_queue:
        queue_before = len(last_push_queue)
        last_index = queue_before - 1  # Remove the last item (the one we just added)
        queue_event.clear()
        await sio.emit("removeFromQueue", {"value": last_index})
        if await wait_for(queue_event, 5):
            record("removeFromQueue", "PASS",
                   f"queue {queue_before} → {len(last_push_queue)}")
        else:
            record("removeFromQueue", "FAIL", "no pushQueue response")
    else:
        record("removeFromQueue", "FAIL", "queue empty, nothing to remove")

    # ================================================================
    # PLAYLISTS
    # ================================================================
    print("\n" + "=" * 60)
    print("PLAYLISTS")
    print("=" * 60)

    playlists_event.clear()
    await sio.emit("listPlaylist")
    if await wait_for(playlists_event, 5):
        record("listPlaylist", "PASS", f"{len(last_push_playlists)} playlists")
        for pl in last_push_playlists[:5]:
            print(f"    - {pl}")
    else:
        record("listPlaylist", "FAIL", "no pushListPlaylist response")

    # ================================================================
    # SUMMARY
    # ================================================================
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    pass_count = sum(1 for r in results if r["status"] == "PASS")
    fail_count = sum(1 for r in results if r["status"] == "FAIL")
    unexpected_count = sum(1 for r in results if r["status"] == "UNEXPECTED")
    print(f"  PASS: {pass_count}  |  FAIL: {fail_count}  |  UNEXPECTED: {unexpected_count}")
    print()

    if fail_count or unexpected_count:
        print("ISSUES:")
        for r in results:
            if r["status"] in ("FAIL", "UNEXPECTED"):
                print(f"  [{r['status']}] {r['test']}: {r['detail']}")

    # Dump full results as JSON for docs
    print("\n" + "=" * 60)
    print("RAW RESULTS (JSON)")
    print("=" * 60)
    print(json.dumps(results, indent=2))

    await sio.disconnect()
    print("\n[OK] Done.")


if __name__ == "__main__":
    asyncio.run(main())
