# LitGUI for Volumio

A custom Home Assistant integration that brings Volumio's full feature set into your HA sidebar — real-time WebSocket connection, rich panel UI, and deep automation support.

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![Home Assistant](https://img.shields.io/badge/HA-2024.7%2B-blue.svg)](https://www.home-assistant.io/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

## What It Does

The built-in HA Volumio integration polls every 10 seconds and offers limited controls. LitGUI replaces that with a persistent WebSocket connection for instant state updates, a full sidebar panel for browsing and playback, and 21 services for automations.

It runs alongside the built-in integration (different domain: `volumio_ws`) so you can migrate at your own pace.

## Features

**Sidebar Panel** — a complete music player UI inside Home Assistant:
- Now Playing view with album art, UltraBlur background, quality and source badges
- Browse your full library — local files, Qobuz, TIDAL, Spotify, web radio, podcasts
- Search across all sources with recent search history
- Queue management with drag-and-drop reorder, remove, save-as-playlist
- Playlists, Favorites, and History views
- Context menus on every item (Play Now, Play Next, Add to Queue, Add to Playlist)
- Multi-device support with top-bar device selector
- Keyboard shortcuts for power users
- Dark and light theme support via HA theme variables
- Settings panel with per-user preferences

**Real-Time Connection** — WebSocket (Socket.IO) for push-based state, not polling:
- Instant playback state updates via `pushState`
- Live queue updates via `pushQueue`
- Automatic reconnection with exponential backoff
- No external dependencies — uses HA-native aiohttp

**Media Player Entity** — full playback control:
- Play, pause, stop, next, previous, seek
- Volume control (set, mute, unmute)
- Shuffle and repeat modes
- Browse media tree

**Audio Metadata Sensors**:
- Sample rate (e.g., "96 kHz")
- Bit depth (e.g., "24 bit")
- Track type / codec (e.g., "flac")
- Channels (e.g., "2")

**Services for Automations** — 21 services covering:
- Library: search, browse, get browse sources
- Queue: get, add, remove, move, clear, play by index, replace and play, save to playlist
- Playlists: list, create, delete, add track, remove track, play, enqueue
- Favorites: list, add, remove

All services support `SupportsResponse` for use in automations and scripts that need return data.

**Multi-Device** — add multiple Volumio devices, each as its own config entry. The panel's device selector lets you switch between them. Services target devices via `config_entry_id`.

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Click the three dots menu (top right) → **Custom repositories**
3. Paste `https://github.com/jonkatz1/ha-volumio-ws` and select **Integration**
4. Click **Add**
5. Find "LitGUI for Volumio" in the HACS store and click **Download**
6. Restart Home Assistant

### Manual

1. Copy the `custom_components/volumio_ws/` folder into your HA `config/custom_components/` directory
2. Restart Home Assistant

## Configuration

### Adding a Device

1. Go to **Settings → Devices & Services → Add Integration**
2. Search for "LitGUI for Volumio"
3. Enter your Volumio device's IP address and port (default: 3000)
4. Give it a name (e.g., "Living Room")
5. The sidebar panel appears automatically

### Panel Toggle

Each device has a "Configure" option in Settings → Integrations:
- **Enable sidebar panel** (default: on) — controls whether the Volumio panel appears in your HA sidebar
- The panel shows if *any* device has it enabled; it only disappears when *all* devices have it disabled

### Multiple Devices

Add each Volumio device as a separate integration entry. The panel's device selector (top bar) lets you switch between them.

## Services

All services are under the `volumio_ws` domain and require a `config_entry_id` target. They can be called from Developer Tools → Services, automations, and scripts.

### Library
| Service | Description |
|---------|-------------|
| `search` | Search across all sources. Returns grouped results. |
| `browse` | Browse a library URI. Returns items at that path. |
| `get_browse_sources` | List available browse sources (local, Qobuz, etc.). |

### Queue
| Service | Description |
|---------|-------------|
| `queue_get` | Get the current play queue. |
| `queue_add` | Add a track, album, or playlist to the queue. |
| `queue_remove` | Remove a track by queue position. |
| `queue_move` | Reorder a queue item (from position → to position). |
| `queue_clear` | Clear the entire queue. |
| `queue_play_index` | Jump to a specific queue position. |
| `replace_and_play` | Clear queue, add item, and start playback. |
| `save_queue_to_playlist` | Save the current queue as a named playlist. |

### Playlists
| Service | Description |
|---------|-------------|
| `playlist_list` | List all playlists. |
| `playlist_create` | Create a new empty playlist. |
| `playlist_delete` | Delete a playlist by name. |
| `playlist_add_track` | Add a track to an existing playlist. |
| `playlist_remove_track` | Remove a track from a playlist. |
| `playlist_play` | Clear queue and play a playlist. |
| `playlist_enqueue` | Add all tracks from a playlist to the queue. |

### Favorites
| Service | Description |
|---------|-------------|
| `favorites_list` | List all favorites. |
| `favorites_add` | Add a track to favorites. |
| `favorites_remove` | Remove a track from favorites. |

### Example Automation

```yaml
automation:
  - alias: "Morning Music"
    trigger:
      - platform: time
        at: "07:00:00"
    action:
      - action: volumio_ws.playlist_play
        data:
          config_entry_id: "your_config_entry_id"
          name: "Morning Jazz"
```

## Requirements

- **Home Assistant** 2024.7.0 or later
- **Volumio 3** (any hardware — Raspberry Pi, x86, Tinkerboard, etc.)
- Network access from HA to your Volumio device(s) on port 3000

## Development

```bash
git clone https://github.com/jonkatz1/ha-volumio-ws.git
cd ha-volumio-ws/frontend
npm install
npm run build
```

The frontend is a Lit-based web component built with Rollup. The built bundle lands at `custom_components/volumio_ws/frontend/volumio-panel.js`.

For local testing, `deploy.sh` copies the bundle and backend files to your HA instance over SMB.

## License

[GPL v3](LICENSE)

## Credits

Built by [Jon Katz](https://github.com/jonkatz1)
Powered by [LitGUI](https://litgui.com)
