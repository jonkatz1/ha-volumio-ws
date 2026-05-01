/**
 * Quality tier detection for audio metadata.
 *
 * Tiers (from design spec section 3f):
 *   Hi-Res:   bitdepth > 16 OR samplerate > 44.1kHz AND lossless format
 *   Lossless: FLAC/ALAC/WAV at 16-bit/44.1kHz (CD quality)
 *   High:     lossy format ≥ 256 kbps
 *   Basic:    lossy format < 256 kbps
 *   Stream:   web radio / live stream (any bitrate)
 *   Unknown:  insufficient data
 *
 * Note: Volumio's trackType field sometimes reports the service name
 * (e.g. "qobuz", "tidal") instead of the actual codec. When this
 * happens, we infer quality from bitdepth/samplerate/bitrate.
 */

// Lossless codec identifiers (lowercase)
const LOSSLESS_FORMATS = new Set([
  "flac", "alac", "wav", "aiff", "ape", "wv", "wavpack", "dsf", "dff", "dsd",
]);

// Lossy codec identifiers (lowercase)
const LOSSY_FORMATS = new Set([
  "mp3", "ogg", "aac", "opus", "vorbis", "wma", "m4a",
]);

// Service/plugin names that Volumio may report as trackType instead of a codec
const SERVICE_NAMES = new Set([
  "qobuz", "tidal", "spotify", "spop", "pandora", "youtube", "youtube2",
  "webradio", "mpd", "upnp", "airplay", "snapcast", "bluetooth",
]);

/**
 * Parse a samplerate string into a numeric kHz value.
 * Examples: "96 kHz" → 96, "44.1" → 44.1, "192kHz" → 192
 * @param {string|number} raw
 * @returns {number|null}
 */
export function parseSamplerate(raw) {
  if (raw == null) return null;
  if (typeof raw === "number") return raw;
  const str = String(raw).trim().toLowerCase();
  const match = str.match(/([\d.]+)/);
  if (!match) return null;
  const val = parseFloat(match[1]);
  // If the value looks like Hz (e.g. 44100), convert to kHz
  if (val > 1000) return val / 1000;
  return val;
}

/**
 * Parse a bitdepth string into a numeric value.
 * Examples: "24 bit" → 24, "16" → 16
 * @param {string|number} raw
 * @returns {number|null}
 */
