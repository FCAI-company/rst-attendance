import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY || "default-secret-key"; // use .env in production
const IV_LENGTH = 16;

export function encryptData(data: any): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(SECRET_KEY).digest(),
    iv,
  );
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");
  encrypted += cipher.final("base64");
  return iv.toString("base64") + ":" + encrypted;
}

export function decryptData(encrypted: string): any {
  const [ivStr, content] = encrypted.split(":");
  const iv = Buffer.from(ivStr, "base64");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(SECRET_KEY).digest(),
    iv,
  );
  let decrypted = decipher.update(content, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}
