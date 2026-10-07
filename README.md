# Termux GUI Lite

A small, Android-first **Linux workspace UI** designed around the Realme 9 4G form factor. It combines a Play Store-style package catalog, an app launcher, a terminal-inspired command deck, and a selectable theme gallery in one offline-friendly interface.

> **Prototype scope:** this repository provides the complete UI/PWA and an Android wrapper configuration. Package installs and terminal commands are deliberately simulated locally: this app does **not** embed Termux, ship a Linux root filesystem, ask for root, or access Android files. Connect a real backend only after choosing the security model and runtime you want.

## What is included

- **Play Store-like app catalog** with categories, search, sorting, install/remove state, app detail sheets, and a strict optional 700 MB workspace guardrail.
- **Home dashboard** with quick launch tools, storage feedback, system-health feedback, and a Realme 9 4G device profile.
- **Safe command deck** with useful demo commands: `help`, `neofetch`, `pkg list`, `pkg install <tool>`, `theme <name>`, `ls`, `pwd`, and `clear`.
- **Four built-in themes** — Forest Terminal, Tidal Blue, Orbit Plum, and Solar Sand — plus high contrast and reduced motion controls.
- **Installable PWA shell** with a manifest, service worker, and no external runtime assets.
- **Capacitor 8 configuration** so the same UI can be wrapped as an Android app / Play Store AAB.

## Run locally

This project has no front-end build tool or runtime framework.

```bash
npm run start
```

Open `http://localhost:4173` in a browser. On Android Chrome, use **Install app** / **Add to Home screen** after the first load to test the standalone PWA.

## Android / Play Store wrapper

Prerequisites: Node.js 22+, Android Studio, Android SDK, and a configured JDK.

```bash
npm install
npm run android:sync # after changing the web UI
npm run android:open  # opens the included native project in Android Studio
```

The generated `android/` project is included, with the `com.tuxlite.workspace` package ID, a dark system-bar treatment, a custom adaptive launcher icon, and no requested dangerous/network permissions. If you intentionally remove `android/` and need to recreate it, run `npm run android:add` once. In Android Studio, select a release signing configuration and build an **Android App Bundle (`.aab`)** for Play Console submission.

### Realme 9 4G target

- The layout is mobile-first and has a compact 320 px breakpoint, so it is comfortable on the Realme 9 4G's 1080 × 2400 portrait display.
- It uses touch-sized controls, safe-area padding, dark-mode-first surfaces, and no network-loaded fonts or imagery.
- The design itself is only static HTML/CSS/JS. The generated web bundle is approximately a few hundred KB, well below the requested 700 MB project target.
- The **700 MB meter is a workspace/package budget inside the prototype**, not a claim about final APK/AAB download size. Always check the signed release size in Android Studio / Play Console before publishing.

## Size-friendly architecture

```text
index.html              Application shell and accessible views
styles.css              Responsive mobile UI and theme tokens
app.js                  Local catalog, UI state, safe terminal demo
assets/icon.svg         Vector app icon (no bitmap payload)
manifest.webmanifest    PWA metadata
sw.js                   Offline app-shell cache
scripts/build.mjs       Copies the static shell into www/ for Capacitor
capacitor.config.json   Android wrapper configuration
```

The app has no image library, web framework, remote font request, Linux ISO, rootfs, or bundled package archive. Keep it that way if 700 MB is a hard delivery cap. If you later add a real Linux distribution, make package selection optional and measure both **download size** and **on-device expanded size**.

## Demo command deck

The terminal is intentionally a safe UI simulation. It is useful for testing the interface without requesting elevated permissions:

```text
help
neofetch
pkg list
pkg install web-lab
theme ocean
ls
pwd
clear
```

## Native integration next steps

To turn the UI into a functional Linux environment, choose one approach before adding code:

1. **Termux plugin/API integration** — preserve Termux's security boundaries and use documented intents or APIs where available.
2. **A sandboxed native runtime** — execute only explicitly approved processes in the app sandbox; never imply root access.
3. **Remote development workspace** — proxy authenticated commands to a server and show connection/privacy state clearly.

Whichever route you choose, retain the storage guardrail, request the smallest possible set of Android permissions, publish a privacy policy, and validate on a physical Realme 9 4G before release.

## Validation

```bash
node --check app.js
npm run build
```

`npm run build` creates the ignored `www/` directory used by Capacitor. It contains only the static files required by the Android WebView.
