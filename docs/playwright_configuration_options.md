# Playwright Configuration Options Reference

This document provides a comprehensive list of configuration options available in `playwright.config.js` or `playwright.config.ts`, organized by functional area.

## Basic Setup

In Playwright, configurations are defined using `defineConfig`:

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 1. Core Framework Options
  testDir: './tests',
  timeout: 30000,
  
  // 2. Global Execution / Context Options
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },

  // 3. Projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

---

## 1. Core Framework Options (Top-Level)

These options control test discovery, execution flow, timing, parallelism, and global hooks.

| Option | Type / Values | Description |
| :--- | :--- | :--- |
| **`testDir`** | `string` (e.g., `'./tests'`) | Directory where test files are located. |
| **`testMatch`** | `string \| RegExp \| Array` | Glob pattern or regex to match test files (default: `**/*.@(spec\|test).@(js\|ts\|mjs)`). |
| **`testIgnore`** | `string \| RegExp \| Array` | Glob pattern or regex to skip matching test files. |
| **`timeout`** | `number` (in ms, e.g., `30000`) | Timeout for each individual test in milliseconds (default: `30000` / 30s). |
| **`globalTimeout`** | `number` (in ms) | Overall execution timeout for the entire test run. |
| **`retries`** | `number` (e.g., `2`) | Maximum retry attempts for failed tests. |
| **`workers`** | `number \| string` (e.g., `4` or `'50%'`) | Number of parallel worker processes. |
| **`fullyParallel`** | `boolean` (`true \| false`) | Runs all tests in all files fully in parallel. |
| **`forbidOnly`** | `boolean` (`true \| false`) | Fails CI builds if `test.only` is present in code. |
| **`maxFailures`** | `number` | Stops execution after reaching a specified number of test failures. |
| **`repeatEach`** | `number` | Runs each test file $N$ times. |
| **`quiet`** | `boolean` (`true \| false`) | Suppresses `console.log` output during test execution. |
| **`outputDir`** | `string` (e.g., `'test-results/'`) | Output directory for test artifacts (traces, videos, screenshots). |
| **`preserveOutput`** | `'always' \| 'never' \| 'failures-only'` | Controls when to preserve test artifact output directories. |
| **`reporter`** | `string \| Array` | Formatter choices: `'list'`, `'line'`, `'dot'`, `'html'`, `'json'`, `'junit'`, `'github'`. |
| **`globalSetup`** | `string` (file path) | Path to module executed once before running tests. |
| **`globalTeardown`** | `string` (file path) | Path to module executed once after completing all tests. |
| **`grep`** | `RegExp \| Array<RegExp>` | Filters test execution based on test title match. |
| **`grepInvert`** | `RegExp \| Array<RegExp>` | Inverts `grep` filter to skip matching test titles. |

---

## 2. Browser & Context Execution Options (`use` Block)

Options placed inside the `use: { ... }` object apply globally or per project to the underlying browser and browser context.

### Basic Browser & Navigation Settings
| Option | Type / Values | Description |
| :--- | :--- | :--- |
| **`baseURL`** | `string` (e.g., `'http://localhost:3000'`) | Base URL prefix for relative navigations (`page.goto('/login')`). |
| **`browserName`** | `'chromium' \| 'firefox' \| 'webkit'` | Target browser engine. |
| **`channel`** | `'chrome' \| 'msedge' \| 'chrome-canary'` | Specific distribution channel for Chromium browsers. |
| **`headless`** | `boolean` (`true \| false`) | Runs browser window in headless background mode (default: `true`). |
| **`actionTimeout`** | `number` (in ms) | Max execution time for actions like `click()`, `fill()`, etc. |
| **`navigationTimeout`** | `number` (in ms) | Max execution time for navigation actions like `goto()`. |
| **`testIdAttribute`** | `string` (e.g., `'data-testid'`) | Attribute used by `getByTestId()` locators. |

### Emulation & Device Settings
| Option | Type / Values | Description |
| :--- | :--- | :--- |
| **`viewport`** | `{ width: number, height: number } \| null` | Window dimensions (e.g., `{ width: 1280, height: 720 }`). |
| **`userAgent`** | `string` | Custom `User-Agent` string header. |
| **`deviceScaleFactor`** | `number` (e.g., `2` for Retina) | Screen pixel density scaling factor. |
| **`isMobile`** | `boolean` (`true \| false`) | Metatag viewport calculation simulating mobile viewports. |
| **`hasTouch`** | `boolean` (`true \| false`) | Enables touch event simulation. |
| **`locale`** | `string` (e.g., `'en-US'`, `'de-DE'`) | Emulates browser culture and language locale. |
| **`timezoneId`** | `string` (e.g., `'America/New_York'`) | Overrides context system timezone. |
| **`colorScheme`** | `'light' \| 'dark' \| 'no-preference'` | Emulates `prefers-color-scheme` media query. |
| **`geolocation`** | `{ latitude: number, longitude: number }` | Overrides context geographic location. |
| **`permissions`** | `Array<string>` (e.g., `['geolocation']`) | Auto-grants browser permissions. |

