/**
 * Playlist List — shows all saved playlists.
 *
 * Properties:
 *   playlists: Array<{title, uri, service, type}> - from browse("playlists")
 *   loading: boolean
 *
 * Events:
 *   volumio-playlist-select: { name, uri }
 *   volumio-playlist-create: { name }
 *   volumio-context-menu: { ...item, x, y, context: "playlist" }
 */
import { LitElement, html, css } from "lit";

class VolumioPlaylistList extends LitElement {
  static get properties() {
    return {
      playlists: { type: Array },
      loading: { type: Boolean },
      _showCreateInput: { type: Boolean, state: true },
      _createName: { type: String, state: true },
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

      .create-btn {
        padding: 8px 20px;
        border-radius: 20px;
        border: none;
        background: var(--primary-color, #03a9f4);
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: opacity 0.15s;
      }

      .create-btn:hover {
        opacity: 0.85;
      }

      .create-btn ha-icon {
        --mdc-icon-size: 18px;
      }

      /* ── Create input ──────────────── */
      .create-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: var(--volumio-space-md, 16px);
        padding: 8px 12px;
        background: var(--card-background-color, #1e1e1e);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        border-radius: 8px;
      }

      .create-row input {
        flex: 1;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        font-size: 14px;
        outline: none;
        min-width: 0;
      }

      .create-row input::placeholder {
        color: var(--secondary-text-color, #888);
      }

      .create-row button {
        padding: 6px 16px;
        border-radius: 14px;
        border: none;
        font-size: 13px;
        cursor: pointer;
      }

      .create-row .save-btn {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }

      .create-row .cancel-btn {
        background: var(--divider-color, rgba(255, 255, 255, 0.12));
        color: var(--primary-text-color);
      }

      /* ── Playlist items ────────────── */
      .playlist-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .playlist-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.1s;
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.04));
      }

      .playlist-item:last-child {
        border-bottom: none;
      }

      .playlist-item:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.06));
      }

      .playlist-icon {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .playlist-icon ha-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }

      .playlist-name {
        flex: 1;
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .playlist-context {
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
      }

      .playlist-item:hover .playlist-context {
        opacity: 1;
      }

      .playlist-context:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
      }

      .playlist-context ha-icon {
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
        padding: 12px 16px;
      }

      .skeleton-icon {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-text {
        height: 16px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-text.wide { width: 45%; }
      .skeleton-text.medium { width: 30%; }
    `;
  }

  constructor() {
    super();
    this.playlists = [];
    this.loading = false;
    this._showCreateInput = false;
    this._createName = "";
  }

  render() {
    if (this.loading) {
      return this._renderSkeleton();
    }

    return html`
      <div class="header">
        <div>
          <span class="title">Playlists</span>
          ${this.playlists.length > 0
            ? html`<span class="count">${this.playlists.length} playlist${this.playlists.length !== 1 ? "s" : ""}</span>`
            : ""}
        </div>
        <button class="create-btn" @click=${this._onCreateClick}>
          <ha-icon icon="mdi:plus"></ha-icon> New Playlist
        </button>
      </div>

      ${this._showCreateInput ? html`
        <div class="create-row">
          <input
            type="text"
            placeholder="Playlist name"
            .value=${this._createName}
            @input=${(e) => { this._createName = e.target.value; }}
            @keydown=${this._onCreateKeydown}
          />
          <button class="save-btn" @click=${this._onCreateConfirm}>Create</button>
          <button class="cancel-btn" @click=${() => { this._showCreateInput = false; }}>Cancel</button>
        </div>
      ` : ""}

      ${this.playlists.length === 0
        ? html`
          <div class="empty-state">
            <ha-icon icon="mdi:playlist-music-outline"></ha-icon>
            <div class="empty-title">No playlists yet</div>
            <div class="empty-desc">Create one from the queue or while browsing.</div>
          </div>
        `
        : html`
          <div class="playlist-list">
            ${this.playlists.map(pl => html`
              <div
                class="playlist-item"
                @click=${() => this._onSelect(pl)}
                @contextmenu=${(e) => this._onContextMenu(e, pl)}
              >
                <div class="playlist-icon">
                  <ha-icon icon="mdi:playlist-music"></ha-icon>
                </div>
                <div class="playlist-name">${pl.title}</div>
                <button
                  class="playlist-context"
                  @click=${(e) => this._onDotsClick(e, pl)}
                  title="More actions"
                >
                  <ha-icon icon="mdi:dots-vertical"></ha-icon>
                </button>
              </div>
            `)}
          </div>
        `}
    `;
  }

  _renderSkeleton() {
    return html`
      <div class="header">
        <span class="title">Playlists</span>
      </div>
      <div class="playlist-list">
        ${Array(4).fill(0).map(() => html`
          <div class="skeleton-item">
            <div class="skeleton-icon"></div>
            <div class="skeleton-text wide"></div>
          </div>
        `)}
      </div>
    `;
  }

  _onSelect(pl) {
    this.dispatchEvent(new CustomEvent("volumio-playlist-select", {
      detail: { name: pl.title, uri: pl.uri },
      bubbles: true, composed: true,
    }));
  }

  _onCreateClick() {
    this._showCreateInput = true;
    this._createName = "";
    this.updateComplete.then(() => {
      const input = this.shadowRoot?.querySelector(".create-row input");
      if (input) input.focus();
    });
  }

  _onCreateKeydown(e) {
    if (e.key === "Enter") this._onCreateConfirm();
    if (e.key === "Escape") this._showCreateInput = false;
  }

  _onCreateConfirm() {
    const name = this._createName.trim();
    if (!name) return;
    this._showCreateInput = false;
    this.dispatchEvent(new CustomEvent("volumio-playlist-create", {
      detail: { name },
      bubbles: true, composed: true,
    }));
  }

  _onDotsClick(e, pl) {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    this._fireContextMenu(rect.right, rect.bottom, pl);
  }

  _onContextMenu(e, pl) {
    e.preventDefault();
    e.stopPropagation();
    this._fireContextMenu(e.clientX, e.clientY, pl);
  }

  _fireContextMenu(x, y, pl) {
    this.dispatchEvent(new CustomEvent("volumio-context-menu", {
      detail: {
        title: pl.title,
        uri: pl.uri,
        service: pl.service || "",
        type: "playlist",
        x, y,
        context: "playlist",
      },
      bubbles: true, composed: true,
    }));
  }
}

customElements.define("volumio-playlist-list", VolumioPlaylistList);
