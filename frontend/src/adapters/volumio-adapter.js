/**
 * Volumio Adapter — abstracts direct Volumio Socket.IO + REST communication
 * for the standalone LitGUI plugin. Sibling to ha-adapter.js — same public
 * contract, different transport.
 *
 * The standalone UI runs from Volumio's own web server (registered via
 * registerThirdPartyUI). The browser is same-origin with Volumio, so it can
 * speak Socket.IO directly and POST to /api/v1/pluginEndpoint without any
 * CORS gymnastics or HA backend in between.
 *
 * Protocol: Volumio 3 runs Socket.IO server v2.3 which speaks Engine.IO v3.
 * Client-initiated PING is required (servers will drop the connection in
 * ~30s without it). Wire format from transport.py:
 *   - Open:        0{"sid":"...","upgrades":[],"pingInterval":25000,"pingTimeout":5000}
 *   - SIO connect: 40                       (plain, no namespace)
 *   - Client ping: 2                        (every pingInterval - 2s)
 *   - Server pong: 3
 *   - SIO event:   42["eventName", data]    (no namespace prefix)
 *
 * Usage:
 *   const adapter = new VolumioAdapter();
 *   await adapter.connect({ host, port });   // resolves on SIO connect ack
 *   adapter.onStateChange(cb);
 *   adapter.onQueueChange(cb);
 *   const result = await adapter.call("queue_add", { uri: "..." });
 *   adapter.disconnect();
 *
 * Notes vs HAAdapter:
 *   - connect() takes { host, port } instead of { hass, panel }
 *   - No updateHass() — push-driven via WebSocket events
 *   - Multi-device methods are stubs (standalone is single-device)
 *   - entity_id getter returns null
 *   - State is normalized from Volumio's pushState (25 fields), not HA entity attrs
 *   - REST helpers do direct fetch() — no HA proxy
 */

// ── Constants ─────────────────────────────────────────────

const PING_INTERVAL_DEFAULT_MS = 25000;
const PING_TIMEOUT_DEFAULT_MS = 5000;
const PING_MARGIN_MS = 2000;
const HANDSHAKE_TIMEOUT_MS = 15000;
const RESPONSE_TIMEOUT_MS = 10000;
const RECONNECT_BASE_MS = 5000;
const RECONNECT_MAX_MS = 60000;

// Synthetic device ID for the single-device standalone case
const STANDALONE_DEVICE_ID = "local";

// ── State normalization ───────────────────────────────────

/**
 * Map Volumio's `status` to HA-style player state.
 * Volumio: "play" | "pause" | "stop" (+ rare transitional values pass through)
 * HA:      "playing" | "paused" | "idle"
 */
function mapStatus(status) {
  switch (status) {
    case "play": return "playing";
    case "pause": return "paused";
    case "stop": return "idle";
    case undefined:
    case null:
    case "": return "unavailable";
    default: return status;
  }
}

/**
 * Map Volumio's repeat flags to HA's mode string.
 * Volumio carries TWO independent booleans (`repeat` and `repeatSingle`);
 * `repeatSingle` takes precedence when both are true.
 *
 * NOTE: setRepeat("one") currently can't round-trip — no documented WS
 * command for repeatSingle was identified during T8 research. The mapping
 * here is read-only correct; the setter handles "one" as a known gap.
 */
function mapRepeat(repeat, repeatSingle) {
  if (repeatSingle) return "one";
  if (repeat) return "all";
  return "off";
}

/**
 * Resolve a Volumio albumart path to an absolute URL.
 * Volumio sends relative paths like "/albumart?..." in pushState.
 */
function resolveAlbumArt(albumart, baseUrl) {
  if (!albumart) return "";
  if (albumart.startsWith("http://") || albumart.startsWith("https://")) {
    return albumart;
  }
  return `${baseUrl}${albumart}`;
}

/**
 * Normalize a Volumio pushState dict to the adapter's canonical state shape.
 * The shape MUST match HAAdapter's normalizeState — components consume it
 * unchanged.
 *
 * Naming overlap to be careful of:
 *   - Volumio `seek`     (ms)  → adapter `position` (seconds)
 *   - Volumio `position` (idx) → adapter `queuePosition`
 */
