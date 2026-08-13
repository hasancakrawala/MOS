/* ============================================================
   UI — shared render helpers + the render orchestrator.
   Replaces React's JSX/render with template strings + a single
   full re-render on every state change (small app; simple & safe).
   ============================================================ */
import { STATUS, ORG_COLOR } from "../config/config.js";
import { state, getProjects, getActive, segColor } from "./state.js";
import { hasStore } from "./storage.js";
import { renderProjects } from "./modules/projects.js";
import { renderTracker } from "./modules/tracker.js";
import { renderBlueprint } from "./modules/blueprint.js";
import { renderStatusGuide } from "./modules/status-guide.js";

/* ---- escaping (innerHTML is not auto-safe like JSX) ---- */
export const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
export const escAttr = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---- Lucide icon placeholder; createIcons() swaps <i> → <svg> ---- */
export const icon = (name, { size = 17, color = null, cls = "" } = {}) =>
  `<i data-lucide="${name}" class="${cls}" style="width:${size}px;height:${size}px;${color ? `color:${color};` : ""}"></i>`;

export const mark = (status, size = 17) =>
  `<span class="mark">${icon(STATUS[status].icon, { size, color: STATUS[status].color })}</span>`;

export const pathSeg = (path) =>
  `<div class="segbar">${path.map((s) => `<span class="seg" style="background:${segColor(s.status)}" title="${escAttr(s.id + " " + s.name)}"></span>`).join("")}</div>`;

/* ---- rail (left navigation) ---- */
function rail(active) {
  const d = state.dark;
  const tabs = [
    ["projects", "Projects", "layout-list"],
    ["tracker", "Project Tracker", "list-checks"],
    ["blueprint", "System Blueprint", "git-branch"],
    ["status", "Status Guide", "info"],
  ];
  const nav = tabs.map(([k, l, ic]) => {
    const dis = k === "tracker" && !active;
    return `<button class="tab${state.tab === k ? " active" : ""}${dis ? " disabled" : ""}" ${dis ? "" : `data-act="tab" data-val="${k}"`}>${icon(ic, { size: 16 })} ${l}</button>`;
  }).join("");
  return `<aside class="rail">
    <div class="logo"><div class="logo-mark">${icon("list-checks", { size: 17 })}</div><div><div class="logo-name">MOS Tracker</div><div class="logo-sub">Manual checklist</div></div></div>
    <nav class="tabs">${nav}</nav>
    <div class="rail-foot">
      <div class="backup-row">
        <button class="backup-btn" data-act="export" title="Download a JSON backup">${icon("download", { size: 14 })} Export</button>
        <button class="backup-btn" data-act="import" title="Restore from a JSON backup">${icon("upload", { size: 14 })} Import</button>
      </div>
      <div class="save-note">${hasStore() ? "Changes save automatically" : "This session only"}</div>
      <button class="theme" data-act="theme">${icon(d ? "sun" : "moon", { size: 15 })} ${d ? "Light" : "Dark"}</button>
    </div>
  </aside>`;
}

function hintNoProject() {
  return `<div class="page hint big">${icon("list-checks", { size: 26 })}<p>Select a project to see its tracker.</p><button class="btn-primary" data-act="tab" data-val="projects">Go to Projects</button></div>`;
}

/* ---- the render loop ---- */
export function render() {
  const root = document.getElementById("app");
  if (!root) return;
  root.className = "mos " + (state.dark ? "dark" : "light");
  const projects = getProjects();
  const active = getActive();

  let page = "";
  switch (state.tab) {
    case "projects":  page = renderProjects(projects); break;
    case "tracker":   page = active ? renderTracker(active) : hintNoProject(); break;
    case "blueprint": page = renderBlueprint(); break;
    case "status":    page = renderStatusGuide(); break;
  }
  root.innerHTML = rail(active) + `<main class="main">${page}</main>`;

  if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();

  // keep focus in text inputs that were just re-created
  const focusEl = state.ui.adding ? document.querySelector("[data-add-input]")
    : state.ui.editName ? document.querySelector("[data-rename-input]") : null;
  if (focusEl) { focusEl.focus(); try { focusEl.setSelectionRange(focusEl.value.length, focusEl.value.length); } catch (e) {} }
}
