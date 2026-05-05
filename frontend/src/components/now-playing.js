/**
 * Now Playing — hero view with album art and UltraBlur background.
 *
 * Properties:
 *   playerState: string
 *   title: string
 *   artist: string
 *   album: string
 *   albumArt: string - resolved URL
 *   quality: object - QualityInfo
 *   source: string
 *   isFavorite: boolean
 *
 * Events:
 *   volumio-command: { command, value }
 *   volumio-navigate: { view }
 *   volumio-toggle-favorite: {}
 */
import { LitElement, html, css } from "lit";
import "./quality-badge.js";
import "./source-badge.js";

class VolumioNowPlaying extends LitElement {
  static get properties() {
    return {
      playerState: { type: String, attribute: "player-state" },
      title: { type: String },
      artist: { type: String },
      album: { type: String },
      albumArt: { type: String, attribute: "album-art" },
      quality: { type: Object },
      source: { type: String },
      isFavorite: { type: Boolean, attribute: "is-favorite" },
      _dominantColor: { type: String, state: true },
      _showLightbox: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        height: 100%;
        position: relative;
        overflow: hidden;
      }

      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100%;
        padding: var(--volumio-space-xl, 32px);
        position: relative;
        z-index: 1;
      }

      /* ── UltraBlur background ──────────────────── */
      .ultra-blur {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
      }

      .ultra-blur-gradient {
        position: absolute;
        inset: 0;
        opacity: 0.5;
        filter: blur(120px);
        transition: background 1s ease;
      }

      .ultra-blur-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(
          ellipse at center,
          transparent 30%,
          var(--primary-background-color, #121212) 100%
        );
      }

      /* ── Album art ─────────────────────────────── */
      .art-container {
        position: relative;
        margin-bottom: var(--volumio-space-lg, 24px);
        max-width: 400px;
        width: 50%;
        min-width: 200px;
        aspect-ratio: 1;
        cursor: pointer;
      }

      .art {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        object-fit: cover;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s, box-shadow 4s ease;
      }

      .art.playing {
        animation: artPulse 4s ease-in-out infinite;
      }

      .art.paused {
        opacity: 0.85;
      }