function normalizeState(pushState, baseUrl) {
  if (!pushState || typeof pushState !== "object") {
    return {
      state: "unavailable",
      title: "",
      artist: "",
      album: "",
      albumArt: "",
      rawAlbumart: "",
      duration: 0,
      position: 0,
      positionUpdatedAt: "",
      volume: 0,
      muted: false,
      shuffle: false,
      repeat: "off",
      source: "",
      uri: "",
      queuePosition: -1,
      volumeEnabled: false,
      bitrate: null,
      trackType: null,
      samplerate: null,
      bitdepth: null,
      channels: null,
      _raw: {},
    };
  }

  return {
    state: mapStatus(pushState.status),
    title: pushState.title || "",
    artist: pushState.artist || "",
    album: pushState.album || "",
    albumArt: resolveAlbumArt(pushState.albumart, baseUrl),
    rawAlbumart: pushState.albumart || "",
    duration: pushState.duration || 0,
    position: typeof pushState.seek === "number" ? pushState.seek / 1000 : 0,
    positionUpdatedAt: pushState._receivedAt || "",
    volume: typeof pushState.volume === "number" ? pushState.volume : 0,
    muted: !!pushState.mute,
    shuffle: !!pushState.random,
    repeat: mapRepeat(pushState.repeat, pushState.repeatSingle),
    source: pushState.service || "",
    uri: pushState.uri || "",
    queuePosition:
      typeof pushState.position === "number" ? pushState.position : -1,
    volumeEnabled: !pushState.disableVolumeControl,
    bitrate: pushState.bitrate || null,
    trackType: pushState.trackType || null,
    samplerate: pushState.samplerate || null,
    bitdepth: pushState.bitdepth || null,
    channels: pushState.channels ?? null,
    _raw: pushState,
  };
}

function stateChanged(prev, next) {
  if (!prev || !next) return true;
  const keys = Object.keys(next).filter((k) => k !== "_raw");
  return keys.some((k) => prev[k] !== next[k]);
}

// ── Adapter class ─────────────────────────────────────────

export class VolumioAdapter {
  constructor() {
    // Connection target
    this._host = "";
    this._port = 3000;
    this._baseUrl = "";

    // WebSocket + protocol state
    this._ws = null;
    this._handshakeComplete = false;
    this._firstPushStateReceived = false;
    this._sid = null;
    this._pingIntervalMs = PING_INTERVAL_DEFAULT_MS;
    this._pingTimeoutMs = PING_TIMEOUT_DEFAULT_MS;
    this._pingTimer = null;
    this._pongTimer = null;
    this._shuttingDown = false;

    // Reconnect state
    this._reconnectAttempts = 0;
    this._reconnectTimer = null;

    // Connect promise — resolved when "40" handshake ack arrives
    this._connectResolve = null;
    this._connectReject = null;
    this._connectTimer = null;

    // Cached server data
    this._state = null;     // raw pushState (with _receivedAt sentinel)
    this._queue = [];
    this._browseSources = [];

    // Last normalized snapshot for stateChanged diffs
    this._lastState = null;

    // Listeners (Set-based, same pattern as HAAdapter)
    this._stateListeners = new Set();
    this._queueListeners = new Set();
    this._devicesListeners = new Set();

    // FIFO pending response queues (browseLibrary uses :browse / :search keys)
    this._pendingResponses = new Map();
  }

  // ── Lifecycle ────────────────────────────────────────────

  /**
   * Open the WebSocket, complete the EIO3 handshake, kick off ping loop.
   * Resolves when SIO connect ack ("40") arrives; rejects on timeout or
   * fatal error.
   */
  async connect({ host, port } = {}) {
    this._host = host || window.location.hostname;
    this._port = port || 3000;
    this._baseUrl = `http://${this._host}:${this._port}`;
    this._shuttingDown = false;
    this._reconnectAttempts = 0;
    return this._open();
  }