export function parseBitdepth(raw) {
  if (raw == null) return null;
  if (typeof raw === "number") return raw;
  const match = String(raw).trim().match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Parse a bitrate string into a numeric kbps value.
 * Examples: "320 kbps" → 320, "2239 Kbps" → 2239, "128" → 128
 * @param {string|number} raw
 * @returns {number|null}
 */
export function parseBitrate(raw) {
  if (raw == null) return null;
  if (typeof raw === "number") return raw;
  const match = String(raw).trim().match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : null;
}

/**
 * Normalize a trackType/codec string to lowercase identifier.
 * @param {string} raw
 * @returns {string}
 */
function normalizeFormat(raw) {
  if (!raw) return "";
  return String(raw).trim().toLowerCase().replace(/\s+/g, "");
}

/**
 * @typedef {Object} QualityInfo
 * @property {'hires'|'lossless'|'high'|'basic'|'stream'|'unknown'} tier
 * @property {string} label - display text e.g. "FLAC 24/96"
 * @property {string} tierLabel - tier name e.g. "HI-RES"
 * @property {string} color - CSS custom property name
 * @property {string} colorBg - CSS custom property name for background tint
 */

/**
 * Determine the quality tier from audio metadata.
 *
 * @param {Object} params
 * @param {string} params.trackType - codec/format (e.g. "flac", "mp3") or service name (e.g. "qobuz")
 * @param {string|number} params.samplerate - sample rate (e.g. "96 kHz")
 * @param {string|number} params.bitdepth - bit depth (e.g. "24 bit")
 * @param {string|number} params.bitrate - bitrate (e.g. "320 kbps")
 * @param {boolean} params.isStream - whether this is a web radio/stream
 * @returns {QualityInfo}
 */
export function detectQuality({ trackType, samplerate, bitdepth, bitrate, isStream }) {
  const rawFormat = normalizeFormat(trackType);
  const sr = parseSamplerate(samplerate);
  const bd = parseBitdepth(bitdepth);
  const br = parseBitrate(bitrate);

  // Determine if trackType is an actual codec or a service name
  const isServiceName = SERVICE_NAMES.has(rawFormat);
  const format = isServiceName ? "" : rawFormat;
  const isLossless = LOSSLESS_FORMATS.has(format);
  const isLossy = LOSSY_FORMATS.has(format);

  // Stream tier
  if (isStream) {
    const label = format ? `${format.toUpperCase()}${br ? ` ${Math.round(br)}` : ""}` : "STREAM";
    return _result("stream", label, "STREAM",
      "var(--volumio-quality-stream)",
      "var(--volumio-quality-stream-bg, rgba(66, 165, 245, 0.12))");
  }

  // Known lossless codec with Hi-Res resolution
  if (isLossless && ((bd != null && bd > 16) || (sr != null && sr > 44.1))) {
    return _result("hires", _formatLosslessLabel(format, bd, sr), "HI-RES",
      "var(--volumio-quality-hires)",
      "var(--volumio-quality-hires-bg, rgba(212, 160, 23, 0.12))");
  }

  // Known lossless codec at CD quality or undetermined resolution
  if (isLossless) {
    return _result("lossless", _formatLosslessLabel(format, bd, sr), "LOSSLESS",
      "var(--volumio-quality-lossless)",
      "var(--volumio-quality-lossless-bg, rgba(0, 172, 193, 0.12))");
  }

  // Unknown codec (service name or unrecognized) but we have bitdepth/samplerate
  // → infer lossless quality from the resolution metadata
  if (!isLossy && (bd != null || sr != null)) {
    if ((bd != null && bd > 16) || (sr != null && sr > 44.1)) {
      // Hi-Res — we have high-res metadata even without a codec name
      const label = _formatLosslessLabel(format || "HI-RES", bd, sr);
      return _result("hires", label, "HI-RES",
        "var(--volumio-quality-hires)",
        "var(--volumio-quality-hires-bg, rgba(212, 160, 23, 0.12))");
    }
    // CD-quality lossless — has bitdepth/samplerate but not hi-res
    const label = _formatLosslessLabel(format || "LOSSLESS", bd, sr);
    return _result("lossless", label, "LOSSLESS",
      "var(--volumio-quality-lossless)",
      "var(--volumio-quality-lossless-bg, rgba(0, 172, 193, 0.12))");
  }

  // Known lossy codec
  if (isLossy) {
    if (br != null && br < 256) {
      return _result("basic", `${format.toUpperCase()} ${Math.round(br)}`, "BASIC",
        "var(--volumio-quality-basic, #616161)",
        "rgba(97, 97, 97, 0.08)");
    }
    const label = format ? `${format.toUpperCase()}${br ? ` ${Math.round(br)}` : ""}` : "HIGH";
    return _result("high", label, "HIGH",
      "var(--volumio-quality-lossy)",
      "var(--volumio-quality-lossy-bg, rgba(158, 158, 158, 0.08))");
  }

  // Unrecognized format with only bitrate — assume lossy
  if (format && br != null) {
    if (br < 256) {
      return _result("basic", `${Math.round(br)} kbps`, "BASIC",
        "var(--volumio-quality-basic, #616161)",
        "rgba(97, 97, 97, 0.08)");
    }
    return _result("high", `${Math.round(br)} kbps`, "HIGH",
      "var(--volumio-quality-lossy)",
      "var(--volumio-quality-lossy-bg, rgba(158, 158, 158, 0.08))");
  }

  // Unknown — not enough data
  return _result("unknown", "", "",
    "var(--secondary-text-color)", "transparent");
}

/** Build a QualityInfo result object. */
function _result(tier, label, tierLabel, color, colorBg) {
  return { tier, label, tierLabel, color, colorBg };
}

/**
 * Format a lossless quality label string.
 * e.g. "FLAC 24/96", "LOSSLESS 16/44.1", "FLAC"
 */
function _formatLosslessLabel(format, bitdepth, samplerate) {
  const f = format.toUpperCase();
  if (bitdepth && samplerate) {
    return `${f} ${bitdepth}/${samplerate}`;
  }
  if (bitdepth) return `${f} ${bitdepth}-bit`;
  if (samplerate) return `${f} ${samplerate}kHz`;
  return f;
}
