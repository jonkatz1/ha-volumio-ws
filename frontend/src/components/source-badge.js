/**
 * Source Badge — small label indicating music service.
 *
 * Properties:
 *   source: string - Volumio service/plugin_name (e.g. "qobuz", "mpd", "webradio")
 */
import { LitElement, html, css } from "lit";

// Map plugin_name to display label
const SOURCE_LABELS = {
  qobuz: "Qobuz",
  tidal: "TIDAL",
  mpd: "Local",
  webradio: "Radio",
  spotify: "Spotify",
  spop: "Spotify",
  pandora: "Pandora",
  youtube: "YouTube",
  youtube2: "YouTube",
};

// Map plugin_name to mdi icon
const SOURCE_ICONS = {
  mpd: "mdi:folder-music",
  webradio: "mdi:radio",
};

class VolumioSourceBadge extends LitElement {
  static get properties() {
    return {
      source: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-flex;
        align-items: center;
      }

      .source {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: var(--secondary-text-color, #727272);
        white-space: nowrap;
      }

      ha-icon {
        --mdc-icon-size: 14px;
        width: 14px;
        height: 14px;
      }
    `;
  }

  constructor() {
    super();
    this.source = "";
  }

  render() {
    if (!this.source) return html``;

    const label = SOURCE_LABELS[this.source] || this.source;
    const icon = SOURCE_ICONS[this.source] || null;

    return html`
      <span class="source">
        ${icon ? html`<ha-icon icon="${icon}"></ha-icon>` : ""}
        ${label}
      </span>
    `;
  }
}

customElements.define("volumio-source-badge", VolumioSourceBadge);
