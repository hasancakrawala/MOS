/* ============================================================
   App — initialization + event wiring.
   Replaces React's event props with a small delegation layer.
   Loaded last (module) after the DOM shell is in place.
   ============================================================ */
import { render } from "./ui.js";
import {
  state, subscribe,
  setTab, toggleTheme, openProject, addProject, setStatus, setFile, setType,
  renameProject, deleteProject, importProjects,
  toggleSkill, openMenu, closeMenu, setAdding, setEditName, setConfirmDel,
} from "./state.js";
import { loadState, exportBackup, parseBackup } from "./storage.js";

/* ---- boot ---- */
state.raw = loadState();
subscribe(render);

/* ---- click delegation ---- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const { act, val, pid, skill, idx, status, type } = el.dataset;
  switch (act) {
    case "tab": setTab(val); break;
    case "theme": toggleTheme(); break;
    case "open": openProject(pid); break;
    case "back": setTab("projects"); break;
    case "add-open": setAdding(true); break;
    case "add-confirm": addProject(document.querySelector("[data-add-input]")?.value || ""); break;
    case "add-cancel": setAdding(false); break;
    case "skill": toggleSkill(skill); break;
    case "wsmenu": openMenu(skill, +idx); break;
    case "menu-close": closeMenu(); break;
    case "setstatus": setStatus(skill, +idx, status); break;
    case "type": setType(type); break;
    case "rename-open": setEditName(true); break;
    case "rename-save": renameProject(document.querySelector("[data-rename-input]")?.value || ""); break;
    case "rename-cancel": setEditName(false); break;
    case "del-open": setConfirmDel(true); break;
    case "del-confirm": deleteProject(); break;
    case "del-cancel": setConfirmDel(false); break;
    case "export": doExport(); break;
    case "import": document.getElementById("import-file")?.click(); break;
  }
});

/* ---- keyboard (Enter / Escape) ---- */
document.addEventListener("keydown", (e) => {
  const t = e.target;
  if (t.matches("[data-add-input]")) {
    if (e.key === "Enter") addProject(t.value);
    if (e.key === "Escape") setAdding(false);
  } else if (t.matches("[data-rename-input]")) {
    if (e.key === "Enter") renameProject(t.value);
    if (e.key === "Escape") setEditName(false);
  } else if (t.matches("[data-file]")) {
    if (e.key === "Enter") t.blur();
  }
});

/* ---- file field commit on blur ---- */
document.addEventListener("focusout", (e) => {
  const t = e.target;
  if (t.matches("[data-file]")) setFile(t.dataset.skill, +t.dataset.idx, t.value);
});

/* ---- backup: export ---- */
function doExport() {
  const json = exportBackup(state.raw);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mos-tracker-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/* ---- backup: import ---- */
const importInput = document.getElementById("import-file");
if (importInput) {
  importInput.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const list = parseBackup(await file.text());
      const count = state.raw.length;
      const ok = count === 0 || window.confirm(`Import will replace all ${count} current project(s) with ${list.length} from the backup. Continue?`);
      if (ok) importProjects(list);
    } catch (err) {
      window.alert("Could not read that file — it doesn’t look like a valid MOS Tracker backup.");
    }
    e.target.value = "";
  });
}

/* ---- first paint ---- */
render();
