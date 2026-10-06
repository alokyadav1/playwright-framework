import { expect } from "@playwright/test";
import { decryptText } from "../utils/crypto.js";
import locators from "../locators/login.json" with { type: "json" };

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async navigateToSignInPage() {
    await this.page.locator(locators.profileIcon).first().click();
  }

  async enterEmail(encryptedOrRawEmail) {
    const email = decryptText(encryptedOrRawEmail);
    await this.page.locator(locators.emailId).fill(email);
  }

  async clickContinue() {
    await this.page.locator(locators.continueBtn).click();
  }

  async enterPassword(encryptedOrRawPassword) {
    const password = decryptText(encryptedOrRawPassword);
    await this.page.locator(locators.passwordField).fill(password);
  }

  async clickSignIn() {
    // Register listener BEFORE clicking to avoid missing the response
    const responsePromise = this.page.waitForResponse(
      (res) =>
        res.url().includes("login") &&
        res.request().method() === "POST" &&
        res.status() === 200,
      { timeout: 15000 }
    );

    await this.page.locator(locators.signInBtn).click();

    const response = await responsePromise;
    const body = await response.json();
    const customerId =
      body?.loginDetails?.message?.data?.response?.data?.customerid;

    expect(
      customerId,
      `Login API response missing "customerid". Body: ${JSON.stringify(body)}`
    ).toBeTruthy();

    // Wait for the page to fully settle after login redirect
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyPasswordPage() {
    await expect(this.page.locator(locators.passwordField)).toBeVisible();
  }

  async verifyLoggedIn() {
    const profileIcon = this.page.locator(locators.profileIcon).first();
    await expect(profileIcon).toHaveAttribute("fill", "white", {
      timeout: 10000,
    });
  }

  async performLogin(emailKeyOrRaw, passwordKeyOrRaw) {
    await this.navigateToSignInPage();
    await this.enterEmail(emailKeyOrRaw);
    await this.clickContinue();
    await this.enterPassword(passwordKeyOrRaw);
    await this.clickSignIn();
    await this.verifyLoggedIn();
  }
}
