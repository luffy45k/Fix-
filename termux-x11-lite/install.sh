#!/data/data/com.termux/files/usr/bin/bash
# TuxLite X11 installer — run this inside the Termux app, never as root.
set -Eeuo pipefail
IFS=$'\n\t'

PROJECT_DIR="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
APP_NAME="TuxLite X11"
APP_DATA_DIR="${HOME}/.local/share/tuxlite-x11"
CONFIG_ROOT="${HOME}/.config/tuxlite-x11"
OPENBOX_CONFIG_DIR="${CONFIG_ROOT}/openbox"
FORCE_CONFIG=0
SKIP_PACKAGES=0
WITH_STORE=0

say() { printf '\n\033[1;38;5;155m[%s]\033[0m %s\n' "$APP_NAME" "$*"; }
info() { printf '  \033[0;37m•\033[0m %s\n' "$*"; }
warn() { printf '  \033[1;33m!\033[0m %s\n' "$*" >&2; }
die() { printf '\n\033[1;31mError:\033[0m %s\n' "$*" >&2; exit 1; }

usage() {
  cat <<'EOF'
Usage: bash install.sh [options]

Options:
  --force-config   Replace TuxLite's isolated Openbox files.
  --with-store     Also install YAD for the graphical App Store and Theme Studio.
  --with-theme     Alias for --with-store.
  --skip-packages  Do not install or update Termux packages.
  -h, --help       Show this help.

This installer is for the Termux app only. It creates a lightweight Openbox
session that runs through the separate Termux:X11 companion application.
EOF
}

while (($#)); do
  case "$1" in
    --force-config) FORCE_CONFIG=1 ;;
    --with-store|--with-theme|--with-gui-tools) WITH_STORE=1 ;;
    --skip-packages) SKIP_PACKAGES=1 ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown option: $1" ;;
  esac
  shift
done

[[ -n "${PREFIX:-}" ]] || die "PREFIX is not set. Open this folder in the Termux app and run: bash install.sh"
[[ "${PREFIX}" == *"com.termux"* ]] || warn "PREFIX does not look like a standard Termux prefix: ${PREFIX}"
command -v pkg >/dev/null 2>&1 || die "The Termux pkg command is unavailable. Run this inside Termux."
[[ "$(id -u)" != "0" ]] || die "Do not run this as root. TuxLite X11 is designed for the normal Termux app sandbox."

say "Checking the Termux:X11 companion"
if [[ -x /system/bin/pm ]] && ! /system/bin/pm path com.termux.x11 >/dev/null 2>&1; then
  warn "The Termux:X11 Android app was not detected."
  warn "Install the matching companion APK before running tuxlite-x11."
  warn "Official instructions: https://github.com/termux/termux-x11"
else
  info "Termux:X11 Android companion detected."
fi

if (( ! SKIP_PACKAGES )); then
  say "Installing the lightweight X11 session"
  info "Enabling the Termux X11 repository"
  pkg update -y
  pkg install -y x11-repo
  packages=(termux-x11-nightly openbox aterm dbus xorg-xsetroot procps)
  if (( WITH_STORE )); then
    packages+=(yad)
    info "Installing Termux:X11, Openbox, and optional graphical Store/Theme tools"
  else
    info "Installing Termux:X11, Openbox, aterm, D-Bus, xsetroot, and process tools"
  fi
  pkg install -y "${packages[@]}"
else
  say "Skipping package installation"
fi

for command in termux-x11 openbox-session aterm; do
  command -v "$command" >/dev/null 2>&1 || warn "${command} is not available yet. Re-run without --skip-packages after fixing Termux repositories."
done

say "Installing TuxLite launcher commands"
mkdir -p "${APP_DATA_DIR}" "${OPENBOX_CONFIG_DIR}" "${PREFIX}/bin"
cp -f "${PROJECT_DIR}/README.md" "${APP_DATA_DIR}/README.md"

for script in tuxlite-x11 tuxlite-session tuxlite-x11-stop tuxlite-x11-status tuxlite-store tuxlite-store-action tuxlite-terminal tuxlite-theme; do
  cp -f "${PROJECT_DIR}/bin/${script}" "${PREFIX}/bin/${script}"
  chmod 0755 "${PREFIX}/bin/${script}"
  info "Installed ${PREFIX}/bin/${script}"
done

say "Writing an isolated Openbox profile"
# TuxLite deliberately uses ~/.config/tuxlite-x11 rather than ~/.config/openbox,
# so it does not overwrite an existing Openbox desktop configuration.
for config in autostart menu.xml; do
  destination="${OPENBOX_CONFIG_DIR}/${config}"
  if [[ -e "${destination}" && ${FORCE_CONFIG} -ne 1 ]]; then
    info "Keeping existing ${destination} (use --force-config to replace it)"
  else
    cp -f "${PROJECT_DIR}/config/openbox/${config}" "${destination}"
    chmod 0644 "${destination}"
    info "Wrote ${destination}"
  fi
done

THEME_FILE="${CONFIG_ROOT}/theme.env"
if [[ -e "${THEME_FILE}" ]]; then
  # Keep an existing user palette even when --force-config refreshes the menu.
  info "Keeping existing ${THEME_FILE}"
else
  cp -f "${PROJECT_DIR}/config/theme.env" "${THEME_FILE}"
  chmod 0600 "${THEME_FILE}"
  info "Wrote ${THEME_FILE}"
fi

say "TuxLite X11 is ready"
cat <<EOF

1. Make sure the Termux:X11 Android companion app is installed.
2. In Termux, run:

   tuxlite-x11

Useful commands:
  tuxlite-x11 --fast       Start without legacy drawing fallback
  tuxlite-theme            Open the graphical Theme Studio
  tuxlite-store            Open the curated graphical App Store
  tuxlite-x11-stop         Stop the X11 activity and server
  tuxlite-x11-status       Check companion, packages, and local profile size

The Store and Theme Studio share the optional YAD GUI toolkit. Install it now
with --with-store, or later with: pkg install -y yad

This is a direct Termux/Openbox session — no root, PRoot distro, or Linux ISO
is downloaded. Package download and installed size depends on your Termux mirror.
EOF
