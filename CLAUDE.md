# CLAUDE.md

Persistent operating instructions for Claude Code when working in this repository. This file does not replace the existing documentation — it tells Claude how to behave here and where to look for detail.

## 1. Project Identity

- **Name:** MOS Tracker.
- **Purpose:** a **manual** visual progress tracker for the Marketing Operating System (MOS) workflow: `Marketing Landscape Analysis → Brand Strategy Development → split → Organic branch / Paid Media branch`.
- **Function:** lets a user record, per project, the status (8 states) and file location/link of each workshop by hand, and view derived progress per skill/branch/project.
- **It is explicitly NOT an AI runtime.** It runs no AI, generates no documents, and stores no workshop content — it only tracks *where each project is*. Do not add AI/generation behavior unless explicitly instructed.
- Full description: [README.md](README.md).

## 2. Current Architecture

- **Stack:** plain HTML/CSS/JS, ES modules, no framework, no build step, no `package.json`.
- **Repository structure:** `src/index.html`, `src/css/*` (5 files, load order matters), `src/config/config.js` (locked blueprint + status data), `src/js/{app,state,storage,ui}.js`, `src/js/modules/{projects,tracker,blueprint,status-guide}.js`, plus root-level docs and `docs/`.
- **Module dependency direction:** `config.js` → `storage.js` → `state.js` → `ui.js` → `modules/*` → `app.js`. `config.js` depends on nothing. `ui.js ↔ modules/*` form an intentional import cycle (safe because helpers are only invoked at render time).
- **Data flow:** user event → event delegation in `app.js` (`data-act` dispatch) → mutator in `state.js` (updates `state.raw`, calls `saveState()`, then `emit()`) → `render()` in `ui.js` rebuilds the active page from derived data and writes it into `#app` → `lucide.createIcons()` repaints icons.
- **Derivation is never stored:** `deriveProject()` in `state.js` computes skill/branch/project status and progress from the raw workshop statuses on every read. The manual workshop statuses (`ws` array per skill) are the single source of truth for data.
- Detail: [ARCHITECTURE.md](ARCHITECTURE.md), [docs/SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md), [docs/MODULE_OVERVIEW.md](docs/MODULE_OVERVIEW.md).

## 3. Source of Truth

- **The source code in `src/` is the source of truth for this project**, not this file, not prior conversation memory, and not assumptions carried over from other sessions.
- Documentation (`README.md`, `ARCHITECTURE.md`, `FEATURES.md`, `docs/*`) must reflect the actual source code. If documentation and code disagree, treat the code as authoritative and flag the mismatch to the user rather than silently trusting either one.
- Do not rely on conversation history as a record of project state — re-check the relevant file before making claims about current behavior.

## 4. Current Project Status

- This repository is the result of **extracting a single-file React Claude Artifact** (`mos-manual-tracker.jsx`) into a standalone HTML/CSS/JS project. The original artifact is the reference implementation for intended behavior. See [docs/MIGRATION_REPORT.md](docs/MIGRATION_REPORT.md).
- **Live browser validation has not been performed.** Only JS syntax checks (`node --check`) and manual import-graph review have been done. Behavior parity with the original artifact, persistence round-trips, and cross-browser/mobile behavior are unverified.
- **Do not describe this system as production-ready or fully verified.** State clearly when something is unverified rather than assuming it works.
- [ROADMAP.md](ROADMAP.md): no new features are planned; the only known next step is a logic refactor stage *after* browser validation, not yet started.

## 5. Locked / Sensitive Areas

- `src/config/config.js` is explicitly marked **LOCKED** in its own header comment: it holds the status vocabulary, skill/workshop blueprint, and branch groupings, and is meant to stay pure data with no logic. Changing values here (skill IDs, workshop counts, status set) changes the MOS domain model itself — do not edit without explicit instruction.
- The `localStorage` key `mos-manual-tracker-v1` and the shape it stores (`{ projects: [...] }`) is a persisted data contract; `migrate()` in `storage.js` depends on it. Do not change the key or stored shape without a migration plan (see §6/§9).
- No other file or directory is documented as locked. Do not treat ordinary modules (`state.js`, `ui.js`, `modules/*`, CSS files) as untouchable — they are normal application code, just subject to the change-management rules below.

## 6. Development Rules

- Do not remove existing functionality without explicit instruction.
- Do not redesign the UI or app behavior without explicit instruction.
- Do not change the module architecture (dependency direction, render model, storage model) without first understanding the current dependency graph (§2).
- Do not change the data schema (`config.js` structures, the `ws`/project shape, the storage key/shape) without a migration plan — `migrate()` in `storage.js` is the existing precedent for how upgrades are handled.
- Do not perform large refactors without explicit instruction. A refactor stage is anticipated later (§4) but is not authorized by default.
- Preserve existing behavior; this project's stated goal is parity with the original artifact, not improvement over it.
- Do not add new dependencies or a build toolchain (npm, bundler, framework) without explicit instruction — the project is deliberately dependency-free aside from two CDN includes.
- Do not change the external dependencies already in use (Lucide CDN, Google Fonts CDN) without explicit instruction.

## 7. Change Management

Before making a non-trivial change:
1. Read the relevant existing documentation (README, ARCHITECTURE, MODULE_OVERVIEW, SYSTEM_DESIGN, or MIGRATION_REPORT as applicable).
2. Identify which files are affected, using the dependency direction in §2.
3. State the plan (what will change and why) to the user.
4. Implement only after the user approves the plan.

## 8. Validation Rule

After making a change:
- Check JS syntax, e.g. `node --check --input-type=module < <file>` (per [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)).
- Check that the import graph still resolves (every `import` has a matching `export`).
- Consider what existing behavior could regress (rendering, persistence, migration, derivation).
- Explicitly state what has **not** been verified — in particular, note if live-browser behavior was not checked, since this project currently has no automated or manual browser test coverage.

## 9. Documentation Rule

- If the architecture changes, update the corresponding doc(s): `ARCHITECTURE.md`, `docs/SYSTEM_DESIGN.md`, and/or `docs/MODULE_OVERVIEW.md`.
- If a feature changes (added, removed, or behavior changed), update `FEATURES.md`.
- If a significant change is made, add an entry to `CHANGELOG.md`.
- Keep documentation changes scoped to what actually changed in code — do not describe planned or hypothetical behavior as current.

## 10. Git Rule

- Claude may modify the working tree as instructed by the user.
- Do not create commits or push to GitHub automatically. Only commit or push when the user explicitly asks.
- Before any commit, changes should be reviewable by the user (e.g. via `git diff`/`git status`).

## 11. AI Behavior

- Claude Code acts as a development assistant on this repository, not an autonomous designer of it.
- Do not invent features, architecture, requirements, or project history that are not present in the repository.
- If information is not available in the repository, state explicitly that it is not available rather than guessing or inferring from typical project conventions.
- Prioritize preserving the existing system over improving, modernizing, or simplifying it, unless the user explicitly asks for that.
