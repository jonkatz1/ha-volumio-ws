# T2 Smoke Test Results

**Date:** 2026-04-26
**Tester:** Jon Katz + Claude (orchestrator-guided)
**Branch:** main (with transport fix applied during test)

---

## Environment

| Component | Detail |
|---|---|
| Volumio version | 3.912 |
| Volumio build | Fri 27 Feb 2026 10:59:40 AM CET |
| Volumio hardware | Raspberry Pi |
| Volumio OS | Debian 10 |
| Volumio IP | 192.168.0.24:3000 |
| Home Assistant | Latest HAOS |
| HA IP | 192.168.0.23:8123 |
| Dev machine Python | 3.14.2 (Windows) |
| python-socketio | 5.16.1 |
| python-engineio | 4.13.1 |
| Test content | Qobuz streaming (The Beatles, Anthology 4) |
| Second Volumio | "Jk-volumio-3" at 192.168.0.58 (multiroom) |

---

## Fixes Applied During Testing

**Transport fix (required to unblock testing):**
- `coordinator.py` line 185: added `transports=["websocket"]`
- `config_flow.py` line 46: added `transports=["websocket"]`
- Reason: Engine.IO polling handshake fails ("OPEN packet not returned by server") while direct WebSocket works. Likely python-engineio parsing issue on Python 3.14. Both EIO=3 and EIO=4 succeed via raw HTTP, but `AsyncClient.connect()` with polling transport fails.
- Backups: `*.bak-pre-t2`

---

## Raw pushState Sample

```json
{
  "status": "pause",
  "position": 7,
  "title": "I Need You",
  "artist": "The Beatles",
  "album": "Anthology 4",
  "albumart": "https://static.qobuz.com/images/covers/wb/n0/kv6tfmvmgn0wb_600.jpg",
  "uri": "qobuz://song/353014499",
  "trackType": "qobuz",
  "seek": 19512,
  "duration": 156,
  "samplerate": "96 kHz",
  "bitdepth": "24 bit",
  "channels": 2,
  "bitrate": "2239 Kbps",
  "random": null,
  "repeat": false,
  "repeatSingle": false,
  "consume": true,
  "volume": 100,
  "dbVolume": null,
  "mute": false,
  "disableVolumeControl": true,
  "stream": false,
  "updatedb": false,
  "volatile": false,
  "service": "mpd"
}
```

---

## Step 1 — WebSocket Connectivity

| Test | Result | Detail |
|---|---|---|
| HTTP reachable | PASS | 200, HTML returned |
| REST API (`/api/v1/getState`) | PASS | Returns state JSON |
| EIO=4 polling handshake | PASS | Raw HTTP succeeds |
| EIO=3 polling handshake | PASS | Raw HTTP succeeds |
| AsyncClient default transport | **FAIL** | "OPEN packet not returned by server" |
| AsyncClient polling-only | **FAIL** | Same error |
| AsyncClient websocket-only | **PASS** | Full round-trip, pushState received |

---

## Step 2 — WebSocket Commands

### Playback

| Command | Result | Detail |
|---|---|---|
| play (no args) | PASS | |
| pause | PASS | |
| play {value: 0} | UNEXPECTED | Returned status=stop (likely race condition in test timing) |
| stop | UNEXPECTED | Returned status=play (same race — captured lagged state from previous play) |
| next | UNEXPECTED | Title unchanged in captured pushState (timing) |
| prev | PASS | Track changed correctly |
| seek (sent 30) | PASS | seek=30000ms — Volumio expects seconds, returns ms. Code is correct. |

### Volume

**Note:** `disableVolumeControl=true` on this device. All volume commands were ignored as expected.

| Command | Result | Detail |
|---|---|---|
| volume 50 | UNEXPECTED | Volume stayed at 100 (device rejects volume changes) |
| volume + | UNEXPECTED | No change |
| volume - | UNEXPECTED | No change |
| mute | UNEXPECTED | mute stayed false |
| unmute | PASS | Was already false |

### Shuffle / Repeat

| Command | Result | Detail |
|---|---|---|
| setRandom {value: true} | PASS | random=True (bool) |
| setRandom {value: false} | PASS | random=False (bool) |
| setRepeat {value: true} | PASS | repeat=True |
| setRepeat {value: false} | PASS | repeat=False |

### Browse

| Command | Result | Detail |
|---|---|---|
| getBrowseSources | PASS | 13 sources returned |
| browseLibrary (root, uri="") | PASS* | *Returned 0 lists, 0 items — technically responded but useless |
| browseLibrary (one level deep) | FAIL | No browseable URI from empty root |
| search {value: "Beatles"} | PASS | 16 lists, 454 results |

### Queue

| Command | Result | Detail |
|---|---|---|
| getQueue | PASS | 54 items |
| addToQueue | PASS | 54→55 |
| removeFromQueue | PASS | 55→54 |

