# QUICKREF

## Project
- Custom Home Assistant integration for Volumio over WebSocket (Socket.IO).
- Repo: https://github.com/jkatz/ha-volumio-ws
- Local: `C:\dev\ha-volumio-ws`
- Target: latest Home Assistant + Volumio 3 only (no legacy support).

## Architecture Layers
| # | Layer | Role |
|---|-------|------|
| 1 | `transport.py` + `coordinator.py` | `EIO3Transport` — raw aiohttp WebSocket, EIO3 protocol framing, ping/pong, reconnection. `VolumioWebSocketCoordinator` — state cache, listeners, request/reply futures on top of the transport. |
| 2 | HA Services | Thin wrappers in `media_player.py` / `__init__.py` exposing coordinator methods to HA. |
| 3 | HA WebSocket API | Panel-specific real-time endpoints (push state/queue to frontend). |
| 4 | Panel Frontend | JavaScript sidebar panel (not yet present in repo). |

Rule: each layer calls only the layer directly below. Coordinator methods MUST return response data — no fire-and-forget.

## Current Status
| Task | Status | Notes |
|------|--------|-------|
| T1 — Repo setup | DONE | Initial commit, `.gitignore` fixed. |
| T2 — Smoke test | DONE | 12 issues found. |
| T3 — Critical fixes | DONE | browse root, repeat (partial), `disableVolumeControl`, import fix; connection stability rolled into T4. |
| T4 — Transport rewrite | DONE | `python-socketio` replaced with raw aiohttp EIO3 WebSocket. Stable connection confirmed. Branch: `feat/T4-transport-rewrite`. |

Transport: Raw aiohttp WebSocket with manual EIO3 protocol handling. Client-initiated PING (`2`) every 23s, server responds PONG (`3`) within 5s. Reconnection with exponential backoff (5s → 60s cap). No external dependencies — aiohttp is HA-native.

## EIO3 Protocol Reference (captured from Volumio)
- Open frame: `0{"sid":"...","upgrades":[],"pingInterval":25000,"pingTimeout":5000}`
- SIO connect ack: `40` (no namespace, no JSON body)
- Heartbeat: client `2` (PING) → server `3` (PONG)
- SIO events: `42["eventName", data]` (no namespace prefix)
- On connect, Volumio sends `closeAllModals` and `pushMultiRoomDevices` unsolicited.
- `pushState` keys (25): `album`, `albumart`, `artist`, `bitdepth`, `channels`, `consume`, `dbVolume`, `disableVolumeControl`, `duration`, `mute`, `position`, `random`, `repeat`, `repeatSingle`, `samplerate`, `seek`, `service`, `status`, `stream`, `title`, `trackType`, `updatedb`, `uri`, `volatile`, `volume`.

## File Map (`custom_components/volumio_ws/`)
| File | Purpose |
|------|---------|
| `__init__.py` | Integration entry point — `async_setup_entry`, coordinator lifecycle, platform forwarding. |
| `manifest.json` | HA manifest — domain, version, zeroconf. No external requirements (aiohttp is HA-native). |
| `const.py` | DOMAIN, defaults (port 3000), WS event name constants. |
| `config_flow.py` | UI config flow — `async_test_connect` for host/port validation, zeroconf discovery handler. |
| `transport.py` | `EIO3Transport` — raw aiohttp WebSocket, EIO3 framing, client-initiated PING/PONG, exponential-backoff reconnection. |
| `coordinator.py` | `VolumioWebSocketCoordinator` — runs on top of `EIO3Transport`; owns state cache, listeners, and request/reply futures. |
| `media_player.py` | `MediaPlayerEntity` — playback controls, volume, browse_media, source/sound mode. |
| `sensor.py` | Sensor entities for Volumio audio metadata (sample rate, bit depth, etc.). |
| `browse_media.py` | Browse-media tree builder over coordinator's `async_browse` / `async_get_browse_sources`. |
| `strings.json` | UI strings for config flow. |
| `translations/en.json` | English translations. |

## Key Conventions
- Branches: `feat/T{N}-description`
- Commits: `T{N}: description`
- Backups before risky edits: `<file>.bak-pre-t{task}` (gitignored, do not commit)
- Coordinator methods return response data — never fire-and-forget
- No legacy compat shims; target current HA + Volumio 3 only

## Known Issues (open)
| # | Area | Description |
|---|------|-------------|
| — | Repeat | `repeatSingle` — no WS command found; ONE mode disabled in UI. |
| — | Random | `random=null` reported until first toggle. |
| — | Sensor | `bitrate` sensor missing from sensor platform. |
| — | State | `consume` field not tracked in coordinator state. |
| — | Device | `sw_version` not populated on device entry. |
| — | Browse | Pandora browse title cosmetic issue. |
