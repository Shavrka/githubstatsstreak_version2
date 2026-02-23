import { icon } from "./icons.js";

// ── Midnight-purple colour palette ───────────────────────────────────────────
const C = {
  bg:     "#141321",
  border: "#6e6e6e",
  title:  "#9f4bff",
  text:   "#a9fef7",
  muted:  "#8983a6",
  accent: "#fd428d",
};

const FONT = "'Segoe UI', Ubuntu, 'Helvetica Neue', Sans-Serif";

function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderStreakCard(stats) {
  const { login, currentStreak, longestStreak, totalContributions } = stats;

  const W = 495, H = 155;
  const third = W / 3;

  const cols = [
    { icon: "calendar", value: totalContributions.toLocaleString(), label: "Total Contributions", color: C.text   },
    { icon: "fire",     value: `${currentStreak} days`,             label: "Current Streak",      color: C.accent },
    { icon: "fire",     value: `${longestStreak} days`,             label: "Longest Streak",      color: C.title  },
  ];

  const midY = H / 2;

  const colsSVG = cols.map((col, i) => {
    const cx = third * i + third / 2;
    const divider = i > 0
      ? `<line x1="${third * i}" y1="20" x2="${third * i}" y2="${H - 20}" stroke="${C.border}" stroke-width="1"/>`
      : "";
    return `
  ${divider}
  ${icon(col.icon, col.color, cx - 8, 28)}
  <text x="${cx}" y="${midY + 8}" fill="${col.color}" font-size="21" font-weight="bold" text-anchor="middle" font-family="${FONT}">${esc(col.value)}</text>
  <text x="${cx}" y="${midY + 26}" fill="${C.muted}" font-size="11" text-anchor="middle" font-family="${FONT}">${esc(col.label)}</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <style>
    .fade { animation: fadeIn .8s ease both }
    @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  </style>

  <rect x=".5" y=".5" width="${W-1}" height="${H-1}" rx="4.5" fill="${C.bg}" stroke="${C.border}"/>

  <text class="fade" x="${W/2}" y="16" fill="${C.title}" font-size="13" text-anchor="middle" font-family="${FONT}">${esc(login)}'s GitHub Streak</text>

  <g class="fade">${colsSVG}
  </g>
</svg>`;
}
