# Feature 01: Cross-Browser Testing in `playwright-bdd`

## 1. Overview & Business Value

Cross-browser testing ensures that application features defined in Gherkin scenarios behave consistently across all major web rendering engines:

* **Chromium** (Google Chrome, Microsoft Edge, Brave)
* **Firefox** (Gecko engine)
* **WebKit** (Apple Safari engine)

In traditional BDD setups with Cucumber.js, running scenarios across multiple browsers required writing custom hooks, passing CLI variables, or instantiating different browser instances manually.

`playwright-bdd` compiles `.feature` files into standard Playwright spec files (`.spec.ts` / `.spec.js`) at build time (`npx bddgen`). Because of this compile-step architecture, cross-browser support works seamlessly using Playwright’s native `projects` array in `playwright.config.ts`.

---

## 2. Configuration Setup (`playwright.config.ts`)

`playwright-bdd` uses `defineBddConfig()` inside `playwright.config.ts` to link your Gherkin features with step definitions, while leveraging Playwright’s native `projects` array to define target browsers.

```typescript
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// 1. Define BDD test compilation settings
const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'steps/*.ts',
});

// 2. Pass testDir and defined projects into main Playwright config
export default defineConfig({
  testDir, // Points to .features-gen directory
  fullyParallel: true,
  
  projects: [
    {
      name: 'Chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Applies to all scenarios when running in Chromium
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'Firefox',
      use: { 
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'WebKit',
      use: { 
        ...devices['Desktop Safari'],
      },
    },
  ],
});

```

---

## 3. Feature File & Step Definition Example

The beauty of `playwright-bdd` is that your **Gherkin scenarios remain 100% agnostic** of the browser. You write one scenario, and the framework executes it across every configured project.

### Feature File (`features/login.feature`)

```gherkin
Feature: User Authentication

  Scenario: Successful Login with Valid Credentials
    Given I am on the login page
    When I submit valid credentials
    Then I should be redirected to the dashboard

```

### Step Definition (`steps/login.steps.ts`)

```typescript
import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('I am on the login page', async ({ page }) => {
  await page.goto('/login');
});

When('I submit valid credentials', async ({ page }) => {
  await page.fill('#username', 'user1');
  await page.fill('#password', 'password123');
  await page.click('#login-btn');
});

Then('I should be redirected to the dashboard', async ({ page }) => {
  await expect(page).toHaveURL('/dashboard');
});

```

---

## 4. Execution Commands

### Generate BDD Spec Files & Run Across ALL Browsers

```bash
npx bddgen && npx playwright test

```

### Run Scenarios Only on a Specific Browser

```bash
# Run only in Chromium
npx playwright test --project=Chromium

# Run in Firefox
npx playwright test --project=Firefox

# Run in WebKit (Safari)
npx playwright test --project=WebKit

```

---

## 5. Advanced: Browser-Specific Scenario Tagging

If a particular scenario should **only** run on a specific browser (e.g., testing Apple Pay on WebKit or Chrome-only features), combine Gherkin tags with Playwright CLI filtering.

### Feature File

```gherkin
Feature: Payment Methods

  @chromium-only
  Scenario: Pay with Google Pay
    Given I open the checkout page
    Then I should see the Google Pay option

  @webkit-only
  Scenario: Pay with Apple Pay
    Given I open the checkout page
    Then I should see the Apple Pay option

```

### Execution Command

```bash
# Run @chromium-only scenarios under the Chromium project
npx playwright test --project=Chromium --grep "@chromium-only"

# Run @webkit-only scenarios under the WebKit project
npx playwright test --project=WebKit --grep "@webkit-only"

```

---

## 6. Possible Demo & Audience Questions

### Q1: Does `playwright-bdd` launch 3 separate browsers sequentially or concurrently?

> **Answer:** It depends on your `workers` configuration and CI system. If `fullyParallel: true` is enabled and sufficient CPU workers are available, Playwright can execute Chromium, Firefox, and WebKit tests simultaneously across available worker processes.

### Q2: Do I need real Safari installed locally on Windows/Linux to test WebKit?

> **Answer:** No. Playwright packages a compiled build of WebKit (the open-source rendering engine behind Safari) for Windows, macOS, and Linux. This allows running WebKit E2E tests on Linux-based CI pipelines natively without needing a Mac.

### Q3: How do step definitions know which browser is currently running?

> **Answer:** The default `{ page }` fixture injected into your step definition is automatically instantiated from the specific browser context generated for that `project` during execution. If you need browser metadata directly inside a step definition, you can inspect `browserName`:
> ```typescript
> Given('I check browser info', async ({ browserName }) => {
>   console.log(`Currently executing on: ${browserName}`); // 'chromium', 'firefox', or 'webkit'
> });
> 
> ```
> 
> 

### Q4: Why use `playwright-bdd` instead of standard `cucumber-js` for cross-browser execution?

> **Answer:** Standard `cucumber-js` does not natively support Playwright's `projects` abstraction. In pure `cucumber-js`, you must manually manage browser launching in `Before` hooks or handle multi-browser parallelism with complex wrapper scripts. `playwright-bdd` delegates test execution entirely to Playwright's runner, giving you multi-browser `projects` for free.

---