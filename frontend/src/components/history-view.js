/**
 * History View — recently played tracks stored in localStorage.
 *
 * Properties:
 *   history: Array<{uri, title, artist, album, albumart, service, timestamp}>
 *   currentUri: string
 *   volumioUrl: string
 *
 * Events:
 *   volumio-track-click: { uri, title, artist, ... }
 *   volumio-history-clear: {}
 *   volumio-context-menu: { ...item, x, y, context: "history" }
 */
import { LitElement, html, css } from "lit";
import { resolveArt } from "../utils/format-utils.js";

class VolumioHistoryView extends LitElement {
  static get properties() {
    return {
      history: { type: Array },
      currentUri: { type: String, attribute: "current-uri" },
      volumioUrl: { type: String, attribute: "volumio-url" },
      configEntryId: { type: String, attribute: "config-entry-id" },
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

      .clear-btn {
        padding: 8px 20px;
        border-radius: 20px;
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        background: transparent;
        color: var(--secondary-text-color);
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: background 0.15s, color 0.15s;
      }

      .clear-btn:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
      }

      .clear-btn ha-icon {
        --mdc-icon-size: 16px;
      }

      /* ── Date groups ───────────────── */
      .date-group {
        margin-bottom: var(--volumio-space-lg, 24px);
      }

      .date-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--secondary-text-color);
        padding: 0 0 8px 0;
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        margin-bottom: 4px;
      }

      /* ── History items ─────────────── */
      .history-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        cursor: pointer;
        transition: background 0.1s;
        border-radius: 6px;
      }

      .history-item:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.06));
      }

      .history-item.playing {
        border-left: 3px solid var(--primary-color, #03a9f4);
      }

      .history-item.playing .hi-title {
        color: var(--primary-color, #03a9f4);
      }

      .hi-art {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        overflow: hidden;
        flex-shrink: 0;
        background: var(--card-background-color, #2a2a2a);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hi-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .hi-art:empty::after {
        content: "";
        display: block;
        width: 18px;
        height: 18px;
        background: var(--secondary-text-color);
        opacity: 0.4;
        mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E");
        -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E");
        mask-size: contain;
        -webkit-mask-size: contain;
      }

      .hi-art ha-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
        opacity: 0.4;
      }

      .hi-info {
        flex: 1;
        min-width: 0;
      }

      .hi-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .hi-meta {
        font-size: 13px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 1px;
      }

      .hi-time {
        font-size: 12px;
        color: var(--secondary-text-color);
        opacity: 0.6;
        flex-shrink: 0;
        font-variant-numeric: tabular-nums;
      }

      .hi-context {
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

      .history-item:hover .hi-context {
        opacity: 1;
      }

      .hi-context:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
      }

      .hi-context ha-icon {
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
      }
    `;
  }

  constructor() {
    super();
    this.history = [];
    this.currentUri = "";
    this.volumioUrl = "";
  }

  render() {
    if (this.history.length === 0) {
      return html`
        <div class="header">
          <span class="title">History</span>
        </div>
        <div class="empty-state">
          <ha-icon icon="mdi:history"></ha-icon>
          <div class="empty-title">No listening history yet</div>
          <div class="empty-desc">Play some music!</div>
        </div>
      `;
    }

    const groups = this._groupByDate(this.history);

    return html`
      <div class="header">
        <div>
          <span class="title">History</span>
          <span class="count">${this.history.length} track${this.history.length !== 1 ? "s" : ""}</span>
        </div>
        <button class="clear-btn" @click=${this._onClear}>
          <ha-icon icon="mdi:delete-outline"></ha-icon> Clear History
        </button>
      </div>

      ${groups.map(group => html`
        <div class="date-group">
          <div class="date-label">${group.label}</div>
          ${group.items.map(item => {
            const art = resolveArt(item.albumart, this.volumioUrl, this.configEntryId);
            const isPlaying = item.uri === this.currentUri;
            const metaParts = [item.artist, item.album].filter(Boolean).join(" — ");
            const timeStr = this._formatTime(item.timestamp);
            return html`
              <div
                class="history-item ${isPlaying ? "playing" : ""}"
                @click=${() => this._onItemClick(item)}
                @contextmenu=${(e) => this._onContextMenu(e, item)}
              >
                <div class="hi-art">
                  ${art
                    ? html`<img src="${art}" alt="" loading="lazy" @error=${(e) => { e.target.remove(); }} />`
                    : html`<ha-icon icon="mdi:music-note"></ha-icon>`}
                </div>
                <div class="hi-info">
                  <div class="hi-title">${item.title || "—"}</div>
                  ${metaParts ? html`<div class="hi-meta">${metaParts}</div>` : ""}
                </div>
                <span class="hi-time">${timeStr}</span>
                <button
                  class="hi-context"
                  @click=${(e) => this._onDotsClick(e, item)}
                  title="More actions"
                >
                  <ha-icon icon="mdi:dots-vertical"></ha-icon>
                </button>
              </div>
            `;
          })}
        </div>
      `)}
    `;
  }

  _groupByDate(items) {
    const groups = new Map();
    const now = new Date();
    const todayStr = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    for (const item of items) {
      const d = new Date(item.timestamp);
      const ds = d.toDateString();
      let label;
      if (ds === todayStr) {
        label = "Today";
      } else if (ds === yesterdayStr) {
        label = "Yesterday";
      } else {
        label = d.toLocaleDateString(undefined, {
          weekday: "long", month: "short", day: "numeric",
        });
      }

      if (!groups.has(label)) {
        groups.set(label, []);
      }
      groups.get(label).push(item);
    }

    return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
  }

  _formatTime(timestamp) {
    const d = new Date(timestamp);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
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
        type: "song",
      },
      bubbles: true, composed: true,
    }));
  }

  _onClear() {
    this.dispatchEvent(new CustomEvent("volumio-history-clear", {
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
        type: "song",
        x, y,
        context: "history",
      },
      bubbles: true, composed: true,
    }));
  }
}

customElements.define("volumio-history-view", VolumioHistoryView);
