import { createBdd } from "playwright-bdd";
import { test } from "../../fixtures.js";

const { Given, When, Then } = createBdd(test);

When("User authorizes payment using credit card {string}", async ({ checkoutPage, demoData }, cardKey) => {
    const cardData = demoData[cardKey] || demoData.creditCardData;
    await checkoutPage.authorizeVStripePayment(cardData);
});

When("User clicks on Place Order button", async ({ checkoutPage }) => {
    await checkoutPage.clickPlaceOrder();
});

Then("Order confirmation page should be displayed", async ({ placeOrderPage }) => {
    await placeOrderPage.verifyOrderConfirmationPage();
});
