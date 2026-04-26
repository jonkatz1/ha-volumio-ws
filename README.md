# Volumio WebSocket Integration for Home Assistant

A custom Home Assistant integration for Volumio that uses the WebSocket (Socket.io) API
for real-time state updates and full feature coverage.

## Why This Exists

The built-in HA Volumio integration uses REST API polling and has limited functionality:
- No real-time state updates (polls every 10s)
- Buggy `browse_media` on Volumio 3
- No search, queue management, playlist CRUD, or favorites
- No audio metadata sensors (sample rate, bit depth, codec)
- No multiroom device discovery

This integration uses Volumio's Socket.io WebSocket API for push-based state and
exposes the full Volumio feature set through HA entities and services.

## Features

### Media Player Entity
- Real-time state via `pushState` (no polling)
- Full playback control (play, pause, stop, next, prev, seek)
- Volume control (set, mute, unmute, increment, decrement)
- Source selection
- Shuffle and repeat modes
- Browse media (library, playlists, radio, plugins)
- Search (artists, albums, tracks)

### Sensors
- `sensor.volumio_<name>_sample_rate` — e.g., "96 kHz"
- `sensor.volumio_<name>_bit_depth` — e.g., "24 bit"
- `sensor.volumio_<name>_track_type` — e.g., "flac"
- `sensor.volumio_<name>_channels` — e.g., "2"

### Custom Services
- `volumio_ws.search` — Search library (returns artists, albums, tracks)
- `volumio_ws.browse` — Browse library by URI
- `volumio_ws.add_to_queue` — Add track/album/playlist to queue
- `volumio_ws.remove_from_queue` — Remove track from queue by position
- `volumio_ws.clear_queue` — Clear the play queue
- `volumio_ws.move_queue` — Reorder queue items
- `volumio_ws.create_playlist` — Create a new playlist
- `volumio_ws.delete_playlist` — Delete a playlist
- `volumio_ws.add_to_playlist` — Add track to playlist
- `volumio_ws.remove_from_playlist` — Remove track from playlist
- `volumio_ws.play_playlist` — Clear queue and play a playlist
- `volumio_ws.add_to_favorites` — Add track to favorites
- `volumio_ws.remove_from_favorites` — Remove track from favorites
- `volumio_ws.call_plugin_method` — Call any Volumio plugin method
- `volumio_ws.set_sleep` — Set sleep timer
- `volumio_ws.set_alarm` — Set alarm

### Multiroom (Future)
- Auto-discover Volumio devices on the network
- Group/ungroup for synchronized playback

## Architecture

```
volumio_ws/
├── __init__.py              # Integration setup, service registration
├── manifest.json            # HACS/HA integration metadata
├── config_flow.py           # UI-based configuration (host, port)
├── const.py                 # Constants, domain, defaults
├── coordinator.py           # WebSocket connection manager (Socket.io)
├── media_player.py          # media_player entity with full controls
├── sensor.py                # Audio metadata sensors
├── browse_media.py          # browse_media implementation
├── services.py              # Custom service handlers
├── services.yaml            # Service definitions for HA
├── strings.json             # UI strings
└── translations/
    └── en.json              # English translations
```

### Key Design Decisions

1. **Socket.io via `python-socketio[asyncio_client]`** — Async client that matches
   Volumio's server. Maintains persistent connection with auto-reconnect.

2. **DataUpdateCoordinator pattern** — But instead of polling, the coordinator
   subscribes to `pushState` events and pushes updates to entities instantly.

3. **Album art URL handling** — Volumio returns relative paths for albumart.
   The integration prepends `http://{host}:{port}` automatically.

4. **Browse media** — Maps Volumio's `browseLibrary` response to HA's
   `BrowseMedia` object tree. Supports pagination via `limit`/`offset`.

5. **Separate from built-in integration** — Uses domain `volumio_ws` to avoid
   conflicts. Can run alongside the built-in `volumio` integration during migration.

## Installation

### HACS (recommended)
1. Add this repository as a custom repository in HACS
2. Install "Volumio WebSocket"
3. Restart Home Assistant
4. Add integration → Volumio WebSocket → Enter host IP and port (default 3000)

### Manual
1. Copy `custom_components/volumio_ws/` to your HA `config/custom_components/`
2. Restart Home Assistant
3. Add integration via UI

## Development

### Requirements
- Python 3.11+
- `python-socketio[asyncio_client]>=5.0`
- `aiohttp`

### Testing locally
```bash
pip install python-socketio[asyncio_client] aiohttp
python -c "
import asyncio
import socketio

sio = socketio.AsyncClient()

@sio.on('pushState')
async def on_state(data):
    print(f'State: {data[\"status\"]} - {data.get(\"artist\",\"\")} - {data.get(\"title\",\"\")}')
    print(f'Audio: {data.get(\"samplerate\",\"\")} / {data.get(\"bitdepth\",\"\")} / {data.get(\"trackType\",\"\")}')

async def main():
    await sio.connect('http://YOUR_VOLUMIO_IP:3000')
    await sio.emit('getState')
    await asyncio.sleep(30)
    await sio.disconnect()

asyncio.run(main())
"
```

## Roadmap

- [ ] v0.1: Core media_player entity with WebSocket state
- [ ] v0.2: Browse media + search
- [ ] v0.3: Queue management services
- [ ] v0.4: Playlist and favorites services
- [ ] v0.5: Audio metadata sensors
- [ ] v0.6: Multiroom discovery
- [ ] v1.0: HACS release

## License

MIT
