import { test as base } from "playwright-bdd";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env before any page object or utility uses process.env.SECRET_KEY
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const require = createRequire(import.meta.url);

import fs from "fs";
import { LoginPage } from "./pages/login.page.js";
import { HeaderPage } from "./pages/header.page.js";
import { HomePage } from "./pages/home.page.js";
import { PDPPage } from "./pages/pdp.page.js";
import { PLPPage } from "./pages/plp.page.js";
import { CartPage } from "./pages/cart.page.js";
import { CheckoutPage } from "./pages/checkout.page.js";
import { PlaceOrderPage } from "./pages/placeOrder.page.js";

export const test = base.extend({
  // Fixture options - can be set per-project in playwright.config.js
  testEnv: ["dev", { option: true }],
  dataLocale: ["en-us", { option: true }],

  demoData: async ({ baseURL, testEnv, dataLocale }, use) => {
    // 1. Store - Derived from project's baseURL hostname
    let store;
    if (baseURL) {
      try {
        const hostname = new URL(baseURL).hostname;
        const parts = hostname.split(".");
        if (parts.length > 1) {
          store = parts[0];
        }
      } catch {
        // Ignore URL parsing errors
      }
    }
    store = store || "vpro";

    // 2. Resolve data path: tests/data/{testEnv}/{store}/{dataLocale}.json
    let dataPath = path.resolve(__dirname, "data", testEnv, store, `${dataLocale}.json`);

    // Fallbacks if target file is missing
    if (!fs.existsSync(dataPath)) {
      dataPath = path.resolve(__dirname, "data", testEnv, store, "en-us.json");
    }

    if (!fs.existsSync(dataPath)) {
      dataPath = path.resolve(__dirname, "data", "dev", "vpro", "en-us.json");
    }

    console.log("testEnv: ", testEnv, "| store: ", store, "| dataLocale: ", dataLocale);
    console.log("dataFile: ", dataPath);

    const data = require(dataPath);
    await use(data);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  headerPage: async ({ page }, use) => {
    await use(new HeaderPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  pdpPage: async ({ page }, use) => {
    await use(new PDPPage(page));
  },
  plpPage: async ({ page }, use) => {
    await use(new PLPPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  placeOrderPage: async ({ page }, use) => {
    await use(new PlaceOrderPage(page));
  },
});
