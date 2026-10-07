# Playwright Annotations & `playwright-bdd` Implementation Guide

Annotations in Playwright allow you to modify test behavior (e.g., skip, fail, slow down, fixme) or attach custom metadata/tags to test runs. When using `playwright-bdd`, annotations can be declared either **declaratively in Gherkin (`.feature`) files** or **programmatically in step definitions / hooks**.

---

## Overview of Supported Annotations

| Annotation | Purpose | Native Playwright | `playwright-bdd` Gherkin Equivalent |
| :--- | :--- | :--- | :--- |
| **`@skip`** | Skips the scenario completely. | `test.skip()` | `@skip` tag |
| **`@only`** | Run only focused scenarios | `test.only()` | `@only` tag |
| **`@fixme`** | Marks test as broken; skips execution until fixed. | `test.fixme()` | `@fixme` tag |
| **`@fail`** | Expects the scenario to fail; fails if it passes. | `test.fail()` | `@fail` tag |
| **`@slow`** | Triples the default timeout for the scenario. | `test.slow()` | `@slow` tag |
| **`@no-retries`** | Disables retry attempts for a specific scenario. | `test.describe.configure({ retries: 0 })` | Custom tag or programmatic |
| **Custom Tags** | Attaches metadata or tags for filtering. | `testInfo.annotations` / `{ tag: '@smoke' }` | `@smoke`, `@regression`, etc. |

---

## 1. Declarative Annotations (In Gherkin `.feature` Files)

`playwright-bdd` maps specific Gherkin tags directly to Playwright test modifiers during code generation (`npx bddgen`).

### Case 1.1: Skipping Scenarios (`@skip`)
Use `@skip` above a `Scenario` or `Scenario Outline` to prevent execution.

```gherkin
Feature: User Settings

  Scenario: Change profile picture
    Given I am on the settings page
    ...

  @skip
  Scenario: Enable two-factor authentication via SMS
    Given I request SMS setup
    Then I should receive an OTP
```

### Case 1.2: Skipping an Entire Feature File (`@skip`)
Place the tag above the `Feature:` keyword at the top of the file.

```gherkin
@skip
Feature: Legacy Payment Gateway Integration

  Scenario: Credit Card Checkout
    Given I enter credit card details
    ...

  Scenario: PayPal Checkout
    Given I select PayPal option
    ...
```

### Case 1.3: Marking Broken Tests (`@fixme`)
Use `@fixme` when a scenario is known to fail due to an open bug. Playwright will mark it as skipped without failing the test suite.

```gherkin
Feature: Order Management

  @fixme
  Scenario: Refund processed order
    Given I have a completed order
    When I click "Refund"
    Then the status should update to "Refunded"
```

### Case 1.4: Expecting Failures (`@fail`)
Use `@fail` when you expect a scenario to fail. If the scenario unexpected passes, Playwright will report a test failure.

```gherkin
Feature: Input Validation

  @fail
  Scenario: Submitting empty form causes strict crash
    Given I submit an empty registration form
    Then the app should handle the crash gracefully
```

### Case 1.5: Tripling Scenario Timeout (`@slow`)
Use `@slow` for heavy end-to-end scenarios (e.g., file processing or multi-page workflows). This multiplies the configured test timeout by 3.

```gherkin
Feature: Data Export

  @slow
  Scenario: Generate and download 100K row CSV report
    Given I select date range "Last Year"
    When I click "Export CSV"
    Then the file download should complete successfully
```

### Case 1.6: Parameterized Scenarios (`Scenario Outline` with `@skip` / `@slow`)
You can tag specific `Examples:` tables or individual `Scenario Outline` blocks.

```gherkin
Feature: Regional Localization

  Scenario Outline: Verify checkout currency
    Given I select country "<Country>"
    Then the currency symbol should be "<Symbol>"

    @skip
    Examples: Skipped Regions
      | Country | Symbol |
      | Japan   | ¥      |

    Examples: Active Regions
      | Country | Symbol |
      | US      | $      |
      | UK      | £      |
```

