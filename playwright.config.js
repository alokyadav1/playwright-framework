import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables based on NODE_ENV (defaults to .env)
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: path.resolve(__dirname, envFile) });

const testDir = defineBddConfig({
  paths: ["tests/step-definitions/**/*.feature"],
  require: ["tests/fixtures.js", "tests/step-definitions/**/*.js"],
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  retries: 1,
  workers: "50%",
  reporter: [
    ["html", { open: "never" }],
    ["list"]
  ],
  timeout:120000,
  use: {
    baseURL: process.env.BASE_URL || "https://demo.example.com/",
    trace: "on",
    video: "on",
    screenshot: "only-on-failure",
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1366, height: 633 },
        locale: process.env.LOCALE === "ar" ? "ar-SA" : "en-US",
        timezoneId: "Asia/Kolkata",
      },
    },
  ],
});
