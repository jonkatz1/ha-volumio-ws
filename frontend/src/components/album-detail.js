/**
 * Album Detail — single album view with header metadata and track listing.
 *
 * Properties:
 *   albumTitle: string
 *   albumArtist: string
 *   albumArt: string - resolved URL
 *   albumUri: string
 *   albumService: string
 *   tracks: array - track items from browseLibrary
 *   loading: boolean
 *   currentUri: string - currently playing track URI
 *   quality: object - QualityInfo for album-level badge
 *   volumioUrl: string
 *   story: string|null - album story text (null = hide section)
 *   credits: array - [{key, values:[{name, uri}]}] (empty = hide section)
 *   storyLoading: boolean - story section shows skeleton while true
 *   creditsLoading: boolean - credits section shows skeleton while true
 *
 * Events:
 *   volumio-track-click: { uri, title, artist, ... }
 *   volumio-album-play: { uri }
 *   volumio-album-add-queue: { uri }
 *   volumio-navigate: { view, artist }
 *   volumio-similar-artist-click: { artist, uri, albumart } (from credit name click)
 */
import { LitElement, html, css } from "lit";
import { formatTime, resolveArt } from "../utils/format-utils.js";
import { inferTrackQuality } from "../utils/quality-utils.js";
import "./track-card.js";
import "./quality-badge.js";
import "./source-badge.js";

const STORY_TRUNCATE_WORDS = 200;
const CREDITS_INITIAL_ROWS = 6;

