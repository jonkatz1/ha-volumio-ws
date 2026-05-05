/**
 * HA Adapter — abstracts Home Assistant communication for the Volumio panel.
 *
 * All hass object access is isolated here. Components interact with this
 * adapter via a clean interface; they never import or reference hass.
 *
 * Usage:
 *   const adapter = new HAAdapter();
 *   adapter.connect({ hass, panel });       // on first load
 *   adapter.updateHass(hass);               // on every hass change
 *   adapter.onStateChange(cb);              // subscribe to state diffs
 *   adapter.onQueueChange(cb);              // subscribe to queue pushes
 *   const result = await adapter.call("queue_add", { uri: "..." });
 *   await adapter.play();
 *   adapter.disconnect();                   // cleanup
 */

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

// ── Adapter class ─────────────────────────────────────────

export class HAAdapter {
  constructor() {
    this._hass = null;
    this._panel = null;
    this._entityId = null;
    this._configEntryId = null;
    this._sensorBase = null;
    this._queueUnsub = null;
    this._lastState = null;
    this._stateListeners = new Set();
    this._queueListeners = new Set();
  }

  // ── Lifecycle ──────────────────────────────────────────────

  /**
   * Initialize adapter with HA connection and panel config.
   * Call once when the panel first loads.
   */
  connect({ hass, panel }) {
    this._hass = hass;
    this._panel = panel;
    this._resolveIds();
    this._subscribeQueue();
  }

  /**
   * Update the hass and (optionally) panel reference. Called on every
   * hass or panel property change. Diffs state and only notifies
   * listeners if something Volumio-related changed.
   *
   * Accepts panel because Lit does not guarantee assignment order of
   * reactive properties — hass may arrive before panel, in which case
   * connect() captured `panel: undefined` and we'd never resolve
   * configEntryId without re-passing it on later updates.
   */
  updateHass(hass, panel) {
    this._hass = hass;
    if (panel !== undefined) this._panel = panel;
    this._resolveIds();

    const next = this._normalize();
    if (stateChanged(this._lastState, next)) {
      this._lastState = next;
      for (const cb of this._stateListeners) {
        try {
          cb(next);
        } catch (err) {
          console.error("[ha-adapter] State listener error:", err);
        }
      }
    }
  }

  /**
   * Clean up subscriptions.
   */
  disconnect() {
    this._unsubscribeQueue();
    this._stateListeners.clear();
    this._queueListeners.clear();
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
   */
  getVolumioUrl() {
    return this._panel?.config?.volumio_url || "";
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

  // ── Internals ─────────────────────────────────────────────

  _normalize() {
    const entity = this._entityId
      ? this._hass?.states?.[this._entityId]
      : null;
    return normalizeState(entity, this._sensorBase, this._hass);
  }

  _resolveIds() {
    if (this._entityId && this._configEntryId) return;

    if (!this._entityId && this._hass) {
      let found = Object.keys(this._hass.states).find(
        (eid) =>
          eid.startsWith("media_player.") &&
          this._hass.states[eid].attributes?.volumio_ws === true
      );
      if (!found) {
        found = Object.keys(this._hass.states).find(
          (eid) =>
            eid.startsWith("media_player.") && eid.includes("volumio")
        );
      }
      if (found) {
        this._entityId = found;
        this._sensorBase = found.replace("media_player.", "");
      }
    }

    if (!this._configEntryId && this._panel?.config?.config_entry_id) {
      this._configEntryId = this._panel.config.config_entry_id;
    }
  }

  async _subscribeQueue() {
    if (this._queueUnsub || !this._hass) return;
    try {
      this._queueUnsub = await this._hass.connection.subscribeMessage(
        (msg) => {
          if (msg.queue) {
            const queue = [...msg.queue];
            this._notifyQueue(queue);
          }
        },
        { type: "volumio_ws/subscribe_queue" }
      );
    } catch (err) {
      console.warn("[ha-adapter] Queue subscription failed:", err);
    }

    // Belt-and-suspenders: also fetch queue via service call
    if (this._configEntryId) {
      try {
        const result = await this.call("queue_get");
        if (result?.response?.queue) {
          this._notifyQueue([...result.response.queue]);
        }
      } catch {
        // Silent
      }
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
