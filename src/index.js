import { mkdir, writeFile } from "fs/promises";
import { fetchStats }       from "./fetchStats.js";
import { renderStatsCard }  from "./renderStatsCard.js";
import { renderLangsCard }  from "./renderLangsCard.js";
import { renderStreakCard }  from "./renderStreakCard.js";

const USERNAME = process.env.GH_USERNAME;
const TOKEN    = process.env.GH_TOKEN;

if (!USERNAME) { console.error("❌  GH_USERNAME not set"); process.exit(1); }
if (!TOKEN)    { console.error("❌  GH_TOKEN not set");    process.exit(1); }

console.log(`📡  Fetching stats for @${USERNAME}…`);
const stats = await fetchStats(USERNAME, TOKEN);

console.log(`✅  Done:`);
console.log(`    Commits      : ${stats.totalCommits}`);
console.log(`    Stars        : ${stats.totalStars}`);
console.log(`    PRs merged   : ${stats.totalPRs}`);
console.log(`    Issues       : ${stats.totalIssues}`);
console.log(`    Followers    : ${stats.followers}`);
console.log(`    Streak now   : ${stats.currentStreak} days`);
console.log(`    Streak best  : ${stats.longestStreak} days`);
console.log(`    Contributions: ${stats.totalContributions} (last year)`);

await mkdir("profile", { recursive: true });

await writeFile("profile/stats.svg",  renderStatsCard(stats),          "utf8");
await writeFile("profile/langs.svg",  renderLangsCard(stats.languages), "utf8");
await writeFile("profile/streak.svg", renderStreakCard(stats),          "utf8");

console.log("🎨  SVGs saved → profile/");
