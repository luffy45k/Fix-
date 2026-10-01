#!/usr/bin/env sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DEST="${PREFIX:-$HOME/.local}/bin"
SRC="$ROOT/bullet"
TARGET="$DEST/bullet"

if [ ! -f "$SRC" ]; then
  printf 'Error: bullet not found next to install-termux.sh\n' >&2
  printf 'Run this inside the Fix- repo folder.\n' >&2
  exit 1
fi

mkdir -p "$DEST"
if [ "$SRC" != "$TARGET" ] && ! cmp -s "$SRC" "$TARGET" 2>/dev/null; then
  cp "$SRC" "$TARGET"
fi
chmod +x "$TARGET"
hash -r 2>/dev/null || true

printf 'Bullet installed to %s\n' "$TARGET"
printf 'Run: bullet test\n'
printf 'Run: bullet doctor\n'
case ":$PATH:" in
  *:"$DEST":*) ;;
  *) printf 'If bullet is not found, run: export PATH="%s:$PATH"\n' "$DEST" ;;
esac
