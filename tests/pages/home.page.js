import { expect } from "@playwright/test";
import locators from "../locators/home.json" with { type: "json" };

export class HomePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto("/");
    }

    async verifyHomePageLoaded() {
        await expect(this.page).toHaveURL(/.*vfashion\.logixal\.com.*/);
    }
}
