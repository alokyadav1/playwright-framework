import { expect } from "@playwright/test";
import { decryptText } from "../utils/crypto.js";
import locators from "../locators/checkout.json" with { type: "json" };

export class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async navigateToCheckout() {
    await this.page.goto("/en/checkout");
  }

  async verifyCheckoutPageDisplayed() {
    await expect(this.page).toHaveURL(/.*checkout.*/);
  }

  async openShippingMethodSection() {
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  async clickContinueToPayment() {
    await this.page
      .getByRole("button", { name: "Continue to Payment" })
      .click();
  }

  async verifyPaymentSectionExpanded() {
    await expect(this.page.locator(locators.vstripeCardNumber)).toBeVisible({
      timeout: 15000,
    });
  }

  async authorizeVStripePayment(creditCardData) {
    const cardNumberInput = this.page.locator(locators.vstripeCardNumber);
    await expect(cardNumberInput).toBeVisible();
    await this.page
      .locator(locators.vstripeCardholderName)
      .fill(creditCardData.cardHolderName);
    await cardNumberInput.fill(creditCardData.cardNumber);
    await this.page.locator(locators.vstripeMonth).fill(creditCardData.month);
    await this.page.locator(locators.vstripeYear).fill(creditCardData.year);
    await this.page.locator(locators.vstripeCvv).fill(creditCardData.cvv);
    await this.page.getByRole("button", { name: "PAY NOW" }).click();
    await expect(
      this.page.getByText("Click 'Place Order' to proceed"),
    ).toBeVisible({ timeout: 10000 });
  }

  async authorizePayPalPayment(paypalData) {
    const email = decryptText(paypalData.email);
    const password = decryptText(paypalData.password);

    // 1. Select PayPal method (awaited, so the iframe is rendered before we look for it)
    await this.page
      .getByRole("button", { name: "PayPal Pay using your PayPal" })
      .click();

    // 2. Target only the live button frame, not the prerender placeholder
    const paypalLink = this.page
      .frameLocator('iframe[title="PayPal"]:not(.prerender-frame)')
      .getByRole("link", { name: "PayPal" });
    await expect(paypalLink).toBeVisible({ timeout: 20000 });

    // 3. Register popup listener before the click
    const [paypalPage] = await Promise.all([
      this.page.waitForEvent("popup"),
      paypalLink.click(),
    ]);

    // 4. PayPal login
    await paypalPage
      .getByRole("textbox", { name: "Email or mobile number" })
      .fill(email, { timeout: 20000 });
    await paypalPage.getByRole("button", { name: "Next" }).click();

    await paypalPage
      .getByRole("textbox", { name: "Password" })
      .fill(password, { timeout: 20000 });
    await paypalPage.getByRole("button", { name: "Log In" }).click();

    // 5. Approve payment
    await paypalPage
      .getByTestId("submit-button-initial")
      .click({ timeout: 30000 });

    // 6. Back on the store
    await expect(
      this.page.getByText("Click 'Place Order' to proceed"),
    ).toBeVisible({ timeout: 15000 });
  }

  async clickPlaceOrder() {
    await this.page.getByRole("button", { name: "Place Order" }).click();
  }
}
