import { NextResponse } from "next/server";
import { clearAuthCookie, isAuthed, setAuthCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: await isAuthed() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!process.env.ADMIN_PASSWORD || body?.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  await setAuthCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
