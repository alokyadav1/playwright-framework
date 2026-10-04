import { createBdd } from "playwright-bdd";
import { test } from "../../fixtures.js";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd(test);

When("User navigates to checkout page", async ({ checkoutPage }) => {
    await checkoutPage.navigateToCheckout();
});

Then("Checkout page should be displayed", async ({ checkoutPage }) => {
    await checkoutPage.verifyCheckoutPageDisplayed();
});

When("User opens shipping method section", async ({ checkoutPage }) => {
    await checkoutPage.openShippingMethodSection();
});

When("User clicks on Continue to Payment button", async ({ checkoutPage }) => {
    await checkoutPage.clickContinueToPayment();
});

Then("Payment section should be expanded", async ({ checkoutPage }) => {
    await checkoutPage.verifyPaymentSectionExpanded();
});