class VolumioAlbumDetail extends LitElement {
  static get properties() {
    return {
      albumTitle: { type: String, attribute: "album-title" },
      albumArtist: { type: String, attribute: "album-artist" },
      albumArt: { type: String, attribute: "album-art" },
      albumUri: { type: String, attribute: "album-uri" },
      albumService: { type: String, attribute: "album-service" },
      tracks: { type: Array },
      loading: { type: Boolean },
      currentUri: { type: String, attribute: "current-uri" },
      quality: { type: Object },
      volumioUrl: { type: String, attribute: "volumio-url" },
      configEntryId: { type: String, attribute: "config-entry-id" },
      story: { type: String },
      credits: { type: Array, attribute: false },
      storyLoading: { type: Boolean, attribute: "story-loading" },
      creditsLoading: { type: Boolean, attribute: "credits-loading" },
      _storyExpanded: { type: Boolean, state: true },
      _creditsExpanded: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      /* ── Header ──────────────────────────── */
      .album-header {
        display: flex;
        gap: var(--volumio-space-lg, 24px);
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .album-art-container {
        flex-shrink: 0;
        width: 250px;
        height: 250px;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
      }

      .album-art-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .album-art-placeholder {
        width: 100%;
        height: 100%;
        background: var(--card-background-color, #2a2a2a);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .album-art-placeholder ha-icon {
        --mdc-icon-size: 64px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      .album-meta {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: var(--volumio-space-xs, 4px);
        min-width: 0;
      }

      .meta-type {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
      }

      .album-name {
        font-size: 28px;
        font-weight: 700;
        color: var(--primary-text-color);
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .album-artist-link {
        font-size: 16px;
        color: var(--secondary-text-color);
        cursor: pointer;
        transition: color 0.15s;
      }

      .album-artist-link:hover {
        color: var(--primary-text-color);
        text-decoration: underline;
      }

      .meta-details {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-sm, 8px);
        flex-wrap: wrap;
        margin-top: var(--volumio-space-xs, 4px);
      }

      .meta-details .detail {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .meta-details .sep {
        color: var(--secondary-text-color);
        opacity: 0.4;
      }

      .album-actions {
        display: flex;
        gap: var(--volumio-space-sm, 8px);
        margin-top: var(--volumio-space-md, 16px);
      }

      .action-btn {
        padding: 10px 24px;
        border-radius: 20px;
        border: none;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: opacity 0.15s;
      }

      .action-btn:hover {
        opacity: 0.85;
      }

      .action-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      .action-btn.primary {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }

      .action-btn.secondary {
        background: var(--divider-color, rgba(255, 255, 255, 0.12));
        color: var(--primary-text-color);
      }

      /* ── Track list ──────────────────────── */
      .track-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .track-list-header {
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

      .track-list-header .hdr-duration {
        text-align: right;
      }

      /* ── Story (About this album) ────────── */
      .section {
        margin-top: var(--volumio-space-xl, 32px);
      }

      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: var(--volumio-space-md, 16px);
      }

      .story-text {
        font-size: 14px;
        line-height: 1.6;
        color: var(--primary-text-color);
        white-space: pre-wrap;
      }

      .story-toggle {
        margin-top: var(--volumio-space-sm, 8px);
        background: none;
        border: none;
        padding: 0;
        font-size: 13px;
        font-weight: 500;
        color: var(--primary-color, #03a9f4);
        cursor: pointer;
      }

      .story-toggle:hover {
        text-decoration: underline;
      }

      /* ── Credits ──────────────────────────── */
      .credits-list {
        display: flex;
        flex-direction: column;
        gap: var(--volumio-space-sm, 8px);
      }

      .credit-row {
        display: grid;
        grid-template-columns: minmax(140px, 30%) 1fr;
        gap: var(--volumio-space-md, 16px);
        font-size: 14px;
        line-height: 1.5;
      }

      .credit-key {
        color: var(--secondary-text-color);
        text-transform: capitalize;
      }

      .credit-values {
        color: var(--primary-text-color);
      }

      .credit-name {
        cursor: pointer;
        transition: color 0.15s;
      }

      .credit-name:hover {
        color: var(--primary-color, #03a9f4);
        text-decoration: underline;
      }

      .credits-toggle {
        margin-top: var(--volumio-space-sm, 8px);
        background: none;
        border: none;
        padding: 0;
        font-size: 13px;
        font-weight: 500;
        color: var(--primary-color, #03a9f4);
        cursor: pointer;
      }

      .credits-toggle:hover {
        text-decoration: underline;
      }

      /* ── Section skeletons ────────────────── */
      .skeleton-bar.w-full,
      .skeleton-bar.w-90,
      .skeleton-bar.w-75,
      .skeleton-bar.w-60 {
        height: 14px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        margin-bottom: 8px;
      }

      .skeleton-bar.w-full { width: 100%; }
      .skeleton-bar.w-90 { width: 90%; }
      .skeleton-bar.w-75 { width: 75%; }
      .skeleton-bar.w-60 { width: 60%; }

      .skeleton-credit-row {
        display: grid;
        grid-template-columns: minmax(140px, 30%) 1fr;
        gap: var(--volumio-space-md, 16px);
        margin-bottom: 8px;
      }

      .skeleton-credit-key,
      .skeleton-credit-values {
        height: 14px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-credit-key { width: 60%; }
      .skeleton-credit-values { width: 80%; }

      @media (max-width: 768px) {
        .credit-row,
        .skeleton-credit-row {
          grid-template-columns: 1fr;
          gap: 2px;
        }
      }

      /* ── Loading skeleton ─────────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-header {
        display: flex;
        gap: var(--volumio-space-lg, 24px);
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .skeleton-art {
        width: 250px;
        height: 250px;
        border-radius: 6px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        flex-shrink: 0;
      }

      .skeleton-meta {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 8px;
      }

      .skeleton-bar {
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-bar.title { width: 60%; height: 28px; }
      .skeleton-bar.artist { width: 30%; height: 16px; }
      .skeleton-bar.detail { width: 45%; height: 14px; }

      .skeleton-tracks {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .skeleton-track {
        height: 48px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      /* ── Responsive ──────────────────────── */
      @media (max-width: 768px) {
        .album-header {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .album-art-container {
          width: 200px;
          height: 200px;
        }

        .album-meta {
          align-items: center;
        }

        .album-actions {
          justify-content: center;
        }

        .track-list-header {
          grid-template-columns: 40px 1fr 0.8fr 60px 32px;
        }

        .track-list-header .hdr-album,
        .track-list-header .hdr-quality {
          display: none;
        }
      }
    `;
  }

  constructor() {
    super();
    this.albumTitle = "";
    this.albumArtist = "";
    this.albumArt = "";
    this.albumUri = "";
    this.albumService = "";
    this.tracks = [];
    this.loading = false;
    this.currentUri = "";
    this.quality = null;
    this.volumioUrl = "";
    this.story = null;
    this.credits = [];
    this.storyLoading = false;
    this.creditsLoading = false;
    this._storyExpanded = false;
    this._creditsExpanded = false;
  }

  updated(changedProperties) {
    // Reset expansions when album changes so a new album doesn't inherit
    // the previous album's expanded state.
    if (
      changedProperties.has("albumTitle") ||
      changedProperties.has("albumArtist") ||
      changedProperties.has("story") ||
      changedProperties.has("credits")
    ) {
      this._storyExpanded = false;
      this._creditsExpanded = false;
    }
  }

  render() {
    if (this.loading) {
      return this._renderSkeleton();
    }

    const trackCount = this.tracks.length;
    const totalDuration = this.tracks.reduce((sum, t) => sum + (t.duration || 0), 0);

    return html`
      <div class="album-header">
        <div class="album-art-container">
          ${this.albumArt
            ? html`<img src="${resolveArt(this.albumArt, this.volumioUrl, this.configEntryId)}" alt="${this.albumTitle}" @error=${this._onArtError} />`
            : html`<div class="album-art-placeholder">
                <ha-icon icon="mdi:album"></ha-icon>
              </div>`}
        </div>
        <div class="album-meta">
          <span class="meta-type">Album</span>
          <div class="album-name">${this.albumTitle || "Unknown Album"}</div>
          ${this.albumArtist
            ? html`<span class="album-artist-link" @click=${this._goToArtist}>
                ${this.albumArtist}
              </span>`
            : ""}
          <div class="meta-details">
            ${trackCount > 0 ? html`<span class="detail">${trackCount} track${trackCount !== 1 ? "s" : ""}</span>` : ""}
            ${trackCount > 0 && totalDuration > 0 ? html`<span class="sep">·</span>` : ""}
            ${totalDuration > 0 ? html`<span class="detail">${formatTime(totalDuration)}</span>` : ""}
            ${this.albumService ? html`
              <span class="sep">·</span>
              <volumio-source-badge .source=${this.albumService}></volumio-source-badge>
            ` : ""}
          </div>
          ${this.quality && this.quality.tier !== "unknown" ? html`
            <div style="margin-top: 4px">
              <volumio-quality-badge .quality=${this.quality}></volumio-quality-badge>
            </div>
          ` : ""}
          <div class="album-actions">
            <button class="action-btn primary" @click=${this._playAlbum}>
              <ha-icon icon="mdi:play"></ha-icon> Play
            </button>
            <button class="action-btn secondary" @click=${this._addToQueue}>
              <ha-icon icon="mdi:playlist-plus"></ha-icon> Add to Queue
            </button>
            <button class="action-btn secondary" @click=${this._onMoreClick}>
              <ha-icon icon="mdi:dots-horizontal"></ha-icon>
            </button>
          </div>
        </div>
      </div>

      ${trackCount > 0 ? html`
        <div class="track-list">
          <div class="track-list-header">
            <span>#</span>
            <span>Title</span>
            <span>Artist</span>
            <span class="hdr-album">Album</span>
            <span class="hdr-quality">Quality</span>
            <span class="hdr-duration">Time</span>
            <span></span>
          </div>
          ${this.tracks.map((track, i) => {
            const art = resolveArt(track.albumart || this.albumArt, this.volumioUrl, this.configEntryId);
            const quality = inferTrackQuality(track);
            return html`
              <volumio-track-card
                .index=${i + 1}
                title="${track.title || track.name || ""}"
                artist="${track.artist || this.albumArtist || ""}"
                album="${track.album || this.albumTitle || ""}"
                .duration=${track.duration || 0}
                uri="${track.uri || ""}"
                albumart="${art}"
                service="${track.service || this.albumService || ""}"
                type="${track.type || "song"}"
                .quality=${quality}
                ?is-playing=${this.currentUri && track.uri === this.currentUri}
                @volumio-track-click=${this._onTrackClick}
              ></volumio-track-card>
            `;
          })}
        </div>
      ` : html`
        <div style="text-align: center; padding: 32px; color: var(--secondary-text-color);">
          No tracks found
        </div>
      `}

      ${this._renderStorySection()}
      ${this._renderCreditsSection()}
    `;
  }

  _renderStorySection() {
    if (this.storyLoading) {
      return html`
        <div class="section" aria-busy="true" aria-label="Loading album story">
          <div class="section-title">About this album</div>
          <div class="skeleton-bar w-full"></div>
          <div class="skeleton-bar w-90"></div>
          <div class="skeleton-bar w-75"></div>
        </div>
      `;
    }
    if (!this.story) return "";

    const words = this.story.split(/\s+/);
    const truncated = words.length > STORY_TRUNCATE_WORDS && !this._storyExpanded;
    const displayText = truncated
      ? words.slice(0, STORY_TRUNCATE_WORDS).join(" ") + "…"
      : this.story;

    return html`
      <div class="section">
        <div class="section-title">About this album</div>
        <div class="story-text">${displayText}</div>
        ${words.length > STORY_TRUNCATE_WORDS
          ? html`
            <button class="story-toggle" @click=${this._toggleStory}>
              ${this._storyExpanded ? "Show less" : "Read more"}
            </button>
          `
          : ""}
      </div>
    `;
  }

  _renderCreditsSection() {
    if (this.creditsLoading) {
      return html`
        <div class="section" aria-busy="true" aria-label="Loading album credits">
          <div class="section-title">Credits</div>
          ${Array(5).fill(0).map(() => html`
            <div class="skeleton-credit-row">
              <div class="skeleton-credit-key"></div>
              <div class="skeleton-credit-values"></div>
            </div>
          `)}
        </div>
      `;
    }
    if (!this.credits || this.credits.length === 0) return "";

    const showAll = this._creditsExpanded || this.credits.length <= CREDITS_INITIAL_ROWS;
    const visible = showAll ? this.credits : this.credits.slice(0, CREDITS_INITIAL_ROWS);

    return html`
      <div class="section">
        <div class="section-title">Credits</div>
        <div class="credits-list">
          ${visible.map(row => html`
            <div class="credit-row">
              <div class="credit-key">${row.key || ""}</div>
              <div class="credit-values">
                ${(row.values || []).map((v, i) => html`<span
                  class="credit-name"
                  role="button"
                  tabindex="0"
                  @click=${() => this._onCreditClick(v)}
                  @keydown=${(e) => this._onCreditKeydown(e, v)}
                >${v.name || ""}</span>${i < (row.values || []).length - 1 ? ", " : ""}`)}
              </div>
            </div>
          `)}
        </div>
        ${this.credits.length > CREDITS_INITIAL_ROWS
          ? html`
            <button class="credits-toggle" @click=${this._toggleCredits}>
              ${this._creditsExpanded
                ? "Show fewer credits"
                : `Show all ${this.credits.length} credits`}
            </button>
          `
          : ""}
      </div>
    `;
  }

  _toggleStory() {
    this._storyExpanded = !this._storyExpanded;
  }

  _toggleCredits() {
    this._creditsExpanded = !this._creditsExpanded;
  }

  _onCreditClick(value) {
    // mbid:/artist/... URIs are MusicBrainz IDs, not Volumio URIs. Fire
    // the same event similar-artist clicks fire; the panel translates
    // the name into globalUriArtist/Name via the existing resolver path.
    const name = value?.name || "";
    if (!name) return;
    this.dispatchEvent(new CustomEvent("volumio-similar-artist-click", {
      detail: {
        artist: name,
        uri: `globalUriArtist/${name}`,
        albumart: "",
      },
      bubbles: true, composed: true,
    }));
  }

  _onCreditKeydown(e, value) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._onCreditClick(value);
    }
  }

  _renderSkeleton() {
    return html`
      <div aria-busy="true" aria-label="Loading album">
        <div class="skeleton-header">
          <div class="skeleton-art"></div>
          <div class="skeleton-meta">
            <div class="skeleton-bar title"></div>
            <div class="skeleton-bar artist"></div>
            <div class="skeleton-bar detail"></div>
          </div>
        </div>
        <div class="skeleton-tracks">
          ${Array(8).fill(0).map(() => html`<div class="skeleton-track"></div>`)}
        </div>
      </div>
    `;
  }

  _playAlbum() {
    this.dispatchEvent(new CustomEvent("volumio-album-play", {
      detail: { uri: this.albumUri },
      bubbles: true, composed: true,
    }));
  }

  _addToQueue() {
    this.dispatchEvent(new CustomEvent("volumio-album-add-queue", {
      detail: { uri: this.albumUri },
      bubbles: true, composed: true,
    }));
  }

  _goToArtist() {
    this.dispatchEvent(new CustomEvent("volumio-navigate", {
      detail: { view: "artist-detail", artist: this.albumArtist },
      bubbles: true, composed: true,
    }));
  }

  _onTrackClick(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("volumio-track-click", {
      detail: e.detail,
      bubbles: true, composed: true,
    }));
  }

  _onMoreClick(e) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    this.dispatchEvent(new CustomEvent("volumio-context-menu", {
      detail: {
        uri: this.albumUri,
        title: this.albumTitle,
        artist: this.albumArtist,
        albumart: this.albumArt,
        service: this.albumService,
        type: "album",
        x: rect.right,
        y: rect.bottom,
        context: "album",
      },
      bubbles: true, composed: true,
    }));
  }

  _onArtError(e) {
    const container = e.target.parentElement;
    e.target.remove();
    container.innerHTML = `<div class="album-art-placeholder"><ha-icon icon="mdi:album"></ha-icon></div>`;
  }
}

customElements.define("volumio-album-detail", VolumioAlbumDetail);
