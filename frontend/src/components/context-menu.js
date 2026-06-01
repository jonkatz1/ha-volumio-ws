/**
 * Context Menu — floating action menu for track/album/queue items.
 *
 * Properties:
 *   open: boolean — show/hide
 *   x: number — trigger X position (viewport px)
 *   y: number — trigger Y position (viewport px)
 *   items: Array<{key, label, icon, separator?, submenu?, disabled?}>
 *   submenuItems: Array<{key, label}> — for "Add to Playlist" submenu
 *
 * Events:
 *   volumio-context-action: { action: string, ...extra }
 *   volumio-context-close: (dismissed)
 */
import { LitElement, html, css } from "lit";

// Long-press threshold in ms
const LONG_PRESS_MS = 500;

class VolumioContextMenu extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      x: { type: Number },
      y: { type: Number },
      items: { type: Array },
      submenuItems: { type: Array },
      _showSubmenu: { type: Boolean, state: true },
      _posStyle: { type: String, state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        pointer-events: none;
        display: none;
      }

      :host([open]) {
        display: block;
        pointer-events: auto;
      }

      .backdrop {
        position: absolute;
        inset: 0;
      }

      .menu {
        position: absolute;
        width: 240px;
        background: var(--card-background-color, #2a2a2a);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        padding: 4px 0;
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 100ms ease-out, transform 100ms ease-out;
        overflow: hidden;
        max-height: 80vh;
        overflow-y: auto;
      }

      :host([open]) .menu {
        opacity: 1;
        transform: scale(1);
      }

      .menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        cursor: pointer;
        font-size: 14px;
        color: var(--primary-text-color);
        transition: background 0.1s;
        user-select: none;
      }

      .menu-item:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .menu-item.disabled {
        opacity: 0.4;
        pointer-events: none;
      }

      .menu-item litgui-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
        flex-shrink: 0;
      }

      .menu-item .label {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .menu-item .arrow {
        --mdc-icon-size: 14px;
        color: var(--secondary-text-color);
      }

      .separator {
        height: 1px;
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        margin: 4px 0;
      }

      /* ── Submenu ──────────────────────────── */
      .submenu-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 600;
        color: var(--secondary-text-color);
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .submenu-header litgui-icon {
        --mdc-icon-size: 16px;
        cursor: pointer;
      }

      .submenu-header litgui-icon:hover {
        color: var(--primary-text-color);
      }

      .submenu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 13px;
        color: var(--primary-text-color);
        transition: background 0.1s;
      }

      .submenu-item:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .submenu-item litgui-icon {
        --mdc-icon-size: 16px;
        color: var(--secondary-text-color);
      }

      .submenu-item.create-new {
        color: var(--primary-color, #03a9f4);
        border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
        margin-top: 4px;
      }
    `;
  }

  constructor() {
    super();
    this.open = false;
    this.x = 0;
    this.y = 0;
    this.items = [];
    this.submenuItems = [];
    this._showSubmenu = false;
    this._posStyle = "";
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  updated(changed) {
    if (changed.has("open")) {
      if (this.open) {
        this._showSubmenu = false;
        this._computePosition();
        document.addEventListener("keydown", this._onKeyDown);
      } else {
        document.removeEventListener("keydown", this._onKeyDown);
      }
    }
    if (changed.has("x") || changed.has("y")) {
      if (this.open) this._computePosition();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._onKeyDown);
  }

  _computePosition() {
    const menuW = 240;
    const menuH = Math.min((this.items?.length || 0) * 40 + 20, window.innerHeight * 0.8);
    let left = this.x;
    let top = this.y;

    // Keep on screen
    if (left + menuW > window.innerWidth - 8) {
      left = window.innerWidth - menuW - 8;
    }
    if (left < 8) left = 8;
    if (top + menuH > window.innerHeight - 8) {
      top = window.innerHeight - menuH - 8;
    }
    if (top < 8) top = 8;

    this._posStyle = `left:${left}px;top:${top}px`;
  }

  render() {
    return html`
      <div class="backdrop" @click=${this._close} @contextmenu=${this._preventAndClose}></div>
      <div class="menu" style="${this._posStyle}">
        ${this._showSubmenu ? this._renderSubmenu() : this._renderMainMenu()}
      </div>
    `;
  }

  _renderMainMenu() {
    return (this.items || []).map(item => {
      if (item.separator) {
        return html`<div class="separator"></div>`;
      }
      return html`
        <div
          class="menu-item ${item.disabled ? "disabled" : ""}"
          @click=${() => this._onAction(item)}
        >
          <litgui-icon icon="${item.icon}"></litgui-icon>
          <span class="label">${item.label}</span>
          ${item.submenu ? html`<litgui-icon class="arrow" icon="mdi:chevron-right"></litgui-icon>` : ""}
        </div>
      `;
    });
  }

  _renderSubmenu() {
    return html`
      <div class="submenu-header">
        <litgui-icon icon="mdi:arrow-left" @click=${() => { this._showSubmenu = false; }}></litgui-icon>
        Add to Playlist
      </div>
      ${(this.submenuItems || []).map(pl => html`
        <div class="submenu-item" @click=${() => this._onSubmenuAction(pl.key)}>
          <litgui-icon icon="mdi:playlist-music"></litgui-icon>
          <span class="label">${pl.label}</span>
        </div>
      `)}
      <div class="submenu-item create-new" @click=${() => this._onSubmenuAction("__new__")}>
        <litgui-icon icon="mdi:plus"></litgui-icon>
        <span class="label">New Playlist</span>
      </div>
    `;
  }

  _onAction(item) {
    if (item.disabled) return;
    if (item.submenu) {
      this._showSubmenu = true;
      return;
    }
    this.dispatchEvent(new CustomEvent("volumio-context-action", {
      detail: { action: item.key },
      bubbles: true, composed: true,
    }));
    this._close();
  }

  _onSubmenuAction(playlistKey) {
    this.dispatchEvent(new CustomEvent("volumio-context-action", {
      detail: { action: "add_to_playlist", playlist: playlistKey },
      bubbles: true, composed: true,
    }));
    this._close();
  }

  _close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("volumio-context-close", {
      bubbles: true, composed: true,
    }));
  }

  _preventAndClose(e) {
    e.preventDefault();
    this._close();
  }

  _onKeyDown(e) {
    if (e.key === "Escape") {
      this._close();
    }
  }
}

customElements.define("volumio-context-menu", VolumioContextMenu);

/**
 * Utility: attach long-press detection to an element.
 * Returns a cleanup function.
 *
 * Usage:
 *   const cleanup = attachLongPress(el, (e) => { fire context menu });
 *   // later: cleanup();
 */
export function attachLongPress(el, callback) {
  let timer = null;
  let moved = false;

  function onStart(e) {
    moved = false;
    timer = setTimeout(() => {
      if (!moved) {
        e.preventDefault();
        callback(e);
      }
    }, LONG_PRESS_MS);
  }

  function onMove() {
    moved = true;
    if (timer) { clearTimeout(timer); timer = null; }
  }

  function onEnd() {
    if (timer) { clearTimeout(timer); timer = null; }
  }

  el.addEventListener("touchstart", onStart, { passive: false });
  el.addEventListener("touchmove", onMove, { passive: true });
  el.addEventListener("touchend", onEnd, { passive: true });
  el.addEventListener("touchcancel", onEnd, { passive: true });

  return () => {
    el.removeEventListener("touchstart", onStart);
    el.removeEventListener("touchmove", onMove);
    el.removeEventListener("touchend", onEnd);
    el.removeEventListener("touchcancel", onEnd);
  };
}
