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
| 4 | Panel Frontend | Lit-based sidebar panel under `frontend/src/` (18 components). Built bundle ≈151 KB at `custom_components/volumio_ws/frontend/volumio-panel.js`. |

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
| T17 — Panel layout shell, player bar, Now Playing | DONE | Three-zone responsive layout, player bar with smooth progress interpolation, Now Playing hero with UltraBlur, quality badges (5-tier detection), source badges, left nav with browse sources, keyboard shortcuts, favorite heart toggle with state, loading/skeleton states. New backend: `favorites_list` service, `bitrate` + `source_list` in `extra_state_attributes`, browse-sources state notification. |
| T18 — Browse, search, album/artist detail | DONE | 8 new frontend components, 2 new backend services (`browse`, `get_browse_sources`). Browse source grid, list/grid toggle, album/artist detail, search with debounce + grouping + recent searches, breadcrumb navigation with search trail, alpha jump index, basic queue panel, add-to-queue buttons on cards/rows. Branch: `feat/T18-panel-browse-search`. |
| T19 — Queue panel, context menus, toasts | DONE | Commit f50b247. Queue UI with drag-drop reorder, remove, save-as-playlist, clear-with-confirmation. Context menus on all items. Toast notifications. ha-adapter.js abstraction. replaceAndPlay and saveQueueToPlaylist native WS commands. Branch: `feat/T19-queue-context-toasts`. |
| T20 — Playlists, favorites, history, settings, quality fix | DONE | Commit 5e6c3b7 on feat/T20-views-settings (merged to main). 5 new components, inferTrackQuality fix for service-name trackType. v0.1.43 deployed. |
| #38 — Multi-device panel | DONE | Commit <HASH> on fix/38-multi-device-panel (awaiting review). New WS commands volumio_ws/list_devices and config_entry_id-routed subscribe_queue. Adapter resolves entity via list_devices (no string matching). Top-bar device selector (icon-only, far right, hidden when single-device). A3 ConfigEntryNotReady on connect failure. A7 localStorage JSON.parse guards on history + recent searches. |
| T42 — Pre-release bug fixes | DONE | Commit 0fb6a7f on fix/T42-art-artist-nav. Fix album art 401s after HA restart (raw albumart in extra_state_attributes, store raw paths in history). Fix artist navigation blank pages (remove encodeURIComponent, search-based artist/album URI resolution). Album navigation from Now Playing. |
| T43 — Artist bio + similar + album story + credits | DONE | Branch feat/T43-artist-detail. Direct browser fetch to Volumio's `POST /api/v1/pluginEndpoint` (CORS-confirmed, no backend proxy needed). 5 new adapter methods (`fetchArtistBio`, `fetchSimilarArtists`, `fetchAlbumStory`, `fetchAlbumCredits`, `_fetchPluginEndpoint` helper). Panel refactor: 8 call-sites centralized through `_enterArtistDetail` / `_enterAlbumDetail` helpers. Same-target guards via `_metadataArtistKey` / `_metadataAlbumKey` keys prevent redundant REST on Back/breadcrumb. Credit names clickable → `globalUriArtist/Name` fallback, same path as similar artists. Bio/story 200-word Read more; credits 6-row Show all expansion. Graceful hide on no data. Two post-deploy fixes: similar-artist push-not-replace trail; `_onBack` album-detail restoration branch. Manifest 0.1.63. |

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
  - Artist URI pattern: `globalUriArtist/{artist name}` (used with browseLibrary for cross-service nav). **Must use literal spaces** — `%20` encoding returns empty results. Only searches local library; for streaming services, resolve via search to get source-specific URIs (e.g. `qobuz://artist/148676`).

