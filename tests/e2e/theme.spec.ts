import { expect, test } from "@playwright/test";
import { useArtFallback } from "./art-fallback";

test.beforeEach(async ({ page }) => useArtFallback(page));

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`theme toggles both ways and survives rapid input (${reducedMotion})`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.emulateMedia({ reducedMotion, colorScheme: "light" });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Toggle theme" });
    const icons = toggle.locator("span > span");
    const dark = () =>
      page.evaluate(() => document.documentElement.classList.contains("dark"));
    await expect.poll(dark).toBe(false);
    await toggle.click();
    await expect.poll(dark).toBe(true);
    await expect
      .poll(() =>
        icons.evaluateAll((nodes) =>
          nodes.map((node) => getComputedStyle(node).opacity),
        ),
      )
      .toEqual(["0", "1"]);
    expect(errors).toEqual([]);
    await toggle.click();
    await expect.poll(dark).toBe(false);
    // Dispatch within the same frame to exercise overlapping transition callbacks.
    await toggle.evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
      button.click();
    });
    await expect.poll(dark).toBe(true);
    await expect(page.locator("html")).not.toHaveClass(/theme-ripple/);
    await expect
      .poll(() =>
        icons.evaluateAll((nodes) =>
          nodes.map((node) => getComputedStyle(node).opacity),
        ),
      )
      .toEqual(["0", "1"]);
    expect(errors).toEqual([]);
  });
}
