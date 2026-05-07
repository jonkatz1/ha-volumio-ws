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
import { HAAdapter } from "./adapters/ha-adapter.js";
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
import "./components/context-menu.js";
import "./components/toast-notification.js";
import "./components/playlist-list.js";
import "./components/playlist-detail.js";
import "./components/favorites-view.js";
import "./components/history-view.js";
import "./components/settings-panel.js";

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

class VolumioPanel extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      route: { type: Object },
      panel: { type: Object },
      // Internal state
      _queue: { type: Array, state: true },
      _activeView: { type: String, state: true },
      _navMode: { type: String, state: true },
      _showQueue: { type: Boolean, state: true },
      _showNavFlyout: { type: Boolean, state: true },
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
      // Multi-device (issue #38)
      _devices: { type: Array, state: true },
      _activeDeviceId: { type: String, state: true },
      // Context menu state
      _ctxOpen: { type: Boolean, state: true },
      _ctxX: { type: Number, state: true },
      _ctxY: { type: Number, state: true },
      _ctxItems: { type: Array, state: true },
      _ctxTarget: { type: Object, state: true },
      _ctxPlaylists: { type: Array, state: true },
      // Toast state
      _toastMessage: { type: String, state: true },
      _toastOpen: { type: Boolean, state: true },
      _toastUndo: { type: String, state: true },
      _toastUndoData: { type: Object, state: true },
      // Queue panel state
      _queueConfirmClear: { type: Boolean, state: true },
      _queueSaveOpen: { type: Boolean, state: true },
      _queueSaveName: { type: String, state: true },
      _dragIndex: { type: Number, state: true },
      _dragOverIndex: { type: Number, state: true },
      // Playlist state
      _playlistItems: { type: Array, state: true },
      _playlistDetailItems: { type: Array, state: true },
      _playlistDetailContext: { type: Object, state: true },
      _playlistLoading: { type: Boolean, state: true },
      // Favorites state
      _favoritesItems: { type: Array, state: true },
      _favoritesLoading: { type: Boolean, state: true },
      // History state
      _history: { type: Array, state: true },
      // Settings state
      _settingClickAction: { type: String, state: true },
      _settingQueueThumbnails: { type: Boolean, state: true },
      _settingBrowseViewMode: { type: String, state: true },
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

        /* ── Queue drag handle ───────────────────── */
        .qi-drag {
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
          color: var(--secondary-text-color);
          opacity: 0;
          transition: opacity 0.1s;
          flex-shrink: 0;
          touch-action: none;
        }
        .qi-drag:active { cursor: grabbing; }
        .queue-item:hover .qi-drag { opacity: 0.6; }
        .qi-drag ha-icon { --mdc-icon-size: 14px; }

        .queue-item.dragging {
          opacity: 0.4;
          background: var(--divider-color, rgba(255, 255, 255, 0.04));
        }

        .queue-item.drag-over-above {
          border-top: 2px solid var(--primary-color, #03a9f4);
        }
        .queue-item.drag-over-below {
          border-bottom: 2px solid var(--primary-color, #03a9f4);
        }

        /* ── Queue remove button ─────────────────── */
        .qi-remove {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--secondary-text-color);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          opacity: 0;
          transition: opacity 0.1s, background 0.1s;
          flex-shrink: 0;
        }
        .queue-item:hover .qi-remove { opacity: 1; }
        .qi-remove:hover {
          background: var(--divider-color, rgba(255, 255, 255, 0.08));
          color: var(--error-color, #f44336);
        }
        .qi-remove ha-icon { --mdc-icon-size: 14px; }

        /* ── Queue header actions ─────────────────── */
        .queue-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ── Confirmation bar ─────────────────────── */
        .confirm-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          background: var(--card-background-color, #2a2a2a);
          border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
          font-size: 13px;
          color: var(--primary-text-color);
        }
        .confirm-bar .confirm-btns {
          display: flex;
          gap: 8px;
        }
        .confirm-bar button {
          padding: 4px 12px;
          border-radius: 4px;
          border: none;
          font-size: 12px;
          cursor: pointer;
        }
        .confirm-bar .btn-yes {
          background: var(--error-color, #f44336);
          color: #fff;
        }
        .confirm-bar .btn-no {
          background: var(--divider-color, rgba(255, 255, 255, 0.12));
          color: var(--primary-text-color);
        }

        /* ── Save as playlist dialog ──────────────── */
        .save-dialog {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
        }
        .save-dialog input {
          flex: 1;
          padding: 6px 10px;
          border-radius: 4px;
          border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
          background: transparent;
          color: var(--primary-text-color);
          font-size: 13px;
          outline: none;
        }
        .save-dialog input:focus {
          border-color: var(--primary-color, #03a9f4);
        }
        .save-dialog button {
          padding: 6px 12px;
          border-radius: 4px;
          border: none;
          font-size: 12px;
          cursor: pointer;
          background: var(--primary-color, #03a9f4);
          color: #fff;
        }

        /* ── Queue empty state ────────────────────── */
        .queue-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 16px;
          text-align: center;
          gap: 12px;
          color: var(--secondary-text-color);
          font-size: 13px;
        }
        .queue-empty-state ha-icon {
          --mdc-icon-size: 32px;
          opacity: 0.3;
        }
        .queue-empty-state .browse-btn {
          padding: 6px 16px;
          border-radius: 16px;
          border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
          background: transparent;
          color: var(--primary-text-color);
          font-size: 12px;
          cursor: pointer;
          margin-top: 4px;
        }
        .queue-empty-state .browse-btn:hover {
          background: var(--divider-color, rgba(255, 255, 255, 0.08));
        }

        /* ── Equalizer animation ──────────────────── */
        @keyframes eq-bar1 { 0%,100%{height:3px} 50%{height:12px} }
        @keyframes eq-bar2 { 0%,100%{height:8px} 50%{height:4px} }
        @keyframes eq-bar3 { 0%,100%{height:5px} 50%{height:11px} }
        .eq-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 14px;
          flex-shrink: 0;
        }
        .eq-bars span {
          width: 3px;
          background: var(--primary-color, #03a9f4);
          border-radius: 1px;
        }
        .eq-bars span:nth-child(1) { animation: eq-bar1 0.8s ease-in-out infinite; }
        .eq-bars span:nth-child(2) { animation: eq-bar2 0.6s ease-in-out infinite 0.1s; }
        .eq-bars span:nth-child(3) { animation: eq-bar3 0.7s ease-in-out infinite 0.2s; }

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
    this._adapter = new HAAdapter();
    this._adapterConnected = false;
    this._queue = [];
    this._activeView = "now-playing";
    this._navMode = "collapsed";
    this._showQueue = false;
    this._showNavFlyout = false;
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
    // Multi-device (issue #38)
    this._devices = [];
    this._activeDeviceId = "";
    // Context menu state
    this._ctxOpen = false;
    this._ctxX = 0;
    this._ctxY = 0;
    this._ctxItems = [];
    this._ctxTarget = null;
    this._ctxPlaylists = [];
    // Toast state
    this._toastMessage = "";
    this._toastOpen = false;
    this._toastUndo = null;
    this._toastUndoData = null;
    // Queue panel state
    this._queueConfirmClear = false;
    this._queueSaveOpen = false;
    this._queueSaveName = "";
    this._dragIndex = -1;
    this._dragOverIndex = -1;
    // Playlist state
    this._playlistItems = [];
    this._playlistDetailItems = [];
    this._playlistDetailContext = null;
    this._playlistLoading = false;
    // Favorites state
    this._favoritesItems = [];
    this._favoritesLoading = false;
    // History state — corrupt-data resilient (issue #40)
    try {
      const parsed = JSON.parse(localStorage.getItem("volumio-ws-history") || "[]");
      this._history = Array.isArray(parsed) ? parsed : [];
    } catch {
      this._history = [];
    }
    // Settings state
    this._settingClickAction = localStorage.getItem("volumio-default-click") || "play_now";
    this._settingQueueThumbnails = localStorage.getItem("volumio-queue-thumbnails") !== "false";
    this._settingBrowseViewMode = localStorage.getItem("volumio-browse-view-mode") || "grid";
  }

  connectedCallback() {
    super.connectedCallback();
    this._applyBreakpoint();
    window.addEventListener("resize", this._onResize);
    window.addEventListener("keydown", this._keyHandler);
    // Queue subscription via adapter
    this._adapter.onQueueChange((queue) => {
      this._queue = (queue || []).filter(Boolean);
    });
    // Device list / active device updates from adapter (issue #38)
    this._adapter.onDevicesChange(({ devices, activeId }) => {
      const previousId = this._activeDeviceId;
      const nextId = activeId || "";
      this._devices = devices;
      this._activeDeviceId = nextId;
      if (nextId && previousId && previousId !== nextId) {
        // Switched between devices
        this._onActiveDeviceSwitched();
      } else if (nextId && !previousId && this._adapter.ready) {
        // First device became active on initial load — kick off the
        // initial source fetch directly rather than waiting for the
        // next incidental hass change to trip updated().
        if (this._browseSources.length === 0) {
          this._fetchBrowseSources();
        }
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._adapter.disconnect();
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

  willUpdate(changedProps) {
    // Fire on either hass OR panel changes — Lit does not guarantee the
    // assignment order of reactive properties, so panel may arrive after
    // hass. Adapter must see late panel arrivals to resolve configEntryId.
    if (
      this.hass &&
      (changedProps.has("hass") || changedProps.has("panel"))
    ) {
      if (!this._adapterConnected) {
        this._adapter.connect({ hass: this.hass, panel: this.panel });
        this._adapterConnected = true;
      } else {
        this._adapter.updateHass(this.hass, this.panel);
      }
    }
  }

  updated(changedProps) {
    // Side effects need to run on either hass OR panel changes since
    // either one may flip _adapter.ready to true.
    if (
      this.hass &&
      (changedProps.has("hass") || changedProps.has("panel"))
    ) {
      // Fetch real browse sources once adapter is ready
      if (this._adapter.ready && this._browseSources.length === 0) {
        this._fetchBrowseSources();
      }

      // Track URI changes for favorite detection
      const state = this._adapter.getState();
      const uri = state.uri || null;
      if (uri !== this._lastUri) {
        this._lastUri = uri;
        if (uri && this._adapter.ready) {
          this._checkFavorite();
          this._recordHistory(state);
        } else {
          this._isFavorite = false;
        }
      }
    }
  }

  // ── Adapter Delegates ──────────────────────────────────────

  /** Call a volumio_ws service via adapter. */
  async _callService(service, data = {}) {
    return await this._adapter.call(service, data);
  }

  _getQualityInfo() {
    const state = this._adapter.getState();
    if (state.state === "unavailable") return null;

    const inputs = {
      trackType: state.trackType,
      samplerate: state.samplerate,
      bitdepth: state.bitdepth,
      bitrate: state.bitrate,
      isStream: state._raw?.media_content_type === "channel",
    };

    return detectQuality(inputs);
  }

  // ── Render ────────────────────────────────────────────────

  render() {
    const s = this._adapter.getState();
    const qualityInfo = this._getQualityInfo();
    const artUrl = resolveArt(s.albumArt, "");
    const volumioUrl = this._adapter.getVolumioUrl();

    const navSources = this._getNavSources();

    return html`
      <div class="shell"
        @volumio-context-menu=${this._onContextMenuRequest}
        @volumio-playlist-select=${this._onPlaylistSelect}
        @volumio-playlist-create=${this._onPlaylistCreate}
        @volumio-playlist-play=${this._onPlaylistPlay}
        @volumio-playlist-enqueue=${this._onPlaylistEnqueue}
        @volumio-playlist-delete=${this._onPlaylistDelete}
        @volumio-playlist-remove-track=${this._onPlaylistRemoveTrack}
        @volumio-history-clear=${this._onHistoryClear}
        @volumio-setting-change=${this._onSettingChange}
      >
        <volumio-top-bar
          active-view="${this._activeView}"
          .breadcrumb=${[]}
          ?narrow=${this.narrow}
          ?show-back-button=${this._browseStack.length > 0 || this._activeView === "album-detail" || this._activeView === "artist-detail" || this._activeView === "playlist-detail" || !!this._searchQuery}
          .devices=${this._devices}
          active-device-id="${this._activeDeviceId}"
          @volumio-navigate=${this._onNavigate}
          @volumio-toggle-nav=${this._onToggleNav}
          @volumio-toggle-queue=${this._onToggleQueue}
          @volumio-back=${this._onBack}
          @volumio-search=${this._onSearch}
          @volumio-search-clear=${this._onSearchClear}
          @volumio-device-change=${this._onDeviceChange}
        ></volumio-top-bar>

        <div class="content-area">
          ${this._renderLeftZone(navSources)}

          <div class="center-zone">
            ${this._searchTrail.length > 0 && (this._activeView === "album-detail" || this._activeView === "artist-detail")
              ? html`
                  <volumio-breadcrumb-bar
                    .trail=${this._searchTrail}
                    @volumio-breadcrumb-click=${this._onSearchBreadcrumbClick}
                  ></volumio-breadcrumb-bar>
                `
              : (this._browseStack.length > 0 &&
                 (this._activeView === "browse" ||
                  this._activeView === "album-detail" ||
                  this._activeView === "artist-detail"))
                ? html`
                    <volumio-breadcrumb-bar
                      .trail=${this._browseStack}
                      @volumio-breadcrumb-click=${this._onBreadcrumbClick}
                    ></volumio-breadcrumb-bar>
                  `
                : ""}
            ${this._activeView === "album-detail" || this._activeView === "artist-detail"
              ? this._renderCenterContent(s, qualityInfo, artUrl)
              : this._searchQuery
                ? this._renderSearchView(s, volumioUrl)
                : this._renderCenterContent(s, qualityInfo, artUrl)}
          </div>

          ${this._renderRightZone()}
        </div>

        <volumio-player-bar
          player-state="${s.state}"
          title="${s.title}"
          artist="${s.artist}"
          album-art="${artUrl}"
          .duration=${s.duration}
          .position=${s.position}
          position-updated-at="${s.positionUpdatedAt}"
          .volume=${s.volume}
          ?muted=${s.muted}
          ?shuffle=${s.shuffle}
          repeat="${s.repeat}"
          .quality=${qualityInfo}
          source="${s.source}"
          .volumeEnabled=${s.volumeEnabled}
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

      <volumio-context-menu
        ?open=${this._ctxOpen}
        .x=${this._ctxX}
        .y=${this._ctxY}
        .items=${this._ctxItems}
        .submenuItems=${this._ctxPlaylists}
        @volumio-context-action=${this._onContextAction}
        @volumio-context-close=${() => { this._ctxOpen = false; }}
      ></volumio-context-menu>

      <volumio-toast-notification
        ?open=${this._toastOpen}
        message="${this._toastMessage}"
        undo-action="${this._toastUndo || ""}"
        @volumio-toast-undo=${this._onToastUndo}
        @volumio-toast-dismiss=${() => { this._toastOpen = false; }}
      ></volumio-toast-notification>
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

    const s = this._adapter.getState();
    const currentPosition = s.queuePosition;
    const volumioUrl = this._adapter.getVolumioUrl();

    return html`
      <div class="right-zone pinned">
        <div class="queue-panel">
          <div class="queue-header">
            <span class="queue-title">Queue</span>
            <span class="queue-count">${this._queue.length} track${this._queue.length !== 1 ? "s" : ""}</span>
            <div class="queue-actions">
              <button class="queue-clear-btn" @click=${this._onQueueSaveStart} title="Save as playlist">
                <ha-icon icon="mdi:content-save-outline"></ha-icon>
              </button>
              <button class="queue-clear-btn" @click=${this._onQueueClearClick} title="Clear queue">
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          </div>
          ${this._queueConfirmClear ? html`
            <div class="confirm-bar">
              <span>Clear queue?</span>
              <div class="confirm-btns">
                <button class="btn-yes" @click=${this._onQueueClear}>Yes</button>
                <button class="btn-no" @click=${() => { this._queueConfirmClear = false; }}>No</button>
              </div>
            </div>
          ` : ""}
          ${this._queueSaveOpen ? html`
            <div class="save-dialog">
              <input
                type="text"
                placeholder="Playlist name"
                .value=${this._queueSaveName}
                @input=${(e) => { this._queueSaveName = e.target.value; }}
                @keydown=${(e) => { if (e.key === "Enter") this._onQueueSaveConfirm(); if (e.key === "Escape") this._queueSaveOpen = false; }}
              />
              <button @click=${this._onQueueSaveConfirm}>Save</button>
            </div>
          ` : ""}
          <div class="queue-list">
            ${this._queue.length === 0
              ? html`
                <div class="queue-empty-state">
                  <ha-icon icon="mdi:playlist-music-outline"></ha-icon>
                  <div>Queue is empty</div>
                  <div>Browse for music to start playing.</div>
                  <button class="browse-btn" @click=${() => this._onNavigate({ detail: { view: "browse" } })}>Browse</button>
                </div>`
              : this._queue.map((item, i) => {
                if (!item) return "";
                return html`
                <div
                  class="queue-item ${i === currentPosition ? "playing" : ""} ${i === this._dragIndex ? "dragging" : ""} ${i === this._dragOverIndex ? (this._dragIndex < i ? "drag-over-below" : "drag-over-above") : ""}"
                  @click=${() => this._onQueueItemClick(i)}
                  @contextmenu=${(e) => this._onQueueContextMenu(e, item, i)}
                >
                  <div class="qi-drag"
                    @pointerdown=${(e) => this._onDragStart(e, i)}
                  >
                    <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
                  </div>
                  ${this._settingQueueThumbnails ? html`
                    <div class="qi-art">
                      ${item.albumart
                        ? html`<img src="${resolveArt(item.albumart, volumioUrl)}" alt="" loading="lazy" />`
                        : html`<ha-icon icon="mdi:music-note"></ha-icon>`}
                    </div>
                  ` : ""}
                  <div class="qi-info">
                    <div class="qi-title">${item.name || item.title || "—"}</div>
                    <div class="qi-artist">${item.artist || ""}</div>
                  </div>
                  ${i === currentPosition
                    ? html`<div class="eq-bars"><span></span><span></span><span></span></div>`
                    : ""}
                  <button class="qi-remove" @click=${(e) => this._onQueueRemove(e, i)} title="Remove">
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>
              `;
              })}
          </div>
        </div>
      </div>
    `;
  }

  _renderCenterContent(s, qualityInfo, artUrl) {
    const volumioUrl = this._adapter.getVolumioUrl();

    switch (this._activeView) {
      case "now-playing":
        return html`
          <volumio-now-playing
            player-state="${s.state}"
            title="${s.title}"
            artist="${s.artist}"
            album="${s.album}"
            album-art="${artUrl}"
            .quality=${qualityInfo}
            source="${s.source}"
            .isFavorite=${this._isFavorite}
            @volumio-command=${this._onCommand}
            @volumio-navigate=${this._onNavigate}
            @volumio-toggle-favorite=${this._onToggleFavorite}
          ></volumio-now-playing>
        `;
      case "browse":
        return this._renderBrowseView(s, volumioUrl);
      case "album-detail":
        return this._renderAlbumDetail(s, volumioUrl);
      case "artist-detail":
        return this._renderArtistDetail(volumioUrl);
      case "playlists":
        return this._renderPlaylistList();
      case "playlist-detail":
        return this._renderPlaylistDetail();
      case "favorites":
        return this._renderFavorites();
      case "history":
        return this._renderHistory();
      case "settings":
        return this._renderSettings();
      default:
        return this._renderPlaceholder("", "mdi:help-circle", `Unknown view: ${this._activeView}`);
    }
  }

  _renderBrowseView(s, volumioUrl) {
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
        current-uri="${s.uri}"
        volumio-url="${volumioUrl}"
        @volumio-item-click=${this._onBrowseItemClick}
        @volumio-item-play=${this._onBrowseItemPlay}
      ></volumio-browse-list>
    `;
  }

  _renderAlbumDetail(s, volumioUrl) {
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
        current-uri="${s.uri}"
        volumio-url="${volumioUrl}"
        @volumio-track-click=${this._onTrackPlay}
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
      ></volumio-artist-detail>
    `;
  }

  _renderSearchView(s, volumioUrl) {
    return html`
      <volumio-search-results
        .results=${this._searchResults}
        ?loading=${this._searchLoading}
        query="${this._searchQuery}"
        volumio-url="${volumioUrl}"
        current-uri="${s.uri}"
        @volumio-card-click=${this._onBrowseItemClick}
        @volumio-card-play=${this._onBrowseItemPlay}
        @volumio-track-click=${this._onTrackPlay}
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

  _renderPlaylistList() {
    return html`
      <volumio-playlist-list
        .playlists=${this._playlistItems}
        ?loading=${this._playlistLoading}
      ></volumio-playlist-list>
    `;
  }

  _renderPlaylistDetail() {
    const ctx = this._playlistDetailContext || {};
    const s = this._adapter.getState();
    const volumioUrl = this._adapter.getVolumioUrl();
    return html`
      <volumio-playlist-detail
        playlist-name="${ctx.name || ""}"
        playlist-uri="${ctx.uri || ""}"
        .tracks=${this._playlistDetailItems}
        ?loading=${this._playlistLoading}
        current-uri="${s.uri}"
        volumio-url="${volumioUrl}"
        @volumio-track-click=${this._onTrackPlay}
      ></volumio-playlist-detail>
    `;
  }

  _renderFavorites() {
    const s = this._adapter.getState();
    const volumioUrl = this._adapter.getVolumioUrl();
    return html`
      <volumio-favorites-view
        .items=${this._favoritesItems}
        ?loading=${this._favoritesLoading}
        current-uri="${s.uri}"
        volumio-url="${volumioUrl}"
        @volumio-track-click=${this._onTrackPlay}
      ></volumio-favorites-view>
    `;
  }

  _renderHistory() {
    const s = this._adapter.getState();
    const volumioUrl = this._adapter.getVolumioUrl();
    return html`
      <volumio-history-view
        .history=${this._history}
        current-uri="${s.uri}"
        volumio-url="${volumioUrl}"
        @volumio-track-click=${this._onTrackPlay}
      ></volumio-history-view>
    `;
  }

  _renderSettings() {
    return html`
      <volumio-settings-panel
        click-action="${this._settingClickAction}"
        ?queue-thumbnails=${this._settingQueueThumbnails}
        browse-view-mode="${this._settingBrowseViewMode}"
        .aboutInfo=${{
          volumioUrl: this._adapter.getVolumioUrl(),
          entityId: this._adapter.entityId,
        }}
      ></volumio-settings-panel>
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

      case "playlists":
        this._activeView = "playlists";
        this._showNavFlyout = false;
        this._searchQuery = "";
        this._searchResults = null;
        this._searchTrail = [];
        this._loadPlaylists();
        break;

      case "favorites":
        this._activeView = "favorites";
        this._showNavFlyout = false;
        this._searchQuery = "";
        this._searchResults = null;
        this._searchTrail = [];
        this._loadFavorites();
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
    if (this._activeView === "playlist-detail") {
      this._activeView = "playlists";
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

  // ── Multi-device (issue #38) ──────────────────────────────

  async _onDeviceChange(e) {
    const configEntryId = e?.detail?.config_entry_id;
    if (!configEntryId) return;
    if (configEntryId === this._activeDeviceId) return;
    // Adapter handles unsubscribe/resubscribe and fires onDevicesChange,
    // which our listener picks up to call _onActiveDeviceSwitched().
    await this._adapter.setDevice(configEntryId);
  }

  /**
   * Reset per-device state when the active Volumio device changes.
   * UI prefs (nav mode, queue panel visibility, settings) are kept;
   * everything that reflects what's on the device is cleared so the
   * panel doesn't show stale data from the previous device.
   */
  _onActiveDeviceSwitched() {
    // Browse / search
    this._browseStack = [];
    this._browseItems = [];
    this._browseLoading = false;
    this._browseContext = null;
    this._browseSources = [];
    this._activeSourceUri = "";
    this._searchResults = null;
    this._searchLoading = false;
    this._searchQuery = "";
    this._searchTrail = [];
    // Playlists / favorites views
    this._playlistItems = [];
    this._playlistDetailItems = [];
    this._playlistDetailContext = null;
    this._playlistLoading = false;
    this._favoritesItems = [];
    this._favoritesLoading = false;
    this._favoritesCache = [];
    // Now-playing favorite indicator
    this._isFavorite = false;
    this._lastUri = null;
    // Queue UI state
    this._queue = [];
    this._queueConfirmClear = false;
    this._queueSaveOpen = false;
    this._queueSaveName = "";
    this._dragIndex = -1;
    this._dragOverIndex = -1;
    // Context menu / toast
    this._ctxOpen = false;
    this._ctxItems = [];
    this._ctxTarget = null;
    this._ctxPlaylists = [];
    this._toastOpen = false;
    this._toastMessage = "";
    this._toastUndo = null;
    this._toastUndoData = null;
    // Land on Now Playing for the new device
    this._activeView = "now-playing";
    // Re-fetch sources for the new device
    if (this._adapter.ready) {
      this._fetchBrowseSources();
    }
  }

  // ── Browse Methods ────────────────────────────────────────

  async _fetchBrowseSources() {
    if (!this._adapter.ready) return;
    try {
      const result = await this._callService("get_browse_sources", {});
      const sources = result?.response?.sources || [];
      if (sources.length > 0) {
        this._browseSources = sources;
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
    const s = this._adapter.getState();
    const sourceList = s._raw?.source_list || [];
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
    if (!this._adapter.ready) return;
    this._browseLoading = true;
    this._browseItems = [];

    try {
      const result = await this._callService("browse", { uri });
      const nav = result?.response?.navigation || result?.navigation || {};
      const info = nav.info || null;
      const lists = nav.lists || [];
      const items = [];
      for (const list of lists) {
        if (list.items) items.push(...list.items);
      }
      this._browseItems = items;

      // Promote to album-detail when the response describes an album.
      // Detection: info.type === "album" (mpd canonical) OR info has an
      // album+artist pair and the body is a track list (qobuz returns
      // info.type:"song" for an album URI but populates info.album).
      const looksLikeAlbum =
        !!info &&
        (info.type === "album" ||
          (!!info.album &&
            !!info.artist &&
            items.length > 0 &&
            items.every((it) => it && it.type === "song")));
      if (looksLikeAlbum) {
        // Resolve info.albumart against volumio_url. The album-detail
        // component renders <img src="${albumArt}"> directly — for raw
        // /albumart?... paths we must produce an absolute URL.
        const volumioUrl = this._adapter.getVolumioUrl();
        this._browseContext = {
          title: info.title || info.album || "",
          artist: info.artist || "",
          albumart: resolveArt(info.albumart || "", volumioUrl),
          uri: info.uri || uri,
          service: info.service || "",
        };
        this._activeView = "album-detail";
      }
    } catch (err) {
      console.error("[volumio-panel] Browse failed:", err);
      this._browseItems = [];
    }
    this._browseLoading = false;
  }

  // ── Playlist Methods ────────────────────────────────────────

  async _loadPlaylists() {
    if (!this._adapter.ready) return;
    this._playlistLoading = true;
    try {
      const result = await this._callService("browse", { uri: "playlists" });
      const nav = result?.response?.navigation || result?.navigation || {};
      const lists = nav.lists || [];
      const items = [];
      for (const list of lists) {
        if (list.items) items.push(...list.items);
      }
      this._playlistItems = items;
    } catch (err) {
      console.error("[volumio-panel] Load playlists failed:", err);
      this._playlistItems = [];
    }
    this._playlistLoading = false;
  }

  async _loadPlaylistDetail(uri) {
    if (!this._adapter.ready) return;
    this._playlistLoading = true;
    this._playlistDetailItems = [];
    try {
      const result = await this._callService("browse", { uri });
      const nav = result?.response?.navigation || result?.navigation || {};
      const lists = nav.lists || [];
      const items = [];
      for (const list of lists) {
        if (list.items) items.push(...list.items);
      }
      this._playlistDetailItems = items;
    } catch (err) {
      console.error("[volumio-panel] Load playlist detail failed:", err);
      this._playlistDetailItems = [];
    }
    this._playlistLoading = false;
  }

  // ── Playlist Event Handlers ─────────────────────────────────

  _onPlaylistSelect(e) {
    const { name, uri } = e.detail;
    this._playlistDetailContext = { name, uri };
    this._activeView = "playlist-detail";
    this._loadPlaylistDetail(uri);
  }

  async _onPlaylistCreate(e) {
    const { name } = e.detail;
    try {
      await this._callService("playlist_create", { name });
      this._showToast(`Playlist "${name}" created`);
      this._loadPlaylists();
    } catch (err) {
      console.error("[volumio-panel] Create playlist failed:", err);
      this._showToast("Failed to create playlist");
    }
  }

  async _onPlaylistPlay(e) {
    const { name } = e.detail;
    try {
      await this._callService("playlist_play", { name });
      this._refreshQueue();
    } catch (err) {
      console.error("[volumio-panel] Play playlist failed:", err);
    }
  }

  async _onPlaylistEnqueue(e) {
    const { name } = e.detail;
    try {
      await this._callService("playlist_enqueue", { name });
      this._refreshQueue();
      this._showToast(`Playlist "${name}" added to queue`);
    } catch (err) {
      console.error("[volumio-panel] Enqueue playlist failed:", err);
    }
  }

  async _onPlaylistDelete(e) {
    const { name } = e.detail;
    try {
      await this._callService("playlist_delete", { name });
      this._showToast(`Playlist "${name}" deleted`);
      // If we're on the detail view of the deleted playlist, go back
      if (this._activeView === "playlist-detail" && this._playlistDetailContext?.name === name) {
        this._activeView = "playlists";
      }
      this._loadPlaylists();
    } catch (err) {
      console.error("[volumio-panel] Delete playlist failed:", err);
      this._showToast("Failed to delete playlist");
    }
  }

  async _onPlaylistRemoveTrack(e) {
    const { playlistName, uri, service } = e.detail;
    try {
      await this._callService("playlist_remove_track", {
        name: playlistName,
        uri,
        service: service || undefined,
      });
      this._showToast("Track removed from playlist");
      // Refresh the playlist detail
      if (this._playlistDetailContext?.uri) {
        this._loadPlaylistDetail(this._playlistDetailContext.uri);
      }
    } catch (err) {
      console.error("[volumio-panel] Remove track from playlist failed:", err);
      this._showToast("Failed to remove track");
    }
  }

  // ── Favorites Methods ───────────────────────────────────────

  async _loadFavorites() {
    if (!this._adapter.ready) return;
    this._favoritesLoading = true;
    try {
      const result = await this._adapter.call("favorites_list");
      const items = result?.response?.items || [];
      this._favoritesItems = items;
      this._favoritesCache = items;
    } catch (err) {
      console.error("[volumio-panel] Load favorites failed:", err);
      this._favoritesItems = [];
    }
    this._favoritesLoading = false;
  }

  // ── History Methods ─────────────────────────────────────────

  _recordHistory(state) {
    if (!state.title || state.state === "unavailable") return;
    const now = Date.now();
    let history = [...this._history];

    // Dedup: if same URI within 60s, update timestamp instead of adding
    const recent = history[0];
    if (recent && recent.uri === state.uri && (now - recent.timestamp) < 60000) {
      history[0] = { ...recent, timestamp: now };
    } else {
      const entry = {
        uri: state.uri,
        title: state.title,
        artist: state.artist,
        album: state.album,
        // HA media_player_proxy URL — same-origin, works without browser
        // having to reach Volumio:3000 directly. Persists for the HA
        // session; if it expires the @error handler falls back to the
        // music-note icon via :empty::after.
        albumart: state.albumArt || "",
        service: state.source,
        trackType: state.trackType,
        samplerate: state.samplerate,
        bitdepth: state.bitdepth,
        timestamp: now,
      };
      history.unshift(entry);
    }

    // Cap at 500
    if (history.length > 500) {
      history = history.slice(0, 500);
    }

    this._history = history;
    try {
      localStorage.setItem("volumio-ws-history", JSON.stringify(history));
    } catch (err) {
      // localStorage may be full — trim and retry
      history = history.slice(0, 250);
      this._history = history;
      localStorage.setItem("volumio-ws-history", JSON.stringify(history));
    }
  }

  _onHistoryClear() {
    this._history = [];
    localStorage.removeItem("volumio-ws-history");
    this._showToast("History cleared");
  }

  // ── Settings Methods ────────────────────────────────────────

  _onSettingChange(e) {
    const { key, value } = e.detail;
    switch (key) {
      case "clickAction":
        this._settingClickAction = value;
        localStorage.setItem("volumio-default-click", value);
        break;
      case "queueThumbnails":
        this._settingQueueThumbnails = value;
        localStorage.setItem("volumio-queue-thumbnails", String(value));
        break;
      case "browseViewMode":
        this._settingBrowseViewMode = value;
        localStorage.setItem("volumio-browse-view-mode", value);
        break;
    }
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
      await this._callService("replace_and_play", {
        uri: item.uri,
        title: item.title || "",
        service: item.service || "",
        artist: item.artist || "",
        albumart: item.albumart || "",
      });
      this._refreshQueue();
    } catch (err) {
      console.error("[volumio-panel] Play failed:", err);
    }
  }

  async _onTrackPlay(e) {
    const item = e.detail;
    const action = this._getDefaultClickAction();
    try {
      if (action === "add_to_queue") {
        await this._callService("queue_add", {
          uri: item.uri,
          title: item.title || "",
          service: item.service || "",
          artist: item.artist || "",
          album: item.album || "",
          albumart: item.albumart || "",
        });
        this._refreshQueue();
        this._showToast("Added to queue");
      } else {
        await this._callService("replace_and_play", {
          uri: item.uri,
          title: item.title || "",
          service: item.service || "",
          artist: item.artist || "",
          album: item.album || "",
          albumart: item.albumart || "",
          type: item.type || "song",
        });
        this._refreshQueue();
      }
    } catch (err) {
      console.error("[volumio-panel] Track play failed:", err);
    }
  }

  async _onAlbumPlay(e) {
    const { uri } = e.detail;
    try {
      await this._callService("replace_and_play", {
        uri,
        service: this._browseContext?.service || "",
      });
      this._refreshQueue();
    } catch (err) {
      console.error("[volumio-panel] Album play failed:", err);
    }
  }

  async _onAlbumAddQueue(e) {
    const { uri } = e.detail;
    // Volumio's addToQueue does NOT expand an album URI into its tracks
    // (replaceAndPlay does, but that clears the queue first — destructive).
    // We have the album's tracks already loaded in _browseItems thanks to
    // the album-detail flow, so enqueue each one individually.
    const tracks = (this._browseItems || []).filter(
      (it) => it && (it.type === "song" || it.type === "track")
    );
    if (tracks.length === 0) {
      // Fallback: best-effort single-URI add (works for mpd local files).
      try {
        await this._callService("queue_add", { uri });
        this._refreshQueue();
        this._showToast("Added to queue");
      } catch (err) {
        console.error("[volumio-panel] Album queue add failed:", err);
        this._showToast("Failed to add album");
      }
      return;
    }
    try {
      for (const t of tracks) {
        await this._callService("queue_add", {
          uri: t.uri,
          title: t.title || "",
          service: t.service || this._browseContext?.service || "",
          artist: t.artist || "",
          album: t.album || this._browseContext?.title || "",
          albumart: t.albumart || "",
        });
      }
      this._refreshQueue();
      this._showToast(`Added ${tracks.length} track${tracks.length === 1 ? "" : "s"} to queue`);
    } catch (err) {
      console.error("[volumio-panel] Album queue add failed:", err);
      this._showToast("Failed to add album");
    }
  }

  async _onQueueItemClick(index) {
    try {
      await this._callService("queue_play_index", { index });
    } catch (err) {
      console.error("[volumio-panel] Queue play index failed:", err);
    }
  }

  _onQueueClearClick() {
    this._queueConfirmClear = true;
  }

  async _onQueueClear() {
    this._queueConfirmClear = false;
    const s = this._adapter.getState();
    const wasPlaying = s.state === "playing" || s.state === "paused";

    try {
      if (wasPlaying && s.uri) {
        // Keep current track: clear then re-add and resume
        const currentTrack = {
          uri: s.uri,
          title: s.title,
          artist: s.artist,
          album: s.album,
          service: s.source,
        };
        await this._callService("queue_clear", {});
        await this._callService("replace_and_play", currentTrack);
      } else {
        await this._callService("queue_clear", {});
      }
      this._refreshQueue();
      this._showToast("Queue cleared");
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
      this._refreshQueue();
      this._showToast("Added to queue");
    } catch (err) {
      console.error("[volumio-panel] Add to queue failed:", err);
    }
  }

  /** Fetch queue via service call and force Lit re-render with new reference. */
  async _refreshQueue() {
    if (!this._adapter.ready) return;
    try {
      const result = await this._adapter.call("queue_get");
      if (result?.response?.queue) {
        this._queue = result.response.queue.filter(Boolean);
      }
    } catch (err) {
      // Silent — pushQueue subscription is the primary source
    }
  }

  // ── Queue Item Actions ──────────────────────────────────────

  async _onQueueRemove(e, index) {
    e.stopPropagation();
    const removed = this._queue[index];
    try {
      await this._callService("queue_remove", { index });
      this._refreshQueue();
      this._showToast("Removed from queue", "undo_queue_remove");
      this._toastUndoData = { item: removed, index };
    } catch (err) {
      console.error("[volumio-panel] Queue remove failed:", err);
    }
  }

  _onQueueContextMenu(e, item, index) {
    e.preventDefault();
    e.stopPropagation();
    this._ctxTarget = { ...item, index, context: "queue" };
    this._ctxItems = this._buildContextItems("queue");
    this._ctxX = e.clientX;
    this._ctxY = e.clientY;
    this._ctxOpen = true;
  }

  _onQueueSaveStart() {
    if (this._queue.length === 0) return;
    this._queueSaveName = "";
    this._queueSaveOpen = true;
    // Focus input after render
    this.updateComplete.then(() => {
      const input = this.shadowRoot?.querySelector(".save-dialog input");
      if (input) input.focus();
    });
  }

  async _onQueueSaveConfirm() {
    const name = this._queueSaveName.trim();
    if (!name) return;
    this._queueSaveOpen = false;
    try {
      await this._callService("save_queue_to_playlist", { name });
      this._showToast(`Saved as playlist "${name}"`);
    } catch (err) {
      console.error("[volumio-panel] Save playlist failed:", err);
      this._showToast("Failed to save playlist");
    }
  }

  // ── Drag and Drop ───────────────────────────────────────────

  _onDragStart(e, index) {
    e.preventDefault();
    e.stopPropagation();
    this._dragIndex = index;
    this._dragOverIndex = -1;

    const onMove = (ev) => {
      const listEl = this.shadowRoot?.querySelector(".queue-list");
      if (!listEl) return;
      const items = listEl.querySelectorAll(".queue-item");
      let closest = -1;
      let minDist = Infinity;
      items.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs((ev.clientY || ev.touches?.[0]?.clientY || 0) - mid);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      if (closest !== this._dragOverIndex) {
        this._dragOverIndex = closest;
      }
    };

    const onEnd = async () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onEnd);
      document.removeEventListener("pointercancel", onEnd);

      const from = this._dragIndex;
      const to = this._dragOverIndex;
      this._dragIndex = -1;
      this._dragOverIndex = -1;

      if (from >= 0 && to >= 0 && from !== to) {
        try {
          await this._callService("queue_move", { from_index: from, to_index: to });
          this._refreshQueue();
        } catch (err) {
          console.error("[volumio-panel] Queue move failed:", err);
        }
      }
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onEnd);
    document.addEventListener("pointercancel", onEnd);
  }

  // ── Context Menu ────────────────────────────────────────────

  async _onContextMenuRequest(e) {
    e.stopPropagation();
    const detail = e.detail;
    this._ctxTarget = detail;
    this._ctxItems = this._buildContextItems(detail.context || "track");
    this._ctxX = detail.x;
    this._ctxY = detail.y;
    // Open menu immediately so it never appears unresponsive even if the
    // playlist_list call is slow or hangs (Volumio's pushListPlaylist
    // doesn't always come back after rapid queue mutations). Submenu
    // populates when the fetch completes.
    this._ctxOpen = true;

    // Fetch playlists for submenu (background, non-blocking)
    try {
      const result = await this._callService("playlist_list", {});
      const playlists = result?.response?.playlists || [];
      this._ctxPlaylists = playlists.map(name => ({ key: name, label: name }));
    } catch {
      this._ctxPlaylists = [];
    }
  }

  _buildContextItems(context) {
    const items = [];

    if (context === "album") {
      items.push({ key: "play", label: "Play", icon: "mdi:play" });
      items.push({ key: "play_next", label: "Play Next", icon: "mdi:skip-next" });
      items.push({ key: "add_to_queue", label: "Add to Queue", icon: "mdi:playlist-plus" });
      items.push({ separator: true });
      items.push({ key: "add_to_favorites", label: "Add to Favorites", icon: "mdi:heart-outline" });
      items.push({ key: "add_to_playlist", label: "Add to Playlist", icon: "mdi:playlist-music", submenu: true });
      items.push({ separator: true });
      items.push({ key: "go_to_album", label: "Go to Album", icon: "mdi:album" });
      items.push({ key: "go_to_artist", label: "Go to Artist", icon: "mdi:account-music" });
    } else if (context === "queue") {
      items.push({ key: "play", label: "Play Now", icon: "mdi:play" });
      items.push({ key: "play_next", label: "Play Next", icon: "mdi:skip-next" });
      items.push({ key: "add_to_queue", label: "Add to Queue", icon: "mdi:playlist-plus" });
      items.push({ separator: true });
      items.push({ key: "add_to_favorites", label: "Add to Favorites", icon: "mdi:heart-outline" });
      items.push({ key: "add_to_playlist", label: "Add to Playlist", icon: "mdi:playlist-music", submenu: true });
      items.push({ separator: true });
      items.push({ key: "go_to_album", label: "Go to Album", icon: "mdi:album" });
      items.push({ key: "go_to_artist", label: "Go to Artist", icon: "mdi:account-music" });
      items.push({ separator: true });
      items.push({ key: "remove", label: "Remove", icon: "mdi:close" });
    } else if (context === "playlist") {
      items.push({ key: "play", label: "Play", icon: "mdi:play" });
      items.push({ key: "enqueue", label: "Enqueue", icon: "mdi:playlist-plus" });
      items.push({ separator: true });
      items.push({ key: "delete_playlist", label: "Delete Playlist", icon: "mdi:delete-outline" });
    } else if (context === "favorite") {
      items.push({ key: "play", label: "Play Now", icon: "mdi:play" });
      items.push({ key: "add_to_queue", label: "Add to Queue", icon: "mdi:playlist-plus" });
      items.push({ separator: true });
      items.push({ key: "remove_favorite", label: "Remove from Favorites", icon: "mdi:heart-off" });
      items.push({ separator: true });
      items.push({ key: "go_to_album", label: "Go to Album", icon: "mdi:album" });
      items.push({ key: "go_to_artist", label: "Go to Artist", icon: "mdi:account-music" });
    } else if (context === "history") {
      items.push({ key: "play", label: "Play Now", icon: "mdi:play" });
      items.push({ key: "add_to_queue", label: "Add to Queue", icon: "mdi:playlist-plus" });
      items.push({ separator: true });
      items.push({ key: "add_to_favorites", label: "Add to Favorites", icon: "mdi:heart-outline" });
      items.push({ key: "add_to_playlist", label: "Add to Playlist", icon: "mdi:playlist-music", submenu: true });
      items.push({ separator: true });
      items.push({ key: "go_to_album", label: "Go to Album", icon: "mdi:album" });
      items.push({ key: "go_to_artist", label: "Go to Artist", icon: "mdi:account-music" });
    } else {
      // track context (browse, album detail, search)
      items.push({ key: "play", label: "Play Now", icon: "mdi:play" });
      items.push({ key: "play_next", label: "Play Next", icon: "mdi:skip-next" });
      items.push({ key: "add_to_queue", label: "Add to Queue", icon: "mdi:playlist-plus" });
      items.push({ separator: true });
      items.push({ key: "add_to_favorites", label: "Add to Favorites", icon: "mdi:heart-outline" });
      items.push({ key: "add_to_playlist", label: "Add to Playlist", icon: "mdi:playlist-music", submenu: true });
      items.push({ separator: true });
      items.push({ key: "go_to_album", label: "Go to Album", icon: "mdi:album" });
      items.push({ key: "go_to_artist", label: "Go to Artist", icon: "mdi:account-music" });
    }

    return items;
  }

  async _onContextAction(e) {
    const { action, playlist } = e.detail;
    const item = this._ctxTarget;
    if (!item) return;

    try {
      switch (action) {
        case "play":
          if (item.context === "playlist" && item.title) {
            await this._callService("playlist_play", { name: item.title });
            this._refreshQueue();
          } else if (item.context === "queue" && item.index != null) {
            await this._callService("queue_play_index", { index: item.index });
          } else {
            await this._callService("replace_and_play", {
              uri: item.uri,
              title: item.title || "",
              service: item.service || "",
              artist: item.artist || "",
              album: item.album || "",
              albumart: item.albumart || "",
              type: item.type || "song",
            });
            this._refreshQueue();
          }
          break;

        case "play_next": {
          // Determine the tracks to insert. For an album context, expand
          // from the loaded _browseItems (Volumio's addToQueue does not
          // expand album URIs); for a single track context, just the one.
          const isAlbum = item.context === "album" || item.type === "album";
          const tracks = isAlbum
            ? (this._browseItems || []).filter((it) => it && (it.type === "song" || it.type === "track"))
            : [item];
          if (tracks.length === 0) break;

          const currentPos = this._adapter.getState().queuePosition ?? -1;
          const startIdx = this._queue.length; // first new track lands here
          for (const t of tracks) {
            await this._callService("queue_add", {
              uri: t.uri,
              title: t.title || "",
              service: t.service || this._browseContext?.service || "",
              artist: t.artist || "",
              album: t.album || (isAlbum ? this._browseContext?.title : "") || "",
              albumart: t.albumart || "",
            });
          }
          // Move each newly-added track to right after the current track,
          // preserving order. After moving the first, indices shift.
          let target = currentPos + 1;
          for (let i = 0; i < tracks.length; i++) {
            // The next un-moved track sits at: startIdx + i (Volumio
            // appends; earlier moves don't change indices >= startIdx + i).
            const from = startIdx + i;
            if (from > target) {
              await this._callService("queue_move", { from_index: from, to_index: target });
            }
            target += 1;
          }
          this._refreshQueue();
          this._showToast(tracks.length === 1 ? "Playing next" : `Queued ${tracks.length} tracks next`);
          break;
        }

        case "add_to_queue":
          await this._callService("queue_add", {
            uri: item.uri,
            title: item.title || "",
            service: item.service || "",
            artist: item.artist || "",
            album: item.album || "",
            albumart: item.albumart || "",
          });
          this._refreshQueue();
          this._showToast("Added to queue");
          break;

        case "add_to_favorites":
          await this._callService("favorites_add", {
            uri: item.uri,
            title: item.title || "",
            service: item.service || "",
          });
          this._showToast("Added to favorites");
          break;

        case "add_to_playlist":
          if (playlist === "__new__") {
            const name = prompt("New playlist name:");
            if (name) {
              await this._callService("playlist_create", { name });
              await this._callService("playlist_add_track", {
                name,
                uri: item.uri,
                service: item.service || "",
              });
              this._showToast(`Added to "${name}"`);
            }
          } else if (playlist) {
            await this._callService("playlist_add_track", {
              name: playlist,
              uri: item.uri,
              service: item.service || "",
            });
            this._showToast(`Added to "${playlist}"`);
          }
          break;

        case "go_to_album":
          if (item.album || item.title) {
            // For mpd local files, the album is reachable via
            // albums://<artist>/<album>. Use that when we have artist+album.
            // For services (qobuz/tidal/etc.) we don't have a reliable
            // album URI — leave the track list empty and just show the
            // album header. Avoids the "single track" bug where we'd
            // browse the track URI itself and get one item back.
            let albumUri = "";
            if (item.service === "mpd" && item.artist && item.album) {
              albumUri = `albums://${encodeURIComponent(item.artist)}/${encodeURIComponent(item.album)}`;
            }
            this._browseContext = {
              title: item.album || item.title,
              artist: item.artist || "",
              albumart: item.albumart || "",
              uri: albumUri,
              service: item.service || "",
            };
            this._browseItems = [];
            this._activeView = "album-detail";
            if (albumUri) {
              this._loadBrowseItems(albumUri);
            }
          }
          break;

        case "go_to_artist":
          if (item.artist) {
            const artistUri = `globalUriArtist/${encodeURIComponent(item.artist)}`;
            this._browseContext = {
              title: item.artist,
              artist: item.artist,
              uri: artistUri,
              service: item.service || "",
            };
            this._activeView = "artist-detail";
            this._browseToArtist(artistUri, item.artist);
          }
          break;

        case "remove":
          if (item.context === "queue" && item.index != null) {
            await this._callService("queue_remove", { index: item.index });
            this._refreshQueue();
            this._showToast("Removed from queue", "undo_queue_remove");
            this._toastUndoData = { item, index: item.index };
          }
          break;

        case "enqueue":
          if (item.type === "playlist" && item.title) {
            await this._callService("playlist_enqueue", { name: item.title });
            this._refreshQueue();
            this._showToast(`Playlist "${item.title}" added to queue`);
          }
          break;

        case "delete_playlist":
          if (item.title) {
            await this._callService("playlist_delete", { name: item.title });
            this._showToast(`Playlist "${item.title}" deleted`);
            if (this._activeView === "playlists") {
              this._loadPlaylists();
            }
          }
          break;

        case "remove_favorite":
          await this._callService("favorites_remove", {
            uri: item.uri,
            service: item.service || undefined,
          });
          this._showToast("Removed from favorites");
          // Refresh favorites if on that view
          if (this._activeView === "favorites") {
            this._loadFavorites();
          }
          // Also refresh the favorite heart state
          setTimeout(() => this._checkFavorite(), 500);
          break;
      }
    } catch (err) {
      console.error("[volumio-panel] Context action failed:", err);
      this._showToast("Action failed");
    }
  }

  // ── Toast ───────────────────────────────────────────────────

  _showToast(message, undoAction = null) {
    this._toastMessage = message;
    this._toastUndo = undoAction;
    this._toastOpen = true;
  }

  async _onToastUndo(e) {
    const { action } = e.detail;
    if (action === "undo_queue_remove" && this._toastUndoData) {
      const { item, index } = this._toastUndoData;
      try {
        await this._callService("queue_add", {
          uri: item.uri,
          title: item.title || item.name || "",
          service: item.service || "",
          artist: item.artist || "",
          album: item.album || "",
          albumart: item.albumart || "",
        });
        // Try to move it back to original position
        const newLast = this._queue.length;
        if (index < newLast) {
          await this._callService("queue_move", { from_index: newLast, to_index: index });
        }
        this._refreshQueue();
      } catch (err) {
        console.error("[volumio-panel] Undo failed:", err);
      }
    }
    this._toastUndoData = null;
  }

  // ── Default Click Action ────────────────────────────────────

  _getDefaultClickAction() {
    return this._settingClickAction;
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
    if (!this._adapter.ready) return;

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
    const s = this._adapter.getState();
    if (s.state === "unavailable") return;

    try {
      switch (command) {
        case "play_pause":
          await this._adapter.playPause();
          break;
        case "next":
          await this._adapter.next();
          break;
        case "prev":
          await this._adapter.prev();
          break;
        case "seek":
          await this._adapter.seek(value);
          break;
        case "volume_set":
          await this._adapter.setVolume(value);
          break;
        case "mute_toggle":
          await this._adapter.toggleMute();
          break;
        case "shuffle_set":
          await this._adapter.setShuffle(value);
          break;
        case "repeat_set":
          await this._adapter.setRepeat(value);
          break;
        default:
          console.warn("[volumio-panel] Unknown command:", command);
      }
    } catch (err) {
      console.error("[volumio-panel] Command failed:", command, err);
    }
  }

  async _checkFavorite() {
    if (!this._adapter.ready) return;
    try {
      const result = await this._adapter.call("favorites_list");
      const items = result?.response?.items || [];
      this._favoritesCache = items;
      const s = this._adapter.getState();
      this._isFavorite = !!(s.uri && items.some((it) => it?.uri === s.uri));
    } catch (err) {
      console.error("[volumio-panel] favorites_list failed:", err);
    }
  }

  async _onToggleFavorite() {
    const s = this._adapter.getState();
    if (!this._adapter.ready || !s.uri) return;

    const wasFavorite = this._isFavorite;
    this._isFavorite = !wasFavorite;

    try {
      if (wasFavorite) {
        await this._callService("favorites_remove", {
          uri: s.uri,
          service: s.source,
        });
      } else {
        await this._callService("favorites_add", {
          uri: s.uri,
          title: s.title,
          service: s.source,
        });
      }
      setTimeout(() => this._checkFavorite(), 500);
    } catch (err) {
      console.error("[volumio-panel] Favorite toggle failed:", err);
      this._isFavorite = wasFavorite;
    }
  }

  // ── Keyboard Shortcuts ────────────────────────────────────

  _onKeyDown(e) {
    const target = e.composedPath?.()?.[0] || e.target;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
    if (!this.isConnected) return;

    const s = this._adapter.getState();
    if (s.state === "unavailable") return;

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
          const pos = (s.position || 0) + 10;
          this._onCommand({ detail: { command: "seek", value: pos } });
        }
        break;
      case "ArrowLeft":
        if (e.shiftKey) {
          e.preventDefault();
          this._onCommand({ detail: { command: "prev" } });
        } else {
          e.preventDefault();
          const pos2 = Math.max(0, (s.position || 0) - 10);
          this._onCommand({ detail: { command: "seek", value: pos2 } });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        {
          const vol = Math.min(100, s.volume + 2);
          this._onCommand({ detail: { command: "volume_set", value: vol } });
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        {
          const vol2 = Math.max(0, s.volume - 2);
          this._onCommand({ detail: { command: "volume_set", value: vol2 } });
        }
        break;
      case "m":
      case "M":
        this._onCommand({ detail: { command: "mute_toggle" } });
        break;
      case "s":
      case "S":
        this._onCommand({ detail: { command: "shuffle_set", value: !s.shuffle } });
        break;
      case "r":
      case "R":
        {
          const current = s.repeat;
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
