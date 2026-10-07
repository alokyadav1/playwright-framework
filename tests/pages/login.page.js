import { expect } from "@playwright/test";
import fs from "fs";
import { decryptText } from "../utils/crypto.js";
import locators from "../locators/login.json" with { type: "json" };
import { SessionManager } from "../utils/sessionManager.js";

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.sessionManager = new SessionManager(page);
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

  /**
   * Check if user is currently logged in
   */
  async isLoggedIn() {
    return await this.sessionManager.isLoggedIn();
  }

  /**
   * Resolve storage state file path for given profile and store
   */
  getSessionPath(profileKey, emailKeyOrRaw) {
    return this.sessionManager.getSessionPath(profileKey, emailKeyOrRaw);
  }

  /**
   * Restore cookies and localStorage from stored session file
   */
  async restoreSession(sessionPath) {
    return await this.sessionManager.restoreSession(sessionPath);
  }

  /**
   * Save current context storage state to session file
   */
  async saveSession(sessionPath) {
    return await this.sessionManager.saveSession(sessionPath);
  }


  /**
   * Execute full UI login steps
   */
  async executeLoginFlow(emailKeyOrRaw, passwordKeyOrRaw) {
    await this.navigateToSignInPage();
    await this.enterEmail(emailKeyOrRaw);
    await this.clickContinue();
    await this.enterPassword(passwordKeyOrRaw);
    await this.clickSignIn();
    await this.verifyLoggedIn();
  }

  /**
   * Perform login with on-demand session caching.
   * If session exists and is valid, reuses it.
   * Otherwise, executes login UI flow and persists the session.
   */
  async performLogin(emailKeyOrRaw, passwordKeyOrRaw, profileKey = null) {
    const profile = profileKey || emailKeyOrRaw;
    const sessionPath = this.sessionManager.getSessionPath(profileKey, emailKeyOrRaw);

    // 1. Check if session file already exists
    if (fs.existsSync(sessionPath)) {
      console.log(
        `[Session] Found stored session for profile "${profile}". Attempting reuse...`
      );
      const restored = await this.sessionManager.restoreSession(sessionPath);
      if (restored) {
        console.log(
          `[Session] Successfully reused session for profile "${profile}".`
        );
        return;
      }
      console.warn(
        `[Session] Stored session for profile "${profile}" was expired or invalid. Performing login...`
      );
      try {
        fs.unlinkSync(sessionPath);
      } catch {}
    }

    // 2. Perform full login flow
    await this.executeLoginFlow(emailKeyOrRaw, passwordKeyOrRaw);

    // 3. Store session for subsequent tests
    await this.sessionManager.saveSession(sessionPath);
  }
}
