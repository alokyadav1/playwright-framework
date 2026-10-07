import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const testDir = defineBddConfig({
  paths: ["tests/step-definitions/**/*.feature"],
  require: ["tests/fixtures.js", "tests/step-definitions/**/*.js"],
  // Prevent bddgen from picking up API spec files
  ignore: ["**/*.api.spec.js"],
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  retries: 1,
  workers: "50%",
  reporter: [["html", { open: "never" }], ["list"]],
  timeout: 120000,
  use: {
    baseURL: process.env.BASE_URL || "https://vpro.logixal.com/",
    trace: "on",
    video: "on",
    screenshot: "only-on-failure",
    navigationTimeout: 30000,
    actionTimeout: 15000
  },

  projects: [
    {
      name: "vfashion-desktop",
      testIgnore: /.*\.api\.spec\.js/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://vfashion.logixal.com/",
        locale: "en-US",
        timezoneId: "Asia/Kolkata",
        testEnv: "dev",
        dataLocale: "en-us",
      },
    },
    {
      name: "vfashion-mobile",
      testIgnore: /.*\.api\.spec\.js/,
      use: {
        ...devices["Galaxy S24"],
        baseURL: "https://vfashion.logixal.com/",
        locale: "en-US",
        timezoneId: "Asia/Kolkata",
        testEnv: "dev",
        dataLocale: "en-us",
      },
    },
    {
      name: "vpro-desktop",
      testIgnore: /.*\.api\.spec\.js/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://vpro.logixal.com/",
        locale: "en-US",
        timezoneId: "Asia/Kolkata",
        testEnv: "dev",
        dataLocale: "en-us",
      },
    },
    {
      name: "vpro-mobile",
      testIgnore: /.*\.api\.spec\.js/,
      use: {
        ...devices["Galaxy S24"],
        baseURL: "https://vpro.logixal.com/",
        locale: "en-US",
        timezoneId: "Asia/Kolkata",
        testEnv: "dev",
        dataLocale: "en-us",
      },
    },

    // ── API project ─────────────────────────────────────────────────────────
    // No browser device. Matches only *.api.spec.js files.
    {
      name: "api",
      testDir: "tests/api",
      testMatch: /.*\.api\.spec\.js/,
      retries: 0,
      use: {
        baseURL: "https://headless.logixal.com",
        extraHTTPHeaders: {
          "Content-Type": "application/json",
          Accept: "text/plain, */*, */*",
          Connection: "keep-alive",
        },
      },
    },
  ],
});
