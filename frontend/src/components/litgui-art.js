/**
 * <litgui-art> — declarative album/artist art with lazy, pooled loading.
 *
 * Fetches its image through the art-loader pool (capped concurrency +
 * timeout, see utils/art-loader.js) instead of a bare <img src>, so hung
 * art endpoints cannot exhaust the browser's per-host connection pool.
 *
 * Properties:
 *   src: string  - resolved art URL (already passed through resolveArt)
 *   icon: string - fallback icon name (default "mdi:account-music")
 *   alt: string  - alt text for the loaded image
 *
 * Fills its container (display:block, 100% x 100%); keep border-radius /
 * aspect-ratio / background on the surrounding container. Placeholder icon
 * size can be tuned from outside via --mdc-icon-size.
 */
import { LitElement, html, css } from "lit";
import { loadArt, releaseArt } from "../utils/art-loader.js";

class LitguiArt extends LitElement {
  static get properties() {
    return {
      src: { type: String },
      icon: { type: String },
      alt: { type: String },
      _state: { state: true }, // idle | loading | loaded | error
      _blobUrl: { state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        --mdc-icon-size: 48px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .placeholder litgui-icon {
        color: var(--secondary-text-color);
        opacity: 0.3;
      }
    `;
  }

  constructor() {
    super();
    this.src = "";
    this.icon = "mdi:account-music";
    this.alt = "";
    this._state = "idle";
    this._blobUrl = "";
    this._heldSrc = ""; // src we currently hold an art-loader reference for
    this._observer = null;
    this._visible = false;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._visible) {
      // Reconnected after a disconnect released our reference — reload.
      this._load();
    } else {
      this._observe();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._teardownObserver();
    this._release();
    this._blobUrl = "";
    if (this._state === "loaded") this._state = "idle";
  }

  updated(changed) {
    if (changed.has("src") && changed.get("src") !== undefined) {
      this._release();
      this._blobUrl = "";
      this._state = "idle";
      if (this._visible) {
        this._load();
      } else {
        this._observe();
      }
    }
  }

  render() {
    if (this._state === "loaded" && this._blobUrl) {
      return html`<img src="${this._blobUrl}" alt="${this.alt || ""}" />`;
    }
    return html`
      <div class="placeholder">
        <litgui-icon icon="${this.icon}"></litgui-icon>
      </div>
    `;
  }

  _observe() {
    if (this._observer) return;
    if (typeof IntersectionObserver === "undefined") {
      this._onVisible();
      return;
    }
    this._observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this._onVisible();
            break;
          }
        }
      },
      { rootMargin: "200px" }
    );
    this._observer.observe(this);
  }

  _teardownObserver() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  _onVisible() {
    this._visible = true;
    this._teardownObserver();
    this._load();
  }

  async _load() {
    const src = this.src;
    if (!src) {
      this._state = "idle";
      return;
    }
    if (this._heldSrc === src && this._state === "loaded") return;
    this._state = "loading";
    try {
      const blobUrl = await loadArt(src);
      if (this.src !== src || !this.isConnected) {
        releaseArt(src);
        return;
      }
      this._release();
      this._heldSrc = src;
      this._blobUrl = blobUrl;
      this._state = "loaded";
    } catch {
      if (this.src === src && this.isConnected) {
        this._state = "error";
      }
    }
  }

  _release() {
    if (this._heldSrc) {
      releaseArt(this._heldSrc);
      this._heldSrc = "";
    }
  }
}

customElements.define("litgui-art", LitguiArt);
