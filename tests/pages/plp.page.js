import locators from "../locators/plp.json" with { type: "json" };

export class PLPPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    async selectProduct(productName) {
        const productCard = this.page
            .locator(locators.productCardContainer)
            .filter({ hasText: productName })
            .first();

        await productCard.locator("img").click();
    }
}
