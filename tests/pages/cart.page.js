import { expect } from "@playwright/test";
import locators from "../locators/cart.json" with { type: "json" };

export class CartPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    async navigateToCartPage() {
        await this.page.goto("/en/cart");
    }

    async verifyCartDetailsVisible() {
        await expect(
            this.page.getByRole("button", { name: "Proceed to Checkout" })
        ).toBeVisible();
    }

    async clickCheckout() {
        await this.page
            .getByRole("button", { name: "Proceed to Checkout" })
            .click();
    }

    async clickExpressCheckout() {
        await this.page.locator(locators.expressCheckoutBtn).click();
    }

    async isCartEmpty() {
        return (await this.page.locator(locators.itemContainer).count()) === 0;
    }
}
