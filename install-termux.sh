#!/usr/bin/env sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DEST="${PREFIX:-$HOME/.local}/bin"

mkdir -p "$DEST"
cp "$ROOT/bullet" "$DEST/bullet"
chmod +x "$DEST/bullet"

printf 'Bullet installed to %s/bullet\n' "$DEST"
printf 'Run: bullet doctor\n'
case ":$PATH:" in
  *:"$DEST":*) ;;
  *) printf 'If bullet is not found, run: export PATH="%s:$PATH"\n' "$DEST" ;;
esac