  /** Clean shutdown — closes WS, stops timers, clears listeners. */
  async disconnect() {
    this._shuttingDown = true;
    this._clearTimers();
    this._failPendingConnect(new Error("disconnected"));

    if (this._ws) {
      try {
        this._ws.close();
      } catch {
        // ignore
      }
      this._ws = null;
    }

    this._handshakeComplete = false;
    this._stateListeners.clear();
    this._queueListeners.clear();
    this._devicesListeners.clear();

    // Reject any pending responses so callers don't hang
    for (const [key, entries] of this._pendingResponses) {
      for (const entry of entries) {
        if (entry.timer) clearTimeout(entry.timer);
        entry.resolve(null);
      }
    }
    this._pendingResponses.clear();
  }

  // ── State ─────────────────────────────────────────────────

  getState() {
    return normalizeState(this._state, this._baseUrl);
  }

  getVolumioUrl() {
    return this._baseUrl;
  }

  getSensorValue(key) {
    const state = this.getState();
    return state[key] || null;
  }

  get ready() {
    return this._handshakeComplete && this._firstPushStateReceived;
  }

  /** No HA entity in standalone — components that need this must tolerate null. */
  get entityId() {
    return null;
  }

  // ── Devices (single-device stubs) ─────────────────────────

  getDevices() {
    return [
      {
        config_entry_id: STANDALONE_DEVICE_ID,
        name: "Volumio",
        host: this._host,
        port: this._port,
        volumio_url: this._baseUrl,
        entity_id: null,
      },
    ];
  }

  getActiveDeviceId() {
    return STANDALONE_DEVICE_ID;
  }

  getActiveDevice() {
    return this.getDevices()[0];
  }

  /** No-op — standalone is single-device. */
  async setDevice(/* configEntryId */) {
    return;
  }

  /** No-op — standalone is single-device. */
  async refreshDevices() {
    return;
  }

  onDevicesChange(callback) {
    this._devicesListeners.add(callback);
  }

  offDevicesChange(callback) {
    this._devicesListeners.delete(callback);
  }

  // ── Service calls (volumio_ws service name → WS event) ────

  /**
   * Map the service-name surface used by the panel to Socket.IO emits.
   * Wraps responses in `{ response: ... }` to match the HA call_service
   * shape that the panel consumes.
   *
   * Wait-for-response services use _emitAndWait with the appropriate
   * response_key; fire-and-forget mutations return an ack dict shaped
   * like the HA backend's mutation services do.
   */
  async call(name, data = {}) {
    switch (name) {
      // ── Browse / search ──
      case "get_browse_sources": {
        const sources = await this._emitAndWait(
          "getBrowseSources",
          null,
          "getBrowseSources"
        );
        return { response: { sources: sources || [] } };
      }
      case "browse": {
        const payload = data.uri ? { uri: data.uri } : null;
        const result = await this._emitAndWait(
          "browseLibrary",
          payload,
          "browseLibrary:browse"
        );
        return { response: result || {} };
      }
      case "search": {
        const result = await this._emitAndWait(
          "search",
          { value: data.query },
          "browseLibrary:search"
        );
        return { response: result || {} };
      }

      // ── Queue ──
      case "queue_get": {
        const queue = await this._emitAndWait("getQueue", null, "getQueue");
        return { response: { queue: queue || [] } };
      }
      case "queue_add":
        return this._fireAndAck("addToQueue", data);
      case "queue_remove":
        return this._fireAndAck("removeFromQueue", { value: data.index });
      case "queue_move":
        return this._fireAndAck("moveQueue", {
          from: data.from_index,
          to: data.to_index,
        });
      case "queue_clear":
        return this._fireAndAck("clearQueue");
      case "queue_play_index":
        return this._fireAndAck("play", { value: data.index });
      case "replace_and_play":
        return this._fireAndAck("replaceAndPlay", data);
      case "save_queue_to_playlist":
        return this._fireAndAck("saveQueueToPlaylist", { name: data.name });

      // ── Playlists ──
      case "playlist_list": {
        const playlists = await this._emitAndWait(
          "listPlaylist",
          null,
          "listPlaylist"
        );
        return { response: { playlists: playlists || [] } };
      }
      case "playlist_create":
        return this._fireAndAck("createPlaylist", { name: data.name });
      case "playlist_delete":
        return this._fireAndAck("deletePlaylist", { name: data.name });
      case "playlist_add_track":
        return this._fireAndAck("addToPlaylist", this._playlistTrackPayload(data));
      case "playlist_remove_track":
        return this._fireAndAck("removeFromPlaylist", this._playlistTrackPayload(data));
      case "playlist_play":
        return this._fireAndAck("playPlaylist", { name: data.name });
      case "playlist_enqueue":
        return this._fireAndAck("enqueue", { name: data.name });

      // ── Favorites ──
      case "favorites_list": {
        // Same approach as coordinator.async_list_favourites: browse the
        // "favourites" URI and flatten navigation.lists[].items.
        const result = await this._emitAndWait(
          "browseLibrary",
          { uri: "favourites" },
          "browseLibrary:browse"
        );
        const lists = result?.navigation?.lists || [];
        const items = [];
        for (const list of lists) {
          if (Array.isArray(list?.items)) items.push(...list.items);
        }
        return { response: { items } };
      }
      case "favorites_add":
        return this._fireAndAck("addToFavourites", data);
      case "favorites_remove":
        return this._fireAndAck("removeFromFavourites", data);

      // ── REST plugin endpoint (used by fetchArtistBio etc) ──
      case "plugin_endpoint": {
        const result = await this._fetchPluginEndpoint(
          data.endpoint,
          data.data
        );
        return { response: result || { success: false, error: "fetch_failed" } };
      }

      default:
        console.warn("[volumio-adapter] Unknown service:", name);
        return { response: { success: false, error: `unknown_service:${name}` } };
    }
  }

