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
    actionTimeout: 15000,
  },

  projects: [
    {
      name: "vfashion-desktop",
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
      use: {
        ...devices["Galaxy S24"],
        baseURL: "https://vpro.logixal.com/",
        locale: "en-US",
        timezoneId: "Asia/Kolkata",
        testEnv: "dev",
        dataLocale: "en-us",
      },
    },
  ],
});
