# System Design

## System map

```text
                        ┌──────────────┐
                        │  config.js   │  locked blueprint + status vocab
                        └──────┬───────┘
                               │
        ┌──────────────────────┼───────────────────────┐
        │                      │                        │
   ┌────▼─────┐          ┌─────▼─────┐            ┌──────▼──────┐
   │storage.js│          │ state.js  │            │   ui.js     │
   │localStorage         │ store +   │            │ render loop │
   │+ backup  │◄─────────│ mutators +│───────────►│ + helpers   │
   └──────────┘  persist │ derive    │  read      └──────┬──────┘
                         └─────▲─────┘                    │ calls
                               │ emit                     │
                         ┌─────┴──────────────────────────▼──────┐
                         │ app.js  (init + event delegation)      │
                         └────────────────────────────────────────┘
                               │ renders
             ┌─────────────────┼───────────────────┬───────────────┐
        projects.js        tracker.js          blueprint.js   status-guide.js
```

## Core model

- A **project** = `{ id, name, type, ws }`. `type` ∈ `organic | paid | both`.
- `ws` maps each skill key → an array of workshops `{ s: status, f: fileLocation }`.
- **Skills** (fixed): shared `mla, bsd`; organic `ocsd, meb, cd, sbd`; paid `pmsd, pcbd, acd, cbd`.
- **Derivation** (`deriveProject`): workshop statuses → skill status/progress → branch progress → project headline status/label. Nothing derived is stored.

## Design decisions

1. **No framework, no build.** Plain ES modules + a single full re-render keep the repo openable in any editor and runnable with a static server. Trade-off: a full re-render on each interaction (fine at this scale).
2. **One render function per page.** Each `modules/*.js` returns an HTML string; `ui.js` swaps it into `#app`. Mirrors the original section components.
3. **Event delegation over inline handlers.** `app.js` listens once and dispatches by `data-act`, so re-renders don't need re-binding.
4. **Config is locked.** The blueprint/status data lives in one file and is treated as source-of-truth constants.

## Port decisions (artifact → standalone)

| Area | Original (artifact) | Here (standalone) | Why |
|---|---|---|---|
| Persistence | `window.storage` (Claude host) | `localStorage` | `window.storage` doesn't exist outside the sandbox |
| Rendering | React `useState` + JSX | vanilla store + string render | remove the React/build dependency |
| Icons | `lucide-react` | Lucide via CDN | no bundler available |
| Fonts | Google Fonts | Google Fonts (unchanged) | already external |
| Escaping | JSX auto-escapes | explicit `esc`/`escAttr` | `innerHTML` is not auto-safe |

These are the only intentional behavioral-substrate changes. Everything else aims to reproduce the artifact exactly. See `MIGRATION_REPORT.md` for risks.
