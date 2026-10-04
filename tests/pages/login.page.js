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
        await this.page.locator(locators.signInBtn).click();
    }

    async verifyPasswordPage() {
        await expect(this.page.locator(locators.passwordField)).toBeVisible();
    }

    async verifyLoggedIn(helloText = "Hello") {
        await this.page.locator(locators.profileIcon).first().hover();
        await expect(this.page.locator(locators.welcomeMsg)).toContainText(helloText);
    }

    async performLogin(emailKeyOrRaw, passwordKeyOrRaw) {
        await this.navigateToSignInPage();
        await this.enterEmail(emailKeyOrRaw);
        await this.clickContinue();
        await this.enterPassword(passwordKeyOrRaw);
        await this.clickSignIn();
    }
}
