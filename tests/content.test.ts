import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { projects, profile, experience } from "../data/profile.ts";
import { themes } from "../lib/themes.ts";
test("public content includes all themes, four highlights and no phone or inflated chronology", () => {
  assert.equal(themes.length, 28);
  assert.equal(new Set(themes.map((t) => t.id)).size, 28);
  assert.equal(projects.filter((p) => p.featured).length, 4);
  assert.equal(profile.name, "Abdulaziz Toba");
  const text = JSON.stringify({ profile, projects, experience });
  assert.doesNotMatch(
    text,
    /\+20[\d\s-]{9,}|8\+ years|gitlab\.invento|https?:\/\/10\./i,
  );
  assert.doesNotMatch(experience[2].description, /\.NET 8/);
});
test("GitHub data is a dated authentic snapshot, including zero counts", () => {
  let data;
  try {
    data = JSON.parse(readFileSync("data/github.json", "utf8"));
  } catch {}
  assert.ok(data, "GitHub snapshot has not been fetched");
  assert.equal(data.login, "aziztoba");
  assert.ok(Date.parse(data.fetchedAt));
  assert.ok(Number.isInteger(data.followers));
  assert.ok(
    data.repos.every(
      (r: { stars: number; url: string }) =>
        Number.isInteger(r.stars) &&
        r.url.startsWith("https://github.com/aziztoba/"),
    ),
  );
});
test("contribution calendar is chronological so columns are weeks and footer uses recent days", () => {
  const data = JSON.parse(readFileSync("data/github.json", "utf8"));
  const dates = data.contributions.map((d: { date: string }) => d.date);
  assert.deepEqual(dates, [...dates].sort());
  assert.equal(new Set(dates).size, dates.length);
});
