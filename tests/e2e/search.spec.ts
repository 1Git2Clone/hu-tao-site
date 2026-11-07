import { expect, test } from "@playwright/test";
import { useArtFallback } from "./art-fallback";

test.beforeEach(async ({ page }) => useArtFallback(page));

test("search count collapses, removed cards leave, and browser history restores the query", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/blogs");
  const historyLength = await page.evaluate(() => history.length);
  const input = page.getByPlaceholder("Search posts...");
  const count = page.locator("#search-results").locator("..").locator("..");
  await expect
    .poll(() => count.evaluate((node) => node.getBoundingClientRect().height))
    .toBe(0);
  await input.fill("big");
  await expect(page).toHaveURL(/q=big/);
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
  await expect
    .poll(() => count.evaluate((node) => node.getBoundingClientRect().height))
    .toBeGreaterThan(0);
  await expect(page.locator("section.row-start-2 h2")).toHaveCount(1);
  await input.fill("zzzznomatchzzzz");
  await expect(page.getByText(/No posts found matching/)).toBeVisible();
  await expect(page.locator("section.row-start-2 h2")).toHaveCount(0);
  await expect
    .poll(() => count.evaluate((node) => node.getBoundingClientRect().height))
    .toBe(0);
  await input.fill("big");
  await expect(page).toHaveURL(/q=big/);
  await page
    .locator("header")
    .getByRole("link", { name: "/infra", exact: true })
    .filter({ visible: true })
    .click();
  await expect(page).toHaveURL(/\/infra$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/blogs\?q=big/);
  await expect(input).toHaveValue("big");
  await page.goForward();
  await expect(page).toHaveURL(/\/infra$/);
});

for (const value of ["garbage", "-2", "2x", "999", "Infinity"]) {
  test(`invalid or out-of-range page still shows results: ${value}`, async ({
    page,
  }) => {
    await page.goto(`/blogs?page=${value}`);
    await expect(page.locator("section.row-start-2 h2")).toHaveCount(1);
  });
}

test("search keeps keyboard focus across its URL updates", async ({ page }) => {
  await page.goto("/blogs");
  const input = page.getByPlaceholder("Search posts...");
  await input.click();
  await page.keyboard.type("bi");
  await expect(page).toHaveURL(/q=bi/);
  await expect(input).toBeFocused();
  await page.keyboard.type("g");
  await expect(input).toHaveValue("big");
  await expect(page).toHaveURL(/q=big/);
});
