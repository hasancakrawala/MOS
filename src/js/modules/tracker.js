/* Project Tracker — manual checklist. Rename/delete, Project Type,
   independent Organic/Paid progress, and Strategy / Organic /
   Paid sections with expandable skills → workshop status + file. */
import {
  STATUS, STATUS_ORDER, TYPE_OPTIONS, SHARED, ORGANIC, PAID, ORG_COLOR, PAID_COLOR,
} from "../../config/config.js";
import { state, isUrl } from "../state.js";
import { icon, mark, esc, escAttr } from "../ui.js";

function renderWs(s, w, i) {
  const menuOpen = state.ui.menu && state.ui.menu.skill === s.key && state.ui.menu.i === i;
  const menu = menuOpen
    ? `<div class="menu-backdrop" data-act="menu-close"></div>
       <div class="status-menu">${STATUS_ORDER.map((k) => `
         <button class="menu-item${k === w.s ? " sel" : ""}" data-act="setstatus" data-skill="${s.key}" data-idx="${i}" data-status="${k}">
           ${mark(k, 15)}<span>${STATUS[k].label}</span>${k === w.s ? icon("check", { size: 13, cls: "menu-check" }) : ""}
         </button>`).join("")}</div>` : "";

  const openLink = isUrl(w.f)
    ? `<a class="file-open" href="${escAttr(w.f.trim())}" target="_blank" rel="noreferrer" title="Open link">${icon("external-link", { size: 13 })}</a>` : "";

  return `<div class="ws-row${["in_progress", "revision", "waiting"].includes(w.s) ? " ws-active" : ""}">
    <div class="ws-status-wrap">
      <button class="ws-status-btn" data-act="wsmenu" data-skill="${s.key}" data-idx="${i}" style="border-color:${STATUS[w.s].color}44">
        ${mark(w.s, 15)}<span class="ws-status-label" style="color:${STATUS[w.s].color}">${STATUS[w.s].label}</span>${icon("chevron-down", { size: 12, cls: "ws-caret" })}
      </button>${menu}
    </div>
    <span class="ws-name">Workshop ${String(i + 1).padStart(2, "0")}</span>
    <div class="filefield">${icon("link-2", { size: 13, cls: "file-ic" })}
      <input class="file-input" data-file data-skill="${s.key}" data-idx="${i}" placeholder="File location / link…" value="${escAttr(w.f)}">${openLink}</div>
  </div>`;
}

function renderSkill(s) {
  const isOpen = state.ui.openSkill === s.key;
  const done = s.ws.filter((w) => w.s === "approved").length;
  const body = isOpen ? `<div class="workshops">${s.ws.map((w, i) => renderWs(s, w, i)).join("")}</div>` : "";
  return `<div class="skill${isOpen ? " skill-open" : ""}">
    <button class="skill-row" data-act="skill" data-skill="${s.key}">
      ${mark(s.status)}<span class="mono skill-id">${s.id}</span><span class="skill-name">${esc(s.name)}</span>
      <span class="mono skill-count">${done}/${s.ws.length}</span><span class="skill-pct mono">${s.progress}%</span>
      ${icon(isOpen ? "chevron-down" : "chevron-right", { size: 15, cls: "skill-chev" })}
    </button>${body}</div>`;
}

function section(title, color, keys, map) {
  return `<div class="branch-sec"><div class="branch-head"><span class="branch-tag" style="background:${color}"></span>${title}</div>
    <div class="skills">${keys.map((k) => renderSkill(map[k])).join("")}</div></div>`;
}

function progLine(label, color, used, val) {
  return `<div class="prog-line"><span class="prog-lbl"><span class="prog-tag" style="background:${color}"></span>${label}</span>${
    used ? `<div class="track"><div class="track-fill" style="width:${val}%"></div></div><span class="mono track-pct">${val}%</span>`
         : `<span class="prog-off">Not used</span>`}</div>`;
}

export function renderTracker(p) {
  const ui = state.ui;
  const titleRow = ui.editName
    ? `<div class="rename"><input data-rename-input class="rename-input" value="${escAttr(p.name)}">
        <button class="icon-mini" data-act="rename-save">${icon("check", { size: 16 })}</button>
        <button class="icon-mini" data-act="rename-cancel">${icon("x", { size: 16 })}</button></div>`
    : `<h1>${esc(p.name)}</h1>
        <button class="icon-mini" title="Rename" data-act="rename-open">${icon("pencil", { size: 15 })}</button>
        <div class="head-spacer"></div>${
        ui.confirmDel
          ? `<div class="confirm"><span>Delete?</span><button class="btn-danger" data-act="del-confirm">Delete</button><button class="btn-ghost" data-act="del-cancel">Cancel</button></div>`
          : `<button class="icon-mini danger" title="Delete project" data-act="del-open">${icon("trash-2", { size: 15 })}</button>`}`;

  const typeCtrl = `<div class="ptype"><span class="ptype-lbl">Project Type</span><div class="seg-ctrl">${
    TYPE_OPTIONS.map(([v, l]) => `<button class="seg-btn${p.type === v ? " on" : ""}" data-act="type" data-type="${v}">${l}</button>`).join("")}</div></div>`;

  const prog = `<div class="branch-prog">${progLine("Organic", ORG_COLOR, p.organicUsed, p.organicProgress)}${progLine("Paid Media", PAID_COLOR, p.paidUsed, p.paidProgress)}</div>`;

  const strat = section("Strategy", "var(--faint)", SHARED, p.map);
  const org = p.organicUsed ? section("Organic Branch", ORG_COLOR, ORGANIC, p.map) : "";
  const paid = p.paidUsed ? section("Paid Media Branch", PAID_COLOR, PAID, p.map) : "";

  return `<div class="page">
    <button class="back" data-act="back">${icon("arrow-left", { size: 16 })} Projects</button>
    <div class="tracker-head"><div class="tracker-title-row">${titleRow}</div>${typeCtrl}${prog}</div>
    ${strat}${org}${paid}
  </div>`;
}
