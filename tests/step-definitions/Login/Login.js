import { createBdd } from "playwright-bdd";
import { test } from "../../fixtures.js";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd(test);

Given("User is on the home page", async ({ homePage }) => {
    await homePage.navigate();
});

When("User navigates to sign in page", async ({ loginPage }) => {
    await loginPage.navigateToSignInPage();
});

When("User enters email {string} in Username field", async ({ loginPage, demoData }, emailKey) => {
    const email = demoData[emailKey] || emailKey;
    await loginPage.enterEmail(email);
});

When("User clicks on Continue button", async ({ loginPage }) => {
    await loginPage.clickContinue();
});

Then("User is navigated to the Password page", async ({ loginPage }) => {
    await loginPage.verifyPasswordPage();
});

When("User enters password {string} in Password field", async ({ loginPage, demoData }, pwdKey) => {
    const password = demoData[pwdKey] || pwdKey;
    await loginPage.enterPassword(password);
});

When("User clicks on Sign In button", async ({ loginPage }) => {
    await loginPage.clickSignIn();
});

Then("User welcome message {string} should be visible", async ({ loginPage, demoData }, welcomeKey) => {
    const welcomeText = demoData[welcomeKey] || welcomeKey;
    await loginPage.verifyLoggedIn(welcomeText);
});
