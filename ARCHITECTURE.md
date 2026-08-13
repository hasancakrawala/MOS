# Architecture

## Overview

A dependency-free single-page app with no framework and no build step. State lives in one plain object; every change triggers a full re-render of the active view into a single root element. This mirrors the original React artifact's "render from state" model without React.

## Module architecture

```text
config/config.js   locked data: STATUS, SKILL_DEFS, branches, layers, colors
        │
storage.js         localStorage load/save, migration, backup export/import
        │
state.js           runtime store (pub/sub) + mutators + pure derivation
        │
ui.js              render() orchestrator + shared helpers (icon, mark, esc…)
        │
modules/*.js       one render function per page (pure string builders)
        │
app.js             init, event delegation, backup wiring, first paint
```

## Data flow

```text
user event
   ↓ (event delegation in app.js)
mutator in state.js  → updates state.raw → saveState() to localStorage
   ↓ emit()
render() in ui.js    → getProjects()/deriveProject() → HTML string → #app.innerHTML
   ↓
lucide.createIcons() → icons painted
```

Reads are always derived, never stored: `deriveProject()` computes each skill's status/progress from its workshop statuses, each branch's progress from its skills, and the project's headline status/label from the active branches. The manual workshop statuses are the single source of truth.

## State flow

`state = { dark, tab, activeId, raw[], ui{ adding, editName, confirmDel, openSkill, menu } }`

- `raw` — the persisted array of `{ id, name, type, ws }`. `ws` maps each skill key to an array of `{ s: status, f: fileLocation }`.
- `ui` — ephemeral view state (never persisted).
- `dark`, `tab`, `activeId` — session view state (not persisted).

Only `raw` is written to storage. Mutators that change `raw` call `saveState`; ephemeral toggles just `emit()`.

## Storage mechanism

- Key: `mos-manual-tracker-v1` in `localStorage`, value `{ projects: raw[] }`.
- `migrate()` upgrades any loaded/imported project to the current shape: it **adds missing skills** (e.g. the paid branch) without touching existing workshop data, and defaults a missing `type` to `organic`.
- Backup: `exportBackup()` serialises `{ app, version, exportedAt, projects }`; `parseBackup()` validates and migrates on import.

> Note: the original artifact persisted via the Claude host's `window.storage`. This project uses `localStorage`. The key and migration are preserved, but data does not transfer between the two environments.

## Dependency relationships

- `config.js` depends on nothing.
- `storage.js` → config.
- `state.js` → config, storage.
- `ui.js` → config, state, storage, modules.
- `modules/*` → config, state, ui (helpers).
- `app.js` → state, storage, ui.

`ui.js ↔ modules/*` form an intentional import cycle (ui renders modules; modules use ui's helpers). It is safe because helpers are only *invoked* at render time, after all modules have initialised.