## File Map (`custom_components/volumio_ws/`)
| File | Purpose |
|------|---------|
| `__init__.py` | Integration entry point — `async_setup` (domain-level service registration), `async_setup_entry` (coordinator lifecycle, platform forwarding). Fetches `sw_version` via REST during setup. |
| `manifest.json` | HA manifest — domain, version, zeroconf. No external requirements (aiohttp is HA-native). |
| `const.py` | DOMAIN, defaults (port 3000), WS event name constants. |
| `config_flow.py` | UI config flow — `async_test_connect` for host/port validation, zeroconf discovery handler. |
| `transport.py` | `EIO3Transport` — raw aiohttp WebSocket, EIO3 framing, client-initiated PING/PONG, exponential-backoff reconnection. |
| `coordinator.py` | `VolumioWebSocketCoordinator` — runs on top of `EIO3Transport`; owns state cache, listeners, request/reply futures. Emits `getBrowseSources` on connect; exposes `browse_sources`, `browse_source_names`, `sw_version`. Queue/playlist/favorites methods (`async_get_queue`, `async_add_to_queue`, `async_list_playlists`, `async_list_favourites`, `async_add_to_favourites`, etc). Push handlers for `pushQueue`, `pushListPlaylist`, and `pushBrowseSources` resolve request/reply futures and notify state listeners. |
| `media_player.py` | `MediaPlayerEntity` — playback controls, volume, browse_media. `extra_state_attributes` (queue_position, uri, volatile, bitrate, albumart, source_list); shuffle null→false fix; `SELECT_SOURCE` removed from supported features. |
| `sensor.py` | Sensor entities for Volumio audio metadata (sample rate, bit depth, etc.). |
| `browse_media.py` | Browse-media tree builder over coordinator's `async_browse` / `async_get_browse_sources`. |
| `services.py` | Service handlers — `register_services()` called from `async_setup`. 20 services total: search, browse, get_browse_sources, queue (get/add/remove/move/clear/play_index), playlist (list/create/delete/add_track/remove_track/play/enqueue), favorites (list/add/remove). Uses async closures for HA `SupportsResponse` compatibility. |
| `services.yaml` | Service schema definitions for HA UI. 20 services defined. |
| `ws_api.py` | Panel WebSocket API — `volumio_ws/list_devices` (returns config entries with name/host/port/entity_id) and `volumio_ws/subscribe_queue` (config_entry_id-routed real-time queue updates). |
| `strings.json` | UI strings for config flow. |
| `translations/en.json` | English translations. |
| `frontend/volumio-panel.js` | Built panel bundle (~82 KB) — output of `cd frontend && npm run build` from `frontend/src/volumio-panel.js`. |

## Frontend (`frontend/src/`)
- `volumio-panel.js` — root panel: three-zone layout, view routing (`now-playing` / `browse` / `playlists` / `favorites` / `album-detail` / `artist-detail` / `search-results`), HA service plumbing (`_callService`, queue subscription, favorites caching via `volumio_ws/favorites_list`), keyboard shortcuts. Browse/search state management, navigation stack, search trail, browse-sources cache, queue panel with track list, service display name map.
- `components/top-bar.js` — tabs (Now Playing, Browse, Playlists, Favorites), nav/queue toggles, search affordance. Live search with 300 ms debounce, recent search chips, clear button.
- `components/left-nav.js` — browse sources nav, pinned/collapsed/flyout modes. Active source highlighting by URI.
- `components/now-playing.js` — hero view with album art, UltraBlur dominant-color background (HSL-boosted, 50%/40% origin), favorite heart, quality + source badges, skeleton loading state.
- `components/player-bar.js` — bottom bar with smooth `requestAnimationFrame` progress interpolation, controls, track info + favorite heart, quality + source badges, volume section gated on `volumeEnabled`, skeleton loading state.
- `components/quality-badge.js` / `source-badge.js` — pill badges driven by `quality-utils` and the service name.
- `components/breadcrumb-bar.js` — navigation breadcrumb, max 5 segments with collapse.
- `components/browse-source-grid.js` — top-level source card grid with icons, albumart, click-to-browse.
- `components/browse-list.js` — list/grid view with toggle (localStorage), compact mode, alpha jump index, load-more pagination.
- `components/album-card.js` — reusable album grid card (180px). Hover: play + add-to-queue overlay.
- `components/track-card.js` — reusable track list row (48px). Compact mode. Add-to-queue button. Playing state.
- `components/album-detail.js` — album header + track listing, Play / Add to Queue, About this album (story with Read more), Credits (role → clickable name rows, Show all expansion). Story + credits hidden when no data. Credit name click dispatches `volumio-similar-artist-click` (same event as similar-artist tiles) → resolves to `globalUriArtist/Name`.
- `components/artist-detail.js` — artist albums grid, About (bio with Read more), Similar Artists (round-art card grid). Both sections hidden when no data. Similar-artist click dispatches `volumio-similar-artist-click`.
- `utils/format-utils.js` — `resolveArt(albumart, volumioUrl)` — resolves raw Volumio albumart paths to full URLs. Handles relative `/albumart?...` paths, absolute CDN URLs, and empty values.
- `components/search-results.js` — grouped by source then type, collapsible, show-all expansion.
- `utils/quality-utils.js` — 5-tier detection (hires / lossless / high / basic / stream / unknown). Treats Volumio service names (`qobuz`, `tidal`, …) as unknown codec and infers tier from bitdepth/samplerate.
- `styles/shared-styles.js` — design tokens, focus ring, reduced-motion handling. Theme-aware via HA CSS vars.
- `adapters/ha-adapter.js` — abstracts all HA communication (WS service calls, queue subscriptions, list_devices, multi-device active-device tracking). Plugin endpoint REST methods added in T43: `fetchArtistBio`, `fetchSimilarArtists`, `fetchAlbumStory`, `fetchAlbumCredits` — direct browser POST to `http://<volumio>:3000/api/v1/pluginEndpoint`, CORS works, never throws to caller (returns null/[] on any error).

