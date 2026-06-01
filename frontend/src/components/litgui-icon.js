/**
 * litgui-icon — transport-agnostic MDI icon renderer.
 *
 * Drop-in replacement for <ha-icon> that doesn't depend on Home Assistant's
 * frontend being present. Renders bundled SVG paths from @mdi/js, so the
 * same component works in both the HA panel and the standalone Volumio
 * plugin bundle without runtime mode detection.
 *
 * Usage:
 *   <litgui-icon icon="mdi:play"></litgui-icon>
 *   <litgui-icon icon="${someVar}"></litgui-icon>
 *
 * Sizing:
 *   Set via the --mdc-icon-size custom property (default 24px) or by
 *   styling the element directly with width/height. Color follows
 *   currentColor, so text-color CSS cascades naturally.
 *
 * Adding a new icon:
 *   1. Add the import from @mdi/js below
 *   2. Add the entry to ICON_PATHS
 *   Tree-shaking keeps only the constants actually imported, so unused
 *   MDI icons don't bleed into the bundle.
 */

import { LitElement, html, css } from "lit";
import {
  mdiAccountMusic,
  mdiAlbum,
  mdiArrowLeft,
  mdiCheck,
  mdiChevronDown,
  mdiChevronRight,
  mdiClose,
  mdiCog,
  mdiContentSaveOutline,
  mdiDeleteOutline,
  mdiDotsHorizontal,
  mdiDotsVertical,
  mdiDragHorizontalVariant,
  mdiEqualizer,
  mdiFolderMusic,
  mdiFolderOpenOutline,
  mdiHeart,
  mdiHeartOff,
  mdiHeartOutline,
  mdiHelpCircle,
  mdiHistory,
  mdiMagnify,
  mdiMagnifyClose,
  mdiMenu,
  mdiMusicBox,
  mdiMusicBoxMultipleOutline,
  mdiMusicNote,
  mdiMusicNoteOff,
  mdiPause,
  mdiPin,
  mdiPinOff,
  mdiPlay,
  mdiPlaylistMusic,
  mdiPlaylistMusicOutline,
  mdiPlaylistPlus,
  mdiPlus,
  mdiPodcast,
  mdiRadio,
  mdiRepeat,
  mdiRepeatOnce,
  mdiShuffleVariant,
  mdiSkipNext,
  mdiSkipPrevious,
  mdiSpeakerMultiple,
  mdiSpotify,
  mdiViewGrid,
  mdiViewList,
  mdiVolumeHigh,
  mdiVolumeMute,
  mdiYoutube,
} from "@mdi/js";

const ICON_PATHS = {
  "mdi:account-music": mdiAccountMusic,
  "mdi:album": mdiAlbum,
  "mdi:arrow-left": mdiArrowLeft,
  "mdi:check": mdiCheck,
  "mdi:chevron-down": mdiChevronDown,
  "mdi:chevron-right": mdiChevronRight,
  "mdi:close": mdiClose,
  "mdi:cog": mdiCog,
  "mdi:content-save-outline": mdiContentSaveOutline,
  "mdi:delete-outline": mdiDeleteOutline,
  "mdi:dots-horizontal": mdiDotsHorizontal,
  "mdi:dots-vertical": mdiDotsVertical,
  "mdi:drag-horizontal-variant": mdiDragHorizontalVariant,
  "mdi:equalizer": mdiEqualizer,
  "mdi:folder-music": mdiFolderMusic,
  "mdi:folder-open-outline": mdiFolderOpenOutline,
  "mdi:heart": mdiHeart,
  "mdi:heart-off": mdiHeartOff,
  "mdi:heart-outline": mdiHeartOutline,
  "mdi:help-circle": mdiHelpCircle,
  "mdi:history": mdiHistory,
  "mdi:magnify": mdiMagnify,
  "mdi:magnify-close": mdiMagnifyClose,
  "mdi:menu": mdiMenu,
  "mdi:music-box": mdiMusicBox,
  "mdi:music-box-multiple-outline": mdiMusicBoxMultipleOutline,
  "mdi:music-note": mdiMusicNote,
  "mdi:music-note-off": mdiMusicNoteOff,
  "mdi:pause": mdiPause,
  "mdi:pin": mdiPin,
  "mdi:pin-off": mdiPinOff,
  "mdi:play": mdiPlay,
  "mdi:playlist-music": mdiPlaylistMusic,
  "mdi:playlist-music-outline": mdiPlaylistMusicOutline,
  "mdi:playlist-plus": mdiPlaylistPlus,
  "mdi:plus": mdiPlus,
  "mdi:podcast": mdiPodcast,
  "mdi:radio": mdiRadio,
  "mdi:repeat": mdiRepeat,
  "mdi:repeat-once": mdiRepeatOnce,
  "mdi:shuffle-variant": mdiShuffleVariant,
  "mdi:skip-next": mdiSkipNext,
  "mdi:skip-previous": mdiSkipPrevious,
  "mdi:speaker-multiple": mdiSpeakerMultiple,
  "mdi:spotify": mdiSpotify,
  "mdi:view-grid": mdiViewGrid,
  "mdi:view-list": mdiViewList,
  "mdi:volume-high": mdiVolumeHigh,
  "mdi:volume-mute": mdiVolumeMute,
  "mdi:youtube": mdiYoutube,
};

class LitguiIcon extends LitElement {
  static get properties() {
    return {
      icon: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--mdc-icon-size, 24px);
        height: var(--mdc-icon-size, 24px);
        vertical-align: middle;
        line-height: 0;
      }

      svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }
    `;
  }

  render() {
    const path = ICON_PATHS[this.icon];
    if (!path) {
      // Silently render an empty svg shell so layout doesn't shift while
      // a typo or missing entry gets fixed. A warning still fires once
      // per missing icon to make problems discoverable in DevTools.
      if (this.icon && !LitguiIcon._warned.has(this.icon)) {
        LitguiIcon._warned.add(this.icon);
        console.warn(`[litgui-icon] No bundled path for "${this.icon}"`);
      }
      return html`<svg viewBox="0 0 24 24" aria-hidden="true"></svg>`;
    }
    return html`
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="${path}"></path>
      </svg>
    `;
  }
}

LitguiIcon._warned = new Set();

customElements.define("litgui-icon", LitguiIcon);
