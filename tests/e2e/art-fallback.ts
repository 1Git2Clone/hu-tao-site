import type { Page } from "@playwright/test";

// Layout/interaction tests use the site's supported artwork fallback. The
// separate renderer test exercises live WebGL without this override.
export async function useArtFallback(page: Page) {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = new Proxy(
      // The apply trap below supplies the original canvas receiver.
      // oxlint-disable-next-line typescript/unbound-method
      HTMLCanvasElement.prototype.getContext,
      {
        apply(target, canvas, args) {
          if (String(args[0]).startsWith("webgl")) return null;
          return Reflect.apply(target, canvas, args);
        },
      },
    );
  });
}
