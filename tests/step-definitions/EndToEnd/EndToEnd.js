import { createBdd } from "playwright-bdd";
import { test } from "../../fixtures.js";

const { Given, When, Then } = createBdd(test);

When("User searches for product {string}", async ({ headerPage, demoData }, prodKey) => {
    const productName = demoData[prodKey] || prodKey;
    await headerPage.searchProduct(productName);
});

When("User selects product {string} from PLP", async ({ plpPage, demoData }, prodKey) => {
    const productName = demoData[prodKey] || prodKey;
    await plpPage.selectProduct(productName);
});

Then("User is on PDP for product {string}", async ({ pdpPage, demoData }, prodKey) => {
    const productName = demoData[prodKey] || prodKey;
    await pdpPage.verifyProductPage(productName);
});

When("User clicks on Add To Cart button", async ({ pdpPage }) => {
    await pdpPage.addToCart();
});

Then("Add to cart success message should be displayed", async ({ pdpPage, demoData }) => {
    await pdpPage.verifyAddToCartSuccess(demoData.addToCartSuccessMsg);
});
