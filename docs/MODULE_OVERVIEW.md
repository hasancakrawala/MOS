# Module Overview

## `config/config.js`
The locked data layer. Exports the status vocabulary (`STATUS`, `STATUS_ORDER`, `WEIGHT`), the skill blueprint (`SKILL_DEFS`), branch groupings (`SHARED`, `ORGANIC`, `PAID`, `ALL_SKILLS`), layer labels/colors, `TYPE_OPTIONS`, and `STORE_KEY`. Pure data — no logic, no imports.

## `js/storage.js`
Persistence and backup. `loadState`/`saveState` read/write `localStorage` under `STORE_KEY`. `migrate` upgrades a project to the current shape (adds missing skills, defaults `type`). `newProject`/`freshWorkshops`/`freshArr` create empty structures. `exportBackup`/`parseBackup` handle JSON backup. `hasStore` reports whether persistence is available.

## `js/state.js`
The brain. Two parts:
- **Pure derivation** — `skillStatusFrom`, `pct`, `meanProg`, `deriveProject`, `segColor`, `PRIORITY`, `isUrl`. No side effects.
- **Runtime store** — a `state` object, `subscribe`/`emit` pub-sub, selectors (`getProjects`, `getActive`), and mutators (`addProject`, `setStatus`, `setFile`, `setType`, `renameProject`, `deleteProject`, `importProjects`, plus tab/theme/ui toggles). Data mutators persist then emit.

## `js/ui.js`
Rendering helpers + orchestrator. `esc`/`escAttr` (safe interpolation), `icon` (Lucide placeholder), `mark` (status glyph), `pathSeg` (segmented bar), the `rail` (left nav), and `render()` — which builds the active page, writes it into `#app`, repaints icons, and restores input focus.

## `js/modules/projects.js`
`renderProjects(projects)` — the home list: sorted rows with dual O/P progress, status, and the inline "New Project" control.

## `js/modules/tracker.js`
`renderTracker(project)` — rename/delete header, Project Type control, independent progress bars, and Strategy / Organic / Paid sections. Internal helpers render each skill, each workshop row (status popover + file field), progress lines, and sections.

## `js/modules/blueprint.js`
`renderBlueprint()` — the static MOS map: shared root, split, and the two branch columns with per-layer sublabels.

## `js/modules/status-guide.js`
`renderStatusGuide()` — the eight statuses with glyph, mark, label, and note.

## `js/app.js`
Entry point. Loads state, subscribes `render`, wires delegated `click` / `keydown` / `focusout` handlers and the backup export/import, then does the first paint.