      @keyframes artPulse {
        0%, 100% { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5); }
        50% { box-shadow: 0 6px 32px rgba(0, 0, 0, 0.6); }
      }

      .art-placeholder {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        background: var(--card-background-color, #2a2a2a);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .art-placeholder ha-icon {
        --mdc-icon-size: 80px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      /* ── Track info ────────────────────────────── */
      .info {
        text-align: center;
        max-width: 500px;
        width: 100%;
      }

      .title-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--volumio-space-sm, 8px);
        margin-bottom: var(--volumio-space-sm, 8px);
      }

      .track-title {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary-text-color);
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .fav-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        padding: 0;
        transition: transform 0.3s ease;
      }

      .fav-btn:hover {
        transform: scale(1.1);
      }

      .fav-btn ha-icon {
        --mdc-icon-size: 24px;
      }

      .fav-btn.active ha-icon {
        color: #e91e63;
      }

      .fav-btn:not(.active) ha-icon {
        color: var(--secondary-text-color);
      }

      .track-artist {
        font-size: 18px;
        font-weight: 500;
        color: var(--secondary-text-color);
        line-height: 1.3;
        margin-bottom: var(--volumio-space-xs, 4px);
        cursor: pointer;
      }

      .track-artist:hover {
        color: var(--primary-text-color);
        text-decoration: underline;
      }

      .track-album {
        font-size: 16px;
        color: var(--secondary-text-color);
        line-height: 1.3;
        margin-bottom: var(--volumio-space-md, 16px);
        cursor: pointer;
      }

      .track-album:hover {
        color: var(--primary-text-color);
        text-decoration: underline;
      }

      .quality-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--volumio-space-sm, 8px);
      }

      /* ── Empty / stopped state ─────────────────── */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100%;
        padding: var(--volumio-space-xxl, 48px);
        text-align: center;
        gap: var(--volumio-space-md, 16px);
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.4;
      }

      .empty-state .message {
        font-size: 16px;
        color: var(--secondary-text-color);
      }

      .browse-btn {
        padding: 10px 24px;
        border-radius: 20px;
        border: none;
        background: var(--primary-color, #03a9f4);
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .browse-btn:hover {
        opacity: 0.85;
      }

      /* ── Lightbox ──────────────────────────────── */
      .lightbox {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.9);
        cursor: pointer;
      }

      .lightbox img {
        max-width: 90vw;
        max-height: 90vh;
        border-radius: 8px;
        box-shadow: 0 8px 48px rgba(0, 0, 0, 0.8);
      }

      @media (prefers-reduced-motion: reduce) {
        .art.playing {
          animation: none;
        }
      }

      /* ── Skeleton / loading state ──────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--volumio-space-xxl, 48px);
        gap: var(--volumio-space-md, 16px);
      }

      .skeleton-art {
        width: 50%;
        max-width: 400px;
        min-width: 200px;
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
      }

      .skeleton-bar.title { width: 60%; height: 22px; }
      .skeleton-bar.artist { width: 40%; }
      .skeleton-bar.album { width: 30%; }
    `;
  }

  constructor() {
    super();
    this.playerState = "idle";
    this.title = "";
    this.artist = "";
    this.album = "";
    this.albumArt = "";
    this.quality = null;
    this.source = "";
    this.isFavorite = false;
    this._dominantColor = null;
    this._showLightbox = false;
    this._canvas = null;
  }

  updated(changed) {
    if (changed.has("albumArt") && this.albumArt) {
      this._extractDominantColor(this.albumArt);
    }
  }

  render() {
    if (this.playerState === "unavailable") {
      return this._renderSkeleton();
    }

    const isActive = this.playerState === "playing" || this.playerState === "paused";

    if (!isActive && !this.title) {
      return this._renderEmpty();
    }

    return html`
      <div class="ultra-blur">
        <div
          class="ultra-blur-gradient"
          style="background: ${this._dominantColor
            ? `radial-gradient(ellipse at 50% 40%, ${this._dominantColor} 0%, transparent 85%)`
            : "transparent"}"
        ></div>
        <div class="ultra-blur-overlay"></div>
      </div>

      <div class="container">
        <div class="art-container" @click=${this._toggleLightbox}>
          ${this.albumArt
            ? html`<img
                class="art ${this.playerState}"
                src="${this.albumArt}"
                alt="Album art for ${this.album || this.title}"
                @error=${this._onArtError}
              />`
            : html`<div class="art-placeholder">
                <ha-icon icon="mdi:music-note"></ha-icon>
              </div>`}
        </div>

        <div class="info">
          <div class="title-row">
            <span class="track-title">${this.title || "—"}</span>
            <button
              class="fav-btn ${this.isFavorite ? "active" : ""}"
              @click=${this._toggleFavorite}
              aria-label="${this.isFavorite ? "Remove from favorites" : "Add to favorites"}"
            >
              <ha-icon icon="${this.isFavorite ? "mdi:heart" : "mdi:heart-outline"}"></ha-icon>
            </button>
          </div>

          ${this.artist ? html`
            <div class="track-artist" @click=${this._goToArtist}>${this.artist}</div>
          ` : ""}

          ${this.album ? html`
            <div class="track-album" @click=${this._goToAlbum}>${this.album}</div>
          ` : ""}

          <div class="quality-row">
            <volumio-quality-badge .quality=${this.quality} size="large"></volumio-quality-badge>
            <volumio-source-badge .source=${this.source}></volumio-source-badge>
          </div>
        </div>
      </div>

      ${this._showLightbox && this.albumArt ? html`
        <div class="lightbox" @click=${this._toggleLightbox} @keydown=${this._onLightboxKey}>
          <img src="${this.albumArt}" alt="Full size album art" />
        </div>
      ` : ""}
    `;
  }

  _renderEmpty() {
    return html`
      <div class="empty-state">
        <ha-icon icon="mdi:music-note-off"></ha-icon>
        <div class="message">Nothing playing</div>
        <button class="browse-btn" @click=${this._goToBrowse}>Browse Music</button>
      </div>
    `;
  }

  _renderSkeleton() {
    return html`
      <div class="skeleton" aria-busy="true" aria-label="Loading">
        <div class="skeleton-art"></div>
        <div class="skeleton-bar title"></div>
        <div class="skeleton-bar artist"></div>
        <div class="skeleton-bar album"></div>
      </div>
    `;
  }

  // ── UltraBlur: dominant color extraction ───────────────────

  async _extractDominantColor(url) {
    if (!url) {
      this._dominantColor = null;
      return;
    }

    try {
      const img = new Image();
      img.src = url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      if (!this._canvas) {
        this._canvas = document.createElement("canvas");
      }
      const canvas = this._canvas;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      // Sample at low resolution for performance
      const size = 10;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const data = ctx.getImageData(0, 0, size, size).data;
      let r = 0, g = 0, b = 0;
      const count = size * size;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      // Boost color so dark album art still produces a visible tint
      const max = Math.max(r, g, b) / 255;
      const min = Math.min(r, g, b) / 255;
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        const rn = r / 255, gn = g / 255, bn = b / 255;
        if (rn === max) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        else if (gn === max) h = ((bn - rn) / d + 2) / 6;
        else h = ((rn - gn) / d + 4) / 6;
      }

      // Ensure minimum lightness and boost saturation
      l = Math.max(l, 0.4);
      s = Math.min(s * 1.3, 1.0);

      // HSL back to RGB
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
      g = Math.round(hue2rgb(p, q, h) * 255);
      b = Math.round(hue2rgb(p, q, h - 1/3) * 255);

      this._dominantColor = `rgb(${r}, ${g}, ${b})`;
    } catch {
      // CORS or other error — fall back to no tint
      this._dominantColor = null;
    }
  }

  // ── Handlers ───────────────────────────────────────────────

  _toggleFavorite() {
    this.dispatchEvent(new CustomEvent("volumio-toggle-favorite", {
      bubbles: true, composed: true,
    }));
  }

  _toggleLightbox() {
    this._showLightbox = !this._showLightbox;
  }

  _onLightboxKey(e) {
    if (e.key === "Escape") {
      this._showLightbox = false;
    }
  }

  _goToArtist() {
    // Wired for future navigation — no-op until T18
    this.dispatchEvent(new CustomEvent("volumio-navigate", {
      detail: { view: "artist-detail", artist: this.artist },
      bubbles: true, composed: true,
    }));
  }

  _goToAlbum() {
    // Wired for future navigation — no-op until T18
    this.dispatchEvent(new CustomEvent("volumio-navigate", {
      detail: { view: "album-detail", album: this.album },
      bubbles: true, composed: true,
    }));
  }

  _goToBrowse() {
    this.dispatchEvent(new CustomEvent("volumio-navigate", {
      detail: { view: "browse" },
      bubbles: true, composed: true,
    }));
  }

  _onArtError(e) {
    e.target.style.display = "none";
  }
}

customElements.define("volumio-now-playing", VolumioNowPlaying);
