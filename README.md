# UTAU Random Pitch Generator

A simple browser-based tool for generating random pitch combinations for multi-pitch UTAU voicebanks. Made by **itsukiMNE**.

## Features

- Generate 2–4 pitches using male or female vocal ranges.
- Optionally avoid sharp notes (`#`).
- Create pitch-named folders, with optional numbering (e.g. `01_C4`, `02_E4`).
- Keep the **latest 20 generated combinations** in your browser, including repeated results; click an entry to restore it, or delete individual entries / clear the list.
- Side-by-side generation controls and history on desktop; stacked layout on narrow screens.
- Interface languages: **中文 / 日本語 / English**.

## Usage

1. Open `index.html` in your browser, or publish these files via GitHub Pages.
2. Select a vocal range, number of pitches, and any optional settings.
3. Click **Generate** to get a combination. Previous results appear in **History** on the right (on desktop).
4. Click an earlier combination to restore it, or click **Confirm & Create Folders** to create folders in a directory you choose.

**Notes:** History uses browser `localStorage` and may be lost when site data is cleared or when switching browsers/devices. Folder creation requires a browser supporting the File System Access API, such as recent desktop Chromium-based browsers, and a supported secure context (e.g. HTTPS via GitHub Pages or localhost). The generator itself works without folder creation support.

## Files

- `index.html` — page structure
- `style.css` — appearance and responsive layout
- `script.js` — generation, history, languages, and folder creation

## Version

**v1.14** — Display generation controls and history side by side on desktop.
