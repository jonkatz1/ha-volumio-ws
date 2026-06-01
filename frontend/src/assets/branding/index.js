/**
 * LitGUI brand assets — inlined as ES module string exports.
 *
 * SVG sources from T41. Wordmark text was outlined to paths (T45) so the
 * mark renders identically without loading DM Sans at runtime.
 *
 * Variant naming: "-light" carries light-colored fills/strokes (for use on
 * dark backgrounds); "-dark" carries dark-colored fills/strokes (for light
 * backgrounds). Only the -light pair is wired into the panel currently —
 * the -dark variants are kept here for the future light-theme path.
 *
 * Consumer pattern:
 *   import { wordmarkLight } from "./assets/branding";
 *   import { unsafeHTML } from "lit/directives/unsafe-html.js";
 *   render() { return html`<div>${unsafeHTML(wordmarkLight)}</div>`; }
 *
 * Inlining (vs Rollup string-import plugin) keeps both bundles in lockstep
 * without a new build dependency. Total payload ~5.6 KB raw, well under
 * 1 KB after gzip.
 */

export const iconLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="2 8 36 34" width="200" height="200">
  <path d="M12 18 L5 28 L12 38" stroke="#E8E4DC" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M28 38 L35 28 L28 18" stroke="#E8E4DC" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M20 30 C20 30 15 20 15 16 C15 12 17 10 20 10 C23 10 25 12 25 16 C25 20 20 30 20 30Z" fill="#EF9F27" opacity="0.9"/>
  <path d="M20 26 C20 26 17 20 17 18 C17 15 18 14 20 14 C22 14 23 15 23 18 C23 20 20 26 20 26Z" fill="#F5C475"/>
</svg>`;

export const iconDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="2 8 36 34" width="200" height="200">
  <path d="M12 18 L5 28 L12 38" stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M28 38 L35 28 L28 18" stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M20 30 C20 30 15 20 15 16 C15 12 17 10 20 10 C23 10 25 12 25 16 C25 20 20 30 20 30Z" fill="#EF9F27" opacity="0.9"/>
  <path d="M20 26 C20 26 17 20 17 18 C17 15 18 14 20 14 C22 14 23 15 23 18 C23 20 20 26 20 26Z" fill="#F5C475"/>
</svg>`;

export const wordmarkLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 124 48" width="400" height="155">
  <path d="M12 18 L5 28 L12 38" stroke="#E8E4DC" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M28 38 L35 28 L28 18" stroke="#E8E4DC" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M20 30 C20 30 15 20 15 16 C15 12 17 10 20 10 C23 10 25 12 25 16 C25 20 20 30 20 30Z" fill="#EF9F27" opacity="0.9"/>
  <path d="M20 26 C20 26 17 20 17 18 C17 15 18 14 20 14 C22 14 23 15 23 18 C23 20 20 26 20 26Z" fill="#F5C475"/>
  <!-- LitGUI wordmark — DM Sans outlined -->
  <path fill="#E8E4DC" transform="translate(42.000 38.000) scale(0.028000 -0.028000)" d="M73 0V700H173V79H493V0Z"/>
  <path fill="#E8E4DC" transform="translate(57.036 38.000) scale(0.028000 -0.028000)" d="M75 0V504H175V0ZM126 599Q97 599 78.5 617.0Q60 635 60 663Q60 690 78.5 707.5Q97 725 126 725Q154 725 173.0 707.5Q192 690 192 663Q192 635 173.0 617.0Q154 599 126 599Z"/>
  <path fill="#E8E4DC" transform="translate(64.036 38.000) scale(0.028000 -0.028000)" d="M276 0Q228 0 193.0 15.0Q158 30 139.0 65.0Q120 100 120 160V419H33V504H120L132 630H220V504H363V419H220V159Q220 116 238.0 100.5Q256 85 300 85H358V0Z"/>
  <path fill="#8A8478" transform="translate(75.376 38.000) scale(0.028000 -0.028000)" d="M376 -12Q278 -12 204.0 33.5Q130 79 89.5 160.5Q49 242 49 350Q49 457 90.5 538.5Q132 620 207.5 666.0Q283 712 386 712Q502 712 580.0 656.0Q658 600 680 500H598Q584 568 528.5 608.0Q473 648 386 648Q306 648 246.5 612.0Q187 576 154.0 509.5Q121 443 121 350Q121 257 153.5 190.0Q186 123 243.5 87.0Q301 51 376 51Q494 51 553.5 121.0Q613 191 621 314H410V371H693V0H629L623 124Q597 81 563.5 50.0Q530 19 484.5 3.5Q439 -12 376 -12Z"/>
  <path fill="#8A8478" transform="translate(96.516 38.000) scale(0.028000 -0.028000)" d="M324 -12Q253 -12 195.5 16.0Q138 44 104.0 103.5Q70 163 70 255V700H140V254Q140 183 163.5 137.5Q187 92 229.0 71.0Q271 50 325 50Q380 50 421.0 71.0Q462 92 485.0 137.5Q508 183 508 254V700H578V255Q578 163 544.0 103.5Q510 44 452.5 16.0Q395 -12 324 -12Z"/>
  <path fill="#8A8478" transform="translate(114.660 38.000) scale(0.028000 -0.028000)" d="M78 0V700H148V0Z"/>
