/**
 * Artist Detail — artist view with albums grid and placeholder sections.
 *
 * Properties:
 *   artistName: string
 *   items: array - browse results (albums by this artist)
 *   loading: boolean
 *   volumioUrl: string
 *
 * Events:
 *   volumio-card-click: (from album cards)
 *   volumio-card-play: (from album cards)
 */
import { LitElement, html, css } from "lit";
import { resolveArt } from "../utils/format-utils.js";
import "./album-card.js";

class VolumioArtistDetail extends LitElement {
  static get properties() {
    return {
      artistName: { type: String, attribute: "artist-name" },
      items: { type: Array },
      loading: { type: Boolean },
      volumioUrl: { type: String, attribute: "volumio-url" },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      .artist-header {
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .artist-name {
        font-size: 28px;
        font-weight: 700;
        color: var(--primary-text-color);
        line-height: 1.2;
      }

      .section {
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: var(--volumio-space-md, 16px);
      }

      .albums-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--volumio-space-md, 16px);
      }

      .placeholder-section {
        padding: var(--volumio-space-lg, 24px);
        border-radius: 8px;
        background: var(--card-background-color, #1e1e1e);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        color: var(--secondary-text-color);
        font-size: 14px;
        text-align: center;
      }

      /* ── Loading skeleton ─────────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-name {
        width: 40%;
        height: 28px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .skeleton-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--volumio-space-md, 16px);
      }

      .skeleton-card {
        aspect-ratio: 1;
        border-radius: 6px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .empty-state {
        text-align: center;
        padding: var(--volumio-space-xl, 32px);
        color: var(--secondary-text-color);
        font-size: 14px;
      }
    `;
  }

  constructor() {
    super();
    this.artistName = "";
    this.items = [];
    this.loading = false;
    this.volumioUrl = "";
  }

  render() {
    if (this.loading) {
      return this._renderSkeleton();
    }

    return html`
      <div class="artist-header">
        <div class="artist-name">${this.artistName || "Unknown Artist"}</div>
      </div>

      <div class="section">
        <div class="section-title">Albums</div>
        ${this.items && this.items.length > 0
          ? html`
            <div class="albums-grid">
              ${this.items.map(item => {
                const art = resolveArt(item.albumart || item.icon, this.volumioUrl);
                return html`
                  <volumio-album-card
                    title="${item.title || item.name || ""}"
                    artist="${item.artist || this.artistName || ""}"
                    albumart="${art}"
                    uri="${item.uri || ""}"
                    type="album"
                    service="${item.service || ""}"
                    @volumio-card-click=${this._onCardClick}
                    @volumio-card-play=${this._onCardPlay}
                  ></volumio-album-card>
                `;
              })}
            </div>
          `
          : html`<div class="empty-state">No albums found</div>`}
      </div>

      <div class="section">
        <div class="section-title">About</div>
        <div class="placeholder-section">
          Artist information coming soon
        </div>
      </div>

      <div class="section">
        <div class="section-title">Similar Artists</div>
        <div class="placeholder-section">
          Similar artists coming soon
        </div>
      </div>
    `;
  }

  _renderSkeleton() {
    return html`
      <div aria-busy="true" aria-label="Loading artist">
        <div class="skeleton-name"></div>
        <div class="skeleton-grid">
          ${Array(6).fill(0).map(() => html`<div class="skeleton-card"></div>`)}
        </div>
      </div>
    `;
  }

  _onCardClick(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("volumio-card-click", {
      detail: e.detail,
      bubbles: true, composed: true,
    }));
  }

  _onCardPlay(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("volumio-card-play", {
      detail: e.detail,
      bubbles: true, composed: true,
    }));
  }
}

customElements.define("volumio-artist-detail", VolumioArtistDetail);
