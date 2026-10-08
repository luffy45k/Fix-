# TuxLite X11 — real lightweight Termux GUI

`TuxLite X11` is the real runtime companion for the Android UI in this repository. It starts a **native Termux + Termux:X11 + Openbox** desktop directly in the Termux app sandbox.

It deliberately does **not** install a Debian/Ubuntu rootfs, PRoot distro, VNC server, or full XFCE desktop. That keeps the first usable GUI much smaller and faster on a Realme 9 4G.

## What it installs

| Component | Why it is included |
| --- | --- |
| `termux-x11-nightly` | The Termux companion command that connects to the Android X11 app |
| `openbox` | Lightweight window manager |
| `aterm` | Small X11 terminal launched with the desktop |
| `dbus` | Session bus used by graphical applications |
| `xorg-xsetroot` | Low-overhead desktop background setup |
| `procps` | Reliable `pgrep` / `pkill` commands for session diagnostics and shutdown |
| `yad` *(optional)* | GTK dialog toolkit used by the graphical TuxLite Store and Theme Studio |

The exact download and installed size depends on the active Termux mirror and package versions. The installer does not make a misleading fixed-size promise; `tuxlite-x11-status` reports the direct installed-package total, and `du -sh "$PREFIX"` measures the full Termux environment on the phone.

## Prerequisites

1. Android 8 or newer.
2. A current **Termux** app installation.
3. The separate **Termux:X11 Android companion app**.

Termux:X11 requires both the Android companion app and its Termux package. Install the companion APK from the official Termux:X11 project before starting the session:

- <https://github.com/termux/termux-x11>

Keep Termux and its add-ons from compatible sources. The special shared-UID Termux:X11 build is optional and only works with the GitHub-signed Termux app; it is not required for TuxLite X11 to work.

## Install on the phone

Open **Termux** and run:

```bash
pkg update -y
pkg install -y git
git clone --branch arena/5609cb03-fix https://github.com/luffy45k/Fix-.git
cd Fix-/termux-x11-lite
# Add --with-store to install the graphical App Store and Theme Studio now.
bash install.sh --with-store
```

Omit `--with-store` for the smallest possible base; the Store and Theme Studio can use the optional GUI toolkit later with `pkg install -y yad`.

The installer enables `x11-repo`, installs the minimal GUI packages, and creates these Termux commands:

```text
tuxlite-x11
tuxlite-x11-stop
tuxlite-x11-status
tuxlite-session
tuxlite-terminal
tuxlite-store
tuxlite-theme
```

It writes Openbox configuration only to:

```text
~/.config/tuxlite-x11/openbox/
```

Your normal `~/.config/openbox/` profile is left untouched.

## Start the Linux GUI

```bash
tuxlite-x11
```

This opens Termux:X11 on display `:1`, creates an Openbox session, and starts one compact terminal. The default uses `-legacy-drawing`, which is the more compatible renderer for devices that otherwise show a black screen with a cursor.

### Render options

```bash
# Try the regular / faster renderer if your device works without the fallback
tuxlite-x11 --fast

# Fix swapped red/blue colours on affected devices
tuxlite-x11 --force-bgra

# Start another display if needed
tuxlite-x11 --display :2
```

## Stop or check it

```bash
# Stop the Termux:X11 activity and server
tuxlite-x11-stop

# Check installed pieces, companion app detection, running process, and profile size
tuxlite-x11-status
```

You can also stop the Android X11 activity from its notification drawer.

## Using the desktop

- A compact themed `aterm` terminal opens automatically.
- Use the Termux:X11 touchpad gestures for click, right click, scrolling, and the extra-keys bar.
- Long-press/right-click on the desktop opens the TuxLite Openbox menu.
- The menu can open Theme Studio, the App Store, a terminal, reconfigure Openbox, or exit the session.

## TuxLite Theme Studio — custom theme GUI

`TuxLite Theme Studio` is a small YAD-based GUI for changing the Openbox desktop background and the color palette used by new TuxLite terminals.

```bash
tuxlite-theme
```

Install the shared GUI toolkit during setup with `bash install.sh --with-theme` (an alias for `--with-store`), or later with `pkg install -y yad`.

Built-in low-glare palettes are **Forest Terminal**, **Tidal Blue**, **Orbit Plum**, and **Solar Sand**. The **Custom colors** button lets you choose a desktop background, terminal background, terminal text color, and terminal cursor accent. The desktop background changes immediately; open a new terminal after applying a palette to use its terminal colors.

You can also apply a preset from a regular Termux shell without opening the GUI:

```bash
tuxlite-theme --apply ocean
tuxlite-theme --reset
```

The selected palette is stored in:

```text
~/.config/tuxlite-x11/theme.env
```

It affects only the TuxLite Openbox profile and does not overwrite your normal Openbox configuration.

## TuxLite Store — graphical App Store

`TuxLite Store` is a small **YAD-based GUI package browser** for the Openbox desktop. Launch it from the Openbox menu or run this after starting X11:

```bash
tuxlite-store
```

It has a curated catalog for the lightweight desktop: Thunar, Geany, Feh, NetSurf, Galculator, Xarchiver, Git, Python, Nano, and Htop. Selecting an app opens an `aterm` window where the standard Termux package manager displays the current download and storage details before installation or removal.

The Store does not silently run arbitrary shell text, bundle third-party APKs, or promise inaccurate package sizes. Catalog package names are fixed in the script and package changes are visible in the terminal.

To install the Store GUI now:

```bash
# During first setup
bash install.sh --with-store

# Or later, from Termux
pkg install -y yad
```

`yad` is optional because it adds a GTK dialog toolkit shared by the Store and Theme Studio. Leave it out if the absolute smallest X11 base is more important than those graphical tools.

## Optional software

Install only what you need, for example:

```bash
pkg install thunar        # GUI file manager
pkg install nano          # Small terminal editor
pkg install python        # Python runtime
pkg install git           # Git tools
```

Avoid installing an entire desktop environment if the 700 MB objective is strict. Packages, caches, and user files all count toward practical on-device usage.

## Troubleshooting

| Problem | Try this |
| --- | --- |
| Companion app not detected | Install/open the Termux:X11 Android app, then retry `tuxlite-x11`. |
| Black screen with a cursor | The default already uses the compatibility renderer. Stop it and retry `tuxlite-x11 --legacy-drawing`. |
| Colours look swapped | Stop the session, then run `tuxlite-x11 --force-bgra`. |
| Theme Studio or Store says YAD is missing | Run `pkg install -y yad`, then start the GUI again. |
| Theme menu item is missing after an older install | Re-run `bash install.sh --force-config` to refresh TuxLite's isolated menu and autostart files. |
| X11 will not stop | Run `tuxlite-x11-stop`, then close the Termux:X11 notification. |
| Existing Openbox setup | TuxLite uses `~/.config/tuxlite-x11`, not your normal Openbox directory. |

## Security and scope

- No root is required or requested.
- No external-storage permission is requested by these scripts.
- No PRoot Linux distribution or disk image is downloaded.
- The session runs inside the standard Termux application sandbox.
- The Android GUI app in the repository is a UI hub; Android sandbox boundaries mean it cannot silently execute shell commands inside a separate Termux app. Run these commands explicitly from Termux.

For a reproducible setup, use the scripts in this directory rather than copy/pasting large one-line installers from random videos.
