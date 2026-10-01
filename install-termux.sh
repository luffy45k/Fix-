#!/usr/bin/env sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DEST="${PREFIX:-$HOME/.local}/bin"

if [ ! -f "$ROOT/bullet" ]; then
  printf 'Error: bullet not found next to install-termux.sh\n' >&2
  printf 'Run this inside the Fix- repo folder.\n' >&2
  exit 1
fi

mkdir -p "$DEST"
cp "$ROOT/bullet" "$DEST/bullet"
chmod +x "$DEST/bullet"
hash -r 2>/dev/null || true

printf 'Bullet installed to %s/bullet\n' "$DEST"
printf 'Run: bullet test\n'
printf 'Run: bullet doctor\n'
case ":$PATH:" in
  *:"$DEST":*) ;;
  *) printf 'If bullet is not found, run: export PATH="%s:$PATH"\n' "$DEST" ;;
esac
