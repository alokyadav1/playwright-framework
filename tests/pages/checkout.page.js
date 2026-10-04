import { expect } from "@playwright/test";
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
        await this.page.getByRole("button", { name: "Continue to Payment" }).click();
    }

    async verifyPaymentSectionExpanded() {
        await expect(
            this.page.locator(locators.vstripeCardNumber)
        ).toBeVisible({ timeout: 10000 });
    }

    async authorizeVStripePayment(creditCardData) {
        const cardNumberInput = this.page.locator(locators.vstripeCardNumber);
        await expect(cardNumberInput).toBeVisible();
        await this.page.locator(locators.vstripeCardholderName).fill(creditCardData.cardHolderName);
        await cardNumberInput.fill(creditCardData.cardNumber);
        await this.page.locator(locators.vstripeMonth).fill(creditCardData.month);
        await this.page.locator(locators.vstripeYear).fill(creditCardData.year);
        await this.page.locator(locators.vstripeCvv).fill(creditCardData.cvv);
        await this.page.getByRole('button', { name: "PAY NOW" }).click()
        await expect(
            this.page.getByText("Click 'Place Order' to proceed")
        ).toBeVisible({ timeout: 10000 });
    }

    async clickPlaceOrder() {
        await this.page.getByRole('button', { name: "Place Order" }).click()
    }
}
