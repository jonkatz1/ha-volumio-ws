#!/usr/bin/env bash
# Build and deploy ha-volumio-ws to the Home Assistant config share.
# Usage: ./deploy.sh        (run from repo root in Git Bash)
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$REPO/custom_components/volumio_ws"
DST="//192.168.0.23/config/custom_components/volumio_ws"
MANIFEST="$SRC/manifest.json"

# 1. Build frontend
echo "==> Building frontend"
( cd "$REPO/frontend" && npm run build )

# 2. Bump patch version in manifest.json
OLD_VERSION="$(sed -n 's/.*"version": "\([^"]*\)".*/\1/p' "$MANIFEST")"
if [[ -z "$OLD_VERSION" ]]; then
  echo "ERROR: could not read version from $MANIFEST" >&2
  exit 1
fi
IFS='.' read -r MAJOR MINOR PATCH <<< "$OLD_VERSION"
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
sed -i "s/\"version\": \"$OLD_VERSION\"/\"version\": \"$NEW_VERSION\"/" "$MANIFEST"
echo "==> Bumped manifest: $OLD_VERSION -> $NEW_VERSION"

# 3. Copy files
COPIED=()

copy_always() {
  local rel="$1"
  mkdir -p "$(dirname "$DST/$rel")"
  cp "$SRC/$rel" "$DST/$rel"
  COPIED+=("$rel")
}

copy_if_newer() {
  local rel="$1"
  if [[ ! -e "$DST/$rel" ]] || [[ "$SRC/$rel" -nt "$DST/$rel" ]]; then
    cp "$SRC/$rel" "$DST/$rel"
    COPIED+=("$rel (newer)")
  else
    echo "    skip $rel (HA copy up to date)"
  fi
}

echo "==> Deploying to $DST"
copy_always "frontend/volumio-panel.js"
copy_always "manifest.json"
copy_if_newer "services.py"
copy_if_newer "services.yaml"

# 4. Summary
echo
echo "==> Deployed (version $NEW_VERSION):"
for f in "${COPIED[@]}"; do
  echo "    $f"
done

# 5. Restart reminder
echo
echo "==> Restart Home Assistant manually:"
echo "    Settings -> System -> Restart"
echo "    (required when services.py/yaml or manifest.json changed)"
