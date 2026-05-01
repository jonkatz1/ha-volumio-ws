/**
 * Player Bar — persistent playback control strip at bottom.
 *
 * Properties:
 *   playerState: string - "playing" | "paused" | "idle" | "off" | "unavailable"
 *   title: string
 *   artist: string
 *   albumArt: string - resolved URL
 *   duration: number - seconds
 *   position: number - seconds
 *   positionUpdatedAt: string - ISO datetime
 *   volume: number - 0-100
 *   muted: boolean
 *   shuffle: boolean
 *   repeat: string - "off" | "all" | "one"
 *   quality: object - QualityInfo
 *   source: string - service name
 *   volumeEnabled: boolean - whether volume control is available
 *
 * Events:
 *   volumio-command: { command, value }
 *   volumio-navigate: { view: "now-playing" }
 */
import { LitElement, html, css } from "lit";
import "./quality-badge.js";
import "./source-badge.js";

class VolumioPlayerBar extends LitElement {
  static get properties() {
    return {
      playerState: { type: String, attribute: "player-state" },
      title: { type: String },
      artist: { type: String },
      albumArt: { type: String, attribute: "album-art" },
      duration: { type: Number },
      position: { type: Number },
      positionUpdatedAt: { type: String, attribute: "position-updated-at" },
      volume: { type: Number },
      muted: { type: Boolean },
      shuffle: { type: Boolean },
      repeat: { type: String },
      quality: { type: Object },
      source: { type: String },
      volumeEnabled: { type: Boolean, attribute: "volume-enabled" },
      isFavorite: { type: Boolean, attribute: "is-favorite" },
      _displayPosition: { type: Number, state: true },
      _isDragging: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        z-index: 100;
      }

      .player-bar {
        display: flex;
        align-items: center;
        height: var(--volumio-player-bar-height, 80px);
        padding: 0 var(--volumio-space-md, 16px);
        background: var(--card-background-color, #1e1e1e);
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.12));
        gap: var(--volumio-space-md, 16px);
      }

      /* ── Album art ─────────────────────────────── */
      .art {
        width: 56px;
        height: 56px;
        border-radius: 4px;
        object-fit: cover;
        cursor: pointer;
        flex-shrink: 0;
        background: var(--divider-color, #333);
      }

      .art-placeholder {
        width: 56px;
        height: 56px;
        border-radius: 4px;
        flex-shrink: 0;
        background: var(--divider-color, #333);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .art-placeholder ha-icon {
        --mdc-icon-size: 28px;
        color: var(--secondary-text-color);
      }

      /* ── Track info ────────────────────────────── */
      .track-info {
        flex: 0 1 200px;
        min-width: 0;
        cursor: pointer;
      }

      .track-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.3;
      }

      .track-artist {
        font-size: 12px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.3;
      }

      .track-info-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 0 1 220px;
        min-width: 0;
      }

      .fav-btn {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: var(--secondary-text-color);
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
      }

      .fav-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      .fav-btn.active {
        color: #e91e63;
      }

