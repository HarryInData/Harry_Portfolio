import { cookies } from "next/headers";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const COOKIE = "hari_os_admin";

const lifetime = 60 * 60 * 24;
function sign(payload: string) {
  return createHmac("sha256", process.env.ADMIN_PASSWORD!).update(payload).digest("hex");
}

export async function isAuthed() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value ?? "";
  const match = /^(\d{13}\.[\da-f-]{36})\.([\da-f]{64})$/.exec(token);
  if (!process.env.ADMIN_PASSWORD || !match || Number(token.slice(0, 13)) <= Date.now()) return false;
  return timingSafeEqual(Buffer.from(match[2]), Buffer.from(sign(match[1])));
}

export async function setAuthCookie() {
  const jar = await cookies();
  const payload = `${Date.now() + lifetime * 1000}.${randomUUID()}`;
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: lifetime,
  });
}

export async function clearAuthCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
