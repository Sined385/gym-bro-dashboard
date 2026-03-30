import { cookies } from "next/headers";
import { createHmac } from "crypto";

const COOKIE_NAME = "gym-dashboard-auth";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function generateToken(password: string): string {
  return createHmac("sha256", password).update("authenticated").digest("hex");
}

export async function setAuthCookie(password: string) {
  const token = generateToken(password);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function verifyAuth(): Promise<boolean> {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return false;

  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return false;

  const expected = generateToken(password);
  return cookie.value === expected;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
