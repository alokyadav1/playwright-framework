# LCS Playwright E2E Automation Framework

This repository contains the **Playwright BDD (Cucumber) E2E Automation Framework** migrated from the Cypress E2E automation test suite for the **LCS E-Commerce Platform** (`https://vfashion.logixal.com/`).

---

## 🏗️ Architecture & Framework Overview

The framework follows the **Page Object Model (POM)** pattern integrated with **BDD Gherkin feature files** via `playwright-bdd`.

```text
/home/alok/coding/LCS-playwright/
├── package.json                   # Dependencies and scripts
├── playwright.config.js           # Playwright BDD configuration
├── README.md                      # Framework documentation
└── tests/
    ├── data/
    │   └── dev/
    │       └── en-us.json         # Test data fixture (credentials, products)
    ├── locators/                  # Page locators in JSON format
    │   ├── login.json
    │   ├── header.json
    │   ├── home.json
    │   ├── pdp.json
    │   ├── plp.json
    │   ├── cart.json
    │   ├── checkout.json
    │   └── placeOrder.json
    ├── pages/                     # Page Object Model classes
    │   ├── login.page.js
    │   ├── header.page.js
    │   ├── home.page.js
    │   ├── pdp.page.js
    │   ├── plp.page.js
    │   ├── cart.page.js
    │   ├── checkout.page.js
    │   └── placeOrder.page.js
    ├── step-definitions/          # Feature files & step definition mappings
    │   ├── Login/
    │   │   ├── Login.feature
    │   │   └── Login.js
    │   ├── Cart/
    │   │   ├── Cart.feature
    │   │   └── Cart.js
    │   ├── Checkout/
    │   │   ├── Checkout.feature
    │   │   └── Checkout.js
    │   ├── PlaceOrder/
    │   │   ├── PlaceOrder.feature
    │   │   └── PlaceOrder.js
    │   └── EndToEnd/
    │       ├── EndToEnd.feature
    │       └── EndToEnd.js
    ├── utils/
    │   ├── crypto.js              # Encrypted credential helper (AES-128-CBC)
    │   └── sessionManager.js      # Session caching & storage state manager
    └── fixtures.js                # Custom Playwright test fixture & POM injector
```

---

## 🚀 Covered End-to-End Scenarios

1. **Login (`Login.feature`)**: `LGN_1 - Verify user sign in with valid credentials`
2. **Cart (`Cart.feature`)**: `CRT_1 - Verify product details in cart and proceed to checkout`
3. **Checkout (`Checkout.feature`)**: `CHK_1 - Verify logged in user can navigate to checkout and open shipping method`
4. **Place Order (`PlaceOrder.feature`)**: `PLO_1 - Verify logged in user is able to place order using credit card`
5. **End-to-End (`EndToEnd.feature`)**: `E2E_1 - Complete E2E flow from Login to Order Placement`

---

## ⚡ Execution Commands

### 1. Generate BDD Code
Generates test spec files from `.feature` files:
```bash
npm run bdd:gen
```

### 2. Run All Tests (Headless)
```bash
npm run test
```

### 3. Run Tests in Headed Mode
```bash
npm run test:headed
```

### 4. Run Specific E2E Tag
```bash
npm run test:e2e
```

### 5. View HTML Report
```bash
npm run report
```

---

## ✨ Key Playwright Best Practices Applied

- **Page Object Model (POM)**: Enforces Separation of Concerns between locators, page actions, and test scenarios.
- **Auto-Waiting & Web Assertions**: Replaced arbitrary pauses with Playwright's built-in auto-waiting and web assertions (`await expect(locator).toBeVisible()`, `await expect(page).toHaveURL()`).
- **Encrypted Credential Handling**: Encrypted secrets are handled using AES-128-CBC decryption utility seamlessly.
- **Fixtures Injection**: Custom fixture injects page object instances directly into step definitions.
