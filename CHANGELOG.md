# Changelog

## [0.1.0] — Initial extraction from Claude Artifact

Extracted the single-file React artifact (`mos-manual-tracker.jsx`) into a structured, dependency-free HTML/CSS/JS project.

### Structure
- Split the one component + one CSS string into: `index.html`, five CSS files (`base`, `layout`, `components`, `pages`, `responsive`), `config/config.js`, and JS modules (`app`, `state`, `storage`, `ui`, and one module per page).

### Changed (platform ports required to run standalone)
- **Persistence:** `window.storage` (Claude host API) → `localStorage`. The storage key (`mos-manual-tracker-v1`) and migration logic are preserved. Data does **not** carry over from the artifact environment.
- **Rendering:** React (`useState`/JSX) → a small vanilla store with full re-render into `#app`. Derivation and behavior are reproduced, not refactored.
- **Icons:** `lucide-react` → Lucide via CDN (`data-lucide` + `createIcons()`).
- **Fonts:** kept via Google Fonts CDN.

### Added
- **Export / Import backup** — download all projects as a JSON file and restore them later. Requested to prevent data loss during environment changes.

### Not verified
- Behavior parity has **not** been confirmed in a live browser. See `docs/MIGRATION_REPORT.md` for the validation checklist and known risks.
