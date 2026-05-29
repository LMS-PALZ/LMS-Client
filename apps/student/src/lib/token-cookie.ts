import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "ssu_google_refresh";
const ALGO = "aes-256-gcm";

function getKey() {
  const secret = process.env.TOKEN_ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error("TOKEN_ENCRYPTION_SECRET is not configured");
  }
  return scryptSync(secret, "ssu-google-salt", 32);
}

export function sealToken(plain: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

export function openToken(sealed: string): string {
  const key = getKey();
  const buf = Buffer.from(sealed, "base64url");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString(
    "utf8",
  );
}

export async function setRefreshTokenCookie(refreshToken: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, sealToken(refreshToken), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
}

export async function getRefreshTokenFromCookie(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return null;
  try {
    return openToken(value);
  } catch {
    return null;
  }
}

export async function clearRefreshTokenCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
