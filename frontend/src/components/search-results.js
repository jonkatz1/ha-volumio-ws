/**
 * Search Results — grouped search results display.
 *
 * Properties:
 *   results: object - raw Volumio search response {navigation: {lists: [...]}}
 *   loading: boolean
 *   query: string - the search query
 *   volumioUrl: string
 *   currentUri: string
 *
 * Events:
 *   volumio-card-click: (from album cards)
 *   volumio-card-play: (from album cards)
 *   volumio-track-click: (from track cards)
 */
import { LitElement, html, css } from "lit";
import { resolveArt } from "../utils/format-utils.js";
import "./album-card.js";
import "./track-card.js";

// Default limits per section before "Show all"
const DEFAULT_ALBUM_LIMIT = 4;
const DEFAULT_TRACK_LIMIT = 3;
const DEFAULT_ARTIST_LIMIT = 3;

class VolumioSearchResults extends LitElement {
  static get properties() {
    return {
      results: { type: Object },
      loading: { type: Boolean },
      query: { type: String },
      volumioUrl: { type: String, attribute: "volumio-url" },
      configEntryId: { type: String, attribute: "config-entry-id" },
      currentUri: { type: String, attribute: "current-uri" },
      _expandedSections: { type: Object, state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      .results-header {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-bottom: var(--volumio-space-lg, 24px);
      }

      .results-header strong {
        color: var(--primary-text-color);
      }

      /* ── Source group ─────────────────────── */
      .source-group {
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .source-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--volumio-space-sm, 8px);
        cursor: pointer;
      }

      .source-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .source-count {
        font-size: 12px;
        color: var(--secondary-text-color);
        padding: 2px 8px;
        border-radius: 10px;
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .collapse-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
        transition: transform 0.2s;
      }

      .collapse-icon.collapsed {
        transform: rotate(-90deg);
      }

      /* ── Type subsection ──────────────────── */
      .type-section {
        margin-bottom: var(--volumio-space-md, 16px);
      }

      .type-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: var(--volumio-space-sm, 8px);
      }

      .items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: var(--volumio-space-sm, 8px);
      }

      .items-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .artist-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 20px;
        background: var(--card-background-color, #1e1e1e);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
        transition: background 0.15s;
        margin: 0 8px 8px 0;
      }

