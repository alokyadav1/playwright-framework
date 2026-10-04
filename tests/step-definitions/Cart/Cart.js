import { createBdd } from "playwright-bdd";
import { test } from "../../fixtures.js";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd(test);

When("User logs in using email {string} and password {string}", async ({ loginPage, demoData }, emailKey, pwdKey) => {
    const email = demoData[emailKey] || emailKey;
    const pwd = demoData[pwdKey] || pwdKey;
    await loginPage.performLogin(email, pwd);
});

When("User adds product {string} to cart if cart is empty", async ({ headerPage, plpPage, pdpPage, cartPage, demoData }, prodKey) => {
    const productName = demoData[prodKey] || prodKey;
    await cartPage.navigateToCartPage();
    const isEmpty = await cartPage.isCartEmpty();
    if (isEmpty) {
        await headerPage.navigateHome();
        await headerPage.searchProduct(productName);
        await plpPage.selectProduct(productName);
        await pdpPage.addToCart();
    }
});

When("User navigates to cart page", async ({ cartPage }) => {
    await cartPage.navigateToCartPage();
});

Then("Cart items details should be visible", async ({ cartPage }) => {
    await cartPage.verifyCartDetailsVisible();
});

When("User clicks on Checkout button", async ({ cartPage }) => {
    await cartPage.clickCheckout();
});

Then("User should be navigated to checkout page", async ({ checkoutPage }) => {
    await checkoutPage.verifyCheckoutPageDisplayed();
});