  /**
   * Invoke a Volumio controller/plugin method over Socket.IO.
   * Fire-and-forget: Volumio does not reply on the pushMethod channel for
   * many controller methods (e.g. appearance setVolumio3UI answers with
   * pushToastMessage + reloadUi, never pushMethod), so this does NOT await
   * a response — awaiting would hang until timeout. Callers that need a
   * return value are not supported here yet (await variant is a separate,
   * orchestrator-gated contract item).
   *
   * Wire shape (captured from Volumio's own frontend):
   *   42["callMethod",{ type, endpoint, method, data }]
   *
   * @param {string} type     - "controller" or "plugin" (varies by target)
   * @param {string} endpoint - e.g. "miscellanea/appearance"
   * @param {string} method   - e.g. "setVolumio3UI"
   * @param {object} [data]   - method-specific payload
   * @returns {object} ack dict { success, command } mirroring _fireAndAck
   */
  async callMethod(type, endpoint, method, data) {
    const payload = { type, endpoint, method };
    if (data !== undefined && data !== null) payload.data = data;
    const sent = await this._emit("callMethod", payload);
    if (!sent) {
      return {
        response: { success: false, command: "callMethod", error: "not_connected" },
      };
    }
    return { response: { success: true, command: "callMethod" } };
  }

  _playlistTrackPayload(data) {
    const payload = { name: data.name, uri: data.uri };
    if (data.service != null) payload.service = data.service;
    return payload;
  }

  async _fireAndAck(event, payload) {
    const sent = await this._emit(event, payload);
    if (!sent) {
      return {
        response: { success: false, command: event, error: "not_connected" },
      };
    }
    return { response: { success: true, command: event } };
  }

  // ── Playback (direct WS emit, no service layer) ───────────

  async play() {
    await this._emit("play");
  }

  async pause() {
    await this._emit("pause");
  }

  async playPause() {
    const s = this.getState();
    if (s.state === "playing") {
      await this.pause();
    } else {
      await this.play();
    }
  }

  async stop() {
    await this._emit("stop");
  }

  async next() {
    await this._emit("next");
  }

  async prev() {
    await this._emit("prev");
  }

