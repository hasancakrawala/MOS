/* Status Guide — the universal status vocabulary (8 states). */
import { STATUS, STATUS_ORDER } from "../../config/config.js";
import { mark } from "../ui.js";

export function renderStatusGuide() {
  const rows = STATUS_ORDER.map((k) => `
    <div class="guide-row">
      <span class="guide-glyph">${STATUS[k].glyph}</span>${mark(k, 16)}
      <span class="guide-name">${STATUS[k].label}</span>
      <span class="guide-note">${STATUS[k].note}</span>
    </div>`).join("");
  return `<div class="page"><div class="page-head"><h1>Status Guide</h1></div><div class="guide">${rows}</div></div>`;
}
