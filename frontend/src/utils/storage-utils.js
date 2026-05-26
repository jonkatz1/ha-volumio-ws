/**
 * localStorage helpers with silent failure.
 *
 * localStorage can throw on read or write for legitimate reasons:
 *   - Quota exceeded (write)
 *   - Disabled by user (read or write)
 *   - Private browsing mode in some browsers (read or write)
 *   - Corrupted JSON in the stored value (parse error — caller's responsibility,
 *     but we expose a safe-read helper too)
 *
 * These helpers swallow the error and return a fallback. Data loss is acceptable;
 * crashing the panel is not.
 */

/**
 * Read a string from localStorage. Returns fallback on any error.
 * @param {string} key
 * @param {string} [fallback]
 * @returns {string}
 */
export function safeGet(key, fallback = "") {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
}

/**
 * Write a string to localStorage. Returns true on success, false on any failure.
 * @param {string} key
 * @param {string} value
 * @returns {boolean}
 */
export function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove a key from localStorage. Returns true on success, false on any failure.
 * @param {string} key
 * @returns {boolean}
 */
export function safeRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
