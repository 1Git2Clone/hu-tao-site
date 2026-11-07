import { expect, test } from "@playwright/test";
import { useArtFallback } from "./art-fallback";

test.beforeEach(({ page }) => useArtFallback(page));

// Back while the next page is still being put in place (its page change has
// not finished) must show the page the URL names, with no router errors.
for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`Back during a page change shows the page in the URL (${reducedMotion})`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.emulateMedia({ reducedMotion });
    await page.goto("/blogs");
    const search = page.getByPlaceholder("Search posts...");
    const infraTitle = page.getByRole("heading", {
      level: 1,
      name: /Infrastructure/,
    });
    await expect(search).toBeVisible();

    await page
      .locator("header")
      .getByRole("link", { name: "/infra", exact: true })
      .filter({ visible: true })
      .click();
    // The history entry exists; the page change may still be running.
    await expect(page).toHaveURL(/\/infra$/);
    await page.goBack();

    await expect(page).toHaveURL(/\/blogs$/);
    await expect(search).toBeVisible();
    await expect(infraTitle).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
