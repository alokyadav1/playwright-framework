import locators from "../locators/header.json" with { type: "json" };

export class HeaderPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async navigateHome() {
    await this.page.goto("/");
  }

  async searchProduct(productName) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.locator(locators.searchBox).fill(productName);
    await this.page.locator(locators.searchBox).press("Enter");
  }

  async clickCartIcon() {
    await this.page.locator(locators.cartIcon).click();
  }

  async clickProfileIcon() {
    await this.page.locator(locators.profileIcon).first().click();
  }
}