## Key Conventions
- Branches: `feat/T{N}-description`
- Commits: `T{N}: description`
- Backups before risky edits: `<file>.bak-pre-t{task}` (gitignored, do not commit)
- Coordinator methods return response data — never fire-and-forget
- No legacy compat shims; target current HA + Volumio 3 only

## Decisions
- `SELECT_SOURCE` intentionally omitted from supported features. Volumio browse sources open navigation trees, not playback targets — they don't map to HA's source-select semantics. `source` returns the raw service name (`mpd`, `qobuz`, etc.) because multiple browse sources share the same `plugin_name`.
- `source_list` still populates with browse-source display names but is only visible via entity attributes (not the HA UI dropdown) since `SELECT_SOURCE` is removed.
- `source_list` is published through `extra_state_attributes` (not the standard `source_list` property) precisely because HA only emits the latter when `SELECT_SOURCE` is supported.
- Services use `config_entry_id` (required) for targeting, not `entity_id`. Per HA docs: "target the thing the action acts on." Search operates on the Volumio device (config entry), not a specific entity. No auto-select fallback.
- Services registered in `async_setup` (domain-level, once per HA lifetime), not `async_setup_entry`. Per HA docs and music_assistant pattern. No unregistration needed.
- Mutation services (`queue_add`, `queue_remove`, `playlist_create`, `favorites_add`, etc.) return acknowledgment dicts (`{"success": True, "command": "..."}`) rather than re-fetching updated state. Panel should call the corresponding get/list service after mutations to refresh. Can upgrade to re-fetch pattern later if needed.
- Service handlers use async closures (not lambdas) to capture `hass`. Lambdas break `SupportsResponse` because `asyncio.iscoroutinefunction()` returns False for them.
- Browse source URIs come from Volumio's `getBrowseSources` response (cached on coordinator, exposed via `get_browse_sources` service). Never guess URIs from source names.
- Volumio search result items may have `type: "folder"` even for albums. Panel infers correct type from section title.
- Service names mapped to display labels via `SERVICE_DISPLAY` map: `mpd`→Local, `qobuz`→Qobuz, `tidal`→TIDAL, etc.

