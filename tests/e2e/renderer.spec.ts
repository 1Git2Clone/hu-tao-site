import { expect, test } from "@playwright/test";

test("live WebGL starts and remains usable after a theme change", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const canvas = page.locator("#main-content canvas");
  await expect(page.locator("html")).toHaveClass(/webgl/);
  await expect(canvas).toBeVisible();
  const healthy = () =>
    canvas.evaluate((node: HTMLCanvasElement) => {
      const gl = node.getContext("webgl2");
      return (
        !!gl &&
        !gl.isContextLost() &&
        gl.drawingBufferWidth > 0 &&
        gl.drawingBufferHeight > 0
      );
    });
  await expect.poll(healthy).toBe(true);
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect.poll(healthy).toBe(true);
  expect(errors).toEqual([]);
});
