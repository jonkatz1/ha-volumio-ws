/**
 * Artist Detail — artist view with albums grid, bio, and similar artists.
 *
 * Properties:
 *   artistName: string
 *   items: array - browse results (albums by this artist)
 *   loading: boolean - albums-grid loading
 *   volumioUrl: string
 *   bio: string|null - artist biography text (null = hide section)
 *   similarArtists: array - [{artist, albumart, uri}] (empty = hide section)
 *   bioLoading: boolean - bio section shows skeleton while true
 *   similarLoading: boolean - similar section shows skeleton while true
 *
 * Events:
 *   volumio-card-click: (from album cards)
 *   volumio-card-play: (from album cards)
 *   volumio-similar-artist-click: { artist, uri, albumart }
 */
import { LitElement, html, css } from "lit";
import { resolveArt } from "../utils/format-utils.js";
import "./album-card.js";

const BIO_TRUNCATE_WORDS = 200;

class VolumioArtistDetail extends LitElement {
  static get properties() {
    return {
      artistName: { type: String, attribute: "artist-name" },
      items: { type: Array },
      loading: { type: Boolean },
      volumioUrl: { type: String, attribute: "volumio-url" },
      bio: { type: String },
      similarArtists: { type: Array, attribute: false },
      bioLoading: { type: Boolean, attribute: "bio-loading" },
      similarLoading: { type: Boolean, attribute: "similar-loading" },
      _bioExpanded: { type: Boolean, state: true },
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

      /* ── Bio ─────────────────────────────── */
      .bio-text {
        font-size: 14px;
        line-height: 1.6;
        color: var(--primary-text-color);
        white-space: pre-wrap;
      }

      .bio-toggle {
        margin-top: var(--volumio-space-sm, 8px);
        background: none;
        border: none;
        padding: 0;
        font-size: 13px;
        font-weight: 500;
        color: var(--primary-color, #03a9f4);
        cursor: pointer;
      }

      .bio-toggle:hover {
        text-decoration: underline;
      }

      /* ── Similar artists ─────────────────── */
      .similar-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: var(--volumio-space-md, 16px);
      }

      .similar-card {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--volumio-space-sm, 8px);
        padding: var(--volumio-space-sm, 8px);
        border-radius: 8px;
        transition: background 0.15s;
      }

      .similar-card:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.06));
      }

      .similar-art {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 50%;
        overflow: hidden;
        background: var(--card-background-color, #2a2a2a);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .similar-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .similar-art ha-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      .similar-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        width: 100%;
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

      .skeleton-bar {
        height: 14px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        margin-bottom: 8px;
      }

      .skeleton-bar.w-full { width: 100%; }
      .skeleton-bar.w-90 { width: 90%; }
      .skeleton-bar.w-75 { width: 75%; }
      .skeleton-bar.w-60 { width: 60%; }

      .skeleton-similar-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: var(--volumio-space-md, 16px);
      }

      .skeleton-similar-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--volumio-space-sm, 8px);
      }

      .skeleton-similar-art {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 50%;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-similar-name {
        width: 70%;
        height: 14px;
        border-radius: 4px;
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
    this.bio = null;
    this.similarArtists = [];
    this.bioLoading = false;
    this.similarLoading = false;
    this._bioExpanded = false;
  }

  updated(changedProperties) {
    // Reset expansion when artist changes so a new bio doesn't inherit
    // the previous artist's expanded state.
    if (changedProperties.has("artistName") || changedProperties.has("bio")) {
      this._bioExpanded = false;
    }
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

      ${this._renderBioSection()}
      ${this._renderSimilarSection()}
    `;
  }

  _renderBioSection() {
    // Show section while loading OR when bio exists. Hide if loaded and empty.
    if (this.bioLoading) {
      return html`
        <div class="section" aria-busy="true" aria-label="Loading artist bio">
          <div class="section-title">About</div>
          <div class="skeleton-bar w-full"></div>
          <div class="skeleton-bar w-90"></div>
          <div class="skeleton-bar w-75"></div>
        </div>
      `;
    }
    if (!this.bio) return "";

    const words = this.bio.split(/\s+/);
    const truncated = words.length > BIO_TRUNCATE_WORDS && !this._bioExpanded;
    const displayText = truncated
      ? words.slice(0, BIO_TRUNCATE_WORDS).join(" ") + "…"
      : this.bio;

    return html`
      <div class="section">
        <div class="section-title">About</div>
        <div class="bio-text">${displayText}</div>
        ${words.length > BIO_TRUNCATE_WORDS
          ? html`
            <button class="bio-toggle" @click=${this._toggleBio}>
              ${this._bioExpanded ? "Show less" : "Read more"}
            </button>
          `
          : ""}
      </div>
    `;
  }

  _renderSimilarSection() {
    if (this.similarLoading) {
      return html`
        <div class="section" aria-busy="true" aria-label="Loading similar artists">
          <div class="section-title">Similar Artists</div>
          <div class="skeleton-similar-grid">
            ${Array(6).fill(0).map(() => html`
              <div class="skeleton-similar-card">
                <div class="skeleton-similar-art"></div>
                <div class="skeleton-similar-name"></div>
              </div>
            `)}
          </div>
        </div>
      `;
    }
    if (!this.similarArtists || this.similarArtists.length === 0) return "";

    return html`
      <div class="section">
        <div class="section-title">Similar Artists</div>
        <div class="similar-grid">
          ${this.similarArtists.map(sim => {
            const art = resolveArt(sim.albumart, this.volumioUrl);
            return html`
              <div
                class="similar-card"
                role="button"
                tabindex="0"
                @click=${() => this._onSimilarClick(sim)}
                @keydown=${(e) => this._onSimilarKeydown(e, sim)}
              >
                <div class="similar-art">
                  ${art
                    ? html`<img src="${art}" alt="${sim.artist || ""}" @error=${this._onArtError} />`
                    : html`<ha-icon icon="mdi:account-music"></ha-icon>`}
                </div>
                <div class="similar-name">${sim.artist || "Unknown"}</div>
              </div>
            `;
          })}
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

  _toggleBio() {
    this._bioExpanded = !this._bioExpanded;
  }

  _onSimilarClick(sim) {
    this.dispatchEvent(new CustomEvent("volumio-similar-artist-click", {
      detail: {
        artist: sim.artist || "",
        uri: sim.uri || "",
        albumart: sim.albumart || "",
      },
      bubbles: true, composed: true,
    }));
  }

  _onSimilarKeydown(e, sim) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._onSimilarClick(sim);
    }
  }

  _onArtError(e) {
    const container = e.target.parentElement;
    e.target.remove();
    container.innerHTML = `<ha-icon icon="mdi:account-music"></ha-icon>`;
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
