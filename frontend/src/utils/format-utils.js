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
 * Resolve a Volumio albumart URL.
 * Relative paths get the Volumio base URL prepended.
 * @param {string} albumart - raw albumart path from Volumio
 * @param {string} volumioUrl - base Volumio URL (e.g. "http://192.168.0.24:3000")
 * @returns {string}
 */
export function resolveArt(albumart, volumioUrl) {
  if (!albumart) return "";
  if (albumart.startsWith("http")) return albumart;
  return volumioUrl ? `${volumioUrl}${albumart}` : albumart;
}