</svg>`;

export const wordmarkDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 124 48" width="400" height="155">
  <path d="M12 18 L5 28 L12 38" stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M28 38 L35 28 L28 18" stroke="#1A1A1A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M20 30 C20 30 15 20 15 16 C15 12 17 10 20 10 C23 10 25 12 25 16 C25 20 20 30 20 30Z" fill="#EF9F27" opacity="0.9"/>
  <path d="M20 26 C20 26 17 20 17 18 C17 15 18 14 20 14 C22 14 23 15 23 18 C23 20 20 26 20 26Z" fill="#F5C475"/>
  <!-- LitGUI wordmark — DM Sans outlined -->
  <path fill="#1A1A1A" transform="translate(42.000 38.000) scale(0.028000 -0.028000)" d="M73 0V700H173V79H493V0Z"/>
  <path fill="#1A1A1A" transform="translate(57.036 38.000) scale(0.028000 -0.028000)" d="M75 0V504H175V0ZM126 599Q97 599 78.5 617.0Q60 635 60 663Q60 690 78.5 707.5Q97 725 126 725Q154 725 173.0 707.5Q192 690 192 663Q192 635 173.0 617.0Q154 599 126 599Z"/>
  <path fill="#1A1A1A" transform="translate(64.036 38.000) scale(0.028000 -0.028000)" d="M276 0Q228 0 193.0 15.0Q158 30 139.0 65.0Q120 100 120 160V419H33V504H120L132 630H220V504H363V419H220V159Q220 116 238.0 100.5Q256 85 300 85H358V0Z"/>
  <path fill="#6B6560" transform="translate(75.376 38.000) scale(0.028000 -0.028000)" d="M376 -12Q278 -12 204.0 33.5Q130 79 89.5 160.5Q49 242 49 350Q49 457 90.5 538.5Q132 620 207.5 666.0Q283 712 386 712Q502 712 580.0 656.0Q658 600 680 500H598Q584 568 528.5 608.0Q473 648 386 648Q306 648 246.5 612.0Q187 576 154.0 509.5Q121 443 121 350Q121 257 153.5 190.0Q186 123 243.5 87.0Q301 51 376 51Q494 51 553.5 121.0Q613 191 621 314H410V371H693V0H629L623 124Q597 81 563.5 50.0Q530 19 484.5 3.5Q439 -12 376 -12Z"/>
  <path fill="#6B6560" transform="translate(96.516 38.000) scale(0.028000 -0.028000)" d="M324 -12Q253 -12 195.5 16.0Q138 44 104.0 103.5Q70 163 70 255V700H140V254Q140 183 163.5 137.5Q187 92 229.0 71.0Q271 50 325 50Q380 50 421.0 71.0Q462 92 485.0 137.5Q508 183 508 254V700H578V255Q578 163 544.0 103.5Q510 44 452.5 16.0Q395 -12 324 -12Z"/>
  <path fill="#6B6560" transform="translate(114.660 38.000) scale(0.028000 -0.028000)" d="M78 0V700H148V0Z"/>
</svg>`;