### Network, Security & Auth Settings
| Option | Type / Values | Description |
| :--- | :--- | :--- |
| **`storageState`** | `string \| object` (e.g., `'auth.json'`) | Pre-populates cookies and local storage state for auth. |
| **`extraHTTPHeaders`** | `Record<string, string>` | Custom HTTP headers sent on every request. |
| **`httpCredentials`** | `{ username: string, password: string }` | HTTP Basic/Digest authentication. |
| **`ignoreHTTPSErrors`** | `boolean` (`true \| false`) | Ignores invalid SSL/TLS certificate errors. |
| **`offline`** | `boolean` (`true \| false`) | Emulates offline network state. |
| **`proxy`** | `{ server: string, bypass?: string }` | Custom proxy server configuration. |
| **`bypassCSP`** | `boolean` (`true \| false`) | Bypasses Content Security Policy rules. |

### Artifacts & Debugging Settings
| Option | Type / Values | Description |
| :--- | :--- | :--- |
| **`screenshot`** | `'off' \| 'on' \| 'only-on-failure'` | Captures automatic page screenshots. |
| **`video`** | `'off' \| 'on' \| 'retain-on-failure' \| 'on-first-retry'` | Controls screen recording behavior. |
| **`trace`** | `'off' \| 'on' \| 'retain-on-failure' \| 'on-first-retry'` | Captures execution step traces for Playwright Trace Viewer. |

---

## 3. WebServer Configuration (`webServer`)

Spawns a local development server before tests run and stops it when execution finishes.

```javascript
webServer: {
  command: 'npm run start',
  url: 'http://localhost:3000',
  timeout: 120 * 1000,
  reuseExistingServer: !process.env.CI,
}
```

| Option | Type / Values | Description |
| :--- | :--- | :--- |
| **`command`** | `string` | CLI command required to start the local server. |
| **`url`** | `string` | Target endpoint URL to poll until the server is ready. |
| **`port`** | `number` | Alternative to `url`, checks `http://127.0.0.1:<port>`. |
| **`timeout`** | `number` (in ms) | Maximum time allowed for the app server to start up (default: 60s). |
| **`reuseExistingServer`** | `boolean` (`true \| false`) | Reuses a server if it is already running locally instead of starting a new one. |
| **`cwd`** | `string` | Directory path where `command` should run. |
| **`env`** | `Record<string, string>` | Custom environment variables for the server process. |

---

## 4. Assertion & Visual Regression (`expect`)

Controls global options for web-first assertions, snapshot diffing, and screenshot comparisons.

```javascript
expect: {
  timeout: 5000,
  toHaveScreenshot: { maxDiffPixels: 100 },
  toMatchSnapshot: { threshold: 0.2 },
}
```

| Option | Type / Values | Description |
| :--- | :--- | :--- |
| **`timeout`** | `number` (in ms) | Max wait time for async web-first assertions like `expect().toBeVisible()` (default: 5000). |
| **`toHaveScreenshot`** | `Object` | Controls image comparisons (`maxDiffPixels`, `threshold`, `animations`). |
| **`toMatchSnapshot`** | `Object` | Controls snapshot comparisons (`maxDiffPixelRatio`, `threshold`). |

---

## 5. Projects Configuration (`projects`)

The `projects` array allows splitting tests into different execution targets (browsers, viewports, setup jobs).

```javascript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'setup',
    testMatch: /.*\.setup\.ts/,
  },
]
```

| Option | Type / Values | Description |
| :--- | :--- | :--- |
| **`name`** | `string` | Unique identifier for the project. |
| **`use`** | `Object` | Project-specific overrides for browser context properties. |
| **`testDir`** | `string` | Project-specific test directory override. |
| **`testMatch`** | `string \| RegExp` | Filters which tests run under this specific project. |
| **`dependencies`** | `Array<string>` | Names of other projects that must complete execution before this project starts. |
| **`teardown`** | `string` | Specifies a cleanup project to run after this project finishes. |