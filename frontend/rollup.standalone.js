/**
 * Rollup config for the standalone Volumio plugin bundle.
 *
 * Same entry, same plugin pipeline as rollup.config.js — different
 * output path. The bundle lands in plugin/ui/ next to index.html and
 * favicon.svg, ready for Volumio's web server to serve when LitGUI is
 * selected as the alternative UI via registerThirdPartyUI().
 *
 * Build:
 *   npm run build:standalone     // this bundle only
 *   npm run build:all            // both HA and standalone bundles
 *
 * Note on tree-shaking: both HAAdapter and VolumioAdapter end up in the
 * bundle because the factory references both via static imports. The
 * dead-code overhead is ~6-8 KB minified — acceptable for the simpler
 * single-factory model. A future Rollup alias swap could eliminate this
 * if bundle size becomes a concern.
 */

import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/volumio-panel.js",
  output: {
    file: "../plugin/ui/litgui-panel.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [
    resolve(),
    terser({
      output: {
        comments: false,
      },
    }),
  ],
};
