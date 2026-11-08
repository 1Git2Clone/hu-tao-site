import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
    launchOptions: {
      executablePath: process.env.CHROME_PATH || undefined,
    },
  },
  webServer: {
    command: "pnpm run preview --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
  },
});
