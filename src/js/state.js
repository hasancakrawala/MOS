/* ============================================================
   State — runtime store, mutators, and pure derivation.
   A tiny pub/sub store replaces React's useState. Derivation
   functions are ported verbatim (workshop → skill → branch).
   ============================================================ */
import {
  STATUS, WEIGHT, SKILL_DEFS, SHARED, ORGANIC, PAID, ALL_SKILLS,
} from "../config/config.js";
import { saveState, newProject } from "./storage.js";

/* ---------- pure derivation (unchanged behavior) ---------- */
export function skillStatusFrom(statuses) {
  if (statuses.every((w) => w === "archived")) return "archived";
  if (statuses.every((w) => w === "approved")) return "approved";
  if (statuses.some((w) => w === "revision")) return "revision";
  if (statuses.some((w) => w === "in_progress")) return "in_progress";
  if (statuses.some((w) => w === "waiting")) return "waiting";
  if (statuses.some((w) => w === "ready")) return "ready";
  if (statuses.every((w) => w === "locked")) return "locked";
  return "not_started";
}
export const pct = (statuses) => Math.round((statuses.reduce((a, w) => a + (WEIGHT[w] ?? 0), 0) / statuses.length) * 100);
export const meanProg = (skills) => Math.round(skills.reduce((a, s) => a + s.progress, 0) / skills.length);

export function deriveProject(p) {
  const map = {};
  for (const key of ALL_SKILLS) {
    const arr = (p.ws && p.ws[key]) || [];
    const statuses = arr.map((w) => w.s);
    map[key] = { key, ...SKILL_DEFS[key], ws: arr, status: skillStatusFrom(statuses), progress: pct(statuses) };
  }
  const type = p.type || "organic";
  const organicUsed = type !== "paid";
  const paidUsed = type !== "organic";
  const orgPath = [...SHARED, ...ORGANIC].map((k) => map[k]);
  const paidPath = [...SHARED, ...PAID].map((k) => map[k]);
  const organicProgress = meanProg(orgPath);
  const paidProgress = meanProg(paidPath);

  const active = [...SHARED, ...(organicUsed ? ORGANIC : []), ...(paidUsed ? PAID : [])].map((k) => map[k]);
  const allArchived = active.every((s) => s.status === "archived");
  const activeProg = meanProg(active);
  const current = active.find((s) => !["approved", "archived"].includes(s.status));
  const status = allArchived ? "archived" : activeProg === 100 ? "approved" : current ? current.status : "not_started";
  const currentLabel = allArchived ? "Archived" : activeProg === 100 ? "Completed" : current ? current.name : SKILL_DEFS.mla.name;

  return { ...p, type, map, orgPath, paidPath, organicUsed, paidUsed, organicProgress, paidProgress, status, currentLabel, activeProg };
}

export const segColor = (st) =>
  ({ approved: "#22C55E", in_progress: "#E0A81E", waiting: "#F97316", revision: "#EF4444", ready: "#3B82F6", archived: "#6B7280" }[st]) ||
  "var(--seg-empty)";
export const PRIORITY = { revision: 0, waiting: 1, in_progress: 2, ready: 3, not_started: 4, approved: 5, locked: 6, archived: 7 };
export const isUrl = (v) => /^https?:\/\//i.test((v || "").trim());

/* ---------- runtime store ---------- */
const defaultUi = () => ({ adding: false, editName: false, confirmDel: false, openSkill: null, menu: null });
export const state = { dark: false, tab: "projects", activeId: null, raw: [], ui: defaultUi() };

let listeners = [];
export function subscribe(fn) { listeners.push(fn); }
function emit() { listeners.forEach((f) => f()); }
function persist() { saveState(state.raw); }

/* ---------- selectors ---------- */
export const getProjects = () => state.raw.map(deriveProject);
export const getActive = () => getProjects().find((p) => p.id === state.activeId) || null;

function firstActiveSkill(p) {
  const order = [...SHARED, ...(p.organicUsed ? ORGANIC : []), ...(p.paidUsed ? PAID : [])];
  const f = order.map((k) => p.map[k]).find((s) => ["in_progress", "revision", "waiting"].includes(s.status));
  return f ? f.key : "mla";
}

/* ---------- mutators ---------- */
export function setTab(t) { state.tab = t; state.ui.menu = null; state.ui.adding = false; state.ui.editName = false; state.ui.confirmDel = false; emit(); }
export function toggleTheme() { state.dark = !state.dark; emit(); }

export function openProject(pid) {
  state.activeId = pid; state.tab = "tracker";
  const p = getProjects().find((x) => x.id === pid);
  state.ui = { ...defaultUi(), openSkill: p ? firstActiveSkill(p) : "mla" };
  emit();
}

export function addProject(name) {
  const v = (name || "").trim(); if (!v) return;
  state.raw = [...state.raw, newProject(v)];
  state.ui.adding = false; persist(); emit();
}
export function setStatus(skill, i, st) {
  state.raw = state.raw.map((p) => p.id !== state.activeId ? p
    : { ...p, ws: { ...p.ws, [skill]: p.ws[skill].map((w, j) => j === i ? { ...w, s: st } : w) } });
  state.ui.menu = null; persist(); emit();
}
export function setFile(skill, i, f) {
  let changed = false;
  state.raw = state.raw.map((p) => {
    if (p.id !== state.activeId) return p;
    return { ...p, ws: { ...p.ws, [skill]: p.ws[skill].map((w, j) => {
      if (j === i) { if ((w.f || "") !== f) changed = true; return { ...w, f }; } return w;
    }) } };
  });
  if (changed) { persist(); emit(); }
}
export function setType(t) { state.raw = state.raw.map((p) => p.id === state.activeId ? { ...p, type: t } : p); persist(); emit(); }
export function renameProject(name) {
  const v = (name || "").trim();
  state.raw = state.raw.map((p) => p.id === state.activeId ? { ...p, name: v || p.name } : p);
  state.ui.editName = false; persist(); emit();
}
export function deleteProject() {
  state.raw = state.raw.filter((p) => p.id !== state.activeId);
  state.activeId = null; state.tab = "projects"; state.ui = defaultUi(); persist(); emit();
}
export function importProjects(list) {
  state.raw = list; state.activeId = null; state.tab = "projects"; state.ui = defaultUi(); persist(); emit();
}

/* ephemeral UI toggles (not persisted) */
export function toggleSkill(k) { state.ui.openSkill = state.ui.openSkill === k ? null : k; state.ui.menu = null; emit(); }
export function openMenu(skill, i) { state.ui.menu = { skill, i }; emit(); }
export function closeMenu() { state.ui.menu = null; emit(); }
export function setAdding(b) { state.ui.adding = b; emit(); }
export function setEditName(b) { state.ui.editName = b; emit(); }
export function setConfirmDel(b) { state.ui.confirmDel = b; emit(); }
