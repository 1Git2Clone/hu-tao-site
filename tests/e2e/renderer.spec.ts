import { expect, test } from "@playwright/test";

// Hosted runners have no GPU. Use the same explicit software backend as the
// renderer report, rather than Chromium's platform-dependent GPU fallback.
test.use({
  launchOptions: {
    executablePath: process.env.CHROME_PATH || undefined,
    args: [
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--ignore-gpu-blocklist",
    ],
  },
});

test("live WebGL starts and remains usable after a theme change", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  // Pixel reads synchronize software GL. Keep this smoke test inexpensive.
  await page.setViewportSize({ width: 400, height: 300 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    // oxlint-disable-next-line typescript/unbound-method -- Forwarded with the original context below.
    const draw = WebGL2RenderingContext.prototype.drawArrays;
    WebGL2RenderingContext.prototype.drawArrays = function (...args) {
      draw.apply(this, args);
      if (!(this.canvas instanceof HTMLCanvasElement)) return;
      const dark = document.documentElement.classList.contains("dark");
      if (this.canvas.dataset.sampledTheme === String(dark)) return;
      if (this.getParameter(this.FRAMEBUFFER_BINDING) !== null) return;
      const pixels = new Uint8Array(32 * 32 * 4);
      this.readPixels(
        Math.floor(this.drawingBufferWidth / 2),
        Math.floor(this.drawingBufferHeight / 2),
        32,
        32,
        this.RGBA,
        this.UNSIGNED_BYTE,
        pixels,
      );
      let alpha = 0;
      let absorbed = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        alpha += pixels[i + 3];
        absorbed +=
          pixels[i + 3] - Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
      }
      // Light-mode ink absorbs light; dark-mode glow has max(R,G,B) == alpha.
      if (alpha > 0) {
        const ink = absorbed / alpha;
        this.canvas.dataset.inkShare = String(ink);
        if ((dark && ink < 0.01) || (!dark && ink > 0.1))
          this.canvas.dataset.sampledTheme = String(dark);
      }
    };
  });
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
  const dark = await page
    .locator("html")
    .evaluate((node) => node.classList.contains("dark"));
  const ink = async () => Number(await canvas.getAttribute("data-ink-share"));
  if (dark) await expect.poll(ink).toBeLessThan(0.01);
  else await expect.poll(ink).toBeGreaterThan(0.1);
  await page.getByRole("button", { name: "Toggle theme" }).click();
  if (dark) await expect.poll(ink).toBeGreaterThan(0.1);
  else await expect.poll(ink).toBeLessThan(0.01);
  await expect.poll(healthy).toBe(true);
  expect(errors).toEqual([]);
});
