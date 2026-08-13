/* ============================================================
   MOS Tracker — Configuration (LOCKED)
   Extracted verbatim from the original artifact. Values are the
   blueprint + status vocabulary; do not change without intent.
   Icon names are Lucide icon ids (rendered via the Lucide CDN).
   ============================================================ */

export const STORE_KEY = "mos-manual-tracker-v1";

export const STATUS = {
  not_started: { label: "Not Started",       glyph: "⚪", color: "#9A9AA6", icon: "circle",           note: "Work on this hasn’t begun yet." },
  ready:       { label: "Ready",             glyph: "🔵", color: "#3B82F6", icon: "circle-dot",       note: "Unlocked and ready to start." },
  in_progress: { label: "In Progress",       glyph: "🟡", color: "#E0A81E", icon: "circle-dot",       note: "Currently being worked on." },
  waiting:     { label: "Waiting Approval",  glyph: "🟠", color: "#F97316", icon: "clock",            note: "Finished and awaiting sign-off." },
  approved:    { label: "Approved",          glyph: "🟢", color: "#22C55E", icon: "circle-check-big", note: "Reviewed and locked in as done." },
  locked:      { label: "Locked",            glyph: "🔒", color: "#8A8A94", icon: "lock",             note: "Blocked until earlier steps are approved." },
  revision:    { label: "Revision Required", glyph: "🔴", color: "#EF4444", icon: "circle-alert",     note: "Sent back for changes." },
  archived:    { label: "Archived",          glyph: "⚫", color: "#6B7280", icon: "archive",          note: "Closed and set aside." },
};
export const STATUS_ORDER = ["not_started", "ready", "in_progress", "waiting", "approved", "locked", "revision", "archived"];
export const WEIGHT = { approved: 1, archived: 1, waiting: 0.9, in_progress: 0.5, revision: 0.3, ready: 0.05, not_started: 0, locked: 0 };

export const SKILL_DEFS = {
  // Shared strategy root (01–02)
  mla:  { id: "01", name: "Marketing Landscape Analysis",         workshops: 6,  layer: "strategy" },
  bsd:  { id: "02", name: "Brand Strategy Development",           workshops: 15, layer: "strategy" },
  // Organic branch (03–06)
  ocsd: { id: "03", name: "Organic Content Strategy Development", workshops: 14, layer: "strategy" },
  meb:  { id: "04", name: "Monthly Editorial Blueprint",          workshops: 5,  layer: "planning" },
  cd:   { id: "05", name: "Copywriting Development",              workshops: 6,  layer: "content" },
  sbd:  { id: "06", name: "Storyboard Development",               workshops: 6,  layer: "content" },
  // Paid Media branch (03–06)
  pmsd: { id: "03", name: "Paid Media Strategy Development",      workshops: 9,  layer: "strategy" },
  pcbd: { id: "04", name: "Paid Campaign Blueprint Development",  workshops: 10, layer: "planning" },
  acd:  { id: "05", name: "Ad Copy Development",                  workshops: 9,  layer: "content" },
  cbd:  { id: "06", name: "Creative Brief Development",           workshops: 9,  layer: "content" },
};

export const SHARED = ["mla", "bsd"];
export const ORGANIC = ["ocsd", "meb", "cd", "sbd"];
export const PAID = ["pmsd", "pcbd", "acd", "cbd"];
export const ALL_SKILLS = [...SHARED, ...ORGANIC, ...PAID];

export const LAYER_LABEL = { strategy: "Strategy Layer", planning: "Planning Layer", content: "Content Development Layer" };
export const ORG_COLOR = "#5B5BD6";
export const PAID_COLOR = "#E08A1E";

export const LAYERS = [
  { name: "Strategy Layer",            skills: ["mla", "bsd", "ocsd"] },
  { name: "Planning Layer",            skills: ["meb"] },
  { name: "Content Development Layer", skills: ["cd", "sbd"] },
];

export const TYPE_OPTIONS = [["organic", "Organic Only"], ["paid", "Paid Only"], ["both", "Organic + Paid"]];
