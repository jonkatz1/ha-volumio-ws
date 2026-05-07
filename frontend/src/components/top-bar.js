/**
 * Top Bar — persistent navigation bar at top of panel.
 *
 * Properties:
 *   activeView: string - current active view key
 *   breadcrumb: array - breadcrumb segments [{label, path}]
 *   showBackButton: boolean
 *   narrow: boolean - narrow viewport
 *
 * Events:
 *   volumio-navigate: { view, path }
 *   volumio-toggle-nav: {}
 *   volumio-toggle-queue: {}
 *   volumio-search-focus: {}
 *   volumio-back: {}
 */
import { LitElement, html, css } from "lit";

const TABS = [
  { key: "now-playing", label: "Now Playing" },
  { key: "browse", label: "Browse" },
  { key: "playlists", label: "Playlists" },
  { key: "favorites", label: "Favorites" },
];

class VolumioTopBar extends LitElement {
  static get properties() {
    return {
      activeView: { type: String, attribute: "active-view" },
      breadcrumb: { type: Array },
      showBackButton: { type: Boolean, attribute: "show-back-button" },
      narrow: { type: Boolean },
      searchQuery: { type: String, attribute: "search-query" },
      devices: { type: Array },
      activeDeviceId: { type: String, attribute: "active-device-id" },
      _searchValue: { type: String, state: true },
      _searchFocused: { type: Boolean, state: true },
      _deviceMenuOpen: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        z-index: 100;
      }

      .topbar {
        display: flex;
        align-items: center;
        height: var(--volumio-topbar-height, 48px);
        padding: 0 var(--volumio-space-sm, 8px);
        background: var(--card-background-color, #1e1e1e);
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.12));
        gap: var(--volumio-space-xs, 4px);
      }

      .icon-btn {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        padding: 0;
      }

      .icon-btn:hover {
        background: var(--divider-color, rgba(255,255,255,0.08));
      }

      ha-icon {
        --mdc-icon-size: 24px;
      }

      .tabs {
        display: flex;
        gap: 2px;
        flex-shrink: 0;
      }

