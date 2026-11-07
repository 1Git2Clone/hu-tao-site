import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  optimizeDeps: { include: ["mode-watcher", "fuse.js"] },
  resolve: {
    alias: {
      $lib: fileURLToPath(new URL("./src/lib", import.meta.url)),
      "$app/state": fileURLToPath(
        new URL("./tests/components/app-state.svelte.ts", import.meta.url),
      ),
      "$app/navigation": fileURLToPath(
        new URL("./tests/components/navigation.ts", import.meta.url),
      ),
      "$app/paths": fileURLToPath(
        new URL("./tests/components/paths.ts", import.meta.url),
      ),
    },
    conditions: ["browser"],
  },
  test: {
    include: ["tests/components/**/*.test.ts"],
    setupFiles: ["vitest-browser-svelte"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        launchOptions: { executablePath: process.env.CHROME_PATH || undefined },
      }),
      instances: [{ browser: "chromium" }],
    },
  },
});
