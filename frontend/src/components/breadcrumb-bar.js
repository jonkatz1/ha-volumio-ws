/**
 * Breadcrumb Bar — navigation breadcrumb trail.
 *
 * Properties:
 *   trail: array - [{uri, title}] navigation stack
 *
 * Events:
 *   volumio-breadcrumb-click: { index, uri, title }
 */
import { LitElement, html, css } from "lit";

class VolumioBreadcrumbBar extends LitElement {
  static get properties() {
    return {
      trail: { type: Array },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .breadcrumb {
        display: flex;
        align-items: center;
        height: var(--volumio-breadcrumb-height, 32px);
        padding: 0 var(--volumio-space-md, 16px);
        background: var(--card-background-color, #1e1e1e);
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        font-size: 13px;
        color: var(--secondary-text-color);
        gap: 2px;
        overflow: hidden;
      }

      .segment {
        cursor: pointer;
        color: var(--secondary-text-color);
        white-space: nowrap;
        padding: 2px 4px;
        border-radius: 4px;
        transition: color 0.15s, background 0.15s;
      }

      .segment:hover {
        color: var(--primary-text-color);
        background: var(--divider-color, rgba(255, 255, 255, 0.06));
      }

      .segment.current {
        color: var(--primary-text-color);
        font-weight: 600;
        cursor: default;
      }

      .segment.current:hover {
        background: none;
      }

      .sep {
        color: var(--secondary-text-color);
        opacity: 0.4;
        flex-shrink: 0;
        display: flex;
        align-items: center;
      }

      .sep litgui-icon {
        --mdc-icon-size: 14px;
      }

      .ellipsis {
        color: var(--secondary-text-color);
        opacity: 0.5;
        padding: 0 2px;
      }
    `;
  }

  constructor() {
    super();
    this.trail = [];
  }

  render() {
    if (!this.trail || this.trail.length === 0) {
      return html``;
    }

    const segments = this._getDisplaySegments();

    return html`
      <div class="breadcrumb">
        ${segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          return html`
            ${i > 0 ? html`<span class="sep"><litgui-icon icon="mdi:chevron-right"></litgui-icon></span>` : ""}
            ${seg.ellipsis
              ? html`<span class="ellipsis">...</span>`
              : html`
                <span
                  class="segment ${isLast ? "current" : ""}"
                  @click=${() => !isLast && this._onClick(seg.index)}
                  title="${seg.title}"
                >${seg.title}</span>
              `}
          `;
        })}
      </div>
    `;
  }

  _getDisplaySegments() {
    const trail = this.trail;
    const maxVisible = 5;

    if (trail.length <= maxVisible) {
      return trail.map((seg, i) => ({ ...seg, index: i }));
    }

    // First segment + ellipsis + last 3 segments
    return [
      { ...trail[0], index: 0 },
      { ellipsis: true },
      ...trail.slice(-3).map((seg, i) => ({
        ...seg,
        index: trail.length - 3 + i,
      })),
    ];
  }

  _onClick(index) {
    const seg = this.trail[index];
    if (!seg) return;
    this.dispatchEvent(new CustomEvent("volumio-breadcrumb-click", {
      detail: { index, uri: seg.uri, title: seg.title },
      bubbles: true, composed: true,
    }));
  }
}

customElements.define("volumio-breadcrumb-bar", VolumioBreadcrumbBar);
