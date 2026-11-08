import { expect, test } from "@playwright/test";
import { useArtFallback } from "./art-fallback";

test.beforeEach(async ({ page }) => useArtFallback(page));

test("phone title stays centred and the menu opens, closes and follows links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const title = page.getByRole("link", { name: "Skip to main content" });
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  const panel = page.locator("header div[inert]");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toHaveCount(1);
  const box = await title.boundingBox();
  const width = await page
    .locator("header")
    .evaluate((header) => header.getBoundingClientRect().width);
  expect(Math.abs(box!.x + box!.width / 2 - width / 2)).toBeLessThan(1);
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toHaveCount(0);
  const lines = menu.locator("span > span");
  await expect
    .poll(() =>
      lines.evaluateAll((nodes) =>
        nodes.map((node) => getComputedStyle(node).rotate),
      ),
    )
    .toEqual(["45deg", "-45deg"]);
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page
    .locator("header")
    .getByRole("link", { name: "/blogs", exact: true })
    .filter({ visible: true })
    .click();
  await expect(page).toHaveURL(/\/blogs$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("desktop header shows navigation beside the title", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Menu", exact: true }),
  ).toBeHidden();
  const title = await page
    .getByRole("link", { name: "Skip to main content" })
    .boundingBox();
  const blogs = await page
    .locator("header")
    .getByRole("link", { name: "/blogs", exact: true })
    .filter({ visible: true })
    .boundingBox();
  const theme = await page
    .getByRole("button", { name: "Toggle theme" })
    .boundingBox();
  expect(title!.x + title!.width).toBeLessThan(blogs!.x);
  expect(blogs!.x + blogs!.width).toBeLessThan(theme!.x);
});

test("a mobile link closes a reopened menu while another navigation is loading", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/blogs");
  const pending = Promise.withResolvers<void>();
  const requested = Promise.withResolvers<void>();
  await page.route("**/infra/__data.json*", async (route) => {
    requested.resolve();
    await pending.promise;
    await route.continue();
  });
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  try {
    await menu.click();
    await page
      .locator("header")
      .getByRole("link", { name: "/infra", exact: true })
      .filter({ visible: true })
      .evaluate((node: HTMLAnchorElement) => node.click());
    await requested.promise;
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await menu.click();
    await page
      .locator("header")
      .getByRole("link", { name: "/blogs", exact: true })
      .filter({ visible: true })
      .click();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  } finally {
    pending.resolve();
  }
});
