/**
 * Quality Badge — pill-shaped label showing audio quality tier.
 *
 * Properties:
 *   quality: QualityInfo object from quality-utils.js
 *   size: "small" (browse views, 10px) or "normal" (player bar, 12px)
 */
import { LitElement, html, css } from "lit";

class VolumioQualityBadge extends LitElement {
  static get properties() {
    return {
      quality: { type: Object },
      size: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        line-height: 1;
        white-space: nowrap;
      }

      .badge.normal {
        font-size: 11px;
        height: 22px;
      }

      .badge.small {
        font-size: 10px;
        height: 18px;
        padding: 1px 6px;
      }

      .badge.large {
        font-size: 13px;
        height: 26px;
        padding: 3px 12px;
      }
    `;
  }

  constructor() {
    super();
    this.quality = null;
    this.size = "normal";
  }

  render() {
    if (!this.quality || this.quality.tier === "unknown" || !this.quality.label) {
      return html``;
    }

    const q = this.quality;
    const sizeClass = this.size === "small" ? "small" : this.size === "large" ? "large" : "normal";

    return html`
      <span
        class="badge ${sizeClass}"
        style="color: ${q.color}; background: ${q.colorBg};"
        aria-label="Audio quality: ${q.label}"
        title="${q.tierLabel}: ${q.label}"
      >
        ${q.label}
      </span>
    `;
  }
}

customElements.define("volumio-quality-badge", VolumioQualityBadge);
