/**
 * Favorites View — shows all favorited items.
 *
 * Properties:
 *   items: Array<{title, artist, album, albumart, uri, service, type}>
 *   loading: boolean
 *   currentUri: string
 *   volumioUrl: string
 *
 * Events:
 *   volumio-track-click: { uri, title, artist, ... }
 *   volumio-context-menu: { ...item, x, y, context: "favorite" }
 */
import { LitElement, html, css } from "lit";
import { resolveArt } from "../utils/format-utils.js";
import "./track-card.js";

const SERVICE_DISPLAY = {
  mpd: "Local",
  qobuz: "Qobuz",
  tidal: "TIDAL",
  spotify: "Spotify",
  spop: "Spotify",
  webradio: "Radio",
  pandora: "Pandora",
  youtube: "YouTube",
  youtube2: "YouTube",
  ytmusic: "YouTube Music",
};

function serviceLabel(service) {
  if (!service) return "";
  return SERVICE_DISPLAY[service] || service.charAt(0).toUpperCase() + service.slice(1);
}

class VolumioFavoritesView extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
      loading: { type: Boolean },
      currentUri: { type: String, attribute: "current-uri" },
      volumioUrl: { type: String, attribute: "volumio-url" },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--volumio-space-lg, 24px);
      }

      .title {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary-text-color);
      }

      .count {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-left: 12px;
      }

      /* ── Favorites list ────────────── */
      .favorites-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .fav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        cursor: pointer;
        transition: background 0.1s;
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.04));
      }

      .fav-item:last-child {
        border-bottom: none;
      }

      .fav-item:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.06));
      }

      .fav-item.playing {
        border-left: 3px solid var(--primary-color, #03a9f4);
      }

      .fav-item.playing .fav-title {
        color: var(--primary-color, #03a9f4);
      }

      .fav-art {
        width: 44px;
        height: 44px;
        border-radius: 4px;
        overflow: hidden;
        flex-shrink: 0;
        background: var(--card-background-color, #2a2a2a);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .fav-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .fav-art ha-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
        opacity: 0.4;
      }

      .fav-art:empty::after {
        content: "";
        display: block;
        width: 20px;
        height: 20px;
        background: var(--secondary-text-color);
        opacity: 0.4;
        mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E");
        -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E");
        mask-size: contain;
        -webkit-mask-size: contain;
      }

      .fav-info {
        flex: 1;
        min-width: 0;
      }

      .fav-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .fav-meta {
        font-size: 13px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 2px;
      }

      .fav-service {
        font-size: 11px;
        color: var(--secondary-text-color);
        opacity: 0.6;
        text-transform: capitalize;
        flex-shrink: 0;
      }

      .fav-context {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        opacity: 0;
        transition: opacity 0.1s;
        flex-shrink: 0;
      }

      .fav-item:hover .fav-context {
        opacity: 1;
      }

      .fav-context:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
      }

      .fav-context ha-icon {
        --mdc-icon-size: 18px;
      }

      /* ── Empty state ───────────────── */
      .empty-state {
        text-align: center;
        padding: 64px 24px;
        color: var(--secondary-text-color);
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.3;
        margin-bottom: 16px;
      }

      .empty-state .empty-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: 8px;
      }

      .empty-state .empty-desc {
        font-size: 14px;
        max-width: 360px;
        margin: 0 auto;
        line-height: 1.5;
      }

      /* ── Loading ───────────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
      }

      .skeleton-art {
        width: 44px;
        height: 44px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        flex-shrink: 0;
      }

      .skeleton-lines {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .skeleton-bar {
        height: 14px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-bar.wide { width: 55%; }
      .skeleton-bar.narrow { width: 35%; }
    `;
  }

  constructor() {
    super();
    this.items = [];
    this.loading = false;
    this.currentUri = "";
    this.volumioUrl = "";
  }

  render() {
    if (this.loading) {
      return this._renderSkeleton();
    }

    return html`
      <div class="header">
        <div>
          <span class="title">Favorites</span>
          ${this.items.length > 0
            ? html`<span class="count">${this.items.length} item${this.items.length !== 1 ? "s" : ""}</span>`
            : ""}
        </div>
      </div>

      ${this.items.length === 0
        ? html`
          <div class="empty-state">
            <ha-icon icon="mdi:heart-outline"></ha-icon>
            <div class="empty-title">No favorites yet</div>
            <div class="empty-desc">Tap the heart icon on any track, album, or artist to add it here.</div>
          </div>
        `
        : html`
          <div class="favorites-list">
            ${this.items.map(item => {
              const art = resolveArt(item.albumart, this.volumioUrl);
              const isPlaying = item.uri === this.currentUri;
              const metaParts = [item.artist, item.album].filter(Boolean).join(" — ");
              return html`
                <div
                  class="fav-item ${isPlaying ? "playing" : ""}"
                  @click=${() => this._onItemClick(item)}
                  @contextmenu=${(e) => this._onContextMenu(e, item)}
                >
                  <div class="fav-art">
                    ${art
                      ? html`<img src="${art}" alt="" loading="lazy" @error=${(e) => { e.target.remove(); }} />`
                      : html`<ha-icon icon="mdi:music-note"></ha-icon>`}
                  </div>
                  <div class="fav-info">
                    <div class="fav-title">${item.title || "—"}</div>
                    ${metaParts ? html`<div class="fav-meta">${metaParts}</div>` : ""}
                  </div>
                  <span class="fav-service">${serviceLabel(item.service)}</span>
                  <button
                    class="fav-context"
                    @click=${(e) => this._onDotsClick(e, item)}
                    title="More actions"
                  >
                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                  </button>
                </div>
              `;
            })}
          </div>
        `}
    `;
  }

  _renderSkeleton() {
    return html`
      <div class="header">
        <span class="title">Favorites</span>
      </div>
      <div class="favorites-list">
        ${Array(5).fill(0).map(() => html`
          <div class="skeleton-item">
            <div class="skeleton-art"></div>
            <div class="skeleton-lines">
              <div class="skeleton-bar wide"></div>
              <div class="skeleton-bar narrow"></div>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  _onItemClick(item) {
    this.dispatchEvent(new CustomEvent("volumio-track-click", {
      detail: {
        uri: item.uri,
        title: item.title || "",
        artist: item.artist || "",
        album: item.album || "",
        albumart: item.albumart || "",
        service: item.service || "",
        type: item.type || "song",
      },
      bubbles: true, composed: true,
    }));
  }

  _onDotsClick(e, item) {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    this._fireContextMenu(rect.right, rect.bottom, item);
  }

  _onContextMenu(e, item) {
    e.preventDefault();
    e.stopPropagation();
    this._fireContextMenu(e.clientX, e.clientY, item);
  }

  _fireContextMenu(x, y, item) {
    this.dispatchEvent(new CustomEvent("volumio-context-menu", {
      detail: {
        uri: item.uri,
        title: item.title || "",
        artist: item.artist || "",
        album: item.album || "",
        albumart: item.albumart || "",
        service: item.service || "",
        type: item.type || "song",
        x, y,
        context: "favorite",
      },
      bubbles: true, composed: true,
    }));
  }
}

customElements.define("volumio-favorites-view", VolumioFavoritesView);
