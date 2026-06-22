#!/usr/bin/env bash
# Derive the V3 package.json variant from the canonical V4 source.
#
# HARD CONSTRAINT (do not violate): this script READS plugin/package.json
# (the V4-primary canonical source) and WRITES a transformed copy to an
# output dir. It NEVER mutates, overwrites, or round-trips the source file.
# An interrupted run must leave plugin/package.json untouched.
#
# It transforms ONLY two keys (volumio_info.os, engines). Every other field
# passes through identical, so the V3 and V4 artifacts cannot drift except
# on those two keys.
#
# V3 is the cleanly-removable target: when V3 is abandoned, delete the
# "V3 TRANSFORM" block below. The source file and the V4 path are never
# touched here, so removal is deletion, not a rewrite.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$REPO/plugin/package.json"
OUT_DIR="$REPO/build/litgui-v3"
OUT="$OUT_DIR/package.json"

if [[ ! -f "$SRC" ]]; then
  echo "ERROR: canonical source not found: $SRC" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

# ── V3 TRANSFORM (delete this whole node call to abandon V3) ──────────
# Read canonical V4 JSON, overwrite ONLY os + engines, write to OUT.
# Node guarantees valid JSON out and a deep, key-order-preserving copy.
node -e '
  const fs = require("fs");
  const src = process.argv[1];
  const out = process.argv[2];
  const pkg = JSON.parse(fs.readFileSync(src, "utf8"));

  // The only two fields that differ between V4 (canonical) and V3:
  pkg.volumio_info.os = ["buster", "bullseye"];
  pkg.engines = { node: ">=8", volumio: ">=3" };

  fs.writeFileSync(out, JSON.stringify(pkg, null, 2) + "\n");
' "$SRC" "$OUT"
# ── END V3 TRANSFORM ─────────────────────────────────────────────────

# Verify: source untouched, output transformed, passthrough intact.
node -e '
  const fs = require("fs");
  const src = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  const out = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

  const fail = (m) => { console.error("VERIFY FAIL: " + m); process.exit(1); };

  // Source must still be V4 (never mutated).
  if (JSON.stringify(src.volumio_info.os) !== JSON.stringify(["bookworm"]))
    fail("source os changed - source was mutated!");
  if (src.engines.node !== ">=20" || src.engines.volumio !== ">=4")
    fail("source engines changed - source was mutated!");

  // Output must be V3.
  if (JSON.stringify(out.volumio_info.os) !== JSON.stringify(["buster","bullseye"]))
    fail("output os not transformed to V3");
  if (out.engines.node !== ">=8" || out.engines.volumio !== ">=3")
    fail("output engines not transformed to V3");

  // Passthrough spot-checks: everything else identical.
  for (const k of ["name","version","description","main","author","license"]) {
    if (JSON.stringify(src[k]) !== JSON.stringify(out[k]))
      fail("passthrough field changed: " + k);
  }
  if (JSON.stringify(src.repository) !== JSON.stringify(out.repository))
    fail("repository did not pass through");
  if (JSON.stringify(src.dependencies) !== JSON.stringify(out.dependencies))
    fail("dependencies did not pass through");

  console.log("OK: source intact (V4), output transformed (V3), passthrough verified");
' "$SRC" "$OUT"

echo "==> V3 variant written: $OUT"
