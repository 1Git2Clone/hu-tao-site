import { expect, test, type Page } from "@playwright/test";
import { useArtFallback } from "./art-fallback";

test.beforeEach(({ page }) => useArtFallback(page));

// The phone menu lives in the header, which stays mounted across pages.
async function phone(page: Page, path: string) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(path);
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  const panel = page.locator("header div[inert]");
  const link = (name: string) =>
    page
      .locator("header")
      .getByRole("link", { name, exact: true })
      .filter({ visible: true });
  async function open() {
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toHaveCount(0);
  }
  async function expectClosed() {
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toHaveCount(1);
  }
  return { menu, link, open, expectClosed };
}

test("Escape from a menu link closes the menu and keeps focus on the button", async ({
  page,
}) => {
  const { menu, link, open, expectClosed } = await phone(page, "/");
  await open();
  await link("/infra").focus();
  await expect(link("/infra")).toBeFocused();
  await page.keyboard.press("Escape");
  await expectClosed();
  await expect(menu).toBeFocused();
});

test("Escape with the menu closed leaves focus alone", async ({ page }) => {
  const { expectClosed } = await phone(page, "/");
  const theme = page.getByRole("button", { name: "Toggle theme" });
  await theme.focus();
  await page.keyboard.press("Escape");
  await expectClosed();
  await expect(theme).toBeFocused();
});

test("the title link closes an open menu", async ({ page }) => {
  const { open, expectClosed } = await phone(page, "/blogs");
  await open();
  await page.getByRole("link", { name: "Skip to main content" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expectClosed();
});

test("back and forward close an open menu", async ({ page }) => {
  const { link, open, expectClosed } = await phone(page, "/");
  await open();
  await link("/blogs").click();
  await expect(page).toHaveURL(/\/blogs$/);
  await expectClosed();
  await open();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expectClosed();
  await open();
  await page.goForward();
  await expect(page).toHaveURL(/\/blogs$/);
  await expectClosed();
});
