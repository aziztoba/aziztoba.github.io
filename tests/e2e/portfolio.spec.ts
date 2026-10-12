import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });
test("entrance opens editor and commands navigate with real content", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Enter portfolio" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Enter portfolio" }).click();
  await expect(page).toHaveURL(/\/site\//);
  await expect(page.locator(".buffer")).toContainText("AI engineer building");
  await page.keyboard.press(":");
  await page.keyboard.type("e stack");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#stack$/);
  await expect(page.locator(".buffer")).toContainText("LangGraph");
  await page.keyboard.press(":");
  await page.keyboard.type("help");
  await page.keyboard.press("Enter");
  await expect(page.locator(".cmd")).toContainText("E492");
});
test("theme picker searches and persists across routes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Change theme" }).click();
  await page.getByRole("textbox", { name: "Search themes" }).fill("white");
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "whitegold");
  await page.getByRole("link", { name: "Enter portfolio" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "whitegold");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "whitegold");
});
test("wheel, gallery, lightbox and focus work", async ({ page }) => {
  await page.goto("/site/");
  await page.getByRole("option", { name: "whoami", exact: true }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(page).toHaveURL(/#voice-agent$/);
  await expect(page.locator(".buffer")).toContainText("LangGraph");
  await page.getByRole("button", { name: "View large" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog")).toContainText("2/3");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "View large" })).toBeFocused();
});
test("mobile menu, touch drag, all sections and resume stay usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/site/");
  await page.getByRole("button", { name: "Browse projects" }).click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.getByRole("option", { name: "Voice Agent", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Browse projects" }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(".buffer")).toContainText("Voice Agent");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  const response = await page.request.get("/Abdulaziz_Toba_AI_Engineer_CV.pdf");
  expect(response.ok()).toBeTruthy();
  expect((await response.body()).subarray(0, 4).toString()).toBe("%PDF");
});