  /**
   * @param {number} position - playback position in SECONDS (adapter contract)
   */
  async seek(position) {
    // Volumio's seek event takes seconds (verified during T2/T4 testing).
    await this._emit("seek", Math.floor(position));
  }

  /**
   * @param {number} level - 0-100
   */
  async setVolume(level) {
    if (!this.getState().volumeEnabled) return;
    await this._emit("volume", Math.max(0, Math.min(100, Math.round(level))));
  }

  async mute(muted) {
    if (!this.getState().volumeEnabled) return;
    await this._emit(muted ? "mute" : "unmute");
  }

  async toggleMute() {
    await this.mute(!this.getState().muted);
  }

  async setShuffle(shuffle) {
    await this._emit("setRandom", { value: !!shuffle });
  }

  async setRepeat(repeat) {
    // "one" maps to repeatSingle — no documented WS command for it (T8 open
    // issue). Send `repeat:false` so the UI reflects state, log the gap.
    if (repeat === "one") {
      console.warn(
        "[volumio-adapter] setRepeat('one') not supported (no WS command for repeatSingle)"
      );
      await this._emit("setRepeat", { value: false });
      return;
    }
    await this._emit("setRepeat", { value: repeat === "all" });
  }

  // ── Subscriptions ─────────────────────────────────────────

  onStateChange(callback) {
    this._stateListeners.add(callback);
  }

  offStateChange(callback) {
    this._stateListeners.delete(callback);
  }

  onQueueChange(callback) {
    this._queueListeners.add(callback);
  }

  offQueueChange(callback) {
    this._queueListeners.delete(callback);
  }

  // ── REST plugin endpoint (direct fetch — same origin) ─────

  /**
   * Same envelope handling as HAAdapter._fetchPluginEndpoint, but goes
   * direct to Volumio (no HA proxy). Returns the inner `data` field on
   * success, or null on any failure.
   */
  async _fetchPluginEndpoint(endpoint, data) {
    try {
      const resp = await fetch(`${this._baseUrl}/api/v1/pluginEndpoint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, data }),
      });
      if (!resp.ok) return null;
      const result = await resp.json();
      // Outer envelope mirrors what the HA backend returns.
      if (!result || result.success === false) return null;
      return result.data;
    } catch {
      return null;
    }
  }

  async fetchArtistBio(artistName) {
    if (!artistName) return null;
    const data = await this._fetchPluginEndpoint("metavolumio", {
      mode: "storyArtist",
      artist: artistName,
    });
    if (!data || data.success === false || !data.value) return null;
    return typeof data.value === "string" ? data.value : null;
  }

  async fetchSimilarArtists(artistName) {
    if (!artistName) return [];
    const data = await this._fetchPluginEndpoint("getSimilarArtists", {
      artist: artistName,
    });
    return Array.isArray(data) ? data : [];
  }

  async fetchAlbumStory(artistName, albumName) {
    if (!artistName || !albumName) return null;
    const data = await this._fetchPluginEndpoint("metavolumio", {
      mode: "storyAlbum",
      artist: artistName,
      album: albumName,
    });
    if (!data || data.success === false || !data.value) return null;
    return typeof data.value === "string" ? data.value : null;
  }

  async fetchAlbumCredits(artistName, albumName) {
    if (!artistName || !albumName) return [];
    const data = await this._fetchPluginEndpoint("metavolumio", {
      mode: "creditsAlbum",
      artist: artistName,
      album: albumName,
    });
    if (!data || data.success === false || !Array.isArray(data.value)) return [];
    return data.value;
  }

  // ── EIO3 transport — open / handshake ─────────────────────

  /**
   * Open the WebSocket and run the EIO3 handshake. Returns a Promise that
   * resolves when SIO connect ack ("40") arrives, rejects on timeout.
   */
  _open() {
    return new Promise((resolve, reject) => {
      const url = `ws://${this._host}:${this._port}/socket.io/?EIO=3&transport=websocket`;
      let ws;
      try {
        ws = new WebSocket(url);
      } catch (err) {
        reject(err);
        return;
      }

      this._ws = ws;
      this._handshakeComplete = false;
      this._connectResolve = resolve;
      this._connectReject = reject;

      // Handshake timeout
      this._connectTimer = setTimeout(() => {
        if (this._handshakeComplete) return;
        const msg = `EIO3 handshake to ${this._host}:${this._port} timed out after ${HANDSHAKE_TIMEOUT_MS}ms`;
        console.warn("[volumio-adapter]", msg);
        try {
          ws.close();
        } catch {
          // ignore
        }
        this._failPendingConnect(new Error(msg));
      }, HANDSHAKE_TIMEOUT_MS);

      ws.addEventListener("message", (evt) => {
        if (typeof evt.data === "string") this._onMessage(evt.data);
      });

      ws.addEventListener("error", (err) => {
        console.warn("[volumio-adapter] WebSocket error:", err);
      });

      ws.addEventListener("close", () => {
        this._handleConnectionLost();
      });
    });
  }

