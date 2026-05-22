import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: { timeout: 7000 },
  fullyParallel: true,
  outputDir: "qa/test-artifacts",
  retries: 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "qa/playwright-html-report", open: "never" }],
    ["json", { outputFile: "qa/test-results/playwright-results.json" }],
  ],
  use: {
    baseURL: process.env.BASE_URL || "https://mt-brewscape.lovable.app",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 5"] } },
  ],
});
