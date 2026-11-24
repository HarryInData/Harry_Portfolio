import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/store";
import { isSiteContent } from "@/lib/validate-content";

export const runtime = "nodejs";

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content);
}

export async function PUT(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body: unknown = await req.json().catch(() => null);
  if (!isSiteContent(body)) {
    return NextResponse.json({ error: "Invalid portfolio data. Check your fields and URLs." }, { status: 400 });
  }
  await writeContent(body);
  return NextResponse.json({ ok: true });
}
