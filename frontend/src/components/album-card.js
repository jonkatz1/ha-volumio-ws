/**
 * Album Card — reusable grid card for albums/folders.
 *
 * Properties:
 *   title: string
 *   artist: string
 *   albumart: string - resolved URL
 *   uri: string
 *   type: string - Volumio item type
 *   quality: object - QualityInfo (optional)
 *   service: string
 *
 * Events:
 *   volumio-card-click: { uri, title, artist, albumart, type, service }
 *   volumio-card-play: { uri, title, artist, albumart, type, service }
 *   volumio-card-context: { uri, title, artist, albumart, type, service }
 */
import { LitElement, html, css } from "lit";
import "./quality-badge.js";

class VolumioAlbumCard extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      artist: { type: String },
      albumart: { type: String },
      uri: { type: String },
      type: { type: String },
      quality: { type: Object },
      service: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 180px;
      }

      .card {
        cursor: pointer;
        border-radius: 6px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        position: relative;
      }

      .card:hover {
        transform: scale(1.03);
      }

      .card:hover .play-overlay {
        opacity: 1;
      }

      .card:hover .art {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
      }

      .art-container {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        border-radius: 6px;
        overflow: hidden;
        background: var(--card-background-color, #2a2a2a);
      }

      .art {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: box-shadow 0.15s ease;
      }

      .art-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--card-background-color, #2a2a2a);
      }

      .art-placeholder ha-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      .play-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: rgba(0, 0, 0, 0.4);
        opacity: 0;
        transition: opacity 0.15s ease;
        border-radius: 6px;
      }

      .play-btn,
      .queue-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .play-btn {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }

      .play-btn ha-icon {
        --mdc-icon-size: 22px;
      }

      .queue-btn {
        width: 36px;
        height: 36px;
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
      }

      .queue-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .queue-btn ha-icon {
        --mdc-icon-size: 18px;
      }

      .meta {
        padding: 8px 2px 0;
      }

      .card-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.3;
      }

      .card-artist {
        font-size: 13px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.3;
        margin-top: 2px;
      }

      .card-quality {
        margin-top: 4px;
      }

      /* Folder variant */
      .card.folder .art-placeholder {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }
    `;
  }

  constructor() {
    super();
    this.title = "";
    this.artist = "";
    this.albumart = "";
    this.uri = "";
    this.type = "folder";
    this.quality = null;
    this.service = "";
  }

  render() {
    const isFolder = this.type === "folder" || this.type === "category";
    const icon = isFolder ? "mdi:folder-music" : "mdi:music-note";

    return html`
      <div class="card ${isFolder ? "folder" : ""}" @click=${this._onClick}>
        <div class="art-container">
          ${this.albumart
            ? html`<img
                class="art"
                src="${this.albumart}"
                alt="${this.title}"
                loading="lazy"
                @error=${this._onArtError}
              />`
            : html`<div class="art-placeholder">
                <ha-icon icon="${icon}"></ha-icon>
              </div>`}
          <div class="play-overlay">
            <button class="play-btn" @click=${this._onPlay} title="Play">
              <ha-icon icon="mdi:play"></ha-icon>
            </button>
            <button class="queue-btn" @click=${this._onAddQueue} title="Add to queue">
              <ha-icon icon="mdi:playlist-plus"></ha-icon>
            </button>
          </div>
        </div>
        <div class="meta">
          <div class="card-title" title="${this.title}">${this.title || "Unknown"}</div>
          ${this.artist
            ? html`<div class="card-artist" title="${this.artist}">${this.artist}</div>`
            : ""}
          ${this.quality && this.quality.tier !== "unknown"
            ? html`<div class="card-quality">
                <volumio-quality-badge .quality=${this.quality} size="small"></volumio-quality-badge>
              </div>`
            : ""}
        </div>
      </div>
    `;
  }

  _getItemData() {
    return {
      uri: this.uri,
      title: this.title,
      artist: this.artist,
      albumart: this.albumart,
      type: this.type,
      service: this.service,
    };
  }

  _onClick(e) {
    // Don't fire card-click if play button was clicked
    if (e.target.closest(".play-btn")) return;
    this.dispatchEvent(new CustomEvent("volumio-card-click", {
      detail: this._getItemData(),
      bubbles: true, composed: true,
    }));
  }

  _onPlay(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("volumio-card-play", {
      detail: this._getItemData(),
      bubbles: true, composed: true,
    }));
  }

  _onAddQueue(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("volumio-card-add-queue", {
      detail: this._getItemData(),
      bubbles: true, composed: true,
    }));
  }

  _onArtError(e) {
    // Replace broken img with placeholder
    const container = e.target.parentElement;
    e.target.remove();
    const placeholder = document.createElement("div");
    placeholder.className = "art-placeholder";
    placeholder.innerHTML = `<ha-icon icon="mdi:music-note"></ha-icon>`;
    container.prepend(placeholder);
  }
}

customElements.define("volumio-album-card", VolumioAlbumCard);
