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
| 2 | HA Services | `services.py` — thin wrappers exposing coordinator methods as HA services. Registered in `async_setup` (domain-level). Uses `config_entry_id` targeting and `SupportsResponse` for response data. |
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
| T5-8 — Core polish | DONE | Extra state attrs, source list, sw_version, shuffle fix. Branch: `feat/T5-8-core-polish`, merged to main. |
| T11+T9 — Services + Search | DONE | Service infrastructure (`services.py`, `services.yaml`) + search service. `config_entry_id` targeting, `async_setup` registration, `SupportsResponse.OPTIONAL`. Branch: `feat/T11-9-services`. |
| T12-14 — Services (queue/playlist/favorites) | DONE | 15 new services, async closure fix. Branch: `feat/T12-14-services`. |

Transport: Raw aiohttp WebSocket with manual EIO3 protocol handling. Client-initiated PING (`2`) every 23s, server responds PONG (`3`) within 5s. Reconnection with exponential backoff (5s → 60s cap). No external dependencies — aiohttp is HA-native.

## EIO3 Protocol Reference (captured from Volumio)
- Open frame: `0{"sid":"...","upgrades":[],"pingInterval":25000,"pingTimeout":5000}`
- SIO connect ack: `40` (no namespace, no JSON body)
- Heartbeat: client `2` (PING) → server `3` (PONG)
- SIO events: `42["eventName", data]` (no namespace prefix)
- On connect, Volumio sends `closeAllModals` and `pushMultiRoomDevices` unsolicited.
- `pushState` keys (25): `album`, `albumart`, `artist`, `bitdepth`, `channels`, `consume`, `dbVolume`, `disableVolumeControl`, `duration`, `mute`, `position`, `random`, `repeat`, `repeatSingle`, `samplerate`, `seek`, `service`, `status`, `stream`, `title`, `trackType`, `updatedb`, `uri`, `volatile`, `volume`.

## REST API Endpoints (captured from HAR)
- `GET /api/v1/getSystemVersion` → `{"systemversion":"3.912","builddate":"...","variant":"volumio","hardware":"pi","os":"10"}`
- `POST /api/v1/pluginEndpoint` — generic plugin REST gateway:
  - `{endpoint: "metavolumio", data: {mode: "storyArtist", artist: "..."}}` → artist bio text
  - `{endpoint: "metavolumio", data: {mode: "storyAlbum", artist: "...", album: "..."}}` → album story text
  - `{endpoint: "metavolumio", data: {mode: "creditsAlbum", artist: "...", album: "..."}}` → album credits
  - `{endpoint: "getSimilarArtists", data: {artist: "..."}}` → array of `{artist, albumart, uri}`
  - Artist URI pattern: `globalUriArtist/{artist name}` (used with browseLibrary for cross-service nav)

## File Map (`custom_components/volumio_ws/`)
| File | Purpose |
|------|---------|
| `__init__.py` | Integration entry point — `async_setup` (domain-level service registration), `async_setup_entry` (coordinator lifecycle, platform forwarding). Fetches `sw_version` via REST during setup. |
| `manifest.json` | HA manifest — domain, version, zeroconf. No external requirements (aiohttp is HA-native). |
| `const.py` | DOMAIN, defaults (port 3000), WS event name constants. |
| `config_flow.py` | UI config flow — `async_test_connect` for host/port validation, zeroconf discovery handler. |
| `transport.py` | `EIO3Transport` — raw aiohttp WebSocket, EIO3 framing, client-initiated PING/PONG, exponential-backoff reconnection. |
| `coordinator.py` | `VolumioWebSocketCoordinator` — runs on top of `EIO3Transport`; owns state cache, listeners, request/reply futures. Emits `getBrowseSources` on connect; exposes `browse_sources`, `browse_source_names`, `sw_version`. Queue/playlist/favorites methods (`async_get_queue`, `async_add_to_queue`, `async_list_playlists`, `async_add_to_favourites`, etc — 15 methods total). Push handlers for `pushQueue` and `pushListPlaylist` now resolve request/reply futures. |
| `media_player.py` | `MediaPlayerEntity` — playback controls, volume, browse_media. `extra_state_attributes` (queue_position, uri, volatile); `source_list` from browse sources; shuffle null→false fix; `SELECT_SOURCE` removed from supported features. |
| `sensor.py` | Sensor entities for Volumio audio metadata (sample rate, bit depth, etc.). |
| `browse_media.py` | Browse-media tree builder over coordinator's `async_browse` / `async_get_browse_sources`. |
| `services.py` | Service handlers — `register_services()` called from `async_setup`. 16 services total: search, queue (get/add/remove/move/clear/play_index), playlist (list/create/delete/add_track/remove_track/play/enqueue), favorites (add/remove). Uses async closures for HA `SupportsResponse` compatibility. |
| `services.yaml` | Service schema definitions for HA UI. 16 services defined. |
| `strings.json` | UI strings for config flow. |
| `translations/en.json` | English translations. |

## Key Conventions
- Branches: `feat/T{N}-description`
- Commits: `T{N}: description`
- Backups before risky edits: `<file>.bak-pre-t{task}` (gitignored, do not commit)
- Coordinator methods return response data — never fire-and-forget
- No legacy compat shims; target current HA + Volumio 3 only

## Decisions
- `SELECT_SOURCE` intentionally omitted from supported features. Volumio browse sources open navigation trees, not playback targets — they don't map to HA's source-select semantics. `source` returns the raw service name (`mpd`, `qobuz`, etc.) because multiple browse sources share the same `plugin_name`.
- `source_list` still populates with browse-source display names but is only visible via entity attributes (not the HA UI dropdown) since `SELECT_SOURCE` is removed.
- Services use `config_entry_id` (required) for targeting, not `entity_id`. Per HA docs: "target the thing the action acts on." Search operates on the Volumio device (config entry), not a specific entity. No auto-select fallback.
- Services registered in `async_setup` (domain-level, once per HA lifetime), not `async_setup_entry`. Per HA docs and music_assistant pattern. No unregistration needed.
- Mutation services (`queue_add`, `queue_remove`, `playlist_create`, `favorites_add`, etc.) return acknowledgment dicts (`{"success": True, "command": "..."}`) rather than re-fetching updated state. Panel should call the corresponding get/list service after mutations to refresh. Can upgrade to re-fetch pattern later if needed.
- Service handlers use async closures (not lambdas) to capture `hass`. Lambdas break `SupportsResponse` because `asyncio.iscoroutinefunction()` returns False for them.

## Housekeeping
- `/config/custom_components/volumio_ws.old` should be deleted from the HA config dir (harmless but messy).

## Known Issues (open)
| # | Area | Description |
|---|------|-------------|
| — | Repeat | `repeatSingle` — no WS command found; ONE mode disabled. REST and WS research pending (see T8 research plan in orchestrator). |
| — | Sensor | `bitrate` sensor missing from sensor platform. |
| — | State | `consume` field not tracked in coordinator state. |
| — | Browse | Pandora browse title cosmetic issue. |
| — | Services | `queue_move`, `queue_clear`, `queue_play_index`, `playlist_create/delete/add_track/remove_track/play/enqueue` not yet live-tested. Same patterns as tested services — low risk. |
| — | Services | Payload shapes for `removeFromQueue` (`{value: index}`), `moveQueue` (`{from: N, to: N}`), `addToPlaylist`/`removeFromPlaylist` (`service` field optional?), `addToFavourites`/`removeFromFavourites` item dict — working in tested cases but not exhaustively verified against all edge cases. |
