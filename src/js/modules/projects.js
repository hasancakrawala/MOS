/* Projects page — home list. Rows show independent Organic/Paid
   progress; sorted active-first. Includes inline "New Project". */
import { STATUS } from "../../config/config.js";
import { state, PRIORITY } from "../state.js";
import { icon, esc, pathSeg } from "../ui.js";

function branchLine(letter, used, path, prog) {
  return used
    ? `<div class="dual-row"><span class="dual-lbl">${letter}</span>${pathSeg(path)}<span class="mono dual-pct">${prog}%</span></div>`
    : `<div class="dual-row"><span class="dual-lbl">${letter}</span><span class="dual-off">Not used</span></div>`;
}

export function renderProjects(projects) {
  const sorted = [...projects].sort((a, b) => PRIORITY[a.status] - PRIORITY[b.status] || a.name.localeCompare(b.name));

  const rows = sorted.map((p) => `
    <button class="prow" data-act="open" data-pid="${p.id}">
      <span class="prow-dot" style="background:${STATUS[p.status].color}"></span>
      <div class="prow-main"><div class="prow-name">${esc(p.name)}</div><div class="prow-sub">${esc(p.currentLabel)}</div></div>
      <div class="prow-prog">${branchLine("O", p.organicUsed, p.orgPath, p.organicProgress)}${branchLine("P", p.paidUsed, p.paidPath, p.paidProgress)}</div>
      <div class="prow-status" style="color:${STATUS[p.status].color}">${STATUS[p.status].label}</div>
      ${icon("chevron-right", { size: 16, cls: "prow-chev" })}
    </button>`).join("");

  const addBlock = state.ui.adding
    ? `<div class="prow prow-add-open">${icon("plus", { size: 17, cls: "add-ic" })}
        <input data-add-input class="add-input" placeholder="Project name…">
        <button class="btn-primary" data-act="add-confirm">Add</button>
        <button class="btn-ghost" data-act="add-cancel">Cancel</button></div>`
    : `<button class="prow prow-add" data-act="add-open">${icon("plus", { size: 17, cls: "add-ic" })} New Project</button>`;

  const empty = projects.length === 0 && !state.ui.adding
    ? `<div class="hint">${icon("layout-list", { size: 22 })}<p>No projects yet. Add one to start tracking.</p></div>` : "";

  return `<div class="page">
    <div class="page-head"><h1>Projects</h1><span class="count">${projects.length}</span></div>
    ${empty}
    <div class="plist">${rows}${addBlock}</div>
  </div>`;
}
