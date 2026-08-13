# Features

Every feature carried over from the original artifact, plus the backup feature added during extraction. "Status" reflects code state; none has been verified in a live browser yet (see `docs/MIGRATION_REPORT.md`).

| Feature | Purpose | Location | Depends on | Status |
|---|---|---|---|---|
| Projects list | Home view of all projects, sorted active-first | `js/modules/projects.js` | state, config, ui | Ported |
| Dual branch progress (O/P) | Show Organic & Paid progress per project at a glance | `projects.js`, `state.js` (`deriveProject`) | config | Ported |
| Add project | Create a new project inline | `projects.js`, `state.js` (`addProject`, `newProject`) | storage | Ported |
| Project Tracker | Manual per-workshop status checklist | `js/modules/tracker.js` | state, config, ui | Ported |
| 8-state status picker | Set each workshop's status via popover | `tracker.js`, `state.js` (`setStatus`) | config | Ported |
| File location / link | Record a file path or URL per workshop; open if URL | `tracker.js`, `state.js` (`setFile`, `isUrl`) | — | Ported |
| Project Type | Organic Only / Paid Only / Organic + Paid | `tracker.js`, `state.js` (`setType`) | config | Ported |
| Independent progress bars | Organic & Paid progress, "Not used" when off | `tracker.js`, `state.js` | config | Ported |
| Rename / Delete project | Edit or remove a project | `tracker.js`, `state.js` | storage | Ported |
| System Blueprint | Static MOS map with branch split & layers | `js/modules/blueprint.js` | config | Ported |
| Status Guide | Reference for the 8 statuses | `js/modules/status-guide.js` | config | Ported |
| Light / dark theme | Toggle colour theme | `state.js` (`toggleTheme`), `css/base.css` | — | Ported |
| Persistence | Save/restore across sessions | `js/storage.js` | localStorage | **Changed** (was `window.storage`) |
| Migration | Upgrade old data to current shape | `storage.js` (`migrate`) | config | Ported |
| Export backup | Download all projects as JSON | `app.js` (`doExport`), `storage.js` (`exportBackup`) | — | **Added** |
| Import backup | Restore projects from a JSON file | `app.js`, `storage.js` (`parseBackup`, `importProjects`) | — | **Added** |
| Icons | Status & UI glyphs | Lucide CDN via `ui.js` (`icon`) | Lucide CDN | **Changed** (was `lucide-react`) |

Legend — **Ported**: reimplemented in vanilla JS, behavior intended to match. **Changed**: intentionally different to run standalone. **Added**: new in this extraction.