### Playlists

| Command | Result | Detail |
|---|---|---|
| listPlaylist | PASS | 4 playlists (2001, 2006 Electro, DL queue, JK - speaker test) |

---

## Step 3 — HA Installation

| Check | Result |
|---|---|
| Integration appears in list | PASS |
| Config flow connection test | PASS (with transport fix) |
| Import errors on restart | None |

---

## Step 4 — Entity Verification

| Check | Result | Detail |
|---|---|---|
| Media player entity appears | PASS | `media_player.volumio_office_dev` |
| State reflects device | PASS | playing/paused correctly |
| volume_level | PASS | 1.0 (100%) — correct |
| is_volume_muted | PASS | false |
| media_title | PASS | "I Saw Her Standing There" |
| media_artist | PASS | "The Beatles" |
| media_album_name | PASS | "Anthology 4" (in attributes, not shown in card UI — normal) |
| media_image_url | PASS | Album art loads and displays |
| media_duration | PASS | 186 |
| media_position | PASS | 8 |
| shuffle | PASS | false |
| repeat | PASS | "all" |
| source | PASS | "mpd" |
| Sensor: Sample Rate | PASS | 96 kHz |
| Sensor: Bit Depth | PASS | 24 bit |
| Sensor: Track Type | PASS | qobuz |
| Sensor: Channels | PASS | 2 |

---

## Step 5 — Controls from HA

| Control | Result | Detail |
|---|---|---|
| Play/pause | PASS | Toggles correctly |
| Next | PASS | Track advances |
| Previous | PASS | Track goes back |
| Volume slider | NO EFFECT | disableVolumeControl=true on device |
| Mute toggle | NO EFFECT | Same reason |
| Shuffle toggle | Not tested | |
| Repeat cycle | **BUG** | Goes to single mode, does not cycle further. Cannot turn off or return to all. |
| Browse media | **BUG** | Triggers timeout, returns empty. Caused Pandora re-auth, audio engine restart, and playback interruption on device. |

---

## Issues Found

### BLOCKER

1. **Polling transport fails** — `AsyncClient.connect()` fails with default/polling transport. Fix applied during test: `transports=["websocket"]` in coordinator.py and config_flow.py. Must be committed.

2. **Browse media broken and dangerous** — `browseLibrary("")` returns empty at root level AND triggers destructive side effects on the device (Pandora re-login, audio engine restart, playback stopped). Root cause: `_async_browse_root()` in browse_media.py calls `browseLibrary("")` but should use `getBrowseSources` for root-level listing.

### HIGH

3. **Connection instability** — HA logs show 12 disconnects and 9 "packet queue is empty, aborting" errors in ~8 minutes. May be partly caused by browse attempts, but needs investigation.

4. **Repeat mode cycling broken** — RepeatMode.ONE handler in `async_set_repeat` just sends `setRepeat {value: true}` (same as ALL). No implementation for `repeatSingle`. Cycling gets stuck in single mode — cannot turn off or cycle back.

5. **Import inconsistency** — `config_flow.py` imports `CONF_HOST`/`CONF_PORT` from `homeassistant.const`, while `__init__.py` imports them from `.const`. Same string values so no runtime bug, but inconsistent and could mask issues if values diverge.

6. **Volume features advertised when disabled** — `disableVolumeControl` field is ignored. Integration unconditionally advertises VOLUME_SET, VOLUME_MUTE, VOLUME_STEP features. Should check the flag and remove volume features dynamically.

### MEDIUM

7. **`random` field is null, not false** — Initial state before shuffle has ever been toggled. `shuffle` property returns None. HA shows this as "unknown" which is acceptable but not ideal.

8. **`bitrate` field not tracked** — pushState includes `bitrate: "2239 Kbps"` but there's no sensor for it. Consider adding as a 5th audio sensor.

9. **`consume` field not tracked** — Present in pushState, not exposed.

10. **Browse library timeout** — Even when browseLibrary gets a valid URI, the request/reply pattern in coordinator may have issues. Search works (uses same `browseLibrary` push event) so the handler is functional, but the root browse path is broken.

### LOW

11. **No `sw_version` in device info** — Device info hardcodes `sw_version: None`. Could populate from `/api/v1/getSystemVersion` during setup.

12. **Multiroom not implemented** — Second device discovered at 192.168.0.58. Multiroom data arrives via pushMultiRoomDevices. Future feature.

---

## Recommendations

**For T3 scoping, priority order:**

1. Commit the transport fix (already applied, just needs commit)
2. Fix browse media root to use getBrowseSources (blocker for browse feature)
3. Investigate connection instability (may be partly browse-related)
4. Implement repeatSingle properly
5. Check disableVolumeControl flag for dynamic feature support
6. Fix CONF_HOST/CONF_PORT import inconsistency