## Key Learnings
- Lit boolean attribute binding (`?attr=${false}`) removes the attribute, leaving the constructor default in place. For booleans that default to `true`, use property binding (`.prop=${...}`) so `false` actually overrides.
- HA only exposes `source_list` on the entity state when `SELECT_SOURCE` is in `supported_features`. Without that flag, populate it via `extra_state_attributes` so the panel can still read it.
- Volumio's `trackType` sometimes carries the service name (`qobuz`, `tidal`, `spotify`, …) instead of a codec. Quality-tier detection has to recognize service names and infer the tier from `bitdepth` / `samplerate` / `bitrate` instead of the format string.
- Same-origin HA proxy images (e.g. `/api/media_player_proxy/...`) work for `<canvas>` extraction without `crossorigin="anonymous"`. Adding it forces a CORS preflight and taints the canvas, breaking `getImageData`.
- Volumio `browseLibrary` returns different item structures per source. Handle missing `artist`, `album`, `duration`, `albumart` gracefully.
- Browse source URIs have no consistent pattern: `qobuz://`, `tidal://`, `artists://`, `music-library`, `/pandora`, `Last_100`. Always use the real URI from `getBrowseSources`.
- Multiple browse sources share the same `plugin_name` (`mpd` handles Favorites, Artists, Albums, Genres, Music Library, Last 100). Use URI for active-source highlighting, never `plugin_name`.
- Events with `composed: true` cross shadow DOM. When a child re-dispatches the same event, the parent gets it twice. Always `e.stopPropagation()` in re-dispatchers.
- HA panel caching is aggressive. Bumping `manifest.json` version forces invalidation. `deploy.sh` auto-bumps the patch.
- `pushQueue` subscription receives data but doesn't always trigger Lit re-renders. Workaround: call `queue_get` after mutations. Needs investigation in T19.
- Panel registration is once-per-domain: `panel_custom.async_register_panel` short-circuits on subsequent config entries. Per-entry data in `panel.config` is locked to whichever entry initialized first — never use it as a per-device source. Resolve devices at runtime via a custom WS command instead.
- Volumio WebSocket URIs use literal strings, not URL encoding. `globalUriArtist/Peter Gabriel` works; `globalUriArtist/Peter%20Gabriel` returns empty. This is a JSON payload over WebSocket, not an HTTP URL.
- Volumio search results never use `type: "artist"`. Artist items are `type: "folder"` (mpd) or `type: "folder-with-favourites"` (Qobuz/TIDAL). Match artist lists by list title containing "Artist" + service name, not item type.
- HA `entity_picture` is a proxied URL with session-bound auth tokens. Never persist it to localStorage — tokens expire on HA restart. Store the raw source URL and resolve at render time.
- Volumio's `/api/v1/pluginEndpoint` returns Access-Control-Allow-Origin headers for both GET and POST — direct browser fetch from the HA panel origin works without backend proxy. Response envelope is double-wrapped: outer `{success, data}` plus inner `data.success` for `metavolumio` endpoints. Both layers must be checked.
- `getSimilarArtists` and `metavolumio` (storyArtist/storyAlbum/creditsAlbum) return inconsistent error shapes: outer `{success:false, error:...}` vs outer `{success:true, data:{success:false, error:"not found"}}`. The shared `_fetchPluginEndpoint` helper handles the outer envelope; each specific fetch method handles its own inner envelope.
- `metavolumio.creditsAlbum` value is structured: `[{key:"role", values:[{name, uri}]}]`. URIs are MusicBrainz IDs (`mbid:/artist/...`), NOT Volumio URIs — for cross-navigation use the name with the `globalUriArtist/Name` fallback path.
- `_onBack` only handled `artist-detail` and `now-playing` trail restoration; an `album-detail` trail entry fell through to "back to browse" with cleared trail. Latent pre-T43 bug exposed by T43's credit-name navigation (which made album-detail reachable as a mid-trail node for the first time). Always check `_onBack`'s branch coverage when adding a new way for a view to become a trail intermediate.
- Forward navigation handlers should PUSH to the search trail, never replace. Replacement makes sense for breadcrumb clicks (jumping to a level) but breaks Back when a "click another artist from this artist" path replaces the just-visited entry. The two operations look similar; treat them differently.

## Deploy Script
- `./deploy.sh` at the project root: builds the frontend, auto-bumps the `manifest.json` patch version, then copies `frontend/volumio-panel.js` and `manifest.json` to `\\192.168.0.23\config\custom_components\volumio_ws\` (`services.py` / `services.yaml` only when newer than the HA copy). Reminds to restart HA at the end; never restarts automatically.

## Next Tasks
- **T21 — Polish pass, multi-select, accessibility.**
- **T44 follow-up — `_onBack` audit.** T43 surfaced a latent gap (album-detail restoration). Worth a sweep of all `_onBack` branches to confirm coverage of playlist-detail and any other view that can land mid-trail.
- **T44 follow-up — `volumio-panel.js` is large (~2900 lines).** Step 5b's `_enterArtistDetail` / `_enterAlbumDetail` centralization helped; opportunistic similar refactors for browse/playlist entry points would let the panel keep growing without bloating individual methods.

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
| — | Panel | Queue panel uses `_refreshQueue()` workaround after mutations instead of `pushQueue` subscription. Subscription receives data but doesn't trigger re-renders. |
| — | Panel | Alpha index uses `position: fixed` — may overlap queue panel on smaller screens. |
| — | Panel | No hash routing / deep linking for browse navigation. Browser back/forward doesn't work. |
| — | Panel | No toast/snackbar feedback for queue actions. |
| — | Browse | "Go to Album" from context menu and Now Playing: search-based resolution works for most tracks but may fail if album name differs between playback metadata and library index. |
