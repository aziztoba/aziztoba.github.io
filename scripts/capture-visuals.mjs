import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const target = process.env.TEST_URL || "http://127.0.0.1:3000";
const dir = "docs/qa";
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const rows = [];
for (const [name, width, height, refPath, ownPath] of [
  ["desktop-about", 1440, 900, "/site/#about", "/site/#about"],
  ["desktop-entrance", 1440, 900, "/", "/"],
  ["desktop-project", 1440, 900, "/site/#Shibumi-Shell", "/site/#voice-agent"],
  ["desktop-themes", 1440, 900, "/site/#themes", "/site/#themes"],
  ["mobile-about", 390, 844, "/site/#about", "/site/#about"],
  ["mobile-entrance", 390, 844, "/", "/"],
  ["narrow-about", 360, 844, "/site/#about", "/site/#about"],
  ["tablet-about", 768, 844, "/site/#about", "/site/#about"],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: "reduce",
  });
  const ref = await context.newPage(),
    own = await context.newPage();
  await Promise.all([
    ref.goto(`https://hancore.dev${refPath}`),
    own.goto(`${target}${ownPath}`),
  ]);
  await Promise.all([ref.waitForTimeout(600), own.waitForTimeout(600)]);
  await Promise.all([
    ref.screenshot({ path: `${dir}/${name}-reference.png` }),
    own.screenshot({ path: `${dir}/${name}-portfolio.png` }),
  ]);
  rows.push({
    name,
    width,
    height,
    editor: await own
      .locator(".editor")
      .evaluateAll((es) => es.map((e) => e.getBoundingClientRect().toJSON())),
  });
  if (name === "mobile-about") {
    await own.getByRole("button", { name: "Browse projects" }).click();
    await own.screenshot({ path: `${dir}/mobile-menu-portfolio.png` });
  }
  await context.close();
}
await browser.close();
await writeFile(
  `${dir}/measurements.json`,
  JSON.stringify(rows, null, 2) + "\n",
);
await writeFile(
  `${dir}/comparison.html`,
  `<!doctype html><meta charset="utf-8"><title>Reference comparison</title><style>body{background:#222;color:#ddd;font:14px monospace;margin:24px}section{margin-bottom:40px}.pair{display:flex;gap:12px}.pair figure{margin:0;flex:1;min-width:0}img{width:100%;height:auto}figcaption{padding:8px}</style><h1>Matching viewport comparisons</h1><p>Left: live reference. Right: original personalized implementation. Reduced motion; personal content and graphics intentionally differ.</p>${rows.map((r) => `<section><h2>${r.name} · ${r.width} × ${r.height}</h2><div class="pair"><figure><img src="${r.name}-reference.png"><figcaption>hancore.dev</figcaption></figure><figure><img src="${r.name}-portfolio.png"><figcaption>Abdulaziz Toba</figcaption></figure></div></section>`).join("")}`,
);
console.log(
  `Saved ${rows.length} matched reference/portfolio pairs and comparison.html`,
);