      /* ── Progress section ──────────────────────── */
      .progress-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 200px;
        gap: 2px;
      }

      .controls-row {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-sm, 8px);
      }

      .ctrl-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: background 0.15s;
      }

      .ctrl-btn:hover {
        background: var(--divider-color, rgba(255,255,255,0.08));
      }

      .ctrl-btn.play-pause {
        width: 42px;
        height: 42px;
      }

      .ctrl-btn.play-pause ha-icon {
        --mdc-icon-size: 28px;
      }

      .ctrl-btn.active {
        color: var(--primary-color, #03a9f4);
      }

      .ctrl-btn ha-icon {
        --mdc-icon-size: 22px;
      }

      .ctrl-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .progress-row {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 6px;
      }

      .time-label {
        font-size: 11px;
        color: var(--secondary-text-color);
        min-width: 36px;
        text-align: center;
        font-variant-numeric: tabular-nums;
      }

      .progress-track {
        flex: 1;
        height: 4px;
        background: var(--divider-color, rgba(255,255,255,0.15));
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        transition: height 0.1s;
      }

      .progress-track:hover {
        height: 6px;
      }

      .progress-fill {
        height: 100%;
        background: var(--primary-color, #03a9f4);
        border-radius: 2px;
        transition: none;
        position: relative;
      }

      .progress-thumb {
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
        opacity: 0;
        transition: opacity 0.1s;
      }

      .progress-track:hover .progress-thumb {
        opacity: 1;
      }

      /* ── Right section (quality, volume) ────────── */
      .right-section {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-sm, 8px);
        flex-shrink: 0;
      }

      .quality-source {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
      }

      .volume-section {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .vol-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }

      .vol-btn:hover {
        background: var(--divider-color, rgba(255,255,255,0.08));
      }

      .vol-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      .vol-slider {
        width: 100px;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: var(--divider-color, rgba(255,255,255,0.15));
        border-radius: 2px;
        outline: none;
        cursor: pointer;
      }

      .vol-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
        cursor: pointer;
      }

      .vol-slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
        cursor: pointer;
        border: none;
      }

      /* ── Empty state ────────────────────────────── */
      .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--volumio-player-bar-height, 80px);
        background: var(--card-background-color, #1e1e1e);
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.12));
        color: var(--secondary-text-color);
        font-size: 14px;
        gap: 8px;
      }

      .empty-state ha-icon {
        --mdc-icon-size: 20px;
      }

      /* ── Responsive ─────────────────────────────── */
      @media (max-width: 1024px) {
        .quality-source {
          display: none;
        }
      }

      @media (max-width: 768px) {
        .player-bar {
          flex-wrap: wrap;
          height: auto;
          min-height: var(--volumio-player-bar-height, 80px);
          padding: var(--volumio-space-sm, 8px) var(--volumio-space-md, 16px);
          gap: var(--volumio-space-sm, 8px);
        }

        .progress-section {
          order: 10;
          width: 100%;
          flex: 1 1 100%;
          min-width: 0;
        }

        .volume-section {
          display: none;
        }
      }

      /* ── Skeleton / loading state ──────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-bar-row {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-md, 16px);
        height: var(--volumio-player-bar-height, 80px);
        padding: var(--volumio-space-sm, 8px) var(--volumio-space-md, 16px);
        background: var(--card-background-color, #1e1e1e);
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      }

      .skeleton-art {
        width: 56px;
        height: 56px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        flex: 0 0 auto;
      }

      .skeleton-info {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 0 1 220px;
      }

      .skeleton-bar {
        height: 12px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-bar.title { width: 70%; height: 14px; }
      .skeleton-bar.artist { width: 50%; }

      .skeleton-progress {
        flex: 1;
        height: 4px;
        border-radius: 2px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }
    `;
  }

  constructor() {
    super();
    this.playerState = "idle";
    this.title = "";
    this.artist = "";
    this.albumArt = "";
    this.duration = 0;
    this.position = 0;
    this.positionUpdatedAt = "";
    this.volume = 0;
    this.muted = false;
    this.shuffle = false;
    this.repeat = "off";
    this.quality = null;
    this.source = "";
    this.volumeEnabled = true;
    this.isFavorite = false;
    this._displayPosition = 0;
    this._isDragging = false;
    this._rafId = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._startProgressAnimation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopProgressAnimation();
  }

  updated(changed) {
    if (changed.has("position") || changed.has("positionUpdatedAt") || changed.has("playerState")) {
      if (!this._isDragging) {
        this._displayPosition = this.position || 0;
      }
    }
  }

  // ── Progress interpolation ─────────────────────────────────

  _startProgressAnimation() {
    const tick = () => {
      if (this.playerState === "playing" && !this._isDragging && this.positionUpdatedAt) {
        const updatedAt = new Date(this.positionUpdatedAt).getTime();
        const elapsed = (Date.now() - updatedAt) / 1000;
        const interpolated = (this.position || 0) + elapsed;
        this._displayPosition = Math.min(interpolated, this.duration || Infinity);
      }
      this._rafId = requestAnimationFrame(tick);
    };
    this._rafId = requestAnimationFrame(tick);
  }

  _stopProgressAnimation() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  // ── Render ─────────────────────────────────────────────────

  render() {
    if (this.playerState === "unavailable") {
      return html`
        <div class="skeleton-bar-row" aria-busy="true" aria-label="Loading">
          <div class="skeleton-art"></div>
          <div class="skeleton-info">
            <div class="skeleton-bar title"></div>
            <div class="skeleton-bar artist"></div>
          </div>
          <div class="skeleton-progress"></div>
        </div>
      `;
    }

    const isActive = this.playerState === "playing" || this.playerState === "paused";

    if (!isActive && !this.title) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:music-note-off"></ha-icon>
          <span>Nothing playing</span>
        </div>
      `;
    }

    const isPlaying = this.playerState === "playing";
    const progressPct = this.duration > 0
      ? Math.min(100, (this._displayPosition / this.duration) * 100)
      : 0;

    const repeatIcon = this.repeat === "one" ? "mdi:repeat-once" : "mdi:repeat";
    const repeatActive = this.repeat !== "off";
    const volIcon = this.muted ? "mdi:volume-mute" : "mdi:volume-high";

    return html`
      <div class="player-bar">
        ${this.albumArt
          ? html`<img
              class="art"
              src="${this.albumArt}"
              alt="Album art"
              @click=${this._goToNowPlaying}
              @error=${this._onArtError}
            />`
          : html`<div class="art-placeholder" @click=${this._goToNowPlaying}>
              <ha-icon icon="mdi:music-note"></ha-icon>
            </div>`}

        <div class="track-info-wrap">
          <div class="track-info" @click=${this._goToNowPlaying}>
            <div class="track-title">${this.title || "—"}</div>
            <div class="track-artist">${this.artist || ""}</div>
          </div>
          <button
            class="fav-btn ${this.isFavorite ? "active" : ""}"
            @click=${this._toggleFavorite}
            aria-label="${this.isFavorite ? "Remove from favorites" : "Add to favorites"}"
            title="${this.isFavorite ? "Remove from favorites" : "Add to favorites"}"
          >
            <ha-icon icon="${this.isFavorite ? "mdi:heart" : "mdi:heart-outline"}"></ha-icon>
          </button>
        </div>

        <div class="progress-section">
          <div class="controls-row">
            <button
              class="ctrl-btn ${this.shuffle ? "active" : ""}"
              @click=${() => this._command("shuffle_set", !this.shuffle)}
              title="Shuffle ${this.shuffle ? "on" : "off"}"
              aria-label="Shuffle: ${this.shuffle ? "on" : "off"}"
            >
              <ha-icon icon="mdi:shuffle-variant"></ha-icon>
            </button>

            <button class="ctrl-btn" @click=${() => this._command("prev")} aria-label="Previous track">
              <ha-icon icon="mdi:skip-previous"></ha-icon>
            </button>

            <button class="ctrl-btn play-pause" @click=${() => this._command("play_pause")} aria-label="${isPlaying ? "Pause" : "Play"}">
              <ha-icon icon="${isPlaying ? "mdi:pause" : "mdi:play"}"></ha-icon>
            </button>

            <button class="ctrl-btn" @click=${() => this._command("next")} aria-label="Next track">
              <ha-icon icon="mdi:skip-next"></ha-icon>
            </button>

            <button
              class="ctrl-btn ${repeatActive ? "active" : ""}"
              @click=${() => this._cycleRepeat()}
              title="Repeat: ${this.repeat}"
              aria-label="Repeat: ${this.repeat}"
            >
              <ha-icon icon="${repeatIcon}"></ha-icon>
            </button>
          </div>

          <div class="progress-row">
            <span class="time-label">${this._formatTime(this._displayPosition)}</span>
            <div
              class="progress-track"
              @click=${this._onProgressClick}
              aria-label="Playback progress: ${this._formatTime(this._displayPosition)} of ${this._formatTime(this.duration)}"
              role="slider"
              aria-valuemin="0"
              aria-valuemax="${this.duration || 0}"
              aria-valuenow="${Math.floor(this._displayPosition)}"
            >
              <div class="progress-fill" style="width: ${progressPct}%">
                <div class="progress-thumb"></div>
              </div>
            </div>
            <span class="time-label">${this._formatTime(this.duration)}</span>
          </div>
        </div>

        <div class="right-section">
          <div class="quality-source">
            <volumio-quality-badge .quality=${this.quality}></volumio-quality-badge>
            <volumio-source-badge .source=${this.source}></volumio-source-badge>
          </div>

          ${this.volumeEnabled ? html`
            <div class="volume-section">
              <button
                class="vol-btn"
                @click=${() => this._command("mute_toggle")}
                aria-label="Volume: ${this.muted ? "muted" : this.volume + "%"}"
              >
                <ha-icon icon="${volIcon}"></ha-icon>
              </button>
              <input
                class="vol-slider"
                type="range"
                min="0"
                max="100"
                .value=${String(this.volume)}
                @input=${this._onVolumeInput}
                @change=${this._onVolumeChange}
                aria-label="Volume: ${this.volume}%"
              />
            </div>
          ` : ""}
        </div>
      </div>
    `;
  }

  // ── Handlers ───────────────────────────────────────────────

  _command(command, value) {
    this.dispatchEvent(new CustomEvent("volumio-command", {
      detail: { command, value },
      bubbles: true, composed: true,
    }));
  }

  _cycleRepeat() {
    const next = this.repeat === "off" ? "all" : this.repeat === "all" ? "one" : "off";
    this._command("repeat_set", next);
  }

  _onProgressClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTo = Math.floor(pct * (this.duration || 0));
    this._command("seek", seekTo);
  }

  _onVolumeInput(e) {
    // Live preview while dragging (no command yet)
  }

  _onVolumeChange(e) {
    const val = parseInt(e.target.value, 10);
    this._command("volume_set", val);
  }

  _goToNowPlaying() {
    this.dispatchEvent(new CustomEvent("volumio-navigate", {
      detail: { view: "now-playing" },
      bubbles: true, composed: true,
    }));
  }

  _toggleFavorite(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("volumio-toggle-favorite", {
      bubbles: true, composed: true,
    }));
  }

  _onArtError(e) {
    // Replace broken image with placeholder
    e.target.style.display = "none";
    const placeholder = document.createElement("div");
    placeholder.className = "art-placeholder";
    placeholder.innerHTML = '<ha-icon icon="mdi:music-note"></ha-icon>';
    e.target.parentNode.insertBefore(placeholder, e.target);
  }

  _formatTime(seconds) {
    if (!seconds || seconds <= 0) return "0:00";
    const s = Math.floor(seconds);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }
}

customElements.define("volumio-player-bar", VolumioPlayerBar);
