import { expect, test } from "@playwright/test";
import { useArtFallback } from "./art-fallback";

test.beforeEach(async ({ page }) => useArtFallback(page));

test("page view transitions run only when motion is allowed", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = document.startViewTransition.bind(document);
    document.startViewTransition = ((
      callback: ViewTransitionUpdateCallback,
    ) => {
      document.documentElement.dataset.transitions = String(
        Number(document.documentElement.dataset.transitions || 0) + 1,
      );
      return original(callback);
    }) as typeof document.startViewTransition;
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page
    .locator("header")
    .getByRole("link", { name: "/blogs", exact: true })
    .filter({ visible: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-transitions", "1");
  await page.getByPlaceholder("Search posts...").fill("big");
  await expect(page).toHaveURL(/q=big/);
  await expect(page.locator("html")).toHaveAttribute("data-transitions", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page
    .locator("header")
    .getByRole("link", { name: "/infra", exact: true })
    .filter({ visible: true })
    .click();
  await expect(page).toHaveURL(/\/infra$/);
  await expect(page.locator("html")).toHaveAttribute("data-transitions", "1");
});
