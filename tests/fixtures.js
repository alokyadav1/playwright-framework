import { test as base } from "playwright-bdd";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env before any page object or utility uses process.env.SECRET_KEY
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: path.resolve(__dirname, "../", envFile) });

const require = createRequire(import.meta.url);

import { LoginPage } from "./pages/login.page.js";
import { HeaderPage } from "./pages/header.page.js";
import { HomePage } from "./pages/home.page.js";
import { PDPPage } from "./pages/pdp.page.js";
import { PLPPage } from "./pages/plp.page.js";
import { CartPage } from "./pages/cart.page.js";
import { CheckoutPage } from "./pages/checkout.page.js";
import { PlaceOrderPage } from "./pages/placeOrder.page.js";

export const test = base.extend({
    demoData: async ({ }, use) => {
        const dataPath = path.resolve(__dirname, "data", "dev", "en-us.json");
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
