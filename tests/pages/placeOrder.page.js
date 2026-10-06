import { expect } from "@playwright/test";
import locators from "../locators/placeOrder.json" with { type: "json" };

export class PlaceOrderPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async verifyOrderConfirmationPage() {
    await expect(this.page).toHaveURL(/.*orderconfirmation.*/, {
      timeout: 20000,
    });
  }
}
