import { test, expect } from "@playwright/test";

test("right hand follows mouse activity, shows clicks, and returns to typing", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.goto("/site/#stack");
  await expect(page.locator(".agent-status")).toContainText("idle", {
    timeout: 10000,
  });
  await page.clock.pauseAt(new Date("2026-01-01T00:01:00Z"));
  const desk = page.locator(".editor-desk canvas");
  const ink = () =>
    desk.evaluate((element) => {
      const canvas = element as HTMLCanvasElement;
      // Mouse/hand area to the right of the keyboard, excluding telemetry labels.
      const pixels = canvas
        .getContext("2d")!
        .getImageData(
          canvas.width * 0.7,
          canvas.height * 0.22,
          canvas.width * 0.16,
          canvas.height * 0.72,
        ).data;
      return Array.from(pixels).filter((alpha, i) => i % 4 === 3 && alpha > 30)
        .length;
    });
  await page.keyboard.press("Shift");
  await page.clock.runFor(1000);
  const keyboardInk = await ink();
  await page.mouse.move(1200, 820);
  await page.clock.runFor(1000);
  const mouseInk = await ink();
  expect(mouseInk).toBeGreaterThan(keyboardInk + 100);
  await page.mouse.down();
  await page.clock.runFor(250);
  expect(await ink()).toBeGreaterThan(mouseInk);
  await page.mouse.up();
  await page.keyboard.press("Shift");
  await page.clock.runFor(1000);
  expect(await ink()).toBeLessThan(mouseInk);
});
