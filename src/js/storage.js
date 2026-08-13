/* ============================================================
   Storage — persistence + migration + backup
   Original artifact used the Claude host's window.storage API.
   For a standalone site this is ported to localStorage. The
   storage KEY and the migration behavior are preserved.
   ============================================================ */
import { STORE_KEY, ALL_SKILLS, SKILL_DEFS } from "../config/config.js";

export const hasStore = () => { try { return typeof localStorage !== "undefined"; } catch (e) { return false; } };

export const freshArr = (k) => Array.from({ length: SKILL_DEFS[k].workshops }, () => ({ s: "not_started", f: "" }));
export const freshWorkshops = () => Object.fromEntries(ALL_SKILLS.map((k) => [k, freshArr(k)]));
export const newProject = (name) => ({
  id: "prj_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
  name, type: "both", ws: freshWorkshops(),
});

/* Bring any stored/imported project to the current shape without
   touching existing organic data. Adds missing (paid) skills only. */
export function migrate(p) {
  const ws = { ...(p.ws || {}) };
  for (const k of ALL_SKILLS) if (!Array.isArray(ws[k])) ws[k] = freshArr(k);
  return { id: p.id, name: p.name, type: p.type || "organic", ws };
}

export function loadState() {
  try {
    const r = localStorage.getItem(STORE_KEY);
    if (r) { const d = JSON.parse(r); if (d && Array.isArray(d.projects)) return d.projects.map(migrate); }
  } catch (e) { /* corrupt / unavailable → start empty */ }
  return [];
}

export function saveState(projects) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ projects })); }
  catch (e) { /* best effort (quota / private mode) */ }
}

/* ---- Backup (added during extraction, at user request) ---- */
export function exportBackup(projects) {
  return JSON.stringify({ app: "mos-manual-tracker", version: 1, exportedAt: new Date().toISOString(), projects }, null, 2);
}
export function parseBackup(text) {
  const d = JSON.parse(text);
  if (!d || !Array.isArray(d.projects)) throw new Error("Invalid backup file");
  return d.projects.map(migrate);
}
