/**
 * Formatting utilities for the Volumio panel.
 */

/**
 * Format seconds into m:ss or h:mm:ss.
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  if (!seconds || seconds <= 0) return "0:00";
  const s = Math.floor(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format milliseconds into m:ss or h:mm:ss.
 * @param {number} ms
 * @returns {string}
 */
export function formatTimeMs(ms) {
  if (!ms || ms <= 0) return "0:00";
  return formatTime(Math.floor(ms / 1000));
}

/**
 * Base64url-encode an arbitrary string for safe embedding in a URL.
 *
 * HA's security_filter middleware rejects URLs containing path-traversal
 * patterns like ".." even inside query string values. Volumio art paths
 * legitimately contain these patterns (artist names like "Fred again..",
 * embedded library paths like "/NAS/..."). Base64url uses only
 * A-Z, a-z, 0-9, -, _ and is filter-safe.
 *
 * @param {string} str
 * @returns {string}
 */
function _b64urlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Resolve a Volumio albumart URL.
 *
 * When a configEntryId is provided, Volumio-hosted art is rewritten to flow
 * through HA's backend proxy (/api/volumio_ws/art) so it loads under HTTPS
 * without mixed-content blocking. CDN URLs (https://) and HA proxy URLs
 * (/api/...) pass through unchanged.
 *
 * In standalone mode (no configEntryId), falls back to the prior behavior:
 * relative paths get volumioUrl prepended; absolute URLs returned as-is.
 *
 * @param {string} albumart - raw albumart value from Volumio
 * @param {string} volumioUrl - base Volumio URL (e.g. "http://192.168.1.100:3000")
 * @param {string} [configEntryId] - HA config entry ID for the active device;
 *   when present, enables the HA proxy path
 * @returns {string}
 */
export function resolveArt(albumart, volumioUrl, configEntryId) {
  if (!albumart) return "";

  // Reject inputs containing whitespace. Volumio paths never contain literal
  // whitespace (spaces are percent-encoded as %20). Whitespace is a reliable
  // signal that the caller passed a CSS class string ("fa fa-music") instead
  // of an art URL — likely from an `albumart || icon` fallback at the call site.
  if (/\s/.test(albumart)) return "";

  // Reject non-http(s) absolute schemes (javascript:, data:, file:, etc).
  if (/^[a-z][a-z0-9+.-]*:/i.test(albumart) && !/^https?:\/\//i.test(albumart)) {
    return "";
  }

  // HA-internal paths (e.g. /api/media_player_proxy/, /api/volumio_ws/art)
  // are served by HA itself — pass through.
  if (/^\/api\//.test(albumart)) return albumart;

  // Absolute https:// — CDN (Qobuz/TIDAL/etc), pass through.
  if (/^https:\/\//i.test(albumart)) return albumart;

  // Absolute http:// — could be our Volumio host or external.
  if (/^http:\/\//i.test(albumart)) {
    if (configEntryId && volumioUrl && albumart.startsWith(volumioUrl)) {
      const path = albumart.substring(volumioUrl.length);
      return `/api/volumio_ws/art?entry=${encodeURIComponent(configEntryId)}&path=${_b64urlEncode(path)}`;
    }
    // External http or no proxy available — return as-is.
    return albumart;
  }

  // Relative path.
  if (configEntryId) {
    return `/api/volumio_ws/art?entry=${encodeURIComponent(configEntryId)}&path=${_b64urlEncode(albumart)}`;
  }

  // Standalone / no proxy — original behavior.
  if (volumioUrl && !/^https?:\/\//i.test(volumioUrl)) return "";
  return volumioUrl ? `${volumioUrl}${albumart}` : albumart;
}
