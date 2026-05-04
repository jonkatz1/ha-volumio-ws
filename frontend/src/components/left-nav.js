/**
 * Left Nav — source navigation sidebar.
 *
 * Properties:
 *   sources: array - browse sources [{name, plugin_name, plugin_type, albumart}]
 *   activeSource: string - currently active source plugin_name
 *   mode: "pinned" | "collapsed" | "flyout" | "hidden"
 *   activeView: string - current view
 *
 * Events:
 *   volumio-navigate: { view, source }
 *   volumio-nav-pin: { pinned }
 *   volumio-close-nav: {}
 */
import { LitElement, html, css } from "lit";

const SHORTCUTS = [
  { key: "favorites", label: "Favorites", icon: "mdi:heart" },
  { key: "playlists", label: "Playlists", icon: "mdi:playlist-music-outline" },
  { key: "history", label: "History", icon: "mdi:history" },
];

// Map plugin_type or plugin_name to icon
const SOURCE_ICONS = {
  music_service: "mdi:music-box",
  mpd: "mdi:folder-music",
  webradio: "mdi:radio",
  podcast: "mdi:podcast",
};

class VolumioLeftNav extends LitElement {
  static get properties() {
    return {
      sources: { type: Array },
      activeSource: { type: String, attribute: "active-source" },
      mode: { type: String },
      activeView: { type: String, attribute: "active-view" },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        height: 100%;
      }

      /* ── Pinned nav ──────────────────────────────── */
      .nav {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--card-background-color, #1e1e1e);
        border-right: 1px solid var(--divider-color, rgba(255,255,255,0.08));
        overflow: hidden;
      }

      .nav.pinned {
        width: var(--volumio-nav-width-pinned, 240px);
      }

      .nav.collapsed {
        width: var(--volumio-nav-width-collapsed, 56px);
      }

      .nav.flyout {
        width: var(--volumio-nav-width-pinned, 240px);
      }

      .nav-scroll {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: var(--volumio-space-sm, 8px) 0;
      }

      .nav-section-label {
        padding: var(--volumio-space-md, 16px) var(--volumio-space-md, 16px) var(--volumio-space-xs, 4px);
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color, #888);
      }

      .nav-section-label.collapsed {
        display: none;
      }

      .nav-item {
        display: flex;
        align-items: center;
        height: 44px;
        padding: 0 var(--volumio-space-md, 16px);
        cursor: pointer;
        color: var(--primary-text-color);
        font-size: 14px;
        transition: background 0.15s;
        gap: 12px;
        text-decoration: none;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        position: relative;
      }

      .nav-item:hover {
        background: var(--divider-color, rgba(255,255,255,0.08));
      }

      .nav-item.active {
        color: var(--primary-color, #03a9f4);
      }

      .nav-item.active::before {
        content: "";
        position: absolute;
        left: 0;
        top: 8px;
        bottom: 8px;
        width: 3px;
        background: var(--primary-color, #03a9f4);
        border-radius: 0 2px 2px 0;
      }

      .nav-item ha-icon {
        --mdc-icon-size: 22px;
        flex-shrink: 0;
        width: 24px;
      }

      .nav-item-label {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .collapsed .nav-item {
        justify-content: center;
        padding: 0;
      }

      .collapsed .nav-item-label {
        display: none;
      }

      .collapsed .nav-item ha-icon {
        margin: 0;
      }

      .nav-divider {
        height: 1px;
        background: var(--divider-color, rgba(255,255,255,0.08));
        margin: var(--volumio-space-sm, 8px) var(--volumio-space-md, 16px);
      }

      .nav-footer {
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08));
        padding: var(--volumio-space-sm, 8px) 0;
      }

      .pin-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 36px;
        border: none;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 12px;
        gap: 6px;
      }

      .pin-btn:hover {
        color: var(--primary-text-color);
        background: var(--divider-color, rgba(255,255,255,0.08));
      }

      .pin-btn ha-icon {
        --mdc-icon-size: 18px;
      }

      /* Collapsed: pin button icon only */
      .collapsed .pin-btn span {
        display: none;
      }
    `;
  }

  constructor() {
    super();
    this.sources = [];
    this.activeSource = "";
    this.mode = "pinned";
    this.activeView = "";
  }

  render() {
    const isCollapsed = this.mode === "collapsed";

    return html`
      <nav class="nav ${this.mode}" aria-label="Music sources">
        <div class="nav-scroll">
          <div class="nav-section-label ${isCollapsed ? "collapsed" : ""}">Sources</div>
          ${this.sources.map(src => {
            const icon = SOURCE_ICONS[src.plugin_name] || SOURCE_ICONS[src.plugin_type] || "mdi:music-box";
            const isActive = this.activeSource === src.uri;
            return html`
              <button
                class="nav-item ${isActive ? "active" : ""}"
                @click=${() => this._selectSource(src)}
                title="${src.name}"
                aria-label="${src.name}"
              >
                <ha-icon icon="${icon}"></ha-icon>
                <span class="nav-item-label">${src.name}</span>
              </button>
            `;
          })}

          <div class="nav-divider"></div>
          <div class="nav-section-label ${isCollapsed ? "collapsed" : ""}">Shortcuts</div>

          ${SHORTCUTS.map(sc => html`
            <button
              class="nav-item ${this.activeView === sc.key ? "active" : ""}"
              @click=${() => this._navigate(sc.key)}
              title="${sc.label}"
              aria-label="${sc.label}"
            >
              <ha-icon icon="${sc.icon}"></ha-icon>
              <span class="nav-item-label">${sc.label}</span>
            </button>
          `)}

          <div class="nav-divider"></div>

          <button
            class="nav-item"
            @click=${() => this._navigate("settings")}
            title="Settings"
            aria-label="Panel Settings"
          >
            <ha-icon icon="mdi:cog"></ha-icon>
            <span class="nav-item-label">Settings</span>
          </button>
        </div>

        <div class="nav-footer">
          <button class="pin-btn" @click=${this._togglePin} title="${isCollapsed ? "Pin sidebar" : "Collapse sidebar"}">
            <ha-icon icon="${isCollapsed ? "mdi:pin" : "mdi:pin-off"}"></ha-icon>
            <span>${isCollapsed ? "Pin" : "Collapse"}</span>
          </button>
        </div>
      </nav>
    `;
  }

  _selectSource(source) {
    this.dispatchEvent(new CustomEvent("volumio-navigate", {
      detail: {
        view: "browse",
        source: source.name,
        sourceUri: source.uri,
        pluginName: source.plugin_name,
      },
      bubbles: true, composed: true,
    }));
  }

  _navigate(view) {
    this.dispatchEvent(new CustomEvent("volumio-navigate", {
      detail: { view },
      bubbles: true, composed: true,
    }));
  }

  _togglePin() {
    const newPinned = this.mode === "collapsed";
    this.dispatchEvent(new CustomEvent("volumio-nav-pin", {
      detail: { pinned: newPinned },
      bubbles: true, composed: true,
    }));
  }
}

customElements.define("volumio-left-nav", VolumioLeftNav);
