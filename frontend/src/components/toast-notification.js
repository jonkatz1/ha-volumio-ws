/**
 * Toast Notification — transient feedback bar with optional undo.
 *
 * Properties:
 *   message: string
 *   open: boolean
 *   undoAction: string|null — if set, show "Undo" link
 *
 * Events:
 *   volumio-toast-undo: { action: string }
 *   volumio-toast-dismiss: (auto or manual)
 *
 * Usage from parent:
 *   this._toastMessage = "Added to queue";
 *   this._toastOpen = true;
 *   this._toastUndo = null;  // or "remove_from_queue" for undo support
 */
import { LitElement, html, css } from "lit";

const AUTO_DISMISS_MS = 3000;

class VolumioToastNotification extends LitElement {
  static get properties() {
    return {
      message: { type: String },
      open: { type: Boolean, reflect: true },
      undoAction: { type: String, attribute: "undo-action" },
    };
  }

  static get styles() {
    return css`
      :host {
        position: fixed;
        bottom: 80px;  /* above player bar */
        left: 50%;
        transform: translateX(-50%);
        z-index: 9000;
        pointer-events: none;
        display: block;
      }

      .toast {
        max-width: 320px;
        min-width: 200px;
        padding: 10px 16px;
        background: rgba(30, 30, 30, 0.95);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        gap: 12px;
        pointer-events: auto;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 200ms ease-out, transform 200ms ease-out;
      }

      :host([open]) .toast {
        opacity: 1;
        transform: translateY(0);
      }

      .toast-message {
        flex: 1;
        font-size: 13px;
        color: #eee;
        line-height: 1.3;
      }

      .toast-undo {
        font-size: 13px;
        font-weight: 600;
        color: var(--primary-color, #03a9f4);
        cursor: pointer;
        white-space: nowrap;
        padding: 2px 4px;
        border-radius: 4px;
        transition: background 0.1s;
      }

      .toast-undo:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    `;
  }

  constructor() {
    super();
    this.message = "";
    this.open = false;
    this.undoAction = null;
    this._timer = null;
  }

  updated(changed) {
    if (changed.has("open") && this.open) {
      this._startDismissTimer();
    }
  }

  _startDismissTimer() {
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this._dismiss();
    }, AUTO_DISMISS_MS);
  }

  render() {
    return html`
      <div class="toast">
        <span class="toast-message">${this.message}</span>
        ${this.undoAction
          ? html`<span class="toast-undo" @click=${this._onUndo}>Undo</span>`
          : ""}
      </div>
    `;
  }

  _onUndo() {
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
    this.dispatchEvent(new CustomEvent("volumio-toast-undo", {
      detail: { action: this.undoAction },
      bubbles: true, composed: true,
    }));
    this._dismiss();
  }

  _dismiss() {
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
    this.open = false;
    this.dispatchEvent(new CustomEvent("volumio-toast-dismiss", {
      bubbles: true, composed: true,
    }));
  }

  /** Public method for parent to show a toast. */
  show(message, undoAction = null) {
    this.message = message;
    this.undoAction = undoAction;
    this.open = true;
  }
}

customElements.define("volumio-toast-notification", VolumioToastNotification);
