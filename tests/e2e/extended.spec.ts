import { test, expect } from "@playwright/test";
import { themes } from "../../lib/themes";
import { entries, projects } from "../../data/profile";
test.use({ reducedMotion: "reduce" });
test("keyboard Tab reaches terminal links and Enter respects the entrance GitHub link", async ({
  page,
}) => {
  await page.goto("/site/");
  await page.getByRole("option", { name: "whoami", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(page.locator(".buffer")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(".buffer a").first()).toBeFocused();
  await page.goto("/");
  await page.locator(".github-link").focus();
  const popup = page.waitForEvent("popup", { timeout: 3000 });
  await page.keyboard.press("Enter");
  await popup;
  await expect(page).toHaveURL(/\/$/);
});
test("Tab enters the buffer from the wheel and gallery arrows work from wheel focus", async ({
  page,
}) => {
  await page.goto("/site/#ai-code-review");
  await page
    .getByRole("option", { name: "AI Code Review", exact: true })
    .focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("button", { name: "Shot 2 of 3" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Tab");
  await expect(page.locator(".buffer")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("option", { name: "AI Code Review", exact: true }),
  ).toBeFocused();
});
test("all destinations and palettes render with no browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/site/");
  for (const entry of [...entries, ...projects.filter((p) => !p.featured)]) {
    await page.evaluate((id) => {
      location.hash = id;
    }, entry.id);
    await expect(page.locator(".buffer")).not.toBeEmpty();
    await expect(page.locator(".winbar")).toContainText(
      entry.id === "about"
        ? "README"
        : projects.find((p) => p.id === entry.id)?.name || entry.id,
    );
  }
  await page.evaluate(() => {
    location.hash = "themes";
  });
  for (const theme of themes) {
    await page.getByRole("button", { name: theme.name, exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme.id);
  }
  expect(errors).toEqual([]);
});
test("history, malformed hash and unavailable storage do not break navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Unavailable", "SecurityError");
      },
    });
  });
  await page.goto("/site/#%E0%A4%A");
  await expect(page).toHaveURL(/#about$/);
  await page.keyboard.press(":");
  await page.keyboard.type("e stack");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#stack$/);
  await page.goBack();
  await expect(page).toHaveURL(/#about$/);
  await page.keyboard.press(":");
  await page.keyboard.type("colo whitegold");
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "whitegold");
});
test("theme cancellation and empty search preserve a usable dialog", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Change theme" });
  await trigger.click();
  await page
    .getByRole("textbox", { name: "Search themes" })
    .fill("no-such-palette");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("textbox", { name: "Search themes" }).fill("white");
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "blackmoney",
  );
  await expect(trigger).toBeFocused();
});
test("mobile pointer drag navigates and drawer closes on selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/site/");
  await page.getByRole("button", { name: "Browse projects" }).click();
  const list = page.getByRole("listbox");
  const box = await list.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + 100, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + 100, box!.y + box!.height / 2 - 85, {
    steps: 10,
  });
  await page.mouse.up();
  await expect(page).toHaveURL(/#voice-agent$/);
  await page.getByRole("option", { name: "Voice Agent", exact: true }).click();
  await expect(list).toBeHidden();
});
test("original project film loads and plays", async ({ page }) => {
  await page.goto("/site/#voice-agent");
  await page.getByRole("button", { name: "Shot 3 of 3" }).click();
  const video = page.locator(".frame video");
  await expect(video).toBeVisible();
  await video.evaluate(async (el: HTMLVideoElement) => {
    await el.play();
  });
  await expect
    .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
    .toBeGreaterThan(0);
  expect(
    await video.evaluate((el: HTMLVideoElement) => el.duration),
  ).toBeGreaterThan(10);
  await page.getByRole("button", { name: "View large" }).click();
  await expect(page.getByRole("dialog").locator("video")).toBeVisible();
  await page.keyboard.press("Escape");
});
test("measured viewport structure, mobile blueprint and assets stay intact", async ({
  page,
}) => {
  for (const width of [1440, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.goto("/site/");
    await expect(page.locator(".blueprint")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    const editor = await page.locator(".editor").boundingBox();
    expect(editor!.y).toBe(78);
    const blueprint = await page.locator(".blueprint").boundingBox();
    expect(blueprint!.height).toBe(width <= 700 ? 240 : 300);
    if (width === 1440) {
      expect(editor!.width).toBe(1008);
      expect(editor!.height).toBe(579);
      expect(Math.round(blueprint!.x)).toBe(461);
    }
  }
});
test("normal motion types commands, rotates slides and reacts to keys", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/site/#ai-code-review");
  await expect(page.locator(".buffer")).toContainText(
    "AI-assisted pull-request",
    { timeout: 6000 },
  );
  await expect(page.locator(".gallery")).toBeVisible({ timeout: 8000 });
  await expect(
    page.getByRole("button", { name: "Shot 2 of 3" }),
  ).toHaveAttribute("aria-pressed", "true", { timeout: 6000 });
  await page.getByRole("button", { name: "Pause slideshow" }).click();
  await expect(
    page.getByRole("button", { name: "Resume slideshow" }),
  ).toBeVisible();
  await page.keyboard.press(":");
  await page.keyboard.type("q");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("link", { name: "Enter portfolio" }),
  ).toBeVisible();
});

test("profile and public projects omit follower and star readouts", async ({
  page,
}) => {
  await page.goto("/site/");
  await expect(page.locator(".buffer")).toContainText("public repositories");
  await expect(page.locator("body")).not.toContainText(/followers|stars|☆/i);
  await page.goto("/site/#Luftborn");
  await expect(page.locator(".buffer")).toContainText("Layered backend");
  await expect(page.locator("body")).not.toContainText(/followers|stars|☆/i);
});

test("eye tracks pointer and terminal with two theme-colored dashed lines", async ({
  page,
}) => {
  await page.goto("/site/#voice-agent");
  const overlay = page.locator(".eye-tracking");
  await expect(overlay.locator("line")).toHaveCount(2);
  await expect(overlay).toBeVisible();
  await page.mouse.move(700, 380);
  await expect
    .poll(() => overlay.locator("line").first().getAttribute("x2"))
    .toBe("700");
  await expect
    .poll(() => overlay.locator("line").first().getAttribute("y2"))
    .toBe("380");
  const cursor = page.locator(".buffer .cursor").last();
  await cursor.scrollIntoViewIfNeeded();
  const rect = await cursor.boundingBox();
  await expect
    .poll(async () =>
      Number(await overlay.locator("line").nth(1).getAttribute("x2")),
    )
    .toBeCloseTo(rect!.x + rect!.width / 2, 0);
  await page.mouse.move(650, 350);
  await expect
    .poll(() => overlay.locator("line").first().getAttribute("x2"))
    .toBe("650");
  await page.keyboard.press(":");
  await page.keyboard.type("colo labra");
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "labra");
  expect(
    await overlay
      .locator("line")
      .first()
      .evaluate((el) => getComputedStyle(el).strokeDasharray),
  ).not.toBe("none");
  await page.getByRole("button", { name: "View large" }).click();
  await expect(overlay).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(overlay).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(overlay).toBeHidden();
});