  _onMessage(raw) {
    if (!raw) return;
    const packetType = raw[0];

    if (packetType === "0") {
      this._parseOpenPacket(raw);
      return;
    }
    if (raw === "40") {
      this._onHandshakeAck();
      return;
    }
    if (packetType === "3") {
      // PONG — clear the pong-timeout watchdog.
      if (this._pongTimer) {
        clearTimeout(this._pongTimer);
        this._pongTimer = null;
      }
      return;
    }
    if (packetType === "2") {
      // Server PING (unexpected in EIO3 client-ping model) — respond.
      this._sendRaw("3");
      return;
    }
    if (packetType === "4") {
      if (raw[1] === "2") {
        this._dispatchEvent(raw);
        return;
      }
      if (raw[1] === "1") {
        // SIO disconnect
        this._handleConnectionLost();
        return;
      }
      return;
    }
    if (packetType === "1") {
      // EIO close
      this._handleConnectionLost();
      return;
    }
  }

  _parseOpenPacket(raw) {
    try {
      const data = JSON.parse(raw.slice(1));
      this._sid = data.sid || null;
      this._pingIntervalMs = data.pingInterval || PING_INTERVAL_DEFAULT_MS;
      this._pingTimeoutMs = data.pingTimeout || PING_TIMEOUT_DEFAULT_MS;
    } catch (err) {
      console.warn("[volumio-adapter] Failed to parse EIO3 Open packet:", err);
    }
  }

  _onHandshakeAck() {
    this._handshakeComplete = true;
    this._reconnectAttempts = 0;

    if (this._connectTimer) {
      clearTimeout(this._connectTimer);
      this._connectTimer = null;
    }
    if (this._connectResolve) {
      const resolve = this._connectResolve;
      this._connectResolve = null;
      this._connectReject = null;
      resolve();
    }

    this._startPingLoop();

    // Mirror coordinator._on_connect — request initial state + sources.
    this._emit("getState");
    this._emit("getBrowseSources");
  }

  _dispatchEvent(raw) {
    let payload;
    try {
      payload = JSON.parse(raw.slice(2));
    } catch {
      console.warn("[volumio-adapter] Failed to parse SIO event JSON");
      return;
    }
    if (!Array.isArray(payload) || payload.length < 1) return;

    const event = payload[0];
    const data = payload.length > 1 ? payload[1] : null;

    switch (event) {
      case "pushState":
        this._onPushState(data);
        break;
      case "pushQueue":
        this._onPushQueue(data);
        break;
      case "pushBrowseSources":
        this._onPushBrowseSources(data);
        break;
      case "pushListPlaylist":
        this._resolvePending("listPlaylist", Array.isArray(data) ? data : []);
        break;
      case "pushBrowseLibrary":
        this._onPushBrowseLibrary(data);
        break;
      case "pushMethod":
        this._resolvePending("callMethod", data);
        break;
      case "closeAllModals":
      case "pushMultiRoomDevices":
        // Unsolicited handshake-time events from Volumio — ignored.
        break;
      default:
        // Silent — many Volumio events aren't relevant to the panel.
        break;
    }
  }

