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
    await page.goto("/blogs?q=big");
    const search = page.getByPlaceholder("Search posts...");
    const infraTitle = page.getByRole("heading", {
      level: 1,
      name: /Infrastructure/,
    });
    await expect(search).toBeVisible();
    // Back must restore this URL query through the reactive page state.
    await search.fill("held-draft");

    if (reducedMotion === "no-preference") {
      await page.evaluate(() => {
        const original = document.startViewTransition.bind(document);
        document.startViewTransition = ((
          callback: ViewTransitionUpdateCallback,
        ) => {
          const held = Promise.withResolvers<void>();
          document.addEventListener(
            "release-transition",
            () => held.resolve(),
            { once: true },
          );
          return original(async () => {
            document.documentElement.dataset.transitionHeld = "true";
            await held.promise;
            await callback();
            document.documentElement.dataset.transitionReleased = "true";
          });
        }) as typeof document.startViewTransition;
      });
    }

    await page
      .locator("header")
      .getByRole("link", { name: "/infra", exact: true })
      .filter({ visible: true })
      .evaluate((node: HTMLAnchorElement) => node.click());
    // The history entry exists; the page change may still be running.
    await expect(page).toHaveURL(/\/infra$/);
    if (reducedMotion === "no-preference")
      await expect(page.locator("html")).toHaveAttribute(
        "data-transition-held",
        "true",
      );
    await page.goBack();

    await expect(page).toHaveURL(/\/blogs\?q=big$/);
    // The draft resets only after Back commits through onNavigate.
    await expect(search).toHaveValue("big");
    if (reducedMotion === "no-preference") {
      await page.evaluate(() =>
        document.dispatchEvent(new Event("release-transition")),
      );
      await expect(page.locator("html")).toHaveAttribute(
        "data-transition-released",
        "true",
      );
    }
    await expect(search).toBeVisible();
    await expect(infraTitle).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
