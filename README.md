# MOS Tracker

A lightweight, **manual** visual project tracker for the Marketing Operating System (MOS). It is a standalone checklist app — it does **not** run any AI, generate documents, or store workshop content. It only tracks *where each project is*.

Originally built as a single-file Claude Artifact (React), it has been extracted into a plain **HTML / CSS / JavaScript** project so it can live in version control and be developed in VS Code / Claude Code.

## What it does

- **Projects** — home list of every project, sorted active-first, each showing independent Organic and Paid progress, current skill, and status.
- **Project Tracker** — manual checklist per project. Set each workshop's status by hand (8 states), record a **file location / link** per workshop, choose a **Project Type**, and see independent **Organic** and **Paid Media** progress.
- **System Blueprint** — the fixed MOS map: `Marketing Landscape Analysis → Brand Strategy Development → Split →` Organic branch and Paid Media branch (Strategy → Planning → Content).
- **Status Guide** — the 8-state status vocabulary with one-line descriptions.
- **Export / Import** — download a JSON backup of all projects and restore it later (added during extraction).
- Light / dark theme. Data persists across sessions via `localStorage`.

## Project Type

Each project is `Organic Only`, `Paid Only`, or `Organic + Paid`. This controls which branches appear and which progress bars are active (the other shows *Not used*). `Marketing Landscape Analysis` and `Brand Strategy Development` are the shared Strategy root for both branches.

## Run it

The app uses ES modules, so it must be served over HTTP (opening `index.html` directly with `file://` will be blocked by the browser).

```bash
cd src
python3 -m http.server 8080
# then open http://localhost:8080
```

Or, in VS Code, right-click `src/index.html` → **Open with Live Server**.

## Repository structure

```text
mos-tracker/
├── README.md ARCHITECTURE.md FEATURES.md CHANGELOG.md ROADMAP.md
├── src/
│   ├── index.html
│   ├── css/  base.css layout.css components.css pages.css responsive.css
│   ├── config/ config.js            # locked blueprint + status vocabulary
│   └── js/
│       ├── app.js                    # init + event delegation
│       ├── state.js                  # store + mutators + derivation
│       ├── storage.js                # localStorage + migration + backup
│       ├── ui.js                     # render loop + shared helpers
│       └── modules/ projects.js tracker.js blueprint.js status-guide.js
└── docs/ SYSTEM_DESIGN.md MODULE_OVERVIEW.md DEVELOPMENT_GUIDE.md MIGRATION_REPORT.md
```

There is deliberately no `data/`, `assets/`, or router — the system has no static data files, local assets, or routing. See `docs/MIGRATION_REPORT.md`.

## Dependencies (external, via CDN)

- **Lucide** icons — `https://unpkg.com/lucide@latest`
- **Google Fonts** — Inter + JetBrains Mono

Both are referenced in `src/index.html`. They are not vendored; an internet connection is needed for icons and fonts to appear. Everything else is local and dependency-free (no build step, no framework, no npm).
