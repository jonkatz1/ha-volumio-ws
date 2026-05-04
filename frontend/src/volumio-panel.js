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
import "./components/browse-source-grid.js";
import "./components/browse-list.js";
import "./components/album-detail.js";
import "./components/artist-detail.js";
import "./components/search-results.js";
import "./components/breadcrumb-bar.js";

console.info("[volumio-panel] Build T18-fix10 loaded at", new Date().toISOString());

// Map Volumio service names to display labels
const SERVICE_DISPLAY = {
  mpd: "Local",
  qobuz: "Qobuz",
  tidal: "TIDAL",
  spotify: "Spotify",
  spop: "Spotify",
  webradio: "Radio",
  pandora: "Pandora",
  youtube: "YouTube",
  youtube2: "YouTube",
  ytmusic: "YouTube Music",
};

function serviceLabel(service) {
  if (!service) return "";
  return SERVICE_DISPLAY[service] || service.charAt(0).toUpperCase() + service.slice(1);
}

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
      // Browse state
      _browseStack: { type: Array, state: true },
      _browseItems: { type: Array, state: true },
      _browseLoading: { type: Boolean, state: true },
      _browseContext: { type: Object, state: true },
      // Search state
      _searchResults: { type: Object, state: true },
      _searchLoading: { type: Boolean, state: true },
      _searchQuery: { type: String, state: true },
      _searchTrail: { type: Array, state: true },
      // Real browse sources from Volumio
      _browseSources: { type: Array, state: true },
      _activeSourceUri: { type: String, state: true },
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
          overflow-y: auto;
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

        /* ── Queue panel ─────────────────────────── */
        .queue-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .queue-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
          gap: 8px;
          flex-shrink: 0;
        }

        .queue-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--primary-text-color);
        }

        .queue-count {
          font-size: 12px;
          color: var(--secondary-text-color);
          flex: 1;
        }

        .queue-clear-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--secondary-text-color);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .queue-clear-btn:hover {
          background: var(--divider-color, rgba(255, 255, 255, 0.08));
          color: var(--primary-text-color);
        }

        .queue-clear-btn ha-icon {
          --mdc-icon-size: 18px;
        }

        .queue-list {
          overflow-y: auto;
          flex: 1;
        }

        .queue-empty {
          padding: 32px 16px;
          text-align: center;
          color: var(--secondary-text-color);
          font-size: 14px;
        }

        .queue-item {
          display: flex;
          align-items: center;
          padding: 6px 16px;
          gap: 10px;
          cursor: pointer;
          transition: background 0.1s;
        }

        .queue-item:hover {
          background: var(--divider-color, rgba(255, 255, 255, 0.06));
        }

        .queue-item.playing {
          border-left: 3px solid var(--primary-color, #03a9f4);
        }

        .queue-item.playing .qi-title {
          color: var(--primary-color, #03a9f4);
        }

        .qi-art {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--card-background-color, #2a2a2a);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qi-art img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .qi-art ha-icon {
          --mdc-icon-size: 18px;
          color: var(--secondary-text-color);
          opacity: 0.4;
        }

        .qi-info {
          flex: 1;
          min-width: 0;
        }

        .qi-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--primary-text-color);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .qi-artist {
          font-size: 12px;
          color: var(--secondary-text-color);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .qi-eq {
          --mdc-icon-size: 16px;
          color: var(--primary-color, #03a9f4);
          flex-shrink: 0;
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
    // Browse state
    this._browseStack = [];
    this._browseItems = [];
    this._browseLoading = false;
    this._browseContext = null; // metadata context for album/artist detail
    // Search state
    this._searchResults = null;
    this._searchLoading = false;
    this._searchQuery = "";
    this._searchTrail = []; // [{title, uri}] — navigation chain from search
    this._browseSources = [];
    this._activeSourceUri = "";
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
    if (changedProps.has("_activeView")) {
      console.debug("[volumio-panel] View changed:", this._activeView, "searchTrail:", this._searchTrail, "searchQuery:", this._searchQuery);
    }
    if (changedProps.has("hass") && this.hass) {
      this._resolveIds();
      if (!this._queueUnsub) {
        this._subscribeQueue();
      }
      // Fetch real browse sources once we have a config entry
      if (this._configEntryId && this._browseSources.length === 0) {
        this._fetchBrowseSources();
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
    const volumioUrl = this.panel?.config?.volumio_url || "";

    const navSources = this._getNavSources();

    return html`
      <div class="shell">
        <volumio-top-bar
          active-view="${this._activeView}"
          .breadcrumb=${[]}
          ?narrow=${this.narrow}
          ?show-back-button=${this._browseStack.length > 0 || this._activeView === "album-detail" || this._activeView === "artist-detail" || !!this._searchQuery}
          @volumio-navigate=${this._onNavigate}
          @volumio-toggle-nav=${this._onToggleNav}
          @volumio-toggle-queue=${this._onToggleQueue}
          @volumio-back=${this._onBack}
          @volumio-search=${this._onSearch}
          @volumio-search-clear=${this._onSearchClear}
        ></volumio-top-bar>

        <div class="content-area">
          ${this._renderLeftZone(navSources)}

          <div class="center-zone">
            ${this._activeView === "browse" && this._browseStack.length > 0 ? html`
              <volumio-breadcrumb-bar
                .trail=${this._browseStack}
                @volumio-breadcrumb-click=${this._onBreadcrumbClick}
              ></volumio-breadcrumb-bar>
            ` : ""}
            ${this._searchTrail.length > 0 && (this._activeView === "album-detail" || this._activeView === "artist-detail") ? html`
              <volumio-breadcrumb-bar
                .trail=${this._searchTrail}
                @volumio-breadcrumb-click=${this._onSearchBreadcrumbClick}
              ></volumio-breadcrumb-bar>
            ` : ""}
            ${this._activeView === "album-detail" || this._activeView === "artist-detail"
              ? this._renderCenterContent(entity, attrs, state, qualityInfo, artUrl)
              : this._searchQuery
                ? this._renderSearchView(attrs, volumioUrl)
                : this._renderCenterContent(entity, attrs, state, qualityInfo, artUrl)}
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
            active-source="${this._activeSourceUri}"
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
          active-source="${this._activeSourceUri}"
          @volumio-navigate=${this._onNavigate}
          @volumio-nav-pin=${this._onNavPin}
        ></volumio-left-nav>
      </div>
    `;
  }

  _renderRightZone() {
    if (!this._showQueue) return html``;

    const entity = this._getEntity();
    const attrs = entity?.attributes || {};
    const currentPosition = attrs.queue_position ?? -1;
    const volumioUrl = this.panel?.config?.volumio_url || "";

    return html`
      <div class="right-zone pinned">
        <div class="queue-panel">
          <div class="queue-header">
            <span class="queue-title">Queue</span>
            <span class="queue-count">${this._queue.length} track${this._queue.length !== 1 ? "s" : ""}</span>
            <button class="queue-clear-btn" @click=${this._onQueueClear} title="Clear queue">
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </div>
          <div class="queue-list">
            ${this._queue.length === 0
              ? html`<div class="queue-empty">Queue is empty</div>`
              : this._queue.map((item, i) => html`
                <div
                  class="queue-item ${i === currentPosition ? "playing" : ""}"
                  @click=${() => this._onQueueItemClick(i)}
                >
                  <div class="qi-art">
                    ${item.albumart
                      ? html`<img src="${resolveArt(item.albumart, volumioUrl)}" alt="" loading="lazy" />`
                      : html`<ha-icon icon="mdi:music-note"></ha-icon>`}
                  </div>
                  <div class="qi-info">
                    <div class="qi-title">${item.name || item.title || "—"}</div>
                    <div class="qi-artist">${item.artist || ""}</div>
                  </div>
                  ${i === currentPosition ? html`<ha-icon class="qi-eq" icon="mdi:equalizer"></ha-icon>` : ""}
                </div>
              `)}
          </div>
        </div>
      </div>
    `;
  }

  _renderCenterContent(entity, attrs, state, qualityInfo, artUrl) {
    const volumioUrl = this.panel?.config?.volumio_url || "";

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
        return this._renderBrowseView(attrs, volumioUrl);
      case "album-detail":
        return this._renderAlbumDetail(attrs, volumioUrl);
      case "artist-detail":
        return this._renderArtistDetail(volumioUrl);
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

  _renderBrowseView(attrs, volumioUrl) {
    // If no browse stack, show source grid
    if (this._browseStack.length === 0) {
      return html`
        <volumio-browse-source-grid
          .sources=${this._browseSources}
          volumio-url="${volumioUrl}"
          @volumio-source-select=${this._onSourceSelect}
        ></volumio-browse-source-grid>
      `;
    }

    // Show browse list for current level
    return html`
      <volumio-browse-list
        .items=${this._browseItems}
        ?loading=${this._browseLoading}
        current-uri="${attrs.uri || ""}"
        volumio-url="${volumioUrl}"
        @volumio-item-click=${this._onBrowseItemClick}
        @volumio-item-play=${this._onBrowseItemPlay}
        @volumio-item-add-queue=${this._onAddItemToQueue}
        @volumio-card-add-queue=${this._onAddItemToQueue}
      ></volumio-browse-list>
    `;
  }

  _renderAlbumDetail(attrs, volumioUrl) {
    const ctx = this._browseContext || {};
    return html`
      <volumio-album-detail
        album-title="${ctx.title || ""}"
        album-artist="${ctx.artist || ""}"
        album-art="${ctx.albumart || ""}"
        album-uri="${ctx.uri || ""}"
        album-service="${ctx.service || ""}"
        .tracks=${this._browseItems}
        ?loading=${this._browseLoading}
        current-uri="${attrs.uri || ""}"
        volumio-url="${volumioUrl}"
        @volumio-track-click=${this._onTrackPlay}
        @volumio-track-add-queue=${this._onAddItemToQueue}
        @volumio-album-play=${this._onAlbumPlay}
        @volumio-album-add-queue=${this._onAlbumAddQueue}
        @volumio-navigate=${this._onNavigate}
      ></volumio-album-detail>
    `;
  }

  _renderArtistDetail(volumioUrl) {
    const ctx = this._browseContext || {};
    return html`
      <volumio-artist-detail
        artist-name="${ctx.artist || ctx.title || ""}"
        .items=${this._browseItems}
        ?loading=${this._browseLoading}
        volumio-url="${volumioUrl}"
        @volumio-card-click=${this._onBrowseItemClick}
        @volumio-card-play=${this._onBrowseItemPlay}
        @volumio-card-add-queue=${this._onAddItemToQueue}
      ></volumio-artist-detail>
    `;
  }

  _renderSearchView(attrs, volumioUrl) {
    return html`
      <volumio-search-results
        .results=${this._searchResults}
        ?loading=${this._searchLoading}
        query="${this._searchQuery}"
        volumio-url="${volumioUrl}"
        current-uri="${attrs.uri || ""}"
        @volumio-card-click=${this._onBrowseItemClick}
        @volumio-card-play=${this._onBrowseItemPlay}
        @volumio-card-add-queue=${this._onAddItemToQueue}
        @volumio-track-click=${this._onTrackPlay}
        @volumio-track-add-queue=${this._onAddItemToQueue}
      ></volumio-search-results>
    `;
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
    const { view, source, sourceUri, artist, album, pluginName } = e.detail || {};
    if (!view) return;

    switch (view) {
      case "browse":
        this._activeView = "browse";
        this._showNavFlyout = false;
        this._searchTrail = [];
        // Clear search when explicitly going to browse
        this._searchQuery = "";
        this._searchResults = null;
        // If source is specified, browse into it
        if (sourceUri) {
          this._activeSourceUri = sourceUri || "";
          this._browseStack = [];
          this._browseTo(sourceUri, source || "Browse");
        } else if (this._browseStack.length === 0) {
          // Reset to source grid
          this._activeSourceUri = "";
          this._browseItems = [];
        }
        break;

      case "album-detail":
        // Navigate to album detail — context should be set by caller
        this._activeView = "album-detail";
        this._showNavFlyout = false;
        break;

      case "artist-detail":
        this._activeView = "artist-detail";
        this._showNavFlyout = false;
        if (artist) {
          this._browseContext = { artist, title: artist };
          // Try browsing with globalUriArtist pattern
          const artistUri = `globalUriArtist/${encodeURIComponent(artist)}`;
          this._browseToArtist(artistUri, artist);
        }
        break;

      default:
        this._activeView = view;
        this._showNavFlyout = false;
        this._searchQuery = "";
        this._searchResults = null;
        this._searchTrail = [];
        break;
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
    if (this._searchTrail.length > 0 && (this._activeView === "album-detail" || this._activeView === "artist-detail")) {
      // Pop the search trail
      if (this._searchTrail.length > 1) {
        // Go back one level in the search trail
        this._searchTrail = this._searchTrail.slice(0, -1);
        const prev = this._searchTrail[this._searchTrail.length - 1];
        if (prev.view === "artist-detail") {
          this._activeView = "artist-detail";
          this._browseContext = prev;
          this._browseToArtist(prev.uri, prev.title);
        } else {
          // Back to search results
          this._activeView = "browse";
          this._searchTrail = [];
        }
      } else {
        // Back to search results
        this._activeView = "browse";
        this._searchTrail = [];
      }
      return;
    }
    if (this._searchQuery) {
      this._searchQuery = "";
      this._searchResults = null;
      this._searchTrail = [];
      return;
    }
    if (this._activeView === "album-detail" || this._activeView === "artist-detail") {
      // Go back to browse view
      this._activeView = "browse";
      return;
    }
    if (this._browseStack.length > 1) {
      // Pop the browse stack and re-browse the parent
      this._browseStack = this._browseStack.slice(0, -1);
      const parent = this._browseStack[this._browseStack.length - 1];
      this._loadBrowseItems(parent.uri);
    } else if (this._browseStack.length === 1) {
      // Back to source grid
      this._browseStack = [];
      this._browseItems = [];
      this._activeSourceUri = "";
    } else if (this._activeView !== "now-playing") {
      this._activeView = "now-playing";
    }
  }

  // ── Browse Methods ────────────────────────────────────────

  async _fetchBrowseSources() {
    if (!this._configEntryId) return;
    try {
      const result = await this._callService("get_browse_sources", {});
      const sources = result?.response?.sources || [];
      if (sources.length > 0) {
        this._browseSources = sources;
        console.debug("[volumio-panel] Browse sources loaded:", sources.length, sources.map(s => `${s.name} → ${s.uri}`));
      }
    } catch (err) {
      console.warn("[volumio-panel] get_browse_sources failed:", err.message);
    }
  }

  _getNavSources() {
    // Use real browse sources if available, fall back to entity source_list
    if (this._browseSources.length > 0) {
      return this._browseSources;
    }
    const entity = this._getEntity();
    const sourceList = entity?.attributes?.source_list || [];
    return sourceList.map(name => ({
      name,
      plugin_name: name.toLowerCase().replace(/\s+/g, ""),
      plugin_type: "music_service",
      uri: "",
      albumart: "",
    }));
  }

  async _browseTo(uri, title) {
    this._browseStack = [...this._browseStack, { uri, title }];
    await this._loadBrowseItems(uri);
  }

  async _browseToArtist(uri, name) {
    this._browseLoading = true;
    try {
      const result = await this._callService("browse", { uri });
      const nav = result?.response?.navigation || result?.navigation || {};
      const lists = nav.lists || [];
      const items = [];
      for (const list of lists) {
        if (list.items) items.push(...list.items);
      }
      this._browseItems = items;
    } catch (err) {
      console.error("[volumio-panel] Artist browse failed:", err);
      this._browseItems = [];
    }
    this._browseLoading = false;
  }

  async _loadBrowseItems(uri) {
    if (!this._configEntryId) return;
    this._browseLoading = true;
    this._browseItems = [];

    try {
      const result = await this._callService("browse", { uri });
      const nav = result?.response?.navigation || result?.navigation || {};
      const lists = nav.lists || [];
      const items = [];
      for (const list of lists) {
        if (list.items) items.push(...list.items);
      }
      this._browseItems = items;
      console.debug("[volumio-panel] Browse loaded:", uri, items.length, "items");
      if (items.length > 0) {
        console.debug("[volumio-panel] First item keys:", Object.keys(items[0]), "data:", JSON.stringify(items[0]).substring(0, 300));
      }
    } catch (err) {
      console.error("[volumio-panel] Browse failed:", err);
      this._browseItems = [];
    }
    this._browseLoading = false;
  }

  _onSourceSelect(e) {
    const { uri, name, plugin_name } = e.detail;
    this._activeSourceUri = uri || "";
    this._browseStack = [];
    this._browseTo(uri, name);
  }

  _onBrowseItemClick(e) {
    const item = e.detail;
    const type = item.type || "folder";
    console.debug("[volumio-panel] Item clicked:", type, item.title, item.uri);

    // Playable types → play directly
    const playable = new Set(["song", "track", "webradio", "mywebradio", "cuesong"]);
    if (playable.has(type)) {
      this._onTrackPlay(e);
      return;
    }

    // Album type → album detail view
    if (type === "album") {
      // Build search trail if coming from search or already in search-originated navigation
      if (this._searchQuery || this._searchTrail.length > 0) {
        const trail = this._searchTrail.length > 0
          ? [...this._searchTrail]
          : [{ title: `Search "${this._searchQuery}"`, uri: "__search__", view: "search" }];
        // Add source segment if this is the first item after search and has a service
        if (trail.length === 1 && item.service) {
          trail.push({ title: serviceLabel(item.service), uri: "__source__", view: "source" });
        }
        trail.push({ title: item.title, uri: item.uri, view: "album-detail", service: item.service || "" });
        this._searchTrail = trail;
      }
      console.debug("[volumio-panel] Album detail: searchTrail=", this._searchTrail);
      this._browseContext = {
        title: item.title,
        artist: item.artist || "",
        albumart: item.albumart || "",
        uri: item.uri,
        service: item.service || "",
      };
      this._activeView = "album-detail";
      this._loadBrowseItems(item.uri);
      return;
    }

    // Artist type → artist detail view
    if (type === "artist") {
      if (this._searchQuery || this._searchTrail.length > 0) {
        const trail = this._searchTrail.length > 0
          ? [...this._searchTrail]
          : [{ title: `Search "${this._searchQuery}"`, uri: "__search__", view: "search" }];
        // Add source segment if this is the first item after search and has a service
        if (trail.length === 1 && item.service) {
          trail.push({ title: serviceLabel(item.service), uri: "__source__", view: "source" });
        }
        trail.push({ title: item.title, uri: item.uri, view: "artist-detail", service: item.service || "" });
        this._searchTrail = trail;
      }
      this._browseContext = {
        title: item.title,
        artist: item.title || "",
        uri: item.uri,
        service: item.service || "",
      };
      this._activeView = "artist-detail";
      this._browseToArtist(item.uri, item.title);
      return;
    }

    // Folder/category → browse deeper
    if (this._searchTrail.length === 0) {
      this._searchQuery = "";
      this._searchResults = null;
    }
    this._browseTo(item.uri, item.title || "Browse");
  }

  async _onBrowseItemPlay(e) {
    const item = e.detail;
    try {
      // Clear queue, add item, and play — replaceAndPlay pattern
      await this._callService("queue_clear", {});
      await this._callService("queue_add", {
        uri: item.uri,
        title: item.title || "",
        service: item.service || "",
        artist: item.artist || "",
        albumart: item.albumart || "",
      });
      await this._callService("queue_play_index", { index: 0 });
      console.debug("[volumio-panel] Playing:", item.title);
    } catch (err) {
      console.error("[volumio-panel] Play failed:", err);
    }
  }

  async _onTrackPlay(e) {
    const item = e.detail;
    try {
      // Clear queue, add track, and play
      await this._callService("queue_clear", {});
      await this._callService("queue_add", {
        uri: item.uri,
        title: item.title || "",
        service: item.service || "",
        artist: item.artist || "",
        album: item.album || "",
        albumart: item.albumart || "",
      });
      await this._callService("queue_play_index", { index: 0 });
      console.debug("[volumio-panel] Playing track:", item.title);
    } catch (err) {
      console.error("[volumio-panel] Track play failed:", err);
    }
  }

  async _onAlbumPlay(e) {
    const { uri } = e.detail;
    try {
      // Use HA play_media which does clearQueue → addToQueue → play(0)
      await this.hass.callService("media_player", "play_media", {
        entity_id: this._entityId,
        media_content_id: uri,
        media_content_type: "music",
      });
      console.debug("[volumio-panel] Playing album:", uri);
    } catch (err) {
      console.error("[volumio-panel] Album play failed:", err);
    }
  }

  async _onAlbumAddQueue(e) {
    const { uri } = e.detail;
    try {
      await this._callService("queue_add", { uri });
      console.debug("[volumio-panel] Added album to queue:", uri);
    } catch (err) {
      console.error("[volumio-panel] Album queue add failed:", err);
    }
  }

  async _onQueueItemClick(index) {
    try {
      await this._callService("queue_play_index", { index });
      console.debug("[volumio-panel] Playing queue index:", index);
    } catch (err) {
      console.error("[volumio-panel] Queue play index failed:", err);
    }
  }

  async _onQueueClear() {
    try {
      await this._callService("queue_clear", {});
      console.debug("[volumio-panel] Queue cleared");
    } catch (err) {
      console.error("[volumio-panel] Queue clear failed:", err);
    }
  }

  async _onAddItemToQueue(e) {
    const item = e.detail;
    try {
      await this._callService("queue_add", {
        uri: item.uri,
        title: item.title || "",
        service: item.service || "",
        artist: item.artist || "",
        album: item.album || "",
        albumart: item.albumart || "",
      });
      console.debug("[volumio-panel] Added to queue:", item.title);
    } catch (err) {
      console.error("[volumio-panel] Add to queue failed:", err);
    }
  }

  _onBreadcrumbClick(e) {
    const { index } = e.detail;
    // Pop back to the clicked breadcrumb level
    this._browseStack = this._browseStack.slice(0, index + 1);
    const current = this._browseStack[this._browseStack.length - 1];
    if (this._activeView !== "browse") {
      this._activeView = "browse";
    }
    this._loadBrowseItems(current.uri);
  }

  // ── Search Methods ────────────────────────────────────────

  async _onSearch(e) {
    const { query } = e.detail;
    if (!query || query.length < 2) return;
    if (!this._configEntryId) return;

    this._searchQuery = query;
    this._searchLoading = true;
    this._searchResults = null;
    this._searchTrail = [];
    // If in detail view, go back to browse so search overlay shows
    if (this._activeView === "album-detail" || this._activeView === "artist-detail") {
      this._activeView = "browse";
    }

    try {
      const result = await this._callService("search", { query });
      this._searchResults = result?.response || result || null;
      console.debug("[volumio-panel] Search results:", query, this._searchResults);
    } catch (err) {
      console.error("[volumio-panel] Search failed:", err);
      this._searchResults = null;
    }
    this._searchLoading = false;
  }

  _onSearchClear() {
    this._searchQuery = "";
    this._searchResults = null;
    this._searchLoading = false;
    this._searchTrail = [];
  }

  _onSearchBreadcrumbClick(e) {
    const { index } = e.detail;
    const seg = this._searchTrail[index];
    if (!seg) return;

    if (seg.view === "search" || index === 0) {
      // Go back to search results
      this._activeView = "browse";
      this._searchTrail = [];
    } else if (seg.view === "artist-detail") {
      // Navigate to that artist
      this._searchTrail = this._searchTrail.slice(0, index + 1);
      this._browseContext = { title: seg.title, artist: seg.title, uri: seg.uri, service: seg.service || "" };
      this._activeView = "artist-detail";
      this._browseToArtist(seg.uri, seg.title);
    } else if (seg.view === "album-detail") {
      // Navigate to that album
      this._searchTrail = this._searchTrail.slice(0, index + 1);
      this._activeView = "album-detail";
      this._loadBrowseItems(seg.uri);
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
        if (this._searchQuery) {
          this._onSearchClear();
        }
        this._showNavFlyout = false;
        break;
    }
  }
}

customElements.define("volumio-panel", VolumioPanel);
