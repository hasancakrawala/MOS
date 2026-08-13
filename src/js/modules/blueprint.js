/* System Blueprint — static guide. Shared MLA → BSD, then a split
   into the Organic and Paid Media columns, each labelled by layer. */
import { SKILL_DEFS, ORGANIC, PAID, LAYER_LABEL, ORG_COLOR, PAID_COLOR } from "../../config/config.js";

function branchCol(keys, color, name) {
  let prev = null;
  const body = keys.map((k) => {
    const d = SKILL_DEFS[k];
    const showLayer = d.layer !== prev; prev = d.layer;
    return `<div class="bp-arrow"></div>${showLayer ? `<div class="bp-sublayer">${LAYER_LABEL[d.layer]}</div><div class="bp-arrow"></div>` : ""}
      <div class="bp-skill sm"><span class="mono bp-id">${d.id}</span>${d.name}</div>`;
  }).join("");
  return `<div class="bp-col"><div class="bp-branch-head" style="background:${color}">${name}</div>${body}</div>`;
}

export function renderBlueprint() {
  return `<div class="page">
    <div class="page-head"><h1>System Blueprint</h1></div>
    <div class="bp">
      <div class="bp-layer">Strategy Layer</div>
      <div class="bp-arrow"></div><div class="bp-skill"><span class="mono bp-id">01</span>Marketing Landscape Analysis</div>
      <div class="bp-arrow"></div><div class="bp-skill"><span class="mono bp-id">02</span>Brand Strategy Development</div>
      <div class="bp-arrow"></div><div class="bp-split">Split</div>
      <div class="bp-arrow"></div>
      <div class="bp-branches">${branchCol(ORGANIC, ORG_COLOR, "Organic")}${branchCol(PAID, PAID_COLOR, "Paid Media")}</div>
    </div>
  </div>`;
}