  // ── Event handlers ────────────────────────────────────────

  _onPushState(data) {
    if (!data || typeof data !== "object") return;
    // Stamp arrival time — used by progress interpolation in player-bar.
    data._receivedAt = new Date().toISOString();
    this._state = data;
    this._firstPushStateReceived = true;

    const next = normalizeState(this._state, this._baseUrl);
    if (stateChanged(this._lastState, next)) {
      this._lastState = next;
      this._fireState(next);
    }
  }

  _onPushQueue(data) {
    const queue = Array.isArray(data) ? data : [];
    this._queue = queue;
    // Resolve any pending getQueue waiters first (FIFO).
    this._resolvePending("getQueue", queue);
    this._notifyQueue(queue);
  }

  _onPushBrowseSources(data) {
    this._browseSources = Array.isArray(data) ? data : [];
    this._resolvePending("getBrowseSources", this._browseSources);
  }

  /**
   * Volumio sends pushBrowseLibrary for BOTH browse and search emits with
   * no correlation id. Route by content: search responses carry
   * navigation.isSearchResult = true.
   */
  _onPushBrowseLibrary(data) {
    const isSearch = !!data?.navigation?.isSearchResult;
    const key = isSearch ? "browseLibrary:search" : "browseLibrary:browse";
    this._resolvePending(key, data);
  }

  // ── Emit / pending response (FIFO) ────────────────────────

  /**
   * Send a Socket.IO event. Returns false if the underlying WS is not open;
   * callers use this to surface failures via _fireAndAck.
   */
  async _emit(event, data) {
    if (!this._ws || this._ws.readyState !== WebSocket.OPEN || !this._handshakeComplete) {
      console.warn(`[volumio-adapter] Cannot emit '${event}': not connected`);
      return false;
    }
    const payload =
      data !== undefined && data !== null
        ? JSON.stringify([event, data])
        : JSON.stringify([event]);
    return this._sendRaw(`42${payload}`);
  }

  _sendRaw(message) {
    try {
      this._ws.send(message);
      return true;
    } catch (err) {
      console.warn("[volumio-adapter] send failed:", err);
      return false;
    }
  }

  /**
   * Emit an event and await the matching push response. Multiple concurrent
   * calls sharing `responseKey` are queued FIFO; push handlers resolve the
   * oldest waiter. Returns null on disconnect, send failure, or timeout.
   */
  async _emitAndWait(event, data, responseKey, timeoutMs = RESPONSE_TIMEOUT_MS) {
    if (!this._ws || this._ws.readyState !== WebSocket.OPEN || !this._handshakeComplete) {
      console.warn(
        `[volumio-adapter] Cannot emit ${event} and wait for ${responseKey}: not connected`
      );
      return null;
    }

    const key = responseKey || event;

    return new Promise((resolve) => {
      let queue = this._pendingResponses.get(key);
      if (!queue) {
        queue = [];
        this._pendingResponses.set(key, queue);
      }

      const entry = { resolve, timer: null };
      queue.push(entry);

      entry.timer = setTimeout(() => {
        // Remove THIS entry; siblings keep their slot in FIFO order.
        const q = this._pendingResponses.get(key);
        if (q) {
          const idx = q.indexOf(entry);
          if (idx !== -1) q.splice(idx, 1);
          if (q.length === 0) this._pendingResponses.delete(key);
        }
        console.warn(`[volumio-adapter] Timeout waiting for ${event}`);
        resolve(null);
      }, timeoutMs);

      const sent = this._sendRaw(
        `42${
          data !== undefined && data !== null
            ? JSON.stringify([event, data])
            : JSON.stringify([event])
        }`
      );

      if (!sent) {
        // Roll back the pending entry — send refused.
        clearTimeout(entry.timer);
        const q = this._pendingResponses.get(key);
        if (q) {
          const idx = q.indexOf(entry);
          if (idx !== -1) q.splice(idx, 1);
          if (q.length === 0) this._pendingResponses.delete(key);
        }
        resolve(null);
      }
    });
  }

