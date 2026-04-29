/**
 * Volumio Panel — LitElement web component for Home Assistant sidebar.
 *
 * T15: Infrastructure skeleton.
 * Proves: panel registration, hass integration, entity state display,
 * service calls, WS API subscriptions, HA theme support.
 */
import { LitElement, html, css } from "lit";

class VolumioPanel extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      route: { type: Object },
      panel: { type: Object },
      _entityId: { type: String, state: true },
      _configEntryId: { type: String, state: true },
      _playerState: { type: Object, state: true },
      _queue: { type: Array, state: true },
      _searchResults: { type: Object, state: true },
      _searchQuery: { type: String, state: true },
      _error: { type: String, state: true },
      _queueSubId: { type: Number, state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        height: 100%;
        background: var(--primary-background-color, #fafafa);
        color: var(--primary-text-color, #212121);
        font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
        box-sizing: border-box;
      }

      *,
      *::before,
      *::after {
        box-sizing: inherit;
      }

      .toolbar {
        display: flex;
        align-items: center;
        height: 56px;
        padding: 0 16px;
        background: var(--app-header-background-color, var(--primary-color, #03a9f4));
        color: var(--app-header-text-color, #fff);
        font-size: 20px;
        font-weight: 400;
      }

      .menu-btn {
        display: none;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: inherit;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        flex-shrink: 0;
        padding: 0;
      }

      .menu-btn svg {
        width: 24px;
        height: 24px;
        fill: currentColor;
      }

      .menu-btn:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .toolbar-title {
        flex: 1;
      }

      .content {
        padding: 16px;
        max-width: 960px;
        margin: 0 auto;
      }

      .card {
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: var(
          --ha-card-box-shadow,
          0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 1px 5px 0 rgba(0, 0, 0, 0.12),
          0 3px 1px -2px rgba(0, 0, 0, 0.2)
        );
      }

      .card h2 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .state-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 16px;
      }

      .state-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }

      .state-label {
        color: var(--secondary-text-color, #727272);
        font-size: 14px;
      }

      .state-value {
        font-size: 14px;
        font-weight: 500;
        text-align: right;
      }

      .albumart {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        object-fit: cover;
        background: var(--divider-color, #e0e0e0);
        margin-bottom: 12px;
      }

      .now-playing {
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }

      .now-playing-info {
        flex: 1;
        min-width: 0;
      }

      .now-playing-title {
        font-size: 18px;
        font-weight: 500;
        margin: 0 0 4px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .now-playing-artist {
        font-size: 14px;
        color: var(--secondary-text-color, #727272);
        margin: 0 0 2px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .now-playing-album {
        font-size: 13px;
        color: var(--secondary-text-color, #727272);
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }

      .status-playing {
        background: #4caf50;
        color: #fff;
      }

      .status-paused {
        background: #ff9800;
        color: #fff;
      }

      .status-idle,
      .status-off,
      .status-unavailable {
        background: var(--divider-color, #e0e0e0);
        color: var(--primary-text-color);
      }

      .btn {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        background: var(--primary-color, #03a9f4);
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        transition: opacity 0.2s;
      }

      .btn:hover {
        opacity: 0.85;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 12px;
      }

      .search-row {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }

      .search-input {
        flex: 1;
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid var(--divider-color, #e0e0e0);
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        font-size: 14px;
        outline: none;
      }

      .search-input:focus {
        border-color: var(--primary-color, #03a9f4);
      }

      .queue-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }

      .queue-item:last-child {
        border-bottom: none;
      }

      .queue-index {
        color: var(--secondary-text-color);
        font-size: 13px;
        min-width: 24px;
        text-align: center;
      }

      .queue-art {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        object-fit: cover;
        background: var(--divider-color, #e0e0e0);
        flex-shrink: 0;
      }

      .queue-info {
        flex: 1;
        min-width: 0;
      }

      .queue-title {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .queue-artist {
        font-size: 12px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .result-group {
        margin-bottom: 12px;
      }

      .result-group h3 {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 500;
        color: var(--secondary-text-color);
        text-transform: uppercase;
      }

      .result-item {
        padding: 6px 0;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
        font-size: 14px;
      }

      .result-item:last-child {
        border-bottom: none;
      }

      .error {
        color: var(--error-color, #db4437);
        font-size: 14px;
        padding: 8px 12px;
        background: rgba(219, 68, 55, 0.1);
        border-radius: 4px;
        margin-bottom: 12px;
      }

      .empty {
        color: var(--secondary-text-color);
        font-style: italic;
        font-size: 14px;
        padding: 8px 0;
      }

      .connection-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
      }

      .connected {
        background: #4caf50;
      }

      .disconnected {
        background: #db4437;
      }

      @media (max-width: 870px) {
        .menu-btn {
          display: flex;
        }

        .state-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 480px) {
        .content {
          padding: 8px;
        }

        .card {
          padding: 12px;
        }
      }
    `;
  }

  constructor() {
    super();
    this._entityId = null;
    this._configEntryId = null;
    this._playerState = {};
    this._queue = [];
    this._searchResults = null;
    this._searchQuery = "";
    this._error = null;
    this._queueSubId = null;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    // Note: hass is not yet set here — subscription happens in updated()
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribeQueue();
  }

  updated(changedProperties) {
    if (changedProperties.has("hass") && this.hass) {
      this._resolveIds();
      // Subscribe to queue once hass is available (first update only)
      if (!this._queueSubId) {
        this._subscribeQueue();
      }
    }
  }

  // ── ID resolution ──────────────────────────────────────────────────

  /**
   * Find the volumio_ws media_player entity and config entry ID.
   * Runs once when hass is first set, then caches.
   */
  _resolveIds() {
    if (this._entityId && this._configEntryId) return;

    // Find volumio_ws media_player entity
    if (!this._entityId) {
      const entityId = Object.keys(this.hass.states).find(
        (eid) =>
          eid.startsWith("media_player.") &&
          this.hass.states[eid].attributes?.volumio_ws === true
      );
      if (!entityId) {
        // Fallback: look for entity with volumio in the name from our domain
        // Check entities registry via hass.entities if available, or just
        // find any media_player with "volumio" in its entity_id
        const fallback = Object.keys(this.hass.states).find(
          (eid) =>
            eid.startsWith("media_player.") && eid.includes("volumio")
        );
        if (fallback) {
          this._entityId = fallback;
        }
      } else {
        this._entityId = entityId;
      }
    }

    // Find config entry ID for service calls
    if (!this._configEntryId && this.hass) {
      // panel.config may have the entry_id if we pass it during registration
      if (this.panel?.config?.config_entry_id) {
        this._configEntryId = this.panel.config.config_entry_id;
      }
    }
  }

  // ── Queue subscription (Layer 3) ───────────────────────────────────

  async _subscribeQueue() {
    if (this._queueSubId || !this.hass) return;
    try {
      // Subscribe to queue updates via custom WS API
      this._queueSubId = await this.hass.connection.subscribeMessage(
        (msg) => {
          if (msg.queue) {
            this._queue = msg.queue;
          }
        },
        { type: "volumio_ws/subscribe_queue" }
      );
    } catch (err) {
      console.warn("[volumio-panel] Queue subscription failed:", err);
      // Non-fatal — queue can be fetched via service call fallback
    }
  }

  _unsubscribeQueue() {
    if (this._queueSubId) {
      // The subscribeMessage return value is an unsubscribe function
      if (typeof this._queueSubId === "function") {
        this._queueSubId();
      }
      this._queueSubId = null;
    }
  }

  // ── Service calls ──────────────────────────────────────────────────

  /**
   * Call a volumio_ws service and return the response data.
   * Uses the raw WS connection to ensure return_response works
   * regardless of HA frontend wrapper quirks.
   */
  async _callService(service, serviceData = {}) {
    const result = await this.hass.connection.sendMessagePromise({
      type: "call_service",
      domain: "volumio_ws",
      service,
      service_data: {
        config_entry_id: this._configEntryId,
        ...serviceData,
      },
      return_response: true,
    });
    return result;
  }

  async _fetchQueue() {
    if (!this._configEntryId) {
      this._error = "No config entry ID — cannot call services.";
      return;
    }
    this._error = null;
    try {
      const result = await this._callService("queue_get");
      if (result?.response?.queue) {
        this._queue = result.response.queue;
      }
    } catch (err) {
      this._error = `Queue fetch failed: ${err.message || err}`;
      console.error("[volumio-panel] queue_get error:", err);
    }
  }

  async _doSearch() {
    const query = this._searchQuery?.trim();
    if (!query || !this._configEntryId) return;
    this._error = null;
    this._searchResults = null;
    try {
      const result = await this._callService("search", { query });
      this._searchResults = result?.response || null;
    } catch (err) {
      this._error = `Search failed: ${err.message || err}`;
      console.error("[volumio-panel] search error:", err);
    }
  }

  // ── Event handlers ─────────────────────────────────────────────────

  _onSearchInput(e) {
    this._searchQuery = e.target.value;
  }

  _onSearchKeydown(e) {
    if (e.key === "Enter") {
      this._doSearch();
    }
  }

  _toggleSidebar() {
    const event = new Event("hass-toggle-menu", {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  // ── Render ─────────────────────────────────────────────────────────

  render() {
    const entity = this._entityId ? this.hass?.states[this._entityId] : null;
    const attrs = entity?.attributes || {};
    const state = entity?.state || "unavailable";

    return html`
      <div class="toolbar">
        <button class="menu-btn" @click=${this._toggleSidebar} title="Menu">
          <svg viewBox="0 0 24 24">
            <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
          </svg>
        </button>
        <span class="toolbar-title">Volumio</span>
        <span class="connection-dot ${entity ? "connected" : "disconnected"}"></span>
      </div>

      <div class="content">
        ${this._error ? html`<div class="error">${this._error}</div>` : ""}
        ${this._renderNowPlaying(entity, attrs, state)}
        ${this._renderState(attrs, state)}
        ${this._renderQueue()}
        ${this._renderSearch()}
        ${this._renderDiagnostics()}
      </div>
    `;
  }

  _renderNowPlaying(entity, attrs, state) {
    if (!entity) {
      return html`
        <div class="card">
          <h2>Now Playing</h2>
          <p class="empty">No Volumio entity found. Is the integration loaded?</p>
        </div>
      `;
    }

    const title = attrs.media_title || "—";
    const artist = attrs.media_artist || "";
    const album = attrs.media_album_name || "";
    const imageUrl = attrs.entity_picture
      ? attrs.entity_picture
      : null;

    return html`
      <div class="card">
        <h2>Now Playing</h2>
        <div class="now-playing">
          ${imageUrl
            ? html`<img class="albumart" src=${imageUrl} alt="Album art" />`
            : html`<div class="albumart"></div>`}
          <div class="now-playing-info">
            <p class="now-playing-title">${title}</p>
            ${artist ? html`<p class="now-playing-artist">${artist}</p>` : ""}
            ${album ? html`<p class="now-playing-album">${album}</p>` : ""}
            <span class="status-badge status-${state}">${state}</span>
          </div>
        </div>
      </div>
    `;
  }

  _renderState(attrs, state) {
    return html`
      <div class="card">
        <h2>Player State</h2>
        <div class="state-grid">
          <div class="state-row">
            <span class="state-label">Volume</span>
            <span class="state-value">${attrs.volume_level != null ? Math.round(attrs.volume_level * 100) + "%" : "—"}</span>
          </div>
          <div class="state-row">
            <span class="state-label">Muted</span>
            <span class="state-value">${attrs.is_volume_muted ? "Yes" : "No"}</span>
          </div>
          <div class="state-row">
            <span class="state-label">Shuffle</span>
            <span class="state-value">${attrs.shuffle ? "On" : "Off"}</span>
          </div>
          <div class="state-row">
            <span class="state-label">Repeat</span>
            <span class="state-value">${attrs.repeat || "off"}</span>
          </div>
          <div class="state-row">
            <span class="state-label">Source</span>
            <span class="state-value">${attrs.source || "—"}</span>
          </div>
          <div class="state-row">
            <span class="state-label">Duration</span>
            <span class="state-value">${attrs.media_duration ? this._formatTime(attrs.media_duration) : "—"}</span>
          </div>
        </div>
      </div>
    `;
  }

  _renderQueue() {
    return html`
      <div class="card">
        <h2>Queue (${this._queue.length} items)</h2>
        <div class="btn-row">
          <button class="btn" @click=${this._fetchQueue}>Refresh Queue</button>
        </div>
        ${this._queue.length === 0
          ? html`<p class="empty">Queue is empty or not yet loaded.</p>`
          : this._queue.slice(0, 20).map(
              (item, i) => html`
                <div class="queue-item">
                  <span class="queue-index">${i + 1}</span>
                  ${item.albumart
                    ? html`<img class="queue-art" src=${this._resolveArt(item.albumart)} alt="" />`
                    : html`<div class="queue-art"></div>`}
                  <div class="queue-info">
                    <div class="queue-title">${item.name || item.title || "—"}</div>
                    <div class="queue-artist">${item.artist || ""}</div>
                  </div>
                </div>
              `
            )}
        ${this._queue.length > 20
          ? html`<p class="empty">...and ${this._queue.length - 20} more</p>`
          : ""}
      </div>
    `;
  }

  _renderSearch() {
    return html`
      <div class="card">
        <h2>Search</h2>
        <div class="search-row">
          <input
            class="search-input"
            type="text"
            placeholder="Search Volumio..."
            .value=${this._searchQuery}
            @input=${this._onSearchInput}
            @keydown=${this._onSearchKeydown}
          />
          <button class="btn" @click=${this._doSearch} ?disabled=${!this._searchQuery?.trim()}>
            Search
          </button>
        </div>
        ${this._renderSearchResults()}
      </div>
    `;
  }

  _renderSearchResults() {
    if (!this._searchResults) return "";

    const data = this._searchResults;

    // Search results from Volumio come as a navigation list
    // with items grouped by source/type.
    if (data.navigation?.lists) {
      // Filter out:
      // - Empty lists (no items)
      // - Filter/button chrome (isFiltersAndButtons: true)
      const lists = data.navigation.lists.filter(
        (list) => !list.isFiltersAndButtons && list.items?.length > 0
      );

      if (lists.length === 0) {
        return html`<p class="empty">No results found.</p>`;
      }

      return html`
        ${lists.map(
          (list) => html`
            <div class="result-group">
              <h3>${list.title || "Results"}</h3>
              ${(list.items || []).slice(0, 10).map(
                (item) => html`
                  <div class="result-item">
                    ${item.title || item.name || "—"}
                    ${item.artist ? html` — <span style="color:var(--secondary-text-color)">${item.artist}</span>` : ""}
                  </div>
                `
              )}
              ${(list.items || []).length > 10
                ? html`<div class="result-item empty">...${list.items.length - 10} more</div>`
                : ""}
            </div>
          `
        )}
      `;
    }

    // Fallback: dump as JSON for debugging
    return html`<pre style="font-size:12px;overflow:auto;max-height:200px">${JSON.stringify(data, null, 2)}</pre>`;
  }

  _renderDiagnostics() {
    return html`
      <div class="card">
        <h2>Diagnostics</h2>
        <div class="state-grid">
          <div class="state-row">
            <span class="state-label">Entity ID</span>
            <span class="state-value">${this._entityId || "not found"}</span>
          </div>
          <div class="state-row">
            <span class="state-label">Config Entry</span>
            <span class="state-value">${this._configEntryId || "not found"}</span>
          </div>
          <div class="state-row">
            <span class="state-label">Queue Sub</span>
            <span class="state-value">${this._queueSubId ? "active" : "inactive"}</span>
          </div>
          <div class="state-row">
            <span class="state-label">Hass</span>
            <span class="state-value">${this.hass ? "connected" : "disconnected"}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ── Helpers ────────────────────────────────────────────────────────

  _formatTime(seconds) {
    if (!seconds || seconds <= 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  _resolveArt(albumart) {
    if (!albumart) return "";
    if (albumart.startsWith("http")) return albumart;
    // Relative URL — resolve against Volumio base URL.
    // The panel.config should have the Volumio host info.
    const base = this.panel?.config?.volumio_url || "";
    return base ? `${base}${albumart}` : albumart;
  }
}

customElements.define("volumio-panel", VolumioPanel);
