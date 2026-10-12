import { test, expect } from "@playwright/test";

for (const input of ["click", "keyboard"] as const) {
  test(`${input} plays the radial entrance before opening the portfolio`, async ({
    page,
  }) => {
    await page.goto("/");
    await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
    await page.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
    if (input === "click")
      await page.getByRole("link", { name: "Enter portfolio" }).click();
    else await page.keyboard.press("Enter");
    const canvas = page.locator(".entrance-transition");
    await expect(canvas).toBeVisible();
    await page.clock.runFor(1600);
    await expect(page).not.toHaveURL(/\/site\//);
    const pixels = await canvas.evaluate((element) => {
      const canvas = element as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      const center = Array.from(
        ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data,
      );
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let bright = 0;
      for (let i = 0; i < data.length; i += 4)
        if (data[i] > 90 && data[i + 3] > 200) bright++;
      return { center, bright };
    });
    expect(pixels.center).toEqual([0, 0, 0, 255]);
    expect(pixels.bright).toBeGreaterThan(1000);
    await page.clock.runFor(1600);
    await expect(page).toHaveURL(/\/site\//);
    await expect(page.locator(".buffer")).toContainText("AI engineer building");
  });
}

test("mobile entrance fills the viewport and tolerates repeated Enter", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
  await page.getByRole("link", { name: "Enter portfolio" }).click();
  await page.keyboard.press("Enter");
  await page.clock.runFor(1400);
  await expect(page.locator(".entrance-transition")).toHaveCount(1);
  const box = await page.locator(".entrance-transition").boundingBox();
  expect(box).toEqual({ x: 0, y: 0, width: 390, height: 844 });
  await page.clock.runFor(1800);
  await expect(page).toHaveURL(/\/site\//);
});

test("reduced motion bypasses the entrance effect", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Enter portfolio" }).click();
  await expect(page).toHaveURL(/\/site\//);
  await expect(page.locator(".entrance-transition")).toHaveCount(0);
});
