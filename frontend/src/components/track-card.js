/**
 * Track Card — reusable track list row.
 *
 * Properties:
 *   index: number - display position (1-based)
 *   title: string
 *   artist: string
 *   album: string
 *   duration: number - seconds
 *   uri: string
 *   albumart: string
 *   service: string
 *   type: string
 *   quality: object - QualityInfo (optional)
 *   isPlaying: boolean - highlight as currently playing
 *
 * Events:
 *   volumio-track-click: { uri, title, artist, album, albumart, service, type, index }
 *   volumio-track-play: { ... same }
 *   volumio-track-context: { ... same, x, y }
 */
import { LitElement, html, css } from "lit";
import { formatTime } from "../utils/format-utils.js";
import "./quality-badge.js";

class VolumioTrackCard extends LitElement {
  static get properties() {
    return {
      index: { type: Number },
      title: { type: String },
      artist: { type: String },
      album: { type: String },
      duration: { type: Number },
      uri: { type: String },
      albumart: { type: String },
      service: { type: String },
      type: { type: String },
      quality: { type: Object },
      isPlaying: { type: Boolean, attribute: "is-playing" },
      compact: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .row {
        display: grid;
        grid-template-columns: 40px 1fr 1fr 0.8fr auto 60px 32px;
        align-items: center;
        height: 48px;
        padding: 0 12px;
        cursor: pointer;
        transition: background 0.1s;
        position: relative;
        gap: 8px;
      }

      .row:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.06));
      }

      .row.playing {
        border-left: 3px solid var(--primary-color, #03a9f4);
      }

      .row.playing .cell-title {
        color: var(--primary-color, #03a9f4);
      }

      /* ── Cells ──────────────────────────── */
      .cell-num {
        font-size: 13px;
        color: var(--secondary-text-color);
        text-align: center;
        position: relative;
      }

      .cell-num .num-text {
        display: block;
      }

      .cell-num .play-icon {
        display: none;
        color: var(--primary-text-color);
      }

      .row:hover .cell-num .num-text {
        display: none;
      }

      .row:hover .cell-num .play-icon {
        display: block;
      }

      .row.playing .cell-num .num-text {
        display: none;
      }

      .row.playing .cell-num .eq-icon {
        display: block;
        color: var(--primary-color, #03a9f4);
      }

      .row.playing:not(:hover) .cell-num .play-icon {
        display: none;
      }

      .eq-icon {
        display: none;
      }

      .cell-num litgui-icon {
        --mdc-icon-size: 18px;
      }

      .cell-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .cell-artist,
      .cell-album {
        font-size: 13px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .cell-quality {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .cell-duration {
        font-size: 13px;
        color: var(--secondary-text-color);
        text-align: right;
        font-variant-numeric: tabular-nums;
      }

      .cell-context {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.1s;
      }

      .row:hover .cell-context {
        opacity: 1;
      }

      .context-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }

      .context-btn:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
      }

      .context-btn litgui-icon {
        --mdc-icon-size: 18px;
      }

      /* ── Compact mode (browse — no quality/time/album) ── */
      .row.compact {
        grid-template-columns: 40px 1.5fr 1fr 32px;
      }

      .row.compact .cell-quality,
      .row.compact .cell-duration,
      .row.compact .cell-album {
        display: none;
      }

      /* ── Responsive (hide album & quality) ── */
      @media (max-width: 768px) {
        .row {
          grid-template-columns: 40px 1fr 0.8fr 60px 32px;
        }
        .cell-album,
        .cell-quality {
          display: none;
        }
      }

      @media (max-width: 480px) {
        .row {
          grid-template-columns: 32px 1fr 50px;
          gap: 4px;
        }
        .cell-artist,
        .cell-album,
        .cell-quality,
        .cell-context {
          display: none;
        }
      }
    `;
  }

  constructor() {
    super();
    this.index = 0;
    this.title = "";
    this.artist = "";
    this.album = "";
    this.duration = 0;
    this.uri = "";
    this.albumart = "";
    this.service = "";
    this.type = "song";
    this.quality = null;
    this.isPlaying = false;
    this.compact = false;
  }

  render() {
    return html`
      <div
        class="row ${this.isPlaying ? "playing" : ""} ${this.compact ? "compact" : ""}"
        @click=${this._onClick}
        @contextmenu=${this._onContextMenu}
      >
        <div class="cell-num">
          <span class="num-text">${this.index || ""}</span>
          <litgui-icon class="play-icon" icon="mdi:play"></litgui-icon>
          <litgui-icon class="eq-icon" icon="mdi:equalizer"></litgui-icon>
        </div>
        <div class="cell-title" title="${this.title}">${this.title || "—"}</div>
        <div class="cell-artist" title="${this.artist}">${this.artist || ""}</div>
        <div class="cell-album" title="${this.album}">${this.album || ""}</div>
        <div class="cell-quality">
          ${this.quality && this.quality.tier !== "unknown"
            ? html`<volumio-quality-badge .quality=${this.quality} size="small"></volumio-quality-badge>`
            : ""}
        </div>
        <div class="cell-duration">${this.duration ? formatTime(this.duration) : ""}</div>
        <div class="cell-context">
          <button class="context-btn" @click=${this._onDotsClick} title="More actions">
            <litgui-icon icon="mdi:dots-vertical"></litgui-icon>
          </button>
        </div>
      </div>
    `;
  }

  _getItemData() {
    return {
      uri: this.uri,
      title: this.title,
      artist: this.artist,
      album: this.album,
      albumart: this.albumart,
      service: this.service,
      type: this.type,
      index: this.index,
    };
  }

  _onClick() {
    this.dispatchEvent(new CustomEvent("volumio-track-click", {
      detail: this._getItemData(),
      bubbles: true, composed: true,
    }));
  }

  _onDotsClick(e) {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    this._fireContextEvent(rect.right, rect.bottom);
  }

  _onContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    this._fireContextEvent(e.clientX, e.clientY);
  }

  _fireContextEvent(x, y) {
    this.dispatchEvent(new CustomEvent("volumio-context-menu", {
      detail: { ...this._getItemData(), x, y, context: "track" },
      bubbles: true, composed: true,
    }));
  }
}

customElements.define("volumio-track-card", VolumioTrackCard);
