/**
 * Browse List — list/grid view for browse results within a source.
 *
 * Properties:
 *   items: array - Volumio browse items
 *   viewMode: "grid" | "list"
 *   loading: boolean
 *   currentUri: string - URI of currently playing track
 *   volumioUrl: string - Volumio base URL for resolving art
 *
 * Events:
 *   volumio-item-click: { uri, title, artist, albumart, type, service }
 *   volumio-item-play: { ... same }
 *   volumio-view-mode-change: { mode }
 */
import { LitElement, html, css } from "lit";
import { resolveArt } from "../utils/format-utils.js";
import "./album-card.js";
import "./track-card.js";

// Types that represent playable tracks
const PLAYABLE_TYPES = new Set(["song", "track", "webradio", "mywebradio", "cuesong"]);

// Types that represent navigable folders
const FOLDER_TYPES = new Set(["folder", "category", "radio-category", "streaming-category"]);

class VolumioBrowseList extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
      viewMode: { type: String, attribute: "view-mode" },
      loading: { type: Boolean },
      currentUri: { type: String, attribute: "current-uri" },
      volumioUrl: { type: String, attribute: "volumio-url" },
      _displayCount: { type: Number, state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      /* ── Toolbar ──────────────────────────── */
      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--volumio-space-md, 16px);
        gap: var(--volumio-space-sm, 8px);
      }

      .item-count {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .toolbar-actions {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-xs, 4px);
      }

      .view-btn {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }

      .view-btn:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .view-btn.active {
        color: var(--primary-color, #03a9f4);
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .view-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      /* ── Grid layout ──────────────────────── */
      .browse-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--volumio-space-md, 16px);
      }

      /* ── List layout ──────────────────────── */
      .browse-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .list-header {
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

      .list-header .hdr-duration {
        text-align: right;
      }

      /* ── Load more ────────────────────────── */
      .load-more {
        display: flex;
        justify-content: center;
        padding: var(--volumio-space-lg, 24px);
      }

      .load-more-btn {
        padding: 10px 32px;
        border-radius: 20px;
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        background: transparent;
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
        transition: background 0.15s;
      }

      .load-more-btn:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      /* ── Loading skeleton ─────────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
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

      .skeleton-row {
        height: 48px;
        border-radius: 4px;
        margin-bottom: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--volumio-space-xxl, 48px);
        text-align: center;
        gap: var(--volumio-space-md, 16px);
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      .empty-state .message {
        font-size: 16px;
        color: var(--secondary-text-color);
      }

      /* ── Alpha index ──────────────────────── */
      .browse-content {
        position: relative;
      }

      .alpha-index {
        position: fixed;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
        z-index: 50;
        padding: 4px 2px;
        border-radius: 12px;
        background: var(--card-background-color, rgba(30, 30, 30, 0.9));
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      /* When queue panel is pinned (>= 1400px), offset alpha index */
      @media (min-width: 1400px) {
        .alpha-index {
          right: 340px;
        }
      }

      .alpha-letter {
        width: 22px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        color: var(--secondary-text-color);
        cursor: pointer;
        border-radius: 4px;
        user-select: none;
        transition: color 0.1s, background 0.1s;
      }

      .alpha-letter:hover {
        color: var(--primary-text-color);
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .alpha-letter.active {
        color: var(--primary-color, #03a9f4);
      }

      .alpha-letter.disabled {
        opacity: 0.2;
        cursor: default;
      }

      .alpha-letter.disabled:hover {
        color: var(--secondary-text-color);
        background: transparent;
      }

      @media (max-width: 768px) {
        .list-header {
          grid-template-columns: 40px 1fr 0.8fr 60px 32px;
        }
        .list-header .hdr-album,
        .list-header .hdr-quality {
          display: none;
        }
      }
    `;
  }

  constructor() {
    super();
    this.items = [];
    this.viewMode = localStorage.getItem("volumio-browse-view") || "grid";
    this.loading = false;
    this.currentUri = "";
    this.volumioUrl = "";
    this._displayCount = 100;
  }

  render() {
    if (this.loading) {
      return this._renderSkeleton();
    }

    if (!this.items || this.items.length === 0) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:folder-open-outline"></ha-icon>
          <div class="message">No items found</div>
        </div>
      `;
    }

    const displayItems = this.items.slice(0, this._displayCount);
    const hasMore = this.items.length > this._displayCount;
    const showAlpha = this.items.length > 20;
    const alphaMap = showAlpha ? this._buildAlphaMap() : null;

    return html`
      <div class="toolbar">
        <span class="item-count">${this.items.length} item${this.items.length !== 1 ? "s" : ""}</span>
        <div class="toolbar-actions">
          <button
            class="view-btn ${this.viewMode === "grid" ? "active" : ""}"
            @click=${() => this._setViewMode("grid")}
            title="Grid view"
          >
            <ha-icon icon="mdi:view-grid"></ha-icon>
          </button>
          <button
            class="view-btn ${this.viewMode === "list" ? "active" : ""}"
            @click=${() => this._setViewMode("list")}
            title="List view"
          >
            <ha-icon icon="mdi:view-list"></ha-icon>
          </button>
        </div>
      </div>

      <div class="browse-content">
        ${this.viewMode === "grid"
          ? this._renderGrid(displayItems)
          : this._renderList(displayItems)}

        ${hasMore ? html`
          <div class="load-more">
            <button class="load-more-btn" @click=${this._loadMore}>
              Show more (${this.items.length - this._displayCount} remaining)
            </button>
          </div>
        ` : ""}

        ${showAlpha ? this._renderAlphaIndex(alphaMap) : ""}
      </div>
    `;
  }

  updated(changed) {
    if (changed.has("items")) {
      this._displayCount = 100;
    }
  }

  _renderGrid(items) {
    return html`
      <div class="browse-grid">
        ${items.map(item => {
          const art = resolveArt(item.albumart || item.icon, this.volumioUrl);
          const letter = this._getItemLetter(item);
          return html`
            <volumio-album-card
              data-letter="${letter}"
              title="${item.title || item.name || ""}"
              artist="${item.artist || ""}"
              albumart="${art}"
              uri="${item.uri || ""}"
              type="${item.type || "folder"}"
              service="${item.service || ""}"
              @volumio-card-click=${this._onItemClick}
              @volumio-card-play=${this._onItemPlay}
            ></volumio-album-card>
          `;
        })}
      </div>
    `;
  }

  _renderList(items) {
    // Check if any items have duration data
    const hasDuration = items.some(item => item.duration > 0);
    const compact = !hasDuration;

    return html`
      <div class="browse-list">
        <div class="list-header" style="grid-template-columns: ${compact ? "40px 1.5fr 1fr 32px" : "40px 1fr 1fr 0.8fr auto 60px 32px"};">
          <span>#</span>
          <span>Title</span>
          <span>Artist</span>
          ${!compact ? html`
            <span class="hdr-album">Album</span>
            <span class="hdr-quality">Quality</span>
            <span class="hdr-duration">Time</span>
          ` : ""}
          <span></span>
        </div>
        ${items.map((item, i) => {
          const art = resolveArt(item.albumart || item.icon, this.volumioUrl);
          const letter = this._getItemLetter(item);
          return html`
            <volumio-track-card
              data-letter="${letter}"
              .index=${i + 1}
              title="${item.title || item.name || ""}"
              artist="${item.artist || ""}"
              album="${item.album || ""}"
              .duration=${item.duration || 0}
              uri="${item.uri || ""}"
              albumart="${art}"
              service="${item.service || ""}"
              type="${item.type || "folder"}"
              ?compact=${compact}
              ?is-playing=${this.currentUri && item.uri === this.currentUri}
              @volumio-track-click=${this._onItemClick}
            ></volumio-track-card>
          `;
        })}
      </div>
    `;
  }

  _renderSkeleton() {
    return html`
      <div class="skeleton-grid" aria-busy="true" aria-label="Loading">
        ${Array(12).fill(0).map(() => html`<div class="skeleton-card"></div>`)}
      </div>
    `;
  }

  _setViewMode(mode) {
    this.viewMode = mode;
    localStorage.setItem("volumio-browse-view", mode);
    this.dispatchEvent(new CustomEvent("volumio-view-mode-change", {
      detail: { mode },
      bubbles: true, composed: true,
    }));
  }

  _loadMore() {
    this._displayCount += 100;
  }

  _onItemClick(e) {
    e.stopPropagation();
    const detail = e.detail;
    this.dispatchEvent(new CustomEvent("volumio-item-click", {
      detail,
      bubbles: true, composed: true,
    }));
  }

  _onItemPlay(e) {
    e.stopPropagation();
    const detail = e.detail;
    this.dispatchEvent(new CustomEvent("volumio-item-play", {
      detail,
      bubbles: true, composed: true,
    }));
  }

  // ── Alpha Index ──────────────────────────────────────────

  _getItemLetter(item) {
    const name = (item.title || item.name || "").trim();
    if (!name) return "#";
    const first = name.charAt(0).toUpperCase();
    return /[A-Z]/.test(first) ? first : "#";
  }

  _buildAlphaMap() {
    // Build set of letters that have items
    const letters = new Set();
    for (const item of this.items) {
      letters.add(this._getItemLetter(item));
    }
    return letters;
  }

  _renderAlphaIndex(alphaMap) {
    const chars = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];
    return html`
      <div class="alpha-index">
        ${chars.map(ch => {
          const has = alphaMap.has(ch);
          return html`
            <div
              class="alpha-letter ${has ? "" : "disabled"}"
              @click=${() => has && this._scrollToLetter(ch)}
            >${ch}</div>
          `;
        })}
      </div>
    `;
  }

  _scrollToLetter(letter) {
    // Expand display count to include all items so the target exists
    if (this._displayCount < this.items.length) {
      // Find the index of the first item with this letter
      const idx = this.items.findIndex(item => this._getItemLetter(item) === letter);
      if (idx >= this._displayCount) {
        this._displayCount = Math.min(idx + 50, this.items.length);
      }
    }

    // Wait for render, then scroll
    this.updateComplete.then(() => {
      const el = this.shadowRoot.querySelector(`[data-letter="${letter}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}

customElements.define("volumio-browse-list", VolumioBrowseList);
