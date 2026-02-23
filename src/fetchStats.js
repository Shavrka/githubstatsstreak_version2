const GITHUB_GRAPHQL = "https://api.github.com/graphql";

async function gql(query, variables, token) {
  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "github-stats-cards",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL: ${json.errors.map((e) => e.message).join(", ")}`);
  }
  return json.data;
}

// Fetch commits for a single calendar year.
// totalCommitContributions      = commits on public repos
// restrictedContributionsCount  = commits on private repos (only visible with own PAT)
async function commitsForYear(username, year, token) {
  const from = `${year}-01-01T00:00:00Z`;
  const to   = `${year}-12-31T23:59:59Z`;
  const data = await gql(
    `query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          restrictedContributionsCount
        }
      }
    }`,
    { login: username, from, to },
    token
  );
  const c = data.user.contributionsCollection;
  return c.totalCommitContributions + c.restrictedContributionsCount;
}

export async function fetchStats(username, token) {
  // ── Main query ──────────────────────────────────────────────────────────────
  const data = await gql(
    `query($login: String!) {
      user(login: $login) {
        name
        login
        createdAt
        followers { totalCount }
        repositories(
          ownerAffiliations: OWNER
          isFork: false
          first: 100
          orderBy: { field: UPDATED_AT, direction: DESC }
        ) {
          nodes {
            stargazerCount
            languages(first: 15, orderBy: { field: SIZE, direction: DESC }) {
              edges {
                size
                node { name color }
              }
            }
          }
        }
        pullRequests(states: MERGED) { totalCount }
        issues(states: OPEN)         { totalCount }
        contributionsCollection {
          totalCommitContributions
          restrictedContributionsCount
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }`,
    { login: username },
    token
  );

  const user = data.user;

  // ── All-time commits: query every year since account creation ───────────────
  const accountYear = new Date(user.createdAt).getFullYear();
  const currentYear = new Date().getFullYear();

  const years = [];
  for (let y = accountYear; y <= currentYear; y++) years.push(y);

  const perYear = await Promise.all(years.map((y) => commitsForYear(username, y, token)));
  const totalCommits = perYear.reduce((a, b) => a + b, 0);

  // ── Stars ───────────────────────────────────────────────────────────────────
  const totalStars = user.repositories.nodes.reduce((a, r) => a + r.stargazerCount, 0);

  // ── Language stats ──────────────────────────────────────────────────────────
  const langMap = {};
  for (const repo of user.repositories.nodes) {
    for (const edge of repo.languages.edges) {
      const { name, color } = edge.node;
      if (!langMap[name]) langMap[name] = { size: 0, color: color || "#858585" };
      langMap[name].size += edge.size;
    }
  }

  const sorted = Object.entries(langMap)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 10);

  const totalSize = sorted.reduce((a, [, v]) => a + v.size, 0);

  const languages = sorted.map(([name, { size, color }]) => ({
    name,
    color,
    size,
    percentage: +((size / totalSize) * 100).toFixed(1),
  }));

  // ── Streak (contribution calendar covers last ~1 year) ───────────────────────
  const days = user.contributionsCollection.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => (a.date > b.date ? -1 : 1)); // newest first

  const today = new Date().toISOString().split("T")[0];
  let current = 0, longest = 0, temp = 0, broken = false;

  for (const d of days) {
    if (d.contributionCount > 0) {
      temp++;
      if (!broken) current = temp;
      if (temp > longest) longest = temp;
    } else {
      if (d.date === today) continue; // today may not be over yet
      broken = true;
      temp = 0;
    }
  }

  return {
    name:               user.name || user.login,
    login:              user.login,
    totalCommits,
    totalStars,
    totalPRs:           user.pullRequests.totalCount,
    totalIssues:        user.issues.totalCount,
    followers:          user.followers.totalCount,
    currentStreak:      current,
    longestStreak:      longest,
    totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
    languages,
  };
}
