/**
 * Album Detail — single album view with header metadata and track listing.
 *
 * Properties:
 *   albumTitle: string
 *   albumArtist: string
 *   albumArt: string - resolved URL
 *   albumUri: string
 *   albumService: string
 *   tracks: array - track items from browseLibrary
 *   loading: boolean
 *   currentUri: string - currently playing track URI
 *   quality: object - QualityInfo for album-level badge
 *   volumioUrl: string
 *
 * Events:
 *   volumio-track-click: { uri, title, artist, ... }
 *   volumio-album-play: { uri }
 *   volumio-album-add-queue: { uri }
 *   volumio-navigate: { view, artist }
 */
import { LitElement, html, css } from "lit";
import { formatTime, resolveArt } from "../utils/format-utils.js";
import { inferTrackQuality } from "../utils/quality-utils.js";
import "./track-card.js";
import "./quality-badge.js";
import "./source-badge.js";

class VolumioAlbumDetail extends LitElement {
  static get properties() {
    return {
      albumTitle: { type: String, attribute: "album-title" },
      albumArtist: { type: String, attribute: "album-artist" },
      albumArt: { type: String, attribute: "album-art" },
      albumUri: { type: String, attribute: "album-uri" },
      albumService: { type: String, attribute: "album-service" },
      tracks: { type: Array },
      loading: { type: Boolean },
      currentUri: { type: String, attribute: "current-uri" },
      quality: { type: Object },
      volumioUrl: { type: String, attribute: "volumio-url" },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      /* ── Header ──────────────────────────── */
      .album-header {
        display: flex;
        gap: var(--volumio-space-lg, 24px);
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .album-art-container {
        flex-shrink: 0;
        width: 250px;
        height: 250px;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
      }

      .album-art-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .album-art-placeholder {
        width: 100%;
        height: 100%;
        background: var(--card-background-color, #2a2a2a);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .album-art-placeholder ha-icon {
        --mdc-icon-size: 64px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      .album-meta {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: var(--volumio-space-xs, 4px);
        min-width: 0;
      }

      .meta-type {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
      }

      .album-name {
        font-size: 28px;
        font-weight: 700;
        color: var(--primary-text-color);
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .album-artist-link {
        font-size: 16px;
        color: var(--secondary-text-color);
        cursor: pointer;
        transition: color 0.15s;
      }

      .album-artist-link:hover {
        color: var(--primary-text-color);
        text-decoration: underline;
      }

      .meta-details {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-sm, 8px);
        flex-wrap: wrap;
        margin-top: var(--volumio-space-xs, 4px);
      }

      .meta-details .detail {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .meta-details .sep {
        color: var(--secondary-text-color);
        opacity: 0.4;
      }

      .album-actions {
        display: flex;
        gap: var(--volumio-space-sm, 8px);
        margin-top: var(--volumio-space-md, 16px);
      }

      .action-btn {
        padding: 10px 24px;
        border-radius: 20px;
        border: none;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: opacity 0.15s;
      }

      .action-btn:hover {
        opacity: 0.85;
      }

      .action-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      .action-btn.primary {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }

      .action-btn.secondary {
        background: var(--divider-color, rgba(255, 255, 255, 0.12));
        color: var(--primary-text-color);
      }

      /* ── Track list ──────────────────────── */
      .track-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .track-list-header {
        display: grid;
        grid-template-columns: 40px 1fr 1fr 0.8fr auto 60px 32px;
        align-items: center;
        height: 36px;
        padding: 0 12px;
        gap: 8px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        background: var(--card-background-color, #1e1e1e);
      }

      .track-list-header .hdr-duration {
        text-align: right;
      }

      /* ── Loading skeleton ─────────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-header {
        display: flex;
        gap: var(--volumio-space-lg, 24px);
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .skeleton-art {
        width: 250px;
        height: 250px;
        border-radius: 6px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        flex-shrink: 0;
      }

      .skeleton-meta {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 8px;
      }

      .skeleton-bar {
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-bar.title { width: 60%; height: 28px; }
      .skeleton-bar.artist { width: 30%; height: 16px; }
      .skeleton-bar.detail { width: 45%; height: 14px; }

      .skeleton-tracks {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .skeleton-track {
        height: 48px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      /* ── Responsive ──────────────────────── */
      @media (max-width: 768px) {
        .album-header {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .album-art-container {
          width: 200px;
          height: 200px;
        }

        .album-meta {
          align-items: center;
        }

        .album-actions {
          justify-content: center;
        }

        .track-list-header {
          grid-template-columns: 40px 1fr 0.8fr 60px 32px;
        }

        .track-list-header .hdr-album,
        .track-list-header .hdr-quality {
          display: none;
        }
      }
    `;
  }

  constructor() {
    super();
    this.albumTitle = "";
    this.albumArtist = "";
    this.albumArt = "";
    this.albumUri = "";
    this.albumService = "";
    this.tracks = [];
    this.loading = false;
    this.currentUri = "";
    this.quality = null;
    this.volumioUrl = "";
  }

  render() {
    if (this.loading) {
      return this._renderSkeleton();
    }

    const trackCount = this.tracks.length;
    const totalDuration = this.tracks.reduce((sum, t) => sum + (t.duration || 0), 0);

    return html`
      <div class="album-header">
        <div class="album-art-container">
          ${this.albumArt
            ? html`<img src="${resolveArt(this.albumArt, this.volumioUrl)}" alt="${this.albumTitle}" @error=${this._onArtError} />`
            : html`<div class="album-art-placeholder">
                <ha-icon icon="mdi:album"></ha-icon>
              </div>`}
        </div>
        <div class="album-meta">
          <span class="meta-type">Album</span>
          <div class="album-name">${this.albumTitle || "Unknown Album"}</div>
          ${this.albumArtist
            ? html`<span class="album-artist-link" @click=${this._goToArtist}>
                ${this.albumArtist}
              </span>`
            : ""}
          <div class="meta-details">
            ${trackCount > 0 ? html`<span class="detail">${trackCount} track${trackCount !== 1 ? "s" : ""}</span>` : ""}
            ${trackCount > 0 && totalDuration > 0 ? html`<span class="sep">·</span>` : ""}
            ${totalDuration > 0 ? html`<span class="detail">${formatTime(totalDuration)}</span>` : ""}
            ${this.albumService ? html`
              <span class="sep">·</span>
              <volumio-source-badge .source=${this.albumService}></volumio-source-badge>
            ` : ""}
          </div>
          ${this.quality && this.quality.tier !== "unknown" ? html`
            <div style="margin-top: 4px">
              <volumio-quality-badge .quality=${this.quality}></volumio-quality-badge>
            </div>
          ` : ""}
          <div class="album-actions">
            <button class="action-btn primary" @click=${this._playAlbum}>
              <ha-icon icon="mdi:play"></ha-icon> Play
            </button>
            <button class="action-btn secondary" @click=${this._addToQueue}>
              <ha-icon icon="mdi:playlist-plus"></ha-icon> Add to Queue
            </button>
            <button class="action-btn secondary" @click=${this._onMoreClick}>
              <ha-icon icon="mdi:dots-horizontal"></ha-icon>
            </button>
          </div>
        </div>
      </div>

      ${trackCount > 0 ? html`
        <div class="track-list">
          <div class="track-list-header">
            <span>#</span>
            <span>Title</span>
            <span>Artist</span>
            <span class="hdr-album">Album</span>
            <span class="hdr-quality">Quality</span>
            <span class="hdr-duration">Time</span>
            <span></span>
          </div>
          ${this.tracks.map((track, i) => {
            const art = resolveArt(track.albumart || this.albumArt, this.volumioUrl);
            const quality = inferTrackQuality(track);
            return html`
              <volumio-track-card
                .index=${i + 1}
                title="${track.title || track.name || ""}"
                artist="${track.artist || this.albumArtist || ""}"
                album="${track.album || this.albumTitle || ""}"
                .duration=${track.duration || 0}
                uri="${track.uri || ""}"
                albumart="${art}"
                service="${track.service || this.albumService || ""}"
                type="${track.type || "song"}"
                .quality=${quality}
                ?is-playing=${this.currentUri && track.uri === this.currentUri}
                @volumio-track-click=${this._onTrackClick}
              ></volumio-track-card>
            `;
          })}
        </div>
      ` : html`
        <div style="text-align: center; padding: 32px; color: var(--secondary-text-color);">
          No tracks found
        </div>
      `}
    `;
  }

  _renderSkeleton() {
    return html`
      <div aria-busy="true" aria-label="Loading album">
        <div class="skeleton-header">
          <div class="skeleton-art"></div>
          <div class="skeleton-meta">
            <div class="skeleton-bar title"></div>
            <div class="skeleton-bar artist"></div>
            <div class="skeleton-bar detail"></div>
          </div>
        </div>
        <div class="skeleton-tracks">
          ${Array(8).fill(0).map(() => html`<div class="skeleton-track"></div>`)}
        </div>
      </div>
    `;
  }

  _playAlbum() {
    this.dispatchEvent(new CustomEvent("volumio-album-play", {
      detail: { uri: this.albumUri },
      bubbles: true, composed: true,
    }));
  }

  _addToQueue() {
    this.dispatchEvent(new CustomEvent("volumio-album-add-queue", {
      detail: { uri: this.albumUri },
      bubbles: true, composed: true,
    }));
  }

  _goToArtist() {
    this.dispatchEvent(new CustomEvent("volumio-navigate", {
      detail: { view: "artist-detail", artist: this.albumArtist },
      bubbles: true, composed: true,
    }));
  }

  _onTrackClick(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("volumio-track-click", {
      detail: e.detail,
      bubbles: true, composed: true,
    }));
  }

  _onMoreClick(e) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    this.dispatchEvent(new CustomEvent("volumio-context-menu", {
      detail: {
        uri: this.albumUri,
        title: this.albumTitle,
        artist: this.albumArtist,
        albumart: this.albumArt,
        service: this.albumService,
        type: "album",
        x: rect.right,
        y: rect.bottom,
        context: "album",
      },
      bubbles: true, composed: true,
    }));
  }

  _onArtError(e) {
    const container = e.target.parentElement;
    e.target.remove();
    container.innerHTML = `<div class="album-art-placeholder"><ha-icon icon="mdi:album"></ha-icon></div>`;
  }
}

customElements.define("volumio-album-detail", VolumioAlbumDetail);
