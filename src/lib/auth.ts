export const AUTH_COOKIE = "__noirven_session";

export type SessionRole = "admin" | "user";

export type AuthSession = {
  sub: string;
  role: SessionRole;
  email?: string;
  nickname?: string;
  iat: number;
  exp: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const sessionTtlSeconds = 60 * 60 * 24 * 7;

function getAuthSecret() {
  return process.env.NOIRVEN_AUTH_SECRET || process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
}

export function isAuthConfigured() {
  return Boolean(getAuthSecret());
}

export function isAdminAuthConfigured() {
  return Boolean(getAuthSecret() && process.env.NOIRVEN_ADMIN_USERNAME && process.env.NOIRVEN_ADMIN_PASSWORD);
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function sign(value: string) {
  const secret = getAuthSecret();

  if (!secret) {
    throw new Error("Noirven auth secret is not configured");
  }

  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return bytesToBase64Url(new Uint8Array(signature));
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

export async function createSessionToken(input: Omit<AuthSession, "iat" | "exp">) {
  const now = Math.floor(Date.now() / 1000);
  const session: AuthSession = {
    ...input,
    iat: now,
    exp: now + sessionTtlSeconds,
  };
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify(session)));
  const signature = await sign(payload);

  return `${payload}.${signature}`;
}

export async function verifySessionToken(token?: string | null): Promise<AuthSession | null> {
  if (!token || !isAuthConfigured()) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = await sign(payload);
  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const session = JSON.parse(decoder.decode(base64UrlToBytes(payload))) as AuthSession;
    if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function getCookieOptions(maxAge = sessionTtlSeconds) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

function parseCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) {
    return new Map<string, string>();
  }

  return new Map(
    cookieHeader.split(";").map((part) => {
      const [name, ...rest] = part.trim().split("=");
      return [name, rest.join("=")];
    }),
  );
}

export async function getSessionFromRequest(request: Request) {
  const cookies = parseCookieHeader(request.headers.get("cookie"));
  return verifySessionToken(cookies.get(AUTH_COOKIE));
}

export async function requireUserSession(request: Request) {
  const session = await getSessionFromRequest(request);
  return session?.role === "user" || session?.role === "admin" ? session : null;
}

export async function requireAdminSession(request: Request) {
  const session = await getSessionFromRequest(request);
  return session?.role === "admin" ? session : null;
}

export function validateAdminCredentials(username: string, password: string) {
  return (
    isAdminAuthConfigured() &&
    username === process.env.NOIRVEN_ADMIN_USERNAME &&
    password === process.env.NOIRVEN_ADMIN_PASSWORD
  );
}

export function safeNextPath(value: FormDataEntryValue | string | null, fallback: string) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
