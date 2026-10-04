import crypto from "node:crypto";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure .env is loaded if process.env.SECRET_KEY is missing
if (!process.env.SECRET_KEY) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
    dotenv.config({ path: path.resolve(__dirname, "../../", envFile) });
}

const ALGORITHM = "aes-256-gcm";

function getDerivedKey(secretKey) {
    const keyStr = String(secretKey || process.env.SECRET_KEY || "12345678901234567890123456789012");
    return crypto.createHash("sha256").update(keyStr).digest();
}

/**
 * Encrypt plain text using AES-256-GCM.
 * Format: <ivHex>:<authTagHex>:<encryptedHex>
 */
export function encryptText(text, secretKey) {
    if (!text) return "";
    const key = getDerivedKey(secretKey);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypt text using AES-256-GCM with fallback for legacy AES-128-CBC or raw text.
 */
export function decryptText(data, secretKey) {
    if (!data || typeof data !== "string") return data || "";

    // 1. Modern AES-256-GCM format (iv:authTag:encrypted)
    if (data.includes(":")) {
        try {
            const [ivHex, authTagHex, encryptedHex] = data.split(":");
            const key = getDerivedKey(secretKey);
            const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, "hex"));
            decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

            let decrypted = decipher.update(encryptedHex, "hex", "utf8");
            decrypted += decipher.final("utf8");
            return decrypted;
        } catch (err) {
            console.warn("AES-256-GCM decryption failed. Check process.env.SECRET_KEY. Error:", err.message);
            return data;
        }
    }

    // 2. Fallback for legacy hex-only strings (e.g. Cypress AES-128-CBC)
    if (/^[0-9a-fA-F]{32,}$/.test(data)) {
        try {
            const rawKey = String(secretKey || process.env.SECRET_KEY || "1234567890123456");
            const key = Buffer.from(rawKey.padEnd(16, "0").slice(0, 16), "utf8");
            const iv = Buffer.alloc(16, 0);
            const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
            let decrypted = decipher.update(data, "hex", "utf8");
            decrypted += decipher.final("utf8");
            return decrypted;
        } catch {
            return data;
        }
    }

    return data;
}