      .artist-link:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .artist-link ha-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
      }

      .show-all-btn {
        border: none;
        background: none;
        color: var(--primary-color, #03a9f4);
        font-size: 13px;
        cursor: pointer;
        padding: 4px 0;
        margin-top: var(--volumio-space-xs, 4px);
      }

      .show-all-btn:hover {
        text-decoration: underline;
      }

      /* ── Loading / empty ──────────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-results {
        display: flex;
        flex-direction: column;
        gap: var(--volumio-space-lg, 24px);
      }

      .skeleton-section-title {
        width: 30%;
        height: 18px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: var(--volumio-space-sm, 8px);
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
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        margin-bottom: 4px;
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
    `;
  }

  constructor() {
    super();
    this.results = null;
    this.loading = false;
    this.query = "";
    this.volumioUrl = "";
    this.currentUri = "";
    this._expandedSections = {};
  }

  render() {
    if (this.loading) {
      return this._renderSkeleton();
    }

    const groups = this._parseResults();

    if (!groups || groups.length === 0) {
      if (!this.query) return html``;
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:magnify-close"></ha-icon>
          <div class="message">No results found for "${this.query}"</div>
        </div>
      `;
    }

    const totalItems = groups.reduce((sum, g) =>
      sum + g.sections.reduce((s, sec) => s + sec.items.length, 0), 0);

    return html`
      <div class="results-header">
        Found <strong>${totalItems}</strong> result${totalItems !== 1 ? "s" : ""} for "<strong>${this.query}</strong>"
      </div>

      ${groups.map(group => this._renderSourceGroup(group))}
    `;
  }

  /**
   * Parse Volumio search response into grouped structure:
   * [{source: "QOBUZ", sections: [{type: "Albums", items: [...]}, {type: "Tracks", items: [...]}]}]
   */
  _parseResults() {
    if (!this.results) return [];

    const nav = this.results.navigation || this.results;
    const lists = nav?.lists || [];

    if (lists.length === 0) return [];

    // Group lists by source. Titles like "QOBUZ Artists", "TIDAL Albums", "Found 1 Artist 'Beatles'"
    const sourceMap = new Map();

    for (const list of lists) {
      if (!list.items || list.items.length === 0) continue;

      const { source, type } = this._parseListTitle(list.title || "");

      if (!sourceMap.has(source)) {
        sourceMap.set(source, new Map());
      }
      const typeMap = sourceMap.get(source);
      if (!typeMap.has(type)) {
        typeMap.set(type, []);
      }
      typeMap.get(type).push(...list.items);
    }

    // Convert to array structure
    const groups = [];
    for (const [source, typeMap] of sourceMap) {
      const sections = [];
      for (const [type, items] of typeMap) {
        sections.push({ type, items });
      }
      groups.push({ source, sections });
    }

    return groups;
  }

  /**
   * Parse a list title to extract source and type.
   * "QOBUZ Artists" → {source: "Qobuz", type: "Artists"}
   * "TIDAL Albums" → {source: "Tidal", type: "Albums"}
   * "Found 1 Artist 'Beatles'" → {source: "Local", type: "Artists"}
   */
  _parseListTitle(title) {
    if (!title) return { source: "Other", type: "Results" };

    // Known source prefixes
    const sources = ["QOBUZ", "TIDAL", "SPOTIFY", "YOUTUBE", "PANDORA"];
    for (const src of sources) {
      if (title.startsWith(src + " ")) {
        const type = title.substring(src.length + 1).trim();
        return { source: this._capitalizeSource(src), type: type || "Results" };
      }
    }

    // "Found N Type 'query'" pattern (local/mpd results)
    const foundMatch = title.match(/^Found\s+\d+\s+(\w+)/i);
    if (foundMatch) {
      let type = foundMatch[1];
      // Normalize: "Artist" → "Artists"
      if (!type.endsWith("s")) type += "s";
      return { source: "Local", type };
    }

    // Fallback
    return { source: "Other", type: title };
  }

  _capitalizeSource(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  _renderSourceGroup(group) {
    const key = group.source;
    const totalItems = group.sections.reduce((sum, s) => sum + s.items.length, 0);
    const isCollapsed = this._expandedSections[key] === false;

    return html`
      <div class="source-group">
        <div class="source-header" @click=${() => this._toggleSection(key)}>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="source-title">${group.source}</span>
            <span class="source-count">${totalItems}</span>
          </div>
          <ha-icon
            class="collapse-icon ${isCollapsed ? "collapsed" : ""}"
            icon="mdi:chevron-down"
          ></ha-icon>
        </div>
        ${!isCollapsed ? group.sections.map(section =>
          this._renderTypeSection(section, key)
        ) : ""}
      </div>
    `;
  }

  _renderTypeSection(section, sourceKey) {
    const sectionKey = `${sourceKey}:${section.type}`;
    const isExpanded = this._expandedSections[sectionKey] === true;
    const typeLower = section.type.toLowerCase();

    // Determine display type and limits
    const isAlbumType = typeLower.includes("album");
    const isTrackType = typeLower.includes("track") || typeLower.includes("song");
    const isArtistType = typeLower.includes("artist");

    let limit;
    if (isAlbumType) limit = DEFAULT_ALBUM_LIMIT;
    else if (isTrackType) limit = DEFAULT_TRACK_LIMIT;
    else if (isArtistType) limit = DEFAULT_ARTIST_LIMIT;
    else limit = DEFAULT_ALBUM_LIMIT;

    const displayItems = isExpanded ? section.items : section.items.slice(0, limit);
    const hasMore = section.items.length > limit && !isExpanded;

    return html`
      <div class="type-section">
        <div class="type-title">${section.type}</div>

        ${isArtistType
          ? this._renderArtistItems(displayItems)
          : isTrackType
            ? this._renderTrackItems(displayItems)
            : this._renderGridItems(displayItems, isAlbumType ? "album" : null)}

        ${hasMore ? html`
          <button class="show-all-btn" @click=${() => this._expandSection(sectionKey)}>
            Show all ${section.items.length} →
          </button>
        ` : ""}
      </div>
    `;
  }

  _renderGridItems(items, overrideType) {
    return html`
      <div class="items-grid">
        ${items.map(item => {
          const art = resolveArt(item.albumart, this.volumioUrl, this.configEntryId);
          return html`
            <volumio-album-card
              title="${item.title || item.name || ""}"
              artist="${item.artist || ""}"
              albumart="${art}"
              uri="${item.uri || ""}"
              type="${overrideType || item.type || "album"}"
              service="${item.service || ""}"
              @volumio-card-click=${this._onCardClick}
              @volumio-card-play=${this._onCardPlay}
            ></volumio-album-card>
          `;
        })}
      </div>
    `;
  }

  _renderTrackItems(items) {
    return html`
      <div class="items-list">
        ${items.map((item, i) => {
          const art = resolveArt(item.albumart, this.volumioUrl, this.configEntryId);
          return html`
            <volumio-track-card
              .index=${i + 1}
              title="${item.title || item.name || ""}"
              artist="${item.artist || ""}"
              album="${item.album || ""}"
              .duration=${item.duration || 0}
              uri="${item.uri || ""}"
              albumart="${art}"
              service="${item.service || ""}"
              type="${item.type || "song"}"
              ?is-playing=${this.currentUri && item.uri === this.currentUri}
              @volumio-track-click=${this._onTrackClick}
            ></volumio-track-card>
          `;
        })}
      </div>
    `;
  }

  _renderArtistItems(items) {
    return html`
      <div style="display: flex; flex-wrap: wrap;">
        ${items.map(item => html`
          <span
            class="artist-link"
            @click=${() => this._onArtistClick(item)}
          >
            <ha-icon icon="mdi:account-music"></ha-icon>
            ${item.title || item.name || "Unknown"}
          </span>
        `)}
      </div>
    `;
  }

  _renderSkeleton() {
    return html`
      <div class="skeleton-results" aria-busy="true" aria-label="Searching">
        <div class="skeleton-section-title"></div>
        <div class="skeleton-grid">
          ${Array(4).fill(0).map(() => html`<div class="skeleton-card"></div>`)}
        </div>
        <div class="skeleton-section-title"></div>
        ${Array(3).fill(0).map(() => html`<div class="skeleton-row"></div>`)}
      </div>
    `;
  }

  _toggleSection(key) {
    this._expandedSections = {
      ...this._expandedSections,
      [key]: this._expandedSections[key] === false ? undefined : false,
    };
  }

  _expandSection(key) {
    this._expandedSections = {
      ...this._expandedSections,
      [key]: true,
    };
  }

  _onCardClick(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("volumio-card-click", {
      detail: e.detail,
      bubbles: true, composed: true,
    }));
  }

  _onCardPlay(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("volumio-card-play", {
      detail: e.detail,
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

  _onArtistClick(item) {
    this.dispatchEvent(new CustomEvent("volumio-card-click", {
      detail: {
        uri: item.uri || "",
        title: item.title || item.name || "",
        artist: item.title || item.name || "",
        albumart: item.albumart || "",
        type: "artist",
        service: item.service || "",
      },
      bubbles: true, composed: true,
    }));
  }
}

customElements.define("volumio-search-results", VolumioSearchResults);
