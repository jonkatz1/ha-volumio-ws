/**
 * Adapter factory — single import surface for both HA and standalone modes.
 *
 * The panel imports `createAdapter` from here and never references the
 * adapter classes directly. The mode is decided at the panel level (HA mode
 * when running inside Home Assistant, "volumio" when running as a
 * registerThirdPartyUI plugin from Volumio's own web server).
 *
 * Note on bundling: both adapter modules are statically imported. Rollup
 * will tree-shake unused exports but cannot eliminate an entire module
 * referenced through a runtime branch — so the HA bundle carries the
 * Volumio adapter (~25 KB) and vice versa. This is intentional: it keeps
 * one build pipeline and one factory. If bundle size becomes a concern, a
 * Rollup alias swap or two factory files can be introduced later without
 * changing call sites.
 *
 * Usage:
 *   import { createAdapter } from "./adapters";
 *   const adapter = createAdapter("ha");        // HA mode (default)
 *   const adapter = createAdapter("volumio");   // standalone mode
 */

import { HAAdapter } from "./ha-adapter.js";
import { VolumioAdapter } from "./volumio-adapter.js";

/**
 * @param {"ha" | "volumio"} [mode="ha"]
 * @returns {HAAdapter | VolumioAdapter}
 */
export function createAdapter(mode = "ha") {
  switch (mode) {
    case "volumio":
      return new VolumioAdapter();
    case "ha":
      return new HAAdapter();
    default:
      console.warn(
        `[adapters] Unknown mode "${mode}" — falling back to HA adapter`
      );
      return new HAAdapter();
  }
}

// Re-export the classes for any caller that needs to type-check or
// instantiate directly (tests, advanced wiring). The panel uses createAdapter.
export { HAAdapter, VolumioAdapter };
