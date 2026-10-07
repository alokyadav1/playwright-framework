/**
 * API tests for POST /auth/VT/login
 *
 * Uses only the `request` fixture — no browser/page involved.
 * Credentials are read from the existing data file (AES-256-GCM encrypted)
 * with env-var fallbacks (API_USERNAME / API_PASSWORD_B64).
 *
 * Run:
 *   npx playwright test --project=api
 *   npm run test:api
 */
import { test, expect } from "@playwright/test";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { decryptText } from "../utils/crypto.js";
import { validateSchema } from "./utils/schema.js";
import {
  loginSuccessSchema,
  loginErrorSchema,
} from "./schemas/login.schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env so SECRET_KEY is available for decryptText
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// ── Credentials ──────────────────────────────────────────────────────────────
// Priority: env vars → data file
const require = createRequire(import.meta.url);

function resolveCredentials() {
  if (process.env.API_USERNAME && process.env.API_PASSWORD_B64) {
    return {
      username: process.env.API_USERNAME,
      // Password is already base64 as the API expects; do not re-encode.
      password: process.env.API_PASSWORD_B64,
    };
  }

  // Fall back to the existing data file (tests/data/dev/vpro/en-us.json)
  const dataPath = path.resolve(__dirname, "../data/dev/vpro/en-us.json");
  const data = require(dataPath);

  const username = decryptText(data.loginEmail);
  // validPassword is the plain-text password; the API needs it base64-encoded.
  const plainPassword = decryptText(data.validPassword);
  const password = Buffer.from(plainPassword).toString("base64");

  return { username, password };
}

const { username, password } = resolveCredentials();

// ── Helpers ───────────────────────────────────────────────────────────────────
const LOGIN_ENDPOINT = "/auth/VT/login";

function buildBody(overrides = {}) {
  return {
    loginDetails: {
      body: {
        username,
        password,
        ...overrides,
      },
    },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────
test.describe("Auth API - /auth/VT/login", () => {
  // ── API_LOGIN_1 ──────────────────────────────────────────────────────────
  test(
    "API_LOGIN_1 - Valid credentials return HTTP 200 and a schema-valid body",
    { tag: ["@api", "@login"] },
    async ({ request }) => {
      const start = Date.now();
      const response = await request.post(LOGIN_ENDPOINT, {
        data: buildBody(),
      });
      const elapsed = Date.now() - start;

      // ── Soft assertion: response time < 10000 ms (API_LOGIN_4 concern)
      expect
        .soft(elapsed, `Response time ${elapsed}ms exceeded 10000ms`)
        .toBeLessThan(10000);

      // ── Status
      expect(response.status()).toBe(200);

      const body = await response.json();

      // ── Schema
      const { valid, errors } = validateSchema(loginSuccessSchema, body);
      expect(valid, `Schema validation failed:\n${errors}`).toBe(true);

      // ── Email in response matches the username used
      const responseEmail =
        body?.loginDetails?.message?.data?.response?.data?.email;
      expect(responseEmail).toBe(username);
    },
  );

  // ── API_LOGIN_2 ──────────────────────────────────────────────────────────
  test(
    "API_LOGIN_2 - Wrong password does not return a successful login",
    { tag: ["@api", "@login"] },
    async ({ request }) => {
      const response = await request.post(LOGIN_ENDPOINT, {
        data: buildBody({
          password: Buffer.from("wrong_password_xyz").toString("base64"),
        }),
      });

      const body = await response.json();

      expect(response.status()).toBe(401);

      // ── Schema Validation
      const { valid, errors } = validateSchema(loginErrorSchema, body);
      expect(valid, `Error schema validation failed:\n${errors}`).toBe(true);

      // ── Specific error details validation
      expect(body.errors[0].statusCode).toBe(401);
      expect(body.errors[0].message).toBe("Service Error");
      expect(body.errors[0].errors).toContain("Invalid UserName or Password");
      expect(body.path).toBe(LOGIN_ENDPOINT);
    },
  );

  // ── API_LOGIN_3 ──────────────────────────────────────────────────────────
  test(
    "API_LOGIN_3 - Missing username does not return a successful login",
    { tag: ["@api", "@login"] },
    async ({ request }) => {
      const response = await request.post(LOGIN_ENDPOINT, {
        data: {
          loginDetails: {
            body: {
              // username intentionally omitted
              password,
            },
          },
        },
      });

      const body = await response.json();

      expect(response.status()).toBe(422);

      // ── Schema Validation
      const { valid, errors } = validateSchema(loginErrorSchema, body);
      expect(valid, `Error schema validation failed:\n${errors}`).toBe(true);

      // ── Specific error details validation
      expect(body.errors[0].statusCode).toBe(422);
      expect(body.errors[0].message).toBe("Validation failed");
      expect(body.errors[0].errors).toEqual(
        expect.arrayContaining([
          "username should not be null or undefined",
          "username must be a string",
          "username should not be empty",
        ]),
      );
      expect(body.path).toBe(LOGIN_ENDPOINT);
    },
  );
});