      .tab {
        padding: 6px 14px;
        border-radius: 6px;
        border: none;
        background: transparent;
        color: var(--secondary-text-color, #aaa);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
        white-space: nowrap;
      }

      .tab:hover {
        background: var(--divider-color, rgba(255,255,255,0.08));
        color: var(--primary-text-color);
      }

      .tab.active {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }

      .spacer {
        flex: 1;
      }

      .search-field {
        display: flex;
        align-items: center;
        background: var(--primary-background-color, #121212);
        border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
        border-radius: 20px;
        padding: 0 12px;
        height: 34px;
        min-width: 180px;
        max-width: 300px;
        flex-shrink: 1;
        gap: 6px;
        cursor: text;
      }

      .search-field ha-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
        flex-shrink: 0;
      }

      .search-field input {
        flex: 1;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        font-size: 13px;
        outline: none;
        min-width: 0;
      }

      .search-field input::placeholder {
        color: var(--secondary-text-color, #888);
      }

      .search-field input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .search-clear {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: none;
        background: var(--secondary-text-color, #888);
        color: var(--primary-background-color, #121212);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        flex-shrink: 0;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
      }

      .search-clear:hover {
        background: var(--primary-text-color);
      }

      .recent-searches {
        position: absolute;
        top: 100%;
        right: 0;
        left: 0;
        margin: 0 var(--volumio-space-sm, 8px);
        background: var(--card-background-color, #1e1e1e);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        padding: var(--volumio-space-sm, 8px);
        z-index: 110;
        max-width: 320px;
        margin-left: auto;
      }

      .recent-label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        padding: 4px 8px;
      }

      .recent-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 4px;
      }

      .recent-chip {
        padding: 4px 12px;
        border-radius: 14px;
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        background: transparent;
        color: var(--primary-text-color);
        font-size: 13px;
        cursor: pointer;
        transition: background 0.15s;
      }

      .recent-chip:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .breadcrumb-row {
        display: flex;
        align-items: center;
        height: var(--volumio-breadcrumb-height, 32px);
        padding: 0 var(--volumio-space-md, 16px);
        background: var(--card-background-color, #1e1e1e);
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.06));
        font-size: 13px;
        color: var(--secondary-text-color);
        gap: 4px;
        overflow: hidden;
      }

      .device-selector {
        position: relative;
        flex-shrink: 0;
      }

      .device-menu {
        position: absolute;
        top: calc(100% + 4px);
        right: 0;
        min-width: 200px;
        background: var(--card-background-color, #1e1e1e);
        border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        padding: 4px;
        z-index: 110;
      }

      .device-menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        width: 100%;
        text-align: left;
        font-size: 13px;
        cursor: pointer;
        border-radius: 6px;
      }

      .device-menu-item:hover {
        background: var(--divider-color, rgba(255,255,255,0.08));
      }

      .device-menu-item.active {
        font-weight: 600;
      }

      .device-menu-item ha-icon {
        --mdc-icon-size: 18px;
        color: var(--primary-color, #03a9f4);
        flex-shrink: 0;
      }

      .device-menu-item .device-menu-spacer {
        width: 18px;
        flex-shrink: 0;
      }

      .device-menu-item .device-menu-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .breadcrumb-segment {
        cursor: pointer;
        color: var(--secondary-text-color);
        text-decoration: none;
        white-space: nowrap;
      }

      .breadcrumb-segment:hover {
        color: var(--primary-text-color);
        text-decoration: underline;
      }

      .breadcrumb-segment.current {
        color: var(--primary-text-color);
        font-weight: 600;
        cursor: default;
      }

      .breadcrumb-segment.current:hover {
        text-decoration: none;
      }

      .breadcrumb-sep {
        color: var(--secondary-text-color);
        opacity: 0.5;
        flex-shrink: 0;
      }

      @media (max-width: 768px) {
        .search-field {
          min-width: 120px;
        }
        .tab {
          padding: 6px 10px;
          font-size: 13px;
        }
      }
    `;
  }

  constructor() {
    super();
    this.activeView = "now-playing";
    this.breadcrumb = [];
    this.showBackButton = false;
    this.narrow = false;
    this.searchQuery = "";
    this.devices = [];
    this.activeDeviceId = "";
    this._searchValue = "";
    this._searchFocused = false;
    this._deviceMenuOpen = false;
    this._debounceTimer = null;
    // Resilient against corrupt/quota-exceeded localStorage (issue #40)
    let recent = [];
    try {
      recent = JSON.parse(localStorage.getItem("volumio-recent-searches") || "[]");
      if (!Array.isArray(recent)) recent = [];
    } catch {
      recent = [];
    }
    this._recentSearches = recent;
    this._onDocClick = this._onDocClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this._onDocClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this._onDocClick);
  }

  _onDocClick(e) {
    if (!this._deviceMenuOpen) return;
    // Close the device menu when clicking outside the host element.
    const path = e.composedPath ? e.composedPath() : [];
    if (!path.includes(this)) {
      this._deviceMenuOpen = false;
    }
  }

  render() {
    return html`
      <div class="topbar">
        <button
          class="icon-btn"
          @click=${this._toggleNav}
          title="Toggle navigation"
          aria-label="Toggle navigation sidebar"
        >
          <ha-icon icon="mdi:menu"></ha-icon>
        </button>

        ${this.showBackButton ? html`
          <button
            class="icon-btn"
            @click=${this._goBack}
            title="Back"
            aria-label="Go back"
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
        ` : ""}

        <div class="tabs">
          ${TABS.map(tab => html`
            <button
              class="tab ${this.activeView === tab.key ? "active" : ""}"
              @click=${() => this._navigate(tab.key)}
            >
              ${tab.label}
            </button>
          `)}
        </div>

        <div class="spacer"></div>

        <div class="search-field" @click=${this._focusSearch} title="Search music">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search music"
            .value=${this._searchValue}
            @input=${this._onSearchInput}
            @focus=${this._onSearchFieldFocus}
            @blur=${this._onSearchFieldBlur}
            @keydown=${this._onSearchKeydown}
          />
          ${this._searchValue ? html`
            <button class="search-clear" @click=${this._clearSearch} title="Clear search" aria-label="Clear search">✕</button>
          ` : ""}
        </div>

        ${this._searchFocused && !this._searchValue && this._recentSearches.length > 0 ? html`
          <div class="recent-searches">
            <div class="recent-label">Recent</div>
            <div class="recent-chips">
              ${this._recentSearches.slice(0, 10).map(q => html`
                <button class="recent-chip" @mousedown=${(e) => { e.preventDefault(); this._useRecentSearch(q); }}>${q}</button>
              `)}
            </div>
          </div>
        ` : ""}

        <button
          class="icon-btn"
          @click=${this._toggleQueue}
          title="Toggle queue"
          aria-label="Toggle queue panel"
        >
          <ha-icon icon="mdi:playlist-music"></ha-icon>
        </button>

        ${this._renderDeviceSelector()}
      </div>

      ${this.breadcrumb.length > 0 ? this._renderBreadcrumb() : ""}
    `;
  }

  _renderDeviceSelector() {
    const devices = Array.isArray(this.devices) ? this.devices : [];
    if (devices.length <= 1) return "";
    const active = devices.find((d) => d.config_entry_id === this.activeDeviceId)
      || devices[0];
    const activeName = active?.name || "Device";
    return html`
      <div class="device-selector">
        <button
          class="icon-btn"
          @click=${this._toggleDeviceMenu}
          title="Device: ${activeName} — switch"
          aria-label="Switch Volumio device (current: ${activeName})"
          aria-haspopup="listbox"
          aria-expanded=${this._deviceMenuOpen ? "true" : "false"}
        >
          <ha-icon icon="mdi:speaker-multiple"></ha-icon>
        </button>
        ${this._deviceMenuOpen ? html`
          <div class="device-menu" role="listbox">
            ${devices.map((d) => {
              const isActive = d.config_entry_id === this.activeDeviceId;
              return html`
                <button
                  class="device-menu-item ${isActive ? "active" : ""}"
                  role="option"
                  aria-selected=${isActive ? "true" : "false"}
                  @click=${() => this._selectDevice(d.config_entry_id)}
                >
                  ${isActive
                    ? html`<ha-icon icon="mdi:check"></ha-icon>`
                    : html`<span class="device-menu-spacer"></span>`}
                  <span class="device-menu-name">${d.name || d.config_entry_id}</span>
                </button>
              `;
            })}
          </div>
        ` : ""}
      </div>
    `;
  }

  _toggleDeviceMenu(e) {
    e.stopPropagation();
    this._deviceMenuOpen = !this._deviceMenuOpen;
  }

  _selectDevice(configEntryId) {
    this._deviceMenuOpen = false;
    if (configEntryId === this.activeDeviceId) return;
    this.dispatchEvent(new CustomEvent("volumio-device-change", {
      detail: { config_entry_id: configEntryId },
      bubbles: true,
      composed: true,
    }));
  }

  _renderBreadcrumb() {
    const segments = this.breadcrumb;
    const maxVisible = 5;
    const display = segments.length > maxVisible
      ? [segments[0], { label: "...", path: null }, ...segments.slice(-3)]
      : segments;

    return html`
      <div class="breadcrumb-row">
        ${display.map((seg, i) => {
          const isLast = i === display.length - 1;
          return html`
            ${i > 0 ? html`<span class="breadcrumb-sep"><ha-icon icon="mdi:chevron-right" style="--mdc-icon-size:14px"></ha-icon></span>` : ""}
            <span
              class="breadcrumb-segment ${isLast ? "current" : ""}"
              @click=${() => !isLast && seg.path != null && this._navigate(seg.path)}
            >${seg.label}</span>
          `;
        })}
      </div>
    `;
  }

  _navigate(view) {
    this.dispatchEvent(new CustomEvent("volumio-navigate", {
      detail: { view },
      bubbles: true,
      composed: true,
    }));
  }

  _toggleNav() {
    this.dispatchEvent(new CustomEvent("volumio-toggle-nav", {
      bubbles: true, composed: true,
    }));
  }

  _toggleQueue() {
    this.dispatchEvent(new CustomEvent("volumio-toggle-queue", {
      bubbles: true, composed: true,
    }));
  }

  _goBack() {
    this.dispatchEvent(new CustomEvent("volumio-back", {
      bubbles: true, composed: true,
    }));
  }

  _focusSearch() {
    const input = this.shadowRoot.querySelector(".search-field input");
    if (input) input.focus();
  }

  _onSearchFieldFocus() {
    this._searchFocused = true;
  }

  _onSearchFieldBlur() {
    // Delay to allow chip clicks to register
    setTimeout(() => { this._searchFocused = false; }, 200);
  }

  _onSearchInput(e) {
    this._searchValue = e.target.value;
    clearTimeout(this._debounceTimer);

    if (this._searchValue.trim().length < 2) {
      // Clear search results if query too short
      if (this._searchValue.trim().length === 0) {
        this.dispatchEvent(new CustomEvent("volumio-search-clear", {
          bubbles: true, composed: true,
        }));
      }
      return;
    }

    this._debounceTimer = setTimeout(() => {
      this._executeSearch(this._searchValue.trim());
    }, 300);
  }

  _onSearchKeydown(e) {
    if (e.key === "Escape") {
      this._clearSearch();
      e.target.blur();
    } else if (e.key === "Enter") {
      clearTimeout(this._debounceTimer);
      if (this._searchValue.trim().length >= 2) {
        this._executeSearch(this._searchValue.trim());
      }
    }
  }

  _executeSearch(query) {
    // Save to recent searches
    this._recentSearches = [query, ...this._recentSearches.filter(q => q !== query)].slice(0, 10);
    localStorage.setItem("volumio-recent-searches", JSON.stringify(this._recentSearches));

    this.dispatchEvent(new CustomEvent("volumio-search", {
      detail: { query },
      bubbles: true, composed: true,
    }));
  }

  _clearSearch() {
    this._searchValue = "";
    clearTimeout(this._debounceTimer);
    this.dispatchEvent(new CustomEvent("volumio-search-clear", {
      bubbles: true, composed: true,
    }));
  }

  _useRecentSearch(query) {
    this._searchValue = query;
    this._searchFocused = false;
    this._executeSearch(query);
  }

  _onSearchFocus() {
    this.dispatchEvent(new CustomEvent("volumio-search-focus", {
      bubbles: true, composed: true,
    }));
  }
}

customElements.define("volumio-top-bar", VolumioTopBar);
