import fs from "fs";
import path from "path";
import { expect } from "@playwright/test";
import { decryptText } from "./crypto.js";
import locators from "../locators/login.json" with { type: "json" };

export class SessionManager {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Check if user is currently logged in
   */
  async isLoggedIn() {
    try {
      const profileIcon = this.page.locator(locators.profileIcon).first();
      await expect(profileIcon).toHaveAttribute("fill", "white", {
        timeout: 4000,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Resolve storage state file path for given profile and store
   */
  getSessionPath(profileKey, emailKeyOrRaw) {
    let store = "default";
    try {
      const url = this.page.url();
      if (url && url !== "about:blank") {
        const hostname = new URL(url).hostname;
        const parts = hostname.split(".");
        if (parts.length > 1) {
          store = parts[0];
        }
      }
    } catch {}

    let profile = profileKey;
    if (!profile && emailKeyOrRaw) {
      profile = decryptText(emailKeyOrRaw);
    }
    const sanitizedProfile = String(profile || "default").replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );
    const authDir = path.resolve(process.cwd(), ".auth");
    return path.join(authDir, `${store}_${sanitizedProfile}.json`);
  }

  /**
   * Restore cookies and localStorage from stored session file
   */
  async restoreSession(sessionPath) {
    try {
      const sessionData = JSON.parse(fs.readFileSync(sessionPath, "utf-8"));

      // 1. Restore cookies
      if (Array.isArray(sessionData.cookies) && sessionData.cookies.length > 0) {
        await this.page.context().addCookies(sessionData.cookies);
      }

      // 2. Restore localStorage (if any origins present)
      if (Array.isArray(sessionData.origins) && sessionData.origins.length > 0) {
        await this.page.context().addInitScript((origins) => {
          for (const origin of origins) {
            if (window.location.origin === origin.origin && origin.localStorage) {
              for (const item of origin.localStorage) {
                localStorage.setItem(item.name, item.value);
              }
            }
          }
        }, sessionData.origins);

        for (const origin of sessionData.origins) {
          if (origin.localStorage && origin.localStorage.length > 0) {
            await this.page
              .evaluate(
                ({ targetOrigin, items }) => {
                  if (
                    window.location.origin === targetOrigin ||
                    targetOrigin.includes(window.location.hostname)
                  ) {
                    for (const item of items) {
                      localStorage.setItem(item.name, item.value);
                    }
                  }
                },
                { targetOrigin: origin.origin, items: origin.localStorage }
              )
              .catch(() => {});
          }
        }
      }

      // 3. Reload or navigate to apply restored session
      if (this.page.url() === "about:blank" || !this.page.url()) {
        await this.page.goto("/");
      } else {
        await this.page.reload({ waitUntil: "domcontentloaded" });
      }

      // 4. Verify whether user is actually logged in
      return await this.isLoggedIn();
    } catch (err) {
      console.warn(
        `[Session] Failed to restore session from ${sessionPath}:`,
        err.message
      );
      return false;
    }
  }

  /**
   * Save current context storage state to session file
   */
  async saveSession(sessionPath) {
    try {
      const dir = path.dirname(sessionPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      await this.page.context().storageState({ path: sessionPath });
      console.log(`[Session] Saved session to ${sessionPath}`);
    } catch (err) {
      console.warn(
        `[Session] Failed to save session to ${sessionPath}:`,
        err.message
      );
    }
  }
}

export default SessionManager;
