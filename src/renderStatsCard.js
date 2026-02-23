import { icon } from "./icons.js";

// ── Midnight-purple colour palette ───────────────────────────────────────────
const C = {
  bg:      "#141321",
  border:  "#6e6e6e",
  title:   "#9f4bff",
  icon:    "#9f4bff",
  text:    "#a9fef7",
  muted:   "#8983a6",
  ring:    "#9f4bff",
  accent:  "#fd428d",
};

const FONT = "'Segoe UI', Ubuntu, 'Helvetica Neue', Sans-Serif";

function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "k";
  return String(n);
}

function rank(stats) {
  const score =
    stats.totalCommits * 2 +
    stats.totalPRs     * 3 +
    stats.totalIssues  * 1 +
    stats.totalStars   * 4 +
    stats.followers    * 1;

  if (score >= 5000) return { label: "S",  pct: 1 };
  if (score >= 2000) return { label: "A+", pct: 12.5 };
  if (score >= 1000) return { label: "A",  pct: 25 };
  if (score >= 500)  return { label: "A-", pct: 37.5 };
  if (score >= 200)  return { label: "B+", pct: 50 };
  if (score >= 100)  return { label: "B",  pct: 62.5 };
  if (score >= 50)   return { label: "B-", pct: 75 };
  if (score >= 20)   return { label: "C+", pct: 87.5 };
  return               { label: "C",  pct: 100 };
}

export function renderStatsCard(stats) {
  const { name, totalCommits, totalStars, totalPRs, totalIssues, followers } = stats;
  const r = rank(stats);

  const rows = [
    { icon: "commit",    label: "Total Commits (all time)", value: fmt(totalCommits) },
    { icon: "star",      label: "Total Stars Earned",       value: fmt(totalStars)   },
    { icon: "pr",        label: "Total PRs Merged",         value: fmt(totalPRs)     },
    { icon: "issue",     label: "Total Issues",             value: fmt(totalIssues)  },
    { icon: "followers", label: "Followers",                value: fmt(followers)    },
  ];

  const W = 495, PAD = 25;
  const ROW_H = 28, LIST_Y = 60;
  const H = LIST_Y + rows.length * ROW_H + 20;

  // Rank ring
  const RX = 440, RY = H / 2 - 5, RR = 38;
  const CIRC = 2 * Math.PI * RR;
  const filled = CIRC * (1 - r.pct / 100);

  const rowsSVG = rows.map((row, i) => {
    const y = LIST_Y + i * ROW_H;
    return `
  <g transform="translate(0,${y})">
    ${icon(row.icon, C.icon, PAD, 0)}
    <text x="${PAD + 23}" y="12" fill="${C.text}" font-size="13" font-family="${FONT}">${esc(row.label)}</text>
    <text x="370" y="12" fill="${C.text}" font-size="13" font-weight="bold" text-anchor="end" font-family="${FONT}">${esc(row.value)}</text>
  </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <style>
    .fade { animation: fadeIn .8s ease both }
    @keyframes fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }
    .ring { animation: ring 1s ease both }
    @keyframes ring {
      from { stroke-dashoffset:${CIRC.toFixed(1)} }
      to   { stroke-dashoffset:${filled.toFixed(1)} }
    }
  </style>

  <rect x=".5" y=".5" width="${W-1}" height="${H-1}" rx="4.5" fill="${C.bg}" stroke="${C.border}"/>

  <text class="fade" x="${PAD}" y="38" fill="${C.title}" font-size="17" font-weight="bold" font-family="${FONT}">${esc(name)}'s GitHub Stats</text>

  <g class="fade">${rowsSVG}
  </g>

  <!-- rank ring track -->
  <circle cx="${RX}" cy="${RY}" r="${RR}" fill="none" stroke="${C.muted}" stroke-width="5" opacity=".3"/>
  <!-- rank ring fill -->
  <circle class="ring" cx="${RX}" cy="${RY}" r="${RR}"
    fill="none" stroke="${C.ring}" stroke-width="5"
    stroke-dasharray="${CIRC.toFixed(1)}" stroke-dashoffset="${CIRC.toFixed(1)}"
    stroke-linecap="round" transform="rotate(-90,${RX},${RY})"/>

  <text x="${RX}" y="${RY+6}" fill="${C.title}" font-size="20" font-weight="bold" text-anchor="middle" font-family="${FONT}">${esc(r.label)}</text>
  <text x="${RX}" y="${RY+22}" fill="${C.muted}" font-size="11" text-anchor="middle" font-family="${FONT}">Rank</text>
</svg>`;
}