  /**
   * Resolve the oldest pending waiter for `key`. Mirrors
   * coordinator._resolve_pending — skips entries whose timer already fired
   * and trims the map entry when empty.
   */
  _resolvePending(key, value) {
    const queue = this._pendingResponses.get(key);
    if (!queue || queue.length === 0) return;
    const entry = queue.shift();
    if (entry) {
      if (entry.timer) clearTimeout(entry.timer);
      entry.resolve(value);
    }
    if (queue.length === 0) this._pendingResponses.delete(key);
  }

  // ── Ping loop ─────────────────────────────────────────────

  _startPingLoop() {
    this._stopPingLoop();
    const intervalMs = Math.max(this._pingIntervalMs - PING_MARGIN_MS, 1000);

    this._pingTimer = setInterval(() => {
      if (!this._ws || this._ws.readyState !== WebSocket.OPEN) {
        this._stopPingLoop();
        return;
      }
      const sent = this._sendRaw("2");
      if (!sent) {
        this._stopPingLoop();
        return;
      }
      // Watchdog: if no pong within timeout, treat as disconnected.
      if (this._pongTimer) clearTimeout(this._pongTimer);
      this._pongTimer = setTimeout(() => {
        console.warn(
          `[volumio-adapter] PONG timeout (${this._pingTimeoutMs}ms) — connection lost`
        );
        this._handleConnectionLost();
      }, this._pingTimeoutMs);
    }, intervalMs);
  }

  _stopPingLoop() {
    if (this._pingTimer) {
      clearInterval(this._pingTimer);
      this._pingTimer = null;
    }
    if (this._pongTimer) {
      clearTimeout(this._pongTimer);
      this._pongTimer = null;
    }
  }

  // ── Connection lost / reconnect ───────────────────────────

  _handleConnectionLost() {
    if (this._shuttingDown) return;
    const wasConnected = this._handshakeComplete;

    this._handshakeComplete = false;
    this._stopPingLoop();

    // Reject any pending connect() so caller doesn't hang.
    this._failPendingConnect(new Error("connection lost"));

    if (this._ws) {
      try {
        this._ws.close();
      } catch {
        // ignore
      }
      this._ws = null;
    }

    if (wasConnected) {
      // Surface "unavailable" state to subscribers.
      const next = normalizeState(null, this._baseUrl);
      this._lastState = next;
      this._fireState(next);
    }

    this._scheduleReconnect();
  }

  _scheduleReconnect() {
    if (this._shuttingDown) return;
    if (this._reconnectTimer) return;

    const delay = Math.min(
      RECONNECT_BASE_MS * Math.pow(2, this._reconnectAttempts),
      RECONNECT_MAX_MS
    );
    this._reconnectAttempts += 1;

    console.info(
      `[volumio-adapter] Reconnecting in ${delay}ms (attempt ${this._reconnectAttempts})`
    );

    this._reconnectTimer = setTimeout(() => {
      this._reconnectTimer = null;
      if (this._shuttingDown) return;
      this._open().catch(() => {
        // Failure already logged; next attempt scheduled by close handler.
      });
    }, delay);
  }

  _clearTimers() {
    this._stopPingLoop();
    if (this._connectTimer) {
      clearTimeout(this._connectTimer);
      this._connectTimer = null;
    }
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = null;
    }
  }

  _failPendingConnect(err) {
    if (this._connectReject) {
      const reject = this._connectReject;
      this._connectResolve = null;
      this._connectReject = null;
      reject(err);
    }
    if (this._connectTimer) {
      clearTimeout(this._connectTimer);
      this._connectTimer = null;
    }
  }

  // ── Listener firing ───────────────────────────────────────

  _fireState(state) {
    for (const cb of this._stateListeners) {
      try {
        cb(state);
      } catch (err) {
        console.error("[volumio-adapter] State listener error:", err);
      }
    }
  }

  _notifyQueue(queue) {
    for (const cb of this._queueListeners) {
      try {
        cb(queue);
      } catch (err) {
        console.error("[volumio-adapter] Queue listener error:", err);
      }
    }
  }
}
