# Migration Report

This project was extracted from a single-file **React** Claude Artifact into a standalone **HTML/CSS/JS** repo. This report states exactly what was preserved, what changed, and what has **not** been verified. It intentionally does **not** claim the result is 100% identical to the original.

## 1. Source

- Original: `mos-manual-tracker.jsx` — one React component + one embedded CSS string, running inside the Claude artifact host. It is kept alongside this project as the source-of-truth reference.

## 2. What was split out (structure only)

- The CSS string → `css/base.css`, `layout.css`, `components.css`, `pages.css`, `responsive.css`. **CSS values were copied verbatim**; only their grouping into files is new.
- The component → `config/config.js` + `js/{app,state,storage,ui}.js` + `js/modules/{projects,tracker,blueprint,status-guide}.js`.

## 3. What was preserved (intended parity)

- The blueprint (skills, IDs, workshop counts, branches, layers, colors).
- The 8-state status vocabulary, weights, and progress derivation (`skillStatusFrom`, `pct`, `meanProg`, `deriveProject`).
- Project Type behavior (organic / paid / both), independent Organic & Paid progress, "Not used" states.
- The four views and their interactions (add, open, status popover, file field, rename, delete, theme).
- The storage key (`mos-manual-tracker-v1`) and the migration rule (add missing skills, default missing `type` to `organic`).

## 4. What changed (required to run standalone)

1. **Persistence:** `window.storage` → `localStorage`. *Same key, same migration, but a different store.*
2. **Rendering:** React `useState`/JSX → a small vanilla store + full re-render. This is a **re-implementation**, not a mechanical file split.
3. **Icons:** `lucide-react` components → Lucide via CDN (`data-lucide` + `createIcons()`).
4. **Escaping:** JSX auto-escaping → explicit `esc()`/`escAttr()` (needed because we build HTML strings).

## 5. What was added

- **Export / Import backup** (JSON). New behavior, not present in the original. Import **replaces** all current projects (after a confirm prompt).

## 6. What was intentionally NOT created

- No `data/` (no static data files exist — config is code).
- No `assets/` (no local images/fonts; icons and fonts are CDN).
- No router / no build tooling / no `package.json` (none needed).

## 7. Validation performed

- ✅ **JS syntax** — every module passes `node --check --input-type=module`.
- ✅ **Import graph** — every `import` resolves to an existing `export` (checked by hand).
- ✅ **CSS values** — copied verbatim from the artifact.

## 8. Validation NOT performed (your step)

- ❌ **Live browser run** — the app has not been opened and clicked through in a browser.
- ❌ **Behavior parity** — no side-by-side comparison against the artifact.
- ❌ **Persistence round-trip** — save/reload/import/export not exercised at runtime.
- ❌ **Cross-browser / mobile** checks.

Recommended check: serve `src/` (see `DEVELOPMENT_GUIDE.md`), then add a project, set some statuses, add a file link, reload (data should persist), toggle Project Type, export, and re-import.

## 9. Potential risks / things to watch

- **Lucide icon names.** Icons render by name via the CDN. If a name has been renamed/removed upstream, that icon may not appear (layout still works). The names used assume current Lucide.
- **`window.storage` → `localStorage`.** Existing data inside the old artifact will **not** appear here — it lived in a different store. Start fresh, or import a backup.
- **Full re-render focus/caret.** Text inputs re-focus after render; in rare fast-typing/tab sequences the caret position could feel different from the React version.
- **Icon `stroke-width`.** The original set a slightly heavier stroke on status marks; the CDN default is used here. Visual difference is minimal but not pixel-identical.
- **Re-implementation risk.** Because the render layer was rebuilt (not transpiled), a subtle interaction could differ from the artifact. Only a live click-through can confirm parity.
- **Import replaces data.** By design, importing a backup overwrites current projects. There is no merge.

## 10. Rollback

The original `mos-manual-tracker.jsx` is unchanged and remains the reference implementation. If anything here misbehaves, it is the ground truth to compare against.