---

## 2. Programmatic Annotations (In Step Definitions / Hooks)

When test behavior depends on **runtime conditions** (e.g., environment variables, browser types, or user permissions), use Playwright's `testInfo` or `test` object inside step definitions.

### Case 2.1: Dynamic Skipping at Runtime
Call `testInfo.skip()` inside a step to conditionally abort execution based on runtime state.

```typescript
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('I execute an administrative task', async ({ page }, testInfo) => {
  if (process.env.ENV === 'production') {
    // Aborts scenario immediately; marks as skipped
    testInfo.skip(true, 'Admin tasks are disabled in Production');
  }

  await page.goto('/admin');
});
```

### Case 2.2: Conditional Fixme / Expected Failure
Mark a scenario as `@fixme` or `@fail` programmatically based on browser type or feature flag.

```typescript
Given('I render a WebGL 3D Canvas', async ({ page, browserName }, testInfo) => {
  if (browserName === 'webkit') {
    testInfo.fixme(true, 'WebGL rendering issue on Safari (Bug #1234)');
  }

  await page.goto('/3d-viewer');
});
```

### Case 2.3: Adjusting Timeout Dynamically (`@slow` or `setTimeout`)
Increase the timeout dynamically inside a long-running step.

```typescript
When('I process large data batch', async ({ page }, testInfo) => {
  // Triples default timeout
  testInfo.slow();
  
  // Or explicitly set custom timeout in milliseconds
  testInfo.setTimeout(60000);

  await page.click('#process-large-batch');
});
```

### Case 2.4: Adding Custom Metadata to Test Reports
Attach key-value metadata to Playwright HTML / JSON reports dynamically.

```typescript
Then('I log execution metadata', async ({ page }, testInfo) => {
  // Adds custom annotation visible in HTML reporter
  testInfo.annotations.push({
    type: 'Jira ID',
    description: 'PROJ-5678',
  });

  testInfo.annotations.push({
    type: 'Environment',
    description: process.env.ENV || 'staging',
  });
});
```

---

## 3. Custom Tags for CLI Filtering

Beyond pre-defined annotations (`@skip`, `@fixme`, `@slow`, `@fail`), you can use custom tags for filtering test execution via the command line.

### Gherkin Setup
```gherkin
@smoke @regression
Feature: User Login

  @critical
  Scenario: Login with valid credentials
    Given I am on the login page
    ...

  @nightly
  Scenario: Login with expired password
    Given I attempt login with expired password
    ...
```

### CLI Execution Examples

#### Using `playwright-bdd` Tag Expressions (`npx bddgen`)
Filter tests at generation time using standard Gherkin tag logic:

```bash
# Run only @smoke scenarios
npx bddgen --tags "@smoke" && npx playwright test

# Exclude @nightly scenarios
npx bddgen --tags "not @nightly" && npx playwright test

# Combine logical operators (AND / OR / NOT)
npx bddgen --tags "(@smoke or @critical) and not @wip" && npx playwright test
```

#### Using Playwright Native Grep Inversion (`--grep-invert`)
Filter tests using Playwright's native test runner flags:

```bash
# Exclude tests tagged with @skip or @nightly
npx playwright test --grep-invert "@skip|@nightly"
```

---

## Summary Matrix

| Case | Where Implemented | Behavior |
| :--- | :--- | :--- |
| Static Skip | `.feature` (`@skip`) | Excludes scenario/feature from run. |
| Dynamic Skip | Step Definition (`testInfo.skip()`) | Aborts scenario execution at runtime when condition evaluates to `true`. |
| Broken Test | `.feature` (`@fixme`) | Skips scenario; tracks open bug. |
| Expected Failure | `.feature` (`@fail`) | Pass = Failed Test, Fail = Expected behavior. |
| Timeout Increase | `.feature` (`@slow`) | Triples timeout ($3 \times \text{default timeout}$). |
| Custom Filtering | `.feature` (`@tagName`) | Filtered via `--tags` or `--grep` flags. |