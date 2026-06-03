/**
 * HA Adapter — abstracts Home Assistant communication for the Volumio panel.
 *
 * All hass object access is isolated here. Components interact with this
 * adapter via a clean interface; they never import or reference hass.
 *
 * Multi-device model (issue #38):
 *   On connect the adapter calls volumio_ws/list_devices to learn which
 *   Volumio config entries exist. Each device record carries its
 *   config_entry_id, display name, host/port, volumio_url, and the
 *   media_player entity_id. The adapter persists the user's selection
 *   in localStorage ("volumio-selected-device") and falls back to the
 *   first device if none is saved or the saved one is gone.
 *
 *   The panel reads the device list via getDevices() and switches
 *   devices via setDevice(configEntryId). The adapter unsubscribes the
 *   old queue, applies the new IDs, notifies state and device listeners,
 *   and re-subscribes the queue.
 *
 * Usage:
 *   const adapter = new HAAdapter();
 *   adapter.connect({ hass, panel });        // first load — kicks off async device init
 *   adapter.updateHass(hass);                // every hass change
 *   adapter.onStateChange(cb);               // state diffs
 *   adapter.onQueueChange(cb);               // queue pushes
 *   adapter.onDevicesChange(cb);             // device list / active device changes
 *   const result = await adapter.call("queue_add", { uri: "..." });
 *   await adapter.setDevice(configEntryId);  // switch active device
 *   await adapter.refreshDevices();          // re-pull device list (e.g. after add/remove)
 *   adapter.disconnect();
 */

const SELECTED_DEVICE_STORAGE_KEY = "volumio-selected-device";

// ── State normalization ───────────────────────────────────

function normalizeState(entity, sensorBase, hass) {
  if (!entity) {
    return {
      state: "unavailable",
      title: "",
      artist: "",
      album: "",
      albumArt: "",
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
      // Raw attributes passthrough for anything not yet normalized
      _raw: {},
    };
  }

  const a = entity.attributes || {};
  const supported = a.supported_features || 0;
  const SUPPORT_VOLUME_SET = 4;

  // Quality sensor lookup
  const sensors = {};
  if (sensorBase && hass) {
    const SENSOR_MAP = {
      trackType: "track_type",
      samplerate: "sample_rate",
      bitdepth: "bit_depth",
      channels: "channels",
    };
    for (const [key, suffix] of Object.entries(SENSOR_MAP)) {
      const sensorId = `sensor.${sensorBase}_${suffix}`;
      const sensor = hass.states?.[sensorId];
      sensors[key] =
        sensor?.state !== "unknown" && sensor?.state !== "unavailable"
          ? sensor.state
          : null;
    }
  }

  return {
    state: entity.state || "unavailable",
    title: a.media_title || "",
    artist: a.media_artist || "",
    album: a.media_album_name || "",
    albumArt: a.entity_picture || "",
    rawAlbumart: a.albumart || "",
    duration: a.media_duration || 0,
    position: a.media_position || 0,
    positionUpdatedAt: a.media_position_updated_at || "",
    volume: a.volume_level != null ? Math.round(a.volume_level * 100) : 0,
    muted: a.is_volume_muted || false,
    shuffle: a.shuffle || false,
    repeat: a.repeat || "off",
    source: a.source || "",
    uri: a.uri || "",
    queuePosition: a.queue_position ?? -1,
    volumeEnabled: !!(supported & SUPPORT_VOLUME_SET),
    bitrate: a.bitrate || null,
    // Quality sensors
    trackType: sensors.trackType || null,
    samplerate: sensors.samplerate || null,
    bitdepth: sensors.bitdepth || null,
    channels: sensors.channels || null,
    // Raw attributes for anything not yet abstracted
    _raw: a,
  };
}

function stateChanged(prev, next) {
  if (!prev || !next) return true;
  // Compare all normalized fields except _raw
  const keys = Object.keys(next).filter((k) => k !== "_raw");
  return keys.some((k) => prev[k] !== next[k]);
}

// ── localStorage helpers (corrupt-data resilient) ─────────

function readSelectedDevice() {
  try {
    return localStorage.getItem(SELECTED_DEVICE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeSelectedDevice(configEntryId) {
  try {
    if (configEntryId) {
      localStorage.setItem(SELECTED_DEVICE_STORAGE_KEY, configEntryId);
    } else {
      localStorage.removeItem(SELECTED_DEVICE_STORAGE_KEY);
    }
  } catch {
    // Storage full / disabled — silent; selection just won't persist
  }
}

// ── Adapter class ─────────────────────────────────────────

export class HAAdapter {
  constructor() {
    this._hass = null;
    this._panel = null;
    this._devices = [];
    this._activeDevice = null;
    this._entityId = null;
    this._configEntryId = null;
    this._sensorBase = null;
    this._queueUnsub = null;
    this._lastState = null;
    this._stateListeners = new Set();
    this._queueListeners = new Set();
    this._devicesListeners = new Set();
    this._initInFlight = null;
  }

  // ── Lifecycle ──────────────────────────────────────────────

  /**
   * Initialize adapter with HA connection and panel config.
   * Synchronous: stores hass/panel and kicks off async device discovery.
   * Listeners will fire once devices are loaded.
   */
  connect({ hass, panel }) {
    this._hass = hass;
    this._panel = panel;
    // Fire-and-forget init; returns a promise stored so refreshDevices can await it
    this._initInFlight = this._initDevices();
  }

  /**
   * Update the hass and (optionally) panel reference. Called on every
   * hass or panel property change. Diffs state and only notifies
   * listeners if something Volumio-related changed.
   */
  updateHass(hass, panel) {
    this._hass = hass;
    if (panel !== undefined) this._panel = panel;

    const next = this._normalize();
    if (stateChanged(this._lastState, next)) {
      this._lastState = next;
      this._fireState(next);
    }
  }

  /**
   * Clean up subscriptions.
   */
  disconnect() {
    this._unsubscribeQueue();
    this._stateListeners.clear();
    this._queueListeners.clear();
    this._devicesListeners.clear();
  }

  // ── State ──────────────────────────────────────────────────

  /**
   * Get normalized state snapshot. Always normalizes fresh from current
   * hass state to avoid Lit lifecycle timing issues (render() runs
   * before updated(), so a cached value would be one cycle stale).
   */
  getState() {
    return this._normalize();
  }

  /**
   * Get the configured Volumio URL for art resolution.
   * Comes from the active device's record (per-device URL — critical
   * for multi-device deployments where each Volumio has its own host).
   */
  getVolumioUrl() {
    return this._activeDevice?.volumio_url || "";
  }

  /**
   * Get a quality-related sensor value.
   * @param {string} key - One of: trackType, samplerate, bitdepth, channels
   */
  getSensorValue(key) {
    const state = this.getState();
    return state[key] || null;
  }

  /**
   * Check if the adapter has resolved entity + config entry IDs.
   */
  get ready() {
    return !!(this._entityId && this._configEntryId);
  }

  /**
   * Get the entity ID (for components that still need it, e.g. media_player).
   */
  get entityId() {
    return this._entityId;
  }

  // ── Devices ───────────────────────────────────────────────

  /**
   * Get the current device list. Empty until volumio_ws/list_devices
   * resolves; subscribe via onDevicesChange to be notified.
   */
  getDevices() {
    return this._devices.slice();
  }

  /**
   * Get the active device's config_entry_id, or null if none selected.
   */
  getActiveDeviceId() {
    return this._configEntryId;
  }

  /**
   * Get the full active device record (for name display, host, etc.).
   */
  getActiveDevice() {
    return this._activeDevice;
  }

  /**
   * Switch the active device. Persists the selection, tears down the
   * old queue subscription, applies the new IDs, and notifies state +
   * device listeners. Re-subscribes the queue against the new device.
   */
  async setDevice(configEntryId) {
    const device = this._devices.find(
      (d) => d.config_entry_id === configEntryId
    );
    if (!device) {
      console.warn("[ha-adapter] setDevice: unknown device", configEntryId);
      return;
    }
    if (device.config_entry_id === this._configEntryId) {
      return; // no-op
    }

    writeSelectedDevice(device.config_entry_id);

    this._unsubscribeQueue();
    this._applyDevice(device);
    // Force the next state notification through even if attributes
    // happen to match — listeners need to know we switched devices.
    this._lastState = null;
    this._fireDevices();
    const next = this._normalize();
    this._lastState = next;
    this._fireState(next);
    await this._subscribeQueue();
  }

  /**
   * Re-fetch the device list (e.g. after a config entry is added or
   * removed). Preserves the active selection if still present.
   */
  async refreshDevices() {
    const previousId = this._configEntryId;
    await this._initDevices();
    // If the active device went away or wasn't subscribed yet, the
    // _initDevices flow already re-subscribed. Otherwise no-op.
    if (this._configEntryId !== previousId) {
      // _initDevices already handled subscription via _applyDevice path
    }
  }

  onDevicesChange(callback) {
    this._devicesListeners.add(callback);
  }

  offDevicesChange(callback) {
    this._devicesListeners.delete(callback);
  }

  // ── Service Calls ─────────────────────────────────────────

  /**
   * Call a volumio_ws service. Handles domain and config_entry_id automatically.
   * @param {string} name - Service name without domain prefix (e.g. "queue_add")
   * @param {object} data - Service data without config_entry_id
   * @returns {Promise<object>} Service response
   */
  async call(name, data = {}) {
    if (!this._hass || !this._configEntryId) {
      throw new Error(`Adapter not ready: call(${name})`);
    }
    return await this._hass.connection.sendMessagePromise({
      type: "call_service",
      domain: "volumio_ws",
      service: name,
      service_data: {
        config_entry_id: this._configEntryId,
        ...data,
      },
      return_response: true,
    });
  }

  /**
   * Contract parity with VolumioAdapter.callMethod — present so the public
   * adapter surface matches across transports. In HA mode this is a guarded
   * no-op: invoking arbitrary Volumio controller/plugin methods over HA's
   * backend is not wired (it would require a dedicated volumio_ws service +
   * coordinator emit, which is a separate, gated contract item). The only
   * caller today (the standalone UI-switch dropdown) is gated to standalone/
   * kiosk mode and never reaches this in HA. Returns the adapter's uniform
   * not-supported failure shape rather than throwing.
   */
  async callMethod(type, endpoint, method /*, data */) {
    console.warn(
      `[ha-adapter] callMethod not supported in HA mode (${endpoint}/${method})`
    );
    return {
      response: { success: false, command: "callMethod", error: "not_supported_in_ha" },
    };
  }

  // ── Playback Commands ─────────────────────────────────────

  async play() {
    await this._mediaPlayerCall("media_play");
  }

  async pause() {
    await this._mediaPlayerCall("media_pause");
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
    await this._mediaPlayerCall("media_stop");
  }

  async next() {
    await this._mediaPlayerCall("media_next_track");
  }

  async prev() {
    await this._mediaPlayerCall("media_previous_track");
  }

  async seek(position) {
    await this._mediaPlayerCall("media_seek", { seek_position: position });
  }

  async setVolume(level) {
    if (!this.getState().volumeEnabled) return;
    await this._mediaPlayerCall("set_volume_level", {
      volume_level: level / 100,
    });
  }

  async mute(muted) {
    if (!this.getState().volumeEnabled) return;
    await this._mediaPlayerCall("volume_mute", {
      is_volume_muted: muted,
    });
  }

  async toggleMute() {
    const s = this.getState();
    await this.mute(!s.muted);
  }

  async setShuffle(shuffle) {
    await this._mediaPlayerCall("shuffle_set", { shuffle });
  }

  async setRepeat(repeat) {
    await this._mediaPlayerCall("repeat_set", { repeat });
  }

  // ── Queue Subscription ────────────────────────────────────

  /**
   * Subscribe to queue changes. Callback receives the queue array.
   */
  onQueueChange(callback) {
    this._queueListeners.add(callback);
  }

  /**
   * Unsubscribe from queue changes.
   */
  offQueueChange(callback) {
    this._queueListeners.delete(callback);
  }

  // ── State Subscription ────────────────────────────────────

  /**
   * Subscribe to normalized state changes. Callback receives state object.
   */
  onStateChange(callback) {
    this._stateListeners.add(callback);
  }

  /**
   * Unsubscribe from state changes.
   */
  offStateChange(callback) {
    this._stateListeners.delete(callback);
  }

  // ── Plugin endpoint REST ──────────────────────────────────

  /**
   * Low-level helper for Volumio's POST /api/v1/pluginEndpoint gateway.
   * Returns the inner `data` field on success, or null on any failure
   * (including network errors, non-OK HTTP, and outer success:false).
   * Never throws to caller.
   * @private
   */
  async _fetchPluginEndpoint(endpoint, data) {
    if (!this._configEntryId) return null;
    try {
      const result = await this.call("plugin_endpoint", { endpoint, data });
      const volumioResponse = result?.response;
      // Outer envelope: getSimilarArtists returns {success:false, error:...}
      // on failure; storyArtist/storyAlbum return {success:true, data:{...}}
      // with the inner success flag carrying the real status.
      if (!volumioResponse || volumioResponse.success === false) return null;
      return volumioResponse.data;
    } catch {
      return null;
    }
  }

  /**
   * Fetch artist biography text via metavolumio.storyArtist.
   * @param {string} artistName
   * @returns {Promise<string|null>} Bio text, or null if unavailable.
   */
  async fetchArtistBio(artistName) {
    if (!artistName) return null;
    const data = await this._fetchPluginEndpoint("metavolumio", {
      mode: "storyArtist",
      artist: artistName,
    });
    // Inner envelope: storyArtist returns {success:false, error:"not found"}
    // wrapped in the outer {success:true, data:...}. Check both.
    if (!data || data.success === false || !data.value) return null;
    return typeof data.value === "string" ? data.value : null;
  }

  /**
   * Fetch similar artists via getSimilarArtists.
   * @param {string} artistName
   * @returns {Promise<Array<{artist:string, albumart:string, uri:string}>>}
   *   Array of similar artist records, or empty array if unavailable.
   */
  async fetchSimilarArtists(artistName) {
    if (!artistName) return [];
    const data = await this._fetchPluginEndpoint("getSimilarArtists", {
      artist: artistName,
    });
    return Array.isArray(data) ? data : [];
  }

  /**
   * Fetch album story text via metavolumio.storyAlbum.
   * @param {string} artistName
   * @param {string} albumName
   * @returns {Promise<string|null>} Story text, or null if unavailable.
   */
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

  /**
   * Fetch album credits via metavolumio.creditsAlbum.
   * Returns an array of {key, values:[{name, uri}]} where key is the role
   * (e.g. "lead vocals") and values are the credited people/places.
   * URIs are MusicBrainz IDs (mbid:/artist/...), NOT Volumio URIs — they
   * are display-only here; cross-navigation uses the name with the
   * globalUriArtist/Name fallback path.
   * @param {string} artistName
   * @param {string} albumName
   * @returns {Promise<Array<{key:string, values:Array<{name:string, uri:string}>}>>}
   */
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

  // ── Internals ─────────────────────────────────────────────

  _normalize() {
    const entity = this._entityId
      ? this._hass?.states?.[this._entityId]
      : null;
    return normalizeState(entity, this._sensorBase, this._hass);
  }

  _applyDevice(device) {
    if (!device) {
      this._activeDevice = null;
      this._configEntryId = null;
      this._entityId = null;
      this._sensorBase = null;
      return;
    }
    this._activeDevice = device;
    this._configEntryId = device.config_entry_id;
    this._entityId = device.entity_id || null;
    this._sensorBase = device.entity_id
      ? device.entity_id.replace("media_player.", "")
      : null;
  }

  async _initDevices() {
    if (!this._hass) return;

    let devices = [];
    try {
      const result = await this._hass.connection.sendMessagePromise({
        type: "volumio_ws/list_devices",
      });
      devices = Array.isArray(result?.devices) ? result.devices : [];
    } catch (err) {
      console.error("[ha-adapter] list_devices failed:", err);
      this._devices = [];
      this._applyDevice(null);
      this._fireDevices();
      return;
    }

    this._devices = devices;

    // Pick active: saved selection if it still exists, else first device.
    const savedId = readSelectedDevice();
    let active = devices.find((d) => d.config_entry_id === savedId);
    if (!active && devices.length > 0) {
      active = devices[0];
    }

    // If saved selection is gone, clear it so future loads pick fresh.
    if (savedId && !devices.some((d) => d.config_entry_id === savedId)) {
      writeSelectedDevice(null);
    }

    const previousQueueDeviceId = this._configEntryId;
    this._applyDevice(active || null);

    // Re-subscribe queue if the active device changed (or this is the
    // first time we have one).
    if (this._configEntryId !== previousQueueDeviceId) {
      this._unsubscribeQueue();
      if (this._configEntryId) {
        await this._subscribeQueue();
      }
    }

    // Notify listeners. State first (entity may now resolve), then devices.
    const next = this._normalize();
    this._lastState = next;
    this._fireState(next);
    this._fireDevices();
  }

  async _subscribeQueue() {
    if (this._queueUnsub || !this._hass || !this._configEntryId) return;
    const cei = this._configEntryId;
    try {
      this._queueUnsub = await this._hass.connection.subscribeMessage(
        (msg) => {
          if (msg.queue) {
            this._notifyQueue([...msg.queue]);
          }
        },
        { type: "volumio_ws/subscribe_queue", config_entry_id: cei }
      );
    } catch (err) {
      console.warn("[ha-adapter] Queue subscription failed:", err);
    }

    // Belt-and-suspenders: also fetch queue via service call so the
    // panel has data immediately even if the push hasn't fired yet.
    try {
      const result = await this.call("queue_get");
      if (result?.response?.queue) {
        this._notifyQueue([...result.response.queue]);
      }
    } catch {
      // Silent
    }
  }

  _unsubscribeQueue() {
    if (this._queueUnsub) {
      if (typeof this._queueUnsub === "function") {
        this._queueUnsub();
      }
      this._queueUnsub = null;
    }
  }

  _notifyQueue(queue) {
    for (const cb of this._queueListeners) {
      try {
        cb(queue);
      } catch (err) {
        console.error("[ha-adapter] Queue listener error:", err);
      }
    }
  }

  _fireState(next) {
    for (const cb of this._stateListeners) {
      try {
        cb(next);
      } catch (err) {
        console.error("[ha-adapter] State listener error:", err);
      }
    }
  }

  _fireDevices() {
    const payload = {
      devices: this._devices.slice(),
      activeId: this._configEntryId,
    };
    for (const cb of this._devicesListeners) {
      try {
        cb(payload);
      } catch (err) {
        console.error("[ha-adapter] Devices listener error:", err);
      }
    }
  }

  async _mediaPlayerCall(service, data = {}) {
    if (!this._hass || !this._entityId) {
      throw new Error(`Adapter not ready: media_player.${service}`);
    }
    return await this._hass.callService("media_player", service, {
      entity_id: this._entityId,
      ...data,
    });
  }
}
