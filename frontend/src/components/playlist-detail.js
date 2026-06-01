/**
 * Playlist Detail — single playlist view with tracks.
 *
 * Properties:
 *   playlistName: string
 *   playlistUri: string
 *   tracks: Array - track items from browse(playlistUri)
 *   loading: boolean
 *   currentUri: string - currently playing track URI
 *   volumioUrl: string
 *
 * Events:
 *   volumio-track-click: { uri, title, artist, ... }
 *   volumio-playlist-play: { name }
 *   volumio-playlist-enqueue: { name }
 *   volumio-playlist-delete: { name }
 *   volumio-playlist-remove-track: { playlistName, uri, service }
 *   volumio-context-menu: { ...item, x, y, context }
 */
import { LitElement, html, css } from "lit";
import { formatTime, resolveArt } from "../utils/format-utils.js";
import "./track-card.js";

class VolumioPlaylistDetail extends LitElement {
  static get properties() {
    return {
      playlistName: { type: String, attribute: "playlist-name" },
      playlistUri: { type: String, attribute: "playlist-uri" },
      tracks: { type: Array },
      loading: { type: Boolean },
      currentUri: { type: String, attribute: "current-uri" },
      volumioUrl: { type: String, attribute: "volumio-url" },
      configEntryId: { type: String, attribute: "config-entry-id" },
      _confirmDelete: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      /* ── Header ──────────────────────── */
      .playlist-header {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-lg, 24px);
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .playlist-icon-box {
        width: 120px;
        height: 120px;
        border-radius: 8px;
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .playlist-icon-box litgui-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.5;
      }

      .playlist-meta {
        display: flex;
        flex-direction: column;
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

      .playlist-title {
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

      .playlist-actions {
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

      .action-btn litgui-icon {
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

      .action-btn.danger {
        background: transparent;
        color: var(--error-color, #ef5350);
        border: 1px solid var(--error-color, #ef5350);
      }

      /* ── Confirm bar ───────────────── */
      .confirm-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 10px 16px;
        background: var(--error-color, #ef5350);
        color: #fff;
        border-radius: 8px;
        margin-bottom: var(--volumio-space-md, 16px);
        font-size: 14px;
      }

      .confirm-bar button {
        padding: 4px 16px;
        border-radius: 12px;
        border: none;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }

      .confirm-bar .btn-yes {
        background: #fff;
        color: var(--error-color, #ef5350);
      }

      .confirm-bar .btn-no {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
      }

      /* ── Track list ──────────────────── */
      .track-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .track-list-header {
        display: grid;
        grid-template-columns: 40px 1fr 1fr 0.8fr 32px 32px;
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

      .track-row-wrap {
        display: flex;
        align-items: center;
      }

      .track-remove {
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

      .track-row-wrap:hover .track-remove {
        opacity: 1;
      }

      .track-remove:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--error-color, #ef5350);
      }

      .track-remove litgui-icon {
        --mdc-icon-size: 16px;
      }

      /* ── Empty state ───────────────── */
      .empty-state {
        text-align: center;
        padding: 64px 24px;
        color: var(--secondary-text-color);
      }

      .empty-state litgui-icon {
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
      }

      /* ── Loading ───────────────────── */
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

      .skeleton-icon {
        width: 120px;
        height: 120px;
        border-radius: 8px;
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

      .skeleton-bar.title { width: 50%; height: 28px; }
      .skeleton-bar.detail { width: 30%; height: 14px; }

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

      /* ── Responsive ──────────────────── */
      @media (max-width: 768px) {
        .playlist-header {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .playlist-icon-box {
          width: 100px;
          height: 100px;
        }

        .playlist-meta {
          align-items: center;
        }

        .playlist-actions {
          justify-content: center;
          flex-wrap: wrap;
        }

        .track-list-header {
          grid-template-columns: 40px 1fr 0.8fr 60px 32px;
        }

        .track-list-header .hdr-album {
          display: none;
        }
      }
    `;
  }

  constructor() {
    super();
    this.playlistName = "";
    this.playlistUri = "";
    this.tracks = [];
    this.loading = false;
    this.currentUri = "";
    this.volumioUrl = "";
    this._confirmDelete = false;
  }

  render() {
    if (this.loading) {
      return this._renderSkeleton();
    }

    const trackCount = this.tracks.length;
    const totalDuration = this.tracks.reduce((sum, t) => sum + (t.duration || 0), 0);

    return html`
      <div class="playlist-header">
        <div class="playlist-icon-box">
          <litgui-icon icon="mdi:playlist-music"></litgui-icon>
        </div>
        <div class="playlist-meta">
          <span class="meta-type">Playlist</span>
          <div class="playlist-title">${this.playlistName || "Unknown Playlist"}</div>
          <div class="meta-details">
            ${trackCount > 0 ? html`<span class="detail">${trackCount} track${trackCount !== 1 ? "s" : ""}</span>` : ""}
            ${trackCount > 0 && totalDuration > 0 ? html`<span class="sep">·</span>` : ""}
            ${totalDuration > 0 ? html`<span class="detail">${formatTime(totalDuration)}</span>` : ""}
          </div>
          <div class="playlist-actions">
            <button class="action-btn primary" @click=${this._playAll} ?disabled=${trackCount === 0}>
              <litgui-icon icon="mdi:play"></litgui-icon> Play
            </button>
            <button class="action-btn secondary" @click=${this._enqueueAll} ?disabled=${trackCount === 0}>
              <litgui-icon icon="mdi:playlist-plus"></litgui-icon> Enqueue
            </button>
            <button class="action-btn danger" @click=${() => { this._confirmDelete = true; }}>
              <litgui-icon icon="mdi:delete-outline"></litgui-icon> Delete
            </button>
          </div>
        </div>
      </div>

      ${this._confirmDelete ? html`
        <div class="confirm-bar">
          <span>Delete "${this.playlistName}"?</span>
          <button class="btn-yes" @click=${this._deletePlaylist}>Yes, delete</button>
          <button class="btn-no" @click=${() => { this._confirmDelete = false; }}>Cancel</button>
        </div>
      ` : ""}

      ${trackCount === 0
        ? html`
          <div class="empty-state">
            <litgui-icon icon="mdi:playlist-music-outline"></litgui-icon>
            <div class="empty-title">Empty playlist</div>
            <div class="empty-desc">Add tracks from browse or search.</div>
          </div>
        `
        : html`
          <div class="track-list">
            <div class="track-list-header">
              <span>#</span>
              <span>Title</span>
              <span>Artist</span>
              <span class="hdr-album">Album</span>
              <span></span>
              <span></span>
            </div>
            ${this.tracks.map((track, i) => {
              const art = resolveArt(track.albumart, this.volumioUrl, this.configEntryId);
              return html`
                <div class="track-row-wrap">
                  <volumio-track-card
                    style="flex:1;min-width:0"
                    .index=${i + 1}
                    title="${track.title || track.name || ""}"
                    artist="${track.artist || ""}"
                    album="${track.album || ""}"
                    .duration=${track.duration || 0}
                    uri="${track.uri || ""}"
                    albumart="${art}"
                    service="${track.service || ""}"
                    type="${track.type || "song"}"
                    ?is-playing=${track.uri === this.currentUri}
                    @volumio-track-click=${this._onTrackClick}
                  ></volumio-track-card>
                  <button
                    class="track-remove"
                    @click=${(e) => this._onRemoveTrack(e, track)}
                    title="Remove from playlist"
                  >
                    <litgui-icon icon="mdi:close"></litgui-icon>
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
      <div class="skeleton-header">
        <div class="skeleton-icon"></div>
        <div class="skeleton-meta">
          <div class="skeleton-bar title"></div>
          <div class="skeleton-bar detail"></div>
        </div>
      </div>
      <div class="skeleton-tracks">
        ${Array(6).fill(0).map(() => html`<div class="skeleton-track"></div>`)}
      </div>
    `;
  }

  _playAll() {
    this.dispatchEvent(new CustomEvent("volumio-playlist-play", {
      detail: { name: this.playlistName },
      bubbles: true, composed: true,
    }));
  }

  _enqueueAll() {
    this.dispatchEvent(new CustomEvent("volumio-playlist-enqueue", {
      detail: { name: this.playlistName },
      bubbles: true, composed: true,
    }));
  }

  _deletePlaylist() {
    this._confirmDelete = false;
    this.dispatchEvent(new CustomEvent("volumio-playlist-delete", {
      detail: { name: this.playlistName },
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

  _onRemoveTrack(e, track) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("volumio-playlist-remove-track", {
      detail: {
        playlistName: this.playlistName,
        uri: track.uri,
        service: track.service || "",
      },
      bubbles: true, composed: true,
    }));
  }
}

customElements.define("volumio-playlist-detail", VolumioPlaylistDetail);
