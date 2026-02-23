// ── Midnight-purple colour palette ───────────────────────────────────────────
const C = {
  bg:     "#141321",
  border: "#6e6e6e",
  title:  "#9f4bff",
  text:   "#a9fef7",
  muted:  "#8983a6",
};

const FONT = "'Segoe UI', Ubuntu, 'Helvetica Neue', Sans-Serif";

function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderLangsCard(languages) {
  if (!languages?.length) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="60">
      <rect width="300" height="60" rx="4.5" fill="${C.bg}" stroke="${C.border}"/>
      <text x="15" y="36" fill="${C.text}" font-size="13" font-family="${FONT}">No language data.</text>
    </svg>`;
  }

  const W = 300, PAD = 25;
  const BAR_Y = 55, BAR_H = 8;
  const LIST_Y = BAR_Y + BAR_H + 18;
  const ROW_H = 24;
  const H = LIST_Y + languages.length * ROW_H + PAD;
  const barW = W - PAD * 2;

  // Progress bar segments
  let bx = PAD;
  const segments = languages.map((lang) => {
    const sw = (lang.percentage / 100) * barW;
    const seg = `<rect x="${bx.toFixed(2)}" y="${BAR_Y}" width="${sw.toFixed(2)}" height="${BAR_H}" fill="${esc(lang.color)}"/>`;
    bx += sw;
    return seg;
  });

  const barSVG = `
  <clipPath id="bc"><rect x="${PAD}" y="${BAR_Y}" width="${barW}" height="${BAR_H}" rx="${BAR_H / 2}"/></clipPath>
  <g clip-path="url(#bc)">${segments.join("")}</g>`;

  const rowsSVG = languages.map((lang, i) => {
    const y = LIST_Y + i * ROW_H;
    return `
  <g transform="translate(${PAD},${y})">
    <circle cx="5" cy="6" r="5" fill="${esc(lang.color)}"/>
    <text x="16" y="11" fill="${C.text}" font-size="11" font-family="${FONT}">${esc(lang.name)}</text>
    <text x="${barW}" y="11" fill="${C.muted}" font-size="11" text-anchor="end" font-family="${FONT}">${lang.percentage}%</text>
  </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <style>
    .fade { animation: fadeIn .8s ease both }
    @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  </style>

  <rect x=".5" y=".5" width="${W-1}" height="${H-1}" rx="4.5" fill="${C.bg}" stroke="${C.border}"/>

  <text class="fade" x="${PAD}" y="35" fill="${C.title}" font-size="17" font-weight="bold" font-family="${FONT}">Most Used Languages</text>

  <g class="fade">${barSVG}${rowsSVG}
  </g>
</svg>`;
}
