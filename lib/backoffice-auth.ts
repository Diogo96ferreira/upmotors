import { createHash } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKOFFICE_COOKIE = "upmotors_backoffice_session";

function getExpectedToken() {
  const password = process.env.BACKOFFICE_PASSWORD;

  if (!password) {
    return null;
  }

  return createHash("sha256").update(password).digest("hex");
}

export async function isBackofficeAuthenticated() {
  const expectedToken = getExpectedToken();

  if (!expectedToken) {
    return false;
  }

  const cookieStore = await cookies();
  return cookieStore.get(BACKOFFICE_COOKIE)?.value === expectedToken;
}

export async function requireBackofficeSession() {
  const authenticated = await isBackofficeAuthenticated();

  if (!authenticated) {
    redirect("/backoffice/login");
  }
}

export async function createBackofficeSession() {
  const expectedToken = getExpectedToken();

  if (!expectedToken) {
    throw new Error("BACKOFFICE_PASSWORD is not configured.");
  }

  const cookieStore = await cookies();
  cookieStore.set(BACKOFFICE_COOKIE, expectedToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearBackofficeSession() {
  const cookieStore = await cookies();
  cookieStore.delete(BACKOFFICE_COOKIE);
}

export function isBackofficePasswordConfigured() {
  return Boolean(process.env.BACKOFFICE_PASSWORD);
}
