import { writeFile, rename } from "node:fs/promises";
const headers = {
  "User-Agent": "aziztoba-portfolio",
  Accept: "application/vnd.github+json",
};
async function get(path) {
  const response = await fetch(`https://api.github.com/${path}`, {
    headers,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  return response.json();
}
const [user, repositories] = await Promise.all([
  get("users/aziztoba"),
  get("users/aziztoba/repos?per_page=100&sort=updated"),
]);
if (
  user.login !== "aziztoba" ||
  !Array.isArray(repositories) ||
  repositories.length !== user.public_repos
)
  throw new Error("Incomplete or invalid GitHub snapshot; keeping prior data");
const repos = repositories.map((r) => ({
  name: r.name,
  description: r.description || "",
  language: r.language,
  url: r.html_url,
  stars: r.stargazers_count,
  forks: r.forks_count,
  isFork: r.fork,
  pushedAt: r.pushed_at,
  createdAt: r.created_at,
}));
if (
  repos.some(
    (r) =>
      !r.url.startsWith("https://github.com/aziztoba/") ||
      !Number.isInteger(r.stars),
  )
)
  throw new Error("Invalid repository metadata");
const languages = {};
for (const r of repos)
  if (!r.isFork && r.language)
    languages[r.language] = (languages[r.language] || 0) + 1;
let contributions = [];
try {
  const response = await fetch(
    "https://github.com/users/aziztoba/contributions",
    { signal: AbortSignal.timeout(15000) },
  );
  if (response.ok) {
    const html = await response.text();
    const cells = [...html.matchAll(/<td\b([^>]*data-date="[^"]+"[^>]*)>/g)];
    contributions = cells.flatMap(([, attrs]) => {
      const date = attrs.match(/data-date="([^"]+)"/)?.[1],
        id = attrs.match(/id="([^"]+)"/)?.[1],
        level = Number(attrs.match(/data-level="(\d)"/)?.[1] || 0);
      if (!date || !id) return [];
      const tooltip =
        html
          .match(new RegExp(`for="${id}"[^>]*>([\\s\\S]*?)<\\/tool-tip>`))?.[1]
          ?.replace(/<[^>]+>/g, "")
          .trim() || "";
      const match = tooltip.match(/(\d[\d,]*) contributions?/i);
      const count = match
        ? Number(match[1].replaceAll(",", ""))
        : /No contributions/i.test(tooltip)
          ? 0
          : null;
      return [{ date, level, count }];
    });
  }
} catch {
  console.warn(
    "Contribution calendar unavailable; repository metrics remain verified.",
  );
}
contributions.sort((a, b) => a.date.localeCompare(b.date));
const data = {
  login: user.login,
  followers: user.followers,
  publicRepos: user.public_repos,
  stars: repos.filter((r) => !r.isFork).reduce((n, r) => n + r.stars, 0),
  fetchedAt: new Date().toISOString(),
  languages,
  repos,
  contributions,
};
await writeFile("data/github.json.tmp", JSON.stringify(data, null, 2) + "\n");
await rename("data/github.json.tmp", "data/github.json");
console.log(
  `Verified ${repos.length} public repositories; ${contributions.length} calendar days.`,
);
