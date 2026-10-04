import { expect } from "@playwright/test";
import locators from "../locators/pdp.json" with { type: "json" };

export class PDPPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    async verifyProductPage(productName) {
        await expect(this.page.locator(locators.productName)).toContainText(productName);
    }

    async addToCart() {
        await this.page.locator(locators.addToCartBtn).click();
    }

    async verifyAddToCartSuccess(expectedMsg = "Product Added to Cart") {
        await expect(this.page.locator(locators.toastMessage)).toContainText(expectedMsg);
    }
}
