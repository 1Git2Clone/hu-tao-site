import { expect, test } from "@playwright/test";
import { useArtFallback } from "./art-fallback";

test.beforeEach(async ({ page }) => useArtFallback(page));

const POST_PATH = "/blogs/intro-to-big-o-notation";

test("post sidebars align with the article and stay above the footer", async ({
  page,
}) => {
  await page.goto(POST_PATH);
  const article = page.locator("article");
  await article.evaluate(async (node) => {
    const images = [...node.querySelectorAll("img")];
    for (const image of images) image.loading = "eager";
    await Promise.all(images.map((image) => image.decode()));
    await document.fonts.ready;
  });
  const sidebars = page.locator("aside > .box-gradient");
  await expect(sidebars).toHaveCount(2);
  const articleTop = (await article.boundingBox())!.y;
  for (const sidebar of await sidebars.all()) {
    expect(
      Math.abs((await sidebar.boundingBox())!.y - articleTop),
    ).toBeLessThan(1);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(async () => {
      const footerTop = (await page.locator("footer").boundingBox())!.y;
      const bottoms = await sidebars.evaluateAll((nodes) =>
        nodes.map((node) => node.getBoundingClientRect().bottom),
      );
      return Math.max(...bottoms) - footerTop;
    })
    .toBeLessThanOrEqual(0);
  await expect
    .poll(async () => {
      const articleBottom = await article.evaluate(
        (node) => node.getBoundingClientRect().bottom,
      );
      return sidebars.evaluateAll(
        (nodes, bottom) =>
          Math.max(
            ...nodes.map((node) =>
              Math.abs(node.getBoundingClientRect().bottom - bottom),
            ),
          ),
        articleBottom,
      );
    })
    .toBeLessThan(1);
  // Content can move the footer without a scroll or viewport resize.
  await article.evaluate((node) => {
    const extra = document.createElement("div");
    extra.style.height = "400px";
    node.append(extra);
  });
  await expect
    .poll(async () => {
      const overlap = await page
        .locator("aside")
        .first()
        .evaluate((node) =>
          Number.parseFloat(
            getComputedStyle(node).getPropertyValue("--footer-overlap"),
          ),
        );
      const footerTop = (await page.locator("footer").boundingBox())!.y;
      return Math.abs(overlap - Math.max(0, 900 - footerTop));
    })
    .toBeLessThan(1);
});

test("plain prose and surface tokens follow both modes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto(POST_PATH);
  const read = () =>
    page.locator("article").evaluate((article) => {
      const probe = document.createElement("span");
      probe.style.color = "var(--color-textcol)";
      probe.style.backgroundColor = "var(--color-surface)";
      article.append(probe);
      const style = getComputedStyle(probe);
      const result = {
        text: getComputedStyle(article.querySelector(".prose p")!).color,
        token: style.color,
        surface: getComputedStyle(article).backgroundColor,
        surfaceToken: style.backgroundColor,
      };
      probe.remove();
      return result;
    });
  const light = await read();
  expect(light.text).toBe(light.token);
  expect(light.surface).toBe(light.surfaceToken);
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  const dark = await read();
  expect(dark.text).toBe(dark.token);
  expect(dark.surface).toBe(dark.surfaceToken);
  expect(dark.text).not.toBe(light.text);
  expect(dark.surface).not.toBe(light.surface);
});
