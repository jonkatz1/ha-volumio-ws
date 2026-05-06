/**
 * Settings Panel — panel preferences and about info.
 *
 * Properties:
 *   clickAction: string - "play_now" | "add_to_queue"
 *   queueThumbnails: boolean
 *   browseViewMode: string - "grid" | "list"
 *   aboutInfo: object - { volumioUrl, entityId }
 *
 * Events:
 *   volumio-setting-change: { key: string, value: any }
 */
import { LitElement, html, css } from "lit";

class VolumioSettingsPanel extends LitElement {
  static get properties() {
    return {
      clickAction: { type: String, attribute: "click-action" },
      queueThumbnails: { type: Boolean, attribute: "queue-thumbnails" },
      browseViewMode: { type: String, attribute: "browse-view-mode" },
      aboutInfo: { type: Object },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
        max-width: 640px;
      }

      .header {
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .title {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary-text-color);
      }

      /* ── Sections ──────────────────── */
      .section {
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .section-title {
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        padding-bottom: 8px;
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        margin-bottom: var(--volumio-space-md, 16px);
      }

      /* ── Setting row ───────────────── */
      .setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0;
        gap: 16px;
      }

      .setting-row + .setting-row {
        border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.04));
      }

      .setting-info {
        flex: 1;
        min-width: 0;
      }

      .setting-label {
        font-size: 15px;
        color: var(--primary-text-color);
        font-weight: 500;
      }

      .setting-desc {
        font-size: 13px;
        color: var(--secondary-text-color);
        margin-top: 2px;
        line-height: 1.4;
      }

      /* ── Toggle switch ─────────────── */
      .toggle {
        position: relative;
        width: 44px;
        height: 24px;
        flex-shrink: 0;
      }

      .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }

      .toggle-track {
        position: absolute;
        inset: 0;
        border-radius: 12px;
        background: var(--divider-color, rgba(255, 255, 255, 0.2));
        cursor: pointer;
        transition: background 0.2s;
      }

      .toggle input:checked + .toggle-track {
        background: var(--primary-color, #03a9f4);
      }

      .toggle-track::after {
        content: "";
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #fff;
        top: 3px;
        left: 3px;
        transition: transform 0.2s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }

      .toggle input:checked + .toggle-track::after {
        transform: translateX(20px);
      }

      /* ── Segmented control ─────────── */
      .segmented {
        display: flex;
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;
      }

      .seg-btn {
        padding: 6px 16px;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
      }

      .seg-btn + .seg-btn {
        border-left: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      }

      .seg-btn.active {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }

      .seg-btn:hover:not(.active) {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
      }

      /* ── About section ─────────────── */
      .about-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
      }

      .about-row + .about-row {
        border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.04));
      }

      .about-key {
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .about-value {
        font-size: 14px;
        color: var(--primary-text-color);
        font-weight: 500;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 60%;
      }
    `;
  }

  constructor() {
    super();
    this.clickAction = "play_now";
    this.queueThumbnails = true;
    this.browseViewMode = "grid";
    this.aboutInfo = {};
  }

  render() {
    return html`
      <div class="header">
        <span class="title">Settings</span>
      </div>

      <div class="section">
        <div class="section-title">Behavior</div>

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-label">Default click action</div>
            <div class="setting-desc">What happens when you click a track</div>
          </div>
          <div class="segmented">
            <button
              class="seg-btn ${this.clickAction === "play_now" ? "active" : ""}"
              @click=${() => this._onChange("clickAction", "play_now")}
            >Play Now</button>
            <button
              class="seg-btn ${this.clickAction === "add_to_queue" ? "active" : ""}"
              @click=${() => this._onChange("clickAction", "add_to_queue")}
            >Add to Queue</button>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Appearance</div>

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-label">Queue thumbnails</div>
            <div class="setting-desc">Show album art in the queue panel</div>
          </div>
          <label class="toggle">
            <input
              type="checkbox"
              .checked=${this.queueThumbnails}
              @change=${(e) => this._onChange("queueThumbnails", e.target.checked)}
            />
            <span class="toggle-track"></span>
          </label>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-label">Browse view</div>
            <div class="setting-desc">Default layout for browse lists</div>
          </div>
          <div class="segmented">
            <button
              class="seg-btn ${this.browseViewMode === "grid" ? "active" : ""}"
              @click=${() => this._onChange("browseViewMode", "grid")}
            >Grid</button>
            <button
              class="seg-btn ${this.browseViewMode === "list" ? "active" : ""}"
              @click=${() => this._onChange("browseViewMode", "list")}
            >List</button>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">About</div>
        ${this.aboutInfo.volumioUrl ? html`
          <div class="about-row">
            <span class="about-key">Volumio URL</span>
            <span class="about-value">${this.aboutInfo.volumioUrl}</span>
          </div>
        ` : ""}
        ${this.aboutInfo.entityId ? html`
          <div class="about-row">
            <span class="about-key">Entity</span>
            <span class="about-value">${this.aboutInfo.entityId}</span>
          </div>
        ` : ""}
        <div class="about-row">
          <span class="about-key">Integration</span>
          <span class="about-value">ha-volumio-ws</span>
        </div>
      </div>
    `;
  }

  _onChange(key, value) {
    this.dispatchEvent(new CustomEvent("volumio-setting-change", {
      detail: { key, value },
      bubbles: true, composed: true,
    }));
  }
}

customElements.define("volumio-settings-panel", VolumioSettingsPanel);
