/**
 * Browse Source Grid — top-level source selection.
 *
 * Properties:
 *   sources: array - [{name, plugin_name, plugin_type, albumart, uri}]
 *
 * Events:
 *   volumio-source-select: { uri, name, plugin_name }
 */
import { LitElement, html, css } from "lit";
import { resolveArt } from "../utils/format-utils.js";

// Map plugin_name or plugin_type to mdi icon
const SOURCE_ICON_MAP = {
  mpd: "mdi:folder-music",
  webradio: "mdi:radio",
  podcast: "mdi:podcast",
  spotify: "mdi:spotify",
  spop: "mdi:spotify",
  youtube: "mdi:youtube",
  youtube2: "mdi:youtube",
  tidal: "mdi:music-box",
  qobuz: "mdi:music-box",
  music_service: "mdi:music-box",
};

class VolumioBrowseSourceGrid extends LitElement {
  static get properties() {
    return {
      sources: { type: Array },
      volumioUrl: { type: String, attribute: "volumio-url" },
      configEntryId: { type: String, attribute: "config-entry-id" },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: var(--volumio-space-md, 16px);
        max-width: 960px;
      }

      .source-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;
        border-radius: 12px;
        background: var(--card-background-color, #1e1e1e);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        padding: var(--volumio-space-md, 16px);
        gap: var(--volumio-space-sm, 8px);
        text-align: center;
      }

      .source-card:hover {
        transform: scale(1.03);
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      }

      .source-icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-background-color, #121212);
      }

      .source-icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .source-icon ha-icon {
        --mdc-icon-size: 32px;
        color: var(--secondary-text-color);
      }

      .source-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--volumio-space-xxl, 48px);
        text-align: center;
        gap: var(--volumio-space-md, 16px);
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      .empty-state .message {
        font-size: 16px;
        color: var(--secondary-text-color);
      }
    `;
  }

  constructor() {
    super();
    this.sources = [];
    this.volumioUrl = "";
  }

  render() {
    if (!this.sources || this.sources.length === 0) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:music-box-multiple-outline"></ha-icon>
          <div class="message">No music sources configured</div>
        </div>
      `;
    }

    return html`
      <div class="grid">
        ${this.sources.map(src => this._renderSourceCard(src))}
      </div>
    `;
  }

  _renderSourceCard(source) {
    const icon = SOURCE_ICON_MAP[source.plugin_name]
      || SOURCE_ICON_MAP[source.plugin_type]
      || "mdi:music-box";
    const art = resolveArt(source.albumart || source.icon, this.volumioUrl, this.configEntryId);

    return html`
      <div
        class="source-card"
        @click=${() => this._selectSource(source)}
        title="${source.name}"
      >
        <div class="source-icon">
          ${art
            ? html`<img
                src="${art}"
                alt="${source.name}"
                @error=${this._onIconError}
              />`
            : html`<ha-icon icon="${icon}"></ha-icon>`}
        </div>
        <div class="source-name">${source.name}</div>
      </div>
    `;
  }

  _selectSource(source) {
    this.dispatchEvent(new CustomEvent("volumio-source-select", {
      detail: {
        uri: source.uri,
        name: source.name,
        plugin_name: source.plugin_name,
      },
      bubbles: true, composed: true,
    }));
  }

  _onIconError(e) {
    // Replace broken image with icon
    const parent = e.target.parentElement;
    e.target.remove();
    parent.innerHTML = `<ha-icon icon="mdi:music-box"></ha-icon>`;
  }
}

customElements.define("volumio-browse-source-grid", VolumioBrowseSourceGrid);
