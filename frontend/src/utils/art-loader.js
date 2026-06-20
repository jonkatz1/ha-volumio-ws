/**
 * Art loader — capped-concurrency image fetcher with timeout and blob cache.
 *
 * Volumio's artist-art endpoint can hang server-side forever (T49): a few
 * hung <img> requests exhaust the browser's per-host connection pool and
 * starve all other art. Routing art through fetch() with an AbortController
 * timeout and a global concurrency cap keeps hung URLs from consuming more
 * than a bounded number of connections.
 *
 * Usage:
 *   const blobUrl = await loadArt(url);   // increments refcount
 *   releaseArt(url);                      // decrement; revokes at zero
 */

const MAX_CONCURRENT = 5;
const DEFAULT_TIMEOUT_MS = 4000;
const FAILURE_TTL_MS = 30000;

/** @type {Map<string, {blobUrl: string, refs: number}>} */
const cache = new Map();
/** @type {Map<string, Promise<string>>} */
const inflight = new Map();
/** @type {Map<string, number>} url -> retry-allowed-after timestamp */
const failures = new Map();
/** @type {Array<{url: string, timeoutMs: number, resolve: Function, reject: Function}>} */
const queue = [];
let active = 0;

/**
 * Load an image URL through the capped pool. Resolves to a blob: URL.
 * Each successful call holds one reference — pair with releaseArt(url).
 *
 * @param {string} url
 * @param {{timeoutMs?: number}} [opts]
 * @returns {Promise<string>}
 */
export function loadArt(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  if (!url) return Promise.reject(new Error("loadArt: empty url"));

  const cached = cache.get(url);
  if (cached) {
    cached.refs++;
    return Promise.resolve(cached.blobUrl);
  }

  const retryAfter = failures.get(url);
  if (retryAfter !== undefined) {
    if (Date.now() < retryAfter) {
      return Promise.reject(new Error("loadArt: recently failed: " + url));
    }
    failures.delete(url);
  }

  let promise = inflight.get(url);
  if (!promise) {
    promise = enqueue(url, timeoutMs).then(
      (blobUrl) => {
        cache.set(url, { blobUrl, refs: 0 });
        inflight.delete(url);
        return blobUrl;
      },
      (err) => {
        failures.set(url, Date.now() + FAILURE_TTL_MS);
        inflight.delete(url);
        throw err;
      }
    );
    inflight.set(url, promise);
  }

  // Refcount per caller, including callers deduped onto an in-flight fetch.
  return promise.then((blobUrl) => {
    const entry = cache.get(url);
    if (entry) entry.refs++;
    return blobUrl;
  });
}

/**
 * Release one reference to a loaded URL. When the last reference is
 * released, the blob URL is revoked and evicted from the cache.
 *
 * @param {string} url
 */
export function releaseArt(url) {
  if (!url) return;
  const entry = cache.get(url);
  if (!entry) return;
  entry.refs--;
  if (entry.refs <= 0) {
    URL.revokeObjectURL(entry.blobUrl);
    cache.delete(url);
  }
}

function enqueue(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    queue.push({ url, timeoutMs, resolve, reject });
    pump();
  });
}

function pump() {
  while (active < MAX_CONCURRENT && queue.length > 0) {
    const job = queue.shift();
    active++;
    fetchToBlobUrl(job.url, job.timeoutMs)
      .then(job.resolve, job.reject)
      .finally(() => {
        active--;
        pump();
      });
  }
}

async function fetchToBlobUrl(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { signal: controller.signal });
    if (!resp.ok) {
      throw new Error("loadArt: HTTP " + resp.status + " for " + url);
    }
    const blob = await resp.blob();
    return URL.createObjectURL(blob);
  } finally {
    clearTimeout(timer);
  }
}
