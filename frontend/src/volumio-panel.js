/**
 * Volumio Panel — main LitElement panel for Home Assistant sidebar.
 *
 * T17: Layout shell, player bar, Now Playing view.
 * Replaces T15 skeleton with production three-zone layout.
 *
 * Architecture:
 *   - This component owns hass, entity state, queue data, and routing
 *   - Sub-components receive data via properties, emit events upward
 *   - Service calls and WS subscriptions are centralized here
 */
import { LitElement, html, css } from "lit";
import { sharedStyles } from "./styles/shared-styles.js";
import { detectQuality } from "./utils/quality-utils.js";
import { resolveArt } from "./utils/format-utils.js";
import "./components/top-bar.js";
import "./components/left-nav.js";
import "./components/player-bar.js";
import "./components/now-playing.js";

// HA supported_features bitmask values
const SUPPORT_VOLUME_SET = 4;

class VolumioPanel extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      route: { type: Object },
      panel: { type: Object },
      // Internal state
      _entityId: { type: String, state: true },
      _configEntryId: { type: String, state: true },
      _queue: { type: Array, state: true },
      _queueUnsub: { state: true },
      _activeView: { type: String, state: true },
      _navMode: { type: String, state: true },
      _showQueue: { type: Boolean, state: true },
      _showNavFlyout: { type: Boolean, state: true },
      _sensorBase: { type: String, state: true },
      _isFavorite: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: block;
          height: 100%;
          background: var(--primary-background-color, #121212);
          color: var(--primary-text-color, #e0e0e0);
          font-family: var(--ha-font-family, Roboto, sans-serif);
          box-sizing: border-box;
          overflow: hidden;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .shell {
          display: grid;
          grid-template-rows: auto 1fr auto;
          height: 100%;
        }

        /* ── Three-zone content area ─────────────── */
        .content-area {
          display: grid;
          grid-template-columns: auto 1fr auto;
          overflow: hidden;
          position: relative;
        }

        .left-zone {
          overflow: hidden;
          transition: width 0.2s ease;
        }

        .left-zone.pinned {
          width: var(--volumio-nav-width-pinned, 240px);
        }

        .left-zone.collapsed {
          width: var(--volumio-nav-width-collapsed, 56px);
        }

        .left-zone.hidden {
          width: 0;
        }

        .center-zone {
          overflow-y: auto;
          overflow-x: hidden;
          min-width: 0;
        }

        .right-zone {
          overflow: hidden;
          transition: width 0.2s ease;
        }

        .right-zone.pinned {
          width: var(--volumio-queue-width, 320px);
          border-left: 1px solid var(--divider-color, rgba(255,255,255,0.08));
        }

        .right-zone.hidden {
          width: 0;
        }

        /* ── Flyout overlay ──────────────────────── */
        .flyout-scrim {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 190;
        }

        .flyout-panel {
          position: fixed;
          top: 0;
          bottom: 0;
          z-index: 200;
          transition: transform 0.2s ease-out;
        }

        .flyout-panel.left {
          left: 0;
          width: var(--volumio-nav-width-pinned, 240px);
        }

        .flyout-panel.right {
          right: 0;
          width: var(--volumio-queue-width, 320px);
        }

        /* ── Queue placeholder ───────────────────── */
        .queue-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: var(--volumio-space-lg, 24px);
          color: var(--secondary-text-color);
          text-align: center;
          gap: var(--volumio-space-sm, 8px);
        }

        .queue-placeholder ha-icon {
          --mdc-icon-size: 32px;
          opacity: 0.4;
        }

        .queue-placeholder .count {
          font-size: 13px;
        }

        /* ── Placeholder views ───────────────────── */
        .placeholder-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: var(--volumio-space-xxl, 48px);
          text-align: center;
          gap: var(--volumio-space-md, 16px);
        }

        .placeholder-view ha-icon {
          --mdc-icon-size: 48px;
          color: var(--secondary-text-color);
          opacity: 0.3;
        }

        .placeholder-view .view-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--primary-text-color);
        }

        .placeholder-view .view-desc {
          font-size: 14px;
          color: var(--secondary-text-color);
        }
      `,
    ];
  }

  constructor() {
    super();
    this._entityId = null;
    this._configEntryId = null;
    this._queue = [];
    this._queueUnsub = null;
    this._activeView = "now-playing";
    this._navMode = "collapsed";
    this._showQueue = false;
    this._showNavFlyout = false;
    this._sensorBase = null;
    this._isFavorite = false;
    this._favoritesCache = [];
    this._lastUri = null;
    this._keyHandler = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._applyBreakpoint();
    window.addEventListener("resize", this._onResize);
    window.addEventListener("keydown", this._keyHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribeQueue();
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("keydown", this._keyHandler);
  }

  _onResize = () => {
    this._applyBreakpoint();
  };

  _applyBreakpoint() {
    const w = window.innerWidth;
    if (w >= 1400) {
      this._navMode = "pinned";
      this._showQueue = true;
    } else if (w >= 1024) {
      this._navMode = "collapsed";
    } else {
      this._navMode = "hidden";
      this._showQueue = false;
    }
  }

  updated(changedProps) {
    if (changedProps.has("hass") && this.hass) {
      this._resolveIds();
      if (!this._queueUnsub) {
        this._subscribeQueue();
      }
      const entity = this._getEntity();
      const uri = entity?.attributes?.uri ?? null;
      if (uri !== this._lastUri) {
        this._lastUri = uri;
        if (uri && this._configEntryId) {
          this._checkFavorite();
        } else {
          this._isFavorite = false;
        }
      }
    }
  }

  // ── ID Resolution ─────────────────────────────────────────

  _resolveIds() {
    if (this._entityId && this._configEntryId) return;

    if (!this._entityId) {
      let found = Object.keys(this.hass.states).find(
        (eid) =>
          eid.startsWith("media_player.") &&
          this.hass.states[eid].attributes?.volumio_ws === true
      );
      if (!found) {
        found = Object.keys(this.hass.states).find(
          (eid) =>
            eid.startsWith("media_player.") && eid.includes("volumio")
        );
      }
      if (found) {
        this._entityId = found;
        this._sensorBase = found.replace("media_player.", "");
      }
    }

    if (!this._configEntryId && this.panel?.config?.config_entry_id) {
      this._configEntryId = this.panel.config.config_entry_id;
    }
  }

  // ── Queue Subscription ────────────────────────────────────

  async _subscribeQueue() {
    if (this._queueUnsub || !this.hass) return;
    try {
      this._queueUnsub = await this.hass.connection.subscribeMessage(
        (msg) => {
          if (msg.queue) {
            console.debug("[volumio-panel] Queue push received:", msg.queue.length, "items");
            this._queue = msg.queue;
          }
        },
        { type: "volumio_ws/subscribe_queue" }
      );
      console.debug("[volumio-panel] Queue subscription active");
    } catch (err) {
      console.warn("[volumio-panel] Queue subscription failed:", err);
    }

    // Also fetch queue via service call — the subscription's initial push
    // may have an empty coordinator queue if pushQueue hasn't arrived yet
    if (this._configEntryId) {
      try {
        const result = await this.hass.connection.sendMessagePromise({
          type: "call_service",
          domain: "volumio_ws",
          service: "queue_get",
          service_data: { config_entry_id: this._configEntryId },
          return_response: true,
        });
        if (result?.response?.queue) {
          console.debug("[volumio-panel] Queue fetched via service:", result.response.queue.length, "items");
          this._queue = result.response.queue;
        }
      } catch (err) {
        console.debug("[volumio-panel] queue_get fallback failed (non-fatal):", err.message);
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

  // ── Service Calls ─────────────────────────────────────────

  async _callService(service, data = {}) {
    return await this.hass.connection.sendMessagePromise({
      type: "call_service",
      domain: "volumio_ws",
      service,
      service_data: {
        config_entry_id: this._configEntryId,
        ...data,
      },
      return_response: true,
    });
  }

  async _callMediaPlayerService(service, data = {}) {
    return await this.hass.callService("media_player", service, {
      entity_id: this._entityId,
      ...data,
    });
  }

  // ── State Getters ─────────────────────────────────────────

  _getEntity() {
    return this._entityId ? this.hass?.states[this._entityId] : null;
  }

  _getSensorValue(key) {
    const SENSOR_MAP = {
      trackType: "track_type",
      samplerate: "sample_rate",
      bitdepth: "bit_depth",
      channels: "channels",
    };
    const suffix = SENSOR_MAP[key];
    if (!suffix || !this._sensorBase) return null;
    const sensorId = `sensor.${this._sensorBase}_${suffix}`;
    const sensor = this.hass?.states[sensorId];
    return sensor?.state !== "unknown" && sensor?.state !== "unavailable"
      ? sensor?.state
      : null;
  }

  _getQualityInfo() {
    const entity = this._getEntity();
    if (!entity) return null;
    const attrs = entity.attributes || {};

    const inputs = {
      trackType: this._getSensorValue("trackType"),
      samplerate: this._getSensorValue("samplerate"),
      bitdepth: this._getSensorValue("bitdepth"),
      bitrate: attrs.bitrate || null,
      isStream: attrs.media_content_type === "channel",
    };

    // Log quality inputs once per track change
    const inputKey = JSON.stringify(inputs);
    if (this._lastQualityInputKey !== inputKey) {
      console.debug("[volumio-panel] Quality inputs:", inputs);
      this._lastQualityInputKey = inputKey;
    }

    return detectQuality(inputs);
  }

  _isVolumeEnabled() {
    const entity = this._getEntity();
    if (!entity) return false;
    const features = entity.attributes?.supported_features || 0;
    const enabled = (features & SUPPORT_VOLUME_SET) !== 0;
    // Debug: log when volume state seems wrong
    if (this._lastVolumeEnabled !== enabled) {
      console.debug("[volumio-panel] Volume enabled:", enabled, "supported_features:", features, "& 4 =", features & 4);
      this._lastVolumeEnabled = enabled;
    }
    return enabled;
  }

  // ── Render ────────────────────────────────────────────────

  render() {
    const entity = this._getEntity();
    const attrs = entity?.attributes || {};
    const state = entity?.state || "unavailable";
    const qualityInfo = this._getQualityInfo();
    const artUrl = resolveArt(attrs.entity_picture, "");
    const sources = attrs.source_list || [];
    const volumioUrl = this.panel?.config?.volumio_url || "";

    const navSources = sources.map(name => ({
      name,
      plugin_name: name.toLowerCase().replace(/\s+/g, ""),
      plugin_type: "music_service",
    }));

    return html`
      <div class="shell">
        <volumio-top-bar
          active-view="${this._activeView}"
          .breadcrumb=${[]}
          ?narrow=${this.narrow}
          @volumio-navigate=${this._onNavigate}
          @volumio-toggle-nav=${this._onToggleNav}
          @volumio-toggle-queue=${this._onToggleQueue}
          @volumio-back=${this._onBack}
        ></volumio-top-bar>

        <div class="content-area">
          ${this._renderLeftZone(navSources)}

          <div class="center-zone">
            ${this._renderCenterContent(entity, attrs, state, qualityInfo, artUrl)}
          </div>

          ${this._renderRightZone()}
        </div>

        <volumio-player-bar
          player-state="${state}"
          title="${attrs.media_title || ""}"
          artist="${attrs.media_artist || ""}"
          album-art="${artUrl}"
          .duration=${attrs.media_duration || 0}
          .position=${attrs.media_position || 0}
          position-updated-at="${attrs.media_position_updated_at || ""}"
          .volume=${attrs.volume_level != null ? Math.round(attrs.volume_level * 100) : 0}
          ?muted=${attrs.is_volume_muted || false}
          ?shuffle=${attrs.shuffle || false}
          repeat="${attrs.repeat || "off"}"
          .quality=${qualityInfo}
          source="${attrs.source || ""}"
          .volumeEnabled=${this._isVolumeEnabled()}
          .isFavorite=${this._isFavorite}
          @volumio-command=${this._onCommand}
          @volumio-navigate=${this._onNavigate}
          @volumio-toggle-favorite=${this._onToggleFavorite}
        ></volumio-player-bar>
      </div>

      ${this._showNavFlyout ? html`
        <div class="flyout-scrim" @click=${() => this._showNavFlyout = false}></div>
        <div class="flyout-panel left">
          <volumio-left-nav
            .sources=${navSources}
            mode="flyout"
            active-view="${this._activeView}"
            @volumio-navigate=${this._onNavigate}
            @volumio-nav-pin=${this._onNavPin}
          ></volumio-left-nav>
        </div>
      ` : ""}
    `;
  }

  _renderLeftZone(sources) {
    if (this._navMode === "hidden") return html``;

    return html`
      <div class="left-zone ${this._navMode}">
        <volumio-left-nav
          .sources=${sources}
          mode="${this._navMode}"
          active-view="${this._activeView}"
          @volumio-navigate=${this._onNavigate}
          @volumio-nav-pin=${this._onNavPin}
        ></volumio-left-nav>
      </div>
    `;
  }

  _renderRightZone() {
    if (!this._showQueue) return html``;

    return html`
      <div class="right-zone pinned">
        <div class="queue-placeholder">
          <ha-icon icon="mdi:playlist-music"></ha-icon>
          <span>Queue</span>
          <span class="count">${this._queue.length} tracks</span>
        </div>
      </div>
    `;
  }

  _renderCenterContent(entity, attrs, state, qualityInfo, artUrl) {
    switch (this._activeView) {
      case "now-playing":
        return html`
          <volumio-now-playing
            player-state="${state}"
            title="${attrs.media_title || ""}"
            artist="${attrs.media_artist || ""}"
            album="${attrs.media_album_name || ""}"
            album-art="${artUrl}"
            .quality=${qualityInfo}
            source="${attrs.source || ""}"
            .isFavorite=${this._isFavorite}
            @volumio-command=${this._onCommand}
            @volumio-navigate=${this._onNavigate}
            @volumio-toggle-favorite=${this._onToggleFavorite}
          ></volumio-now-playing>
        `;
      case "browse":
        return this._renderPlaceholder("Browse", "mdi:folder-music", "Browse your music sources — coming in T18");
      case "playlists":
        return this._renderPlaceholder("Playlists", "mdi:playlist-music-outline", "Your playlists — coming in T20");
      case "favorites":
        return this._renderPlaceholder("Favorites", "mdi:heart", "Your favorites — coming in T20");
      case "history":
        return this._renderPlaceholder("History", "mdi:history", "Recently played — coming in T20");
      case "settings":
        return this._renderPlaceholder("Settings", "mdi:cog", "Panel settings — coming in T20");
      default:
        return this._renderPlaceholder("", "mdi:help-circle", `Unknown view: ${this._activeView}`);
    }
  }

  _renderPlaceholder(title, icon, description) {
    return html`
      <div class="placeholder-view">
        <ha-icon icon="${icon}"></ha-icon>
        <div class="view-title">${title}</div>
        <div class="view-desc">${description}</div>
      </div>
    `;
  }

  // ── Event Handlers ────────────────────────────────────────

  _onNavigate(e) {
    const { view } = e.detail;
    if (view) {
      this._activeView = view;
      this._showNavFlyout = false;
    }
  }

  _onToggleNav() {
    if (this._navMode === "hidden") {
      this._showNavFlyout = !this._showNavFlyout;
    } else if (this._navMode === "collapsed") {
      this._navMode = "pinned";
    } else {
      this._navMode = "collapsed";
    }
  }

  _onNavPin(e) {
    this._navMode = e.detail.pinned ? "pinned" : "collapsed";
    this._showNavFlyout = false;
  }

  _onToggleQueue() {
    this._showQueue = !this._showQueue;
  }

  _onBack() {
    if (this._activeView !== "now-playing") {
      this._activeView = "now-playing";
    }
  }

  async _onCommand(e) {
    const { command, value } = e.detail;
    const entity = this._getEntity();
    if (!entity || !this._entityId) return;

    try {
      switch (command) {
        case "play_pause":
          if (entity.state === "playing") {
            await this._callMediaPlayerService("media_pause");
          } else {
            await this._callMediaPlayerService("media_play");
          }
          break;
        case "next":
          await this._callMediaPlayerService("media_next_track");
          break;
        case "prev":
          await this._callMediaPlayerService("media_previous_track");
          break;
        case "seek":
          await this._callMediaPlayerService("media_seek", { seek_position: value });
          break;
        case "volume_set":
          if (this._isVolumeEnabled()) {
            await this._callMediaPlayerService("set_volume_level", { volume_level: value / 100 });
          } else {
            console.debug("[volumio-panel] Volume set ignored — volume control disabled");
          }
          break;
        case "mute_toggle":
          if (this._isVolumeEnabled()) {
            await this._callMediaPlayerService("volume_mute", {
              is_volume_muted: !entity.attributes?.is_volume_muted,
            });
          } else {
            console.debug("[volumio-panel] Mute ignored — volume control disabled");
          }
          break;
        case "shuffle_set":
          await this._callMediaPlayerService("shuffle_set", { shuffle: value });
          break;
        case "repeat_set":
          await this._callMediaPlayerService("repeat_set", { repeat: value });
          break;
        default:
          console.warn("[volumio-panel] Unknown command:", command);
      }
    } catch (err) {
      console.error("[volumio-panel] Command failed:", command, err);
    }
  }

  async _checkFavorite() {
    if (!this.hass || !this._configEntryId) return;
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "call_service",
        domain: "volumio_ws",
        service: "favorites_list",
        service_data: { config_entry_id: this._configEntryId },
        return_response: true,
      });
      const items = result?.response?.items || [];
      this._favoritesCache = items;
      const entity = this._getEntity();
      const uri = entity?.attributes?.uri;
      this._isFavorite = !!(uri && items.some((it) => it?.uri === uri));
    } catch (err) {
      console.error("[volumio-panel] favorites_list failed:", err);
    }
  }

  async _onToggleFavorite() {
    const entity = this._getEntity();
    if (!entity || !this._configEntryId) return;
    const attrs = entity.attributes || {};
    const uri = attrs.uri;
    if (!uri) return;

    const wasFavorite = this._isFavorite;
    this._isFavorite = !wasFavorite;

    console.debug("[volumio-panel] Toggle favorite:", { wasFavorite, uri, title: attrs.media_title, service: attrs.source, configEntryId: this._configEntryId });

    try {
      if (wasFavorite) {
        await this._callService("favorites_remove", {
          uri,
          service: attrs.source || "",
        });
      } else {
        await this._callService("favorites_add", {
          uri,
          title: attrs.media_title || "",
          service: attrs.source || "",
        });
      }
      console.debug("[volumio-panel] Favorite service call completed");
      setTimeout(() => this._checkFavorite(), 500);
    } catch (err) {
      console.error("[volumio-panel] Favorite toggle failed:", err);
      this._isFavorite = wasFavorite;
    }
  }

  // ── Keyboard Shortcuts ────────────────────────────────────

  _onKeyDown(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (!this.isConnected) return;

    const entity = this._getEntity();
    if (!entity) return;

    switch (e.key) {
      case " ":
        e.preventDefault();
        this._onCommand({ detail: { command: "play_pause" } });
        break;
      case "ArrowRight":
        if (e.shiftKey) {
          e.preventDefault();
          this._onCommand({ detail: { command: "next" } });
        } else {
          e.preventDefault();
          const pos = (entity.attributes?.media_position || 0) + 10;
          this._onCommand({ detail: { command: "seek", value: pos } });
        }
        break;
      case "ArrowLeft":
        if (e.shiftKey) {
          e.preventDefault();
          this._onCommand({ detail: { command: "prev" } });
        } else {
          e.preventDefault();
          const pos2 = Math.max(0, (entity.attributes?.media_position || 0) - 10);
          this._onCommand({ detail: { command: "seek", value: pos2 } });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        {
          const vol = Math.min(100, Math.round((entity.attributes?.volume_level || 0) * 100) + 2);
          this._onCommand({ detail: { command: "volume_set", value: vol } });
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        {
          const vol2 = Math.max(0, Math.round((entity.attributes?.volume_level || 0) * 100) - 2);
          this._onCommand({ detail: { command: "volume_set", value: vol2 } });
        }
        break;
      case "m":
      case "M":
        this._onCommand({ detail: { command: "mute_toggle" } });
        break;
      case "s":
      case "S":
        this._onCommand({ detail: { command: "shuffle_set", value: !entity.attributes?.shuffle } });
        break;
      case "r":
      case "R":
        {
          const current = entity.attributes?.repeat || "off";
          const next = current === "off" ? "all" : current === "all" ? "one" : "off";
          this._onCommand({ detail: { command: "repeat_set", value: next } });
        }
        break;
      case "/":
        e.preventDefault();
        this.shadowRoot?.querySelector("volumio-top-bar")
          ?.shadowRoot?.querySelector(".search-field input")
          ?.focus();
        break;
      case "Escape":
        this._showNavFlyout = false;
        break;
    }
  }
}

customElements.define("volumio-panel", VolumioPanel);
