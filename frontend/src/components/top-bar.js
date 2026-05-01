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

        <div class="search-field" @click=${this._focusSearch} title="Search coming in a future update">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="text"
            placeholder="Search (coming soon)..."
            aria-label="Search music — coming soon"
            disabled
          />
        </div>

        <button
          class="icon-btn"
          @click=${this._toggleQueue}
          title="Toggle queue"
          aria-label="Toggle queue panel"
        >
          <ha-icon icon="mdi:playlist-music"></ha-icon>
        </button>
      </div>

      ${this.breadcrumb.length > 0 ? this._renderBreadcrumb() : ""}
    `;
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

  _onSearchFocus() {
    this.dispatchEvent(new CustomEvent("volumio-search-focus", {
      bubbles: true, composed: true,
    }));
  }
}

customElements.define("volumio-top-bar", VolumioTopBar);
