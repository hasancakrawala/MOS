# Development Guide

## Running locally

The app uses native ES modules, so it must be served over HTTP (not opened as a `file://` path).

```bash
cd src
python3 -m http.server 8080
# open http://localhost:8080
```

VS Code: install **Live Server**, then right-click `src/index.html` → *Open with Live Server*.

## Working with Claude Code / VS Code

The repo is plain files with no toolchain, so any AI or editor can operate on it directly. Good entry points:
- Behavior/logic → `js/state.js`
- A specific screen → `js/modules/<page>.js`
- Styling → the matching `css/*.css`
- Blueprint/status data → `config/config.js`

There is no build and nothing to install. Reload the browser to see changes.

## Conventions

- **Render from state.** Never mutate the DOM directly for data. Change `state` via a mutator; `render()` rebuilds the view.
- **Mutators own persistence.** Anything that changes `state.raw` calls `saveState` then `emit()`. Ephemeral UI toggles only `emit()`.
- **Events via `data-act`.** Add a `data-act="…"` (plus any `data-*` params) to the element, then a `case` in the click switch in `app.js`. Avoid inline `onclick`.
- **Escape interpolated values.** Use `esc()` for text and `escAttr()` for attribute values whenever inserting user data into HTML strings.
- **Keep `config.js` pure data.** No logic there.

## Common changes

**Add a status** — add an entry to `STATUS` and to `STATUS_ORDER` in `config.js`, give it a Lucide `icon` name, and (if it affects progress) a `WEIGHT`. The picker, guide, and marks pick it up automatically.

**Change a skill's workshop count** — edit `workshops` in `SKILL_DEFS`. New projects get the new count; existing projects keep their stored workshops until migrated.

**Add a page/tab** — create `js/modules/<name>.js` exporting a render function, import it in `ui.js`, add a `case` in the `render()` switch, and add a tab entry in `rail()`.

## Sanity-checking JS

Syntax-check the modules without a browser:

```bash
for f in $(find src -name '*.js'); do node --check --input-type=module < "$f" || echo "FAIL $f"; done
```

This checks syntax only — it does not verify runtime behavior. Use the browser for that.
