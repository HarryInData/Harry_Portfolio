import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthed } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/store";

export const runtime = "nodejs";

const KINDS = ["resume", "gallery", "music"] as const;
type Kind = (typeof KINDS)[number];

const extensions = {
  resume: [".pdf"],
  gallery: [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"],
  music: [".mp3", ".m4a", ".wav", ".ogg"],
};
const maxBytes = 20 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (Number(req.headers.get("content-length")) > maxBytes + 65536) {
    return NextResponse.json({ error: "20 MB limit" }, { status: 413 });
  }
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  const kind = String(form.get("kind") || "") as Kind;
  const file = form.get("file");
  if (!KINDS.includes(kind) || !(file instanceof File)) {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const ext = path.extname(file.name).toLowerCase();
  if (!extensions[kind].includes(ext) || !file.size) {
    return NextResponse.json({ error: "Unsupported or empty file" }, { status: 400 });
  }
  if (file.size > maxBytes) return NextResponse.json({ error: "20 MB limit" }, { status: 413 });
  const filename = `${id}${ext}`;
  const rel = `/uploads/${kind}/${filename}`;
  const dest = path.join(process.cwd(), "public", rel);

  await fs.mkdir(path.dirname(dest), { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(dest, buf);

  const content = await readContent();
  const title = String(form.get("title") || file.name);
  const artist = String(form.get("artist") || "Unknown");

  if (kind === "resume") {
    content.resumeUrl = rel;
  } else if (kind === "gallery") {
    content.gallery.unshift({ id, title, src: rel });
  } else {
    content.music.unshift({ id, title, artist, src: rel });
  }
  await writeContent(content);

  return NextResponse.json({ url: rel, id, content });
}

export async function DELETE(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, kind } = (await req.json()) as { id?: string; kind?: Kind };
  const content = await readContent();

  const removeFile = async (src?: string | null) => {
    if (!src || !KINDS.includes(kind!) || !src.startsWith(`/uploads/${kind}/`)
      || !/^[\w-][\w.-]*$/.test(src.slice(`/uploads/${kind}/`.length))) return;
    const full = path.join(process.cwd(), "public", src);
    await fs.unlink(full).catch(() => undefined);
  };

  if (kind === "resume") {
    await removeFile(content.resumeUrl);
    content.resumeUrl = null;
  } else if (kind === "gallery") {
    const item = content.gallery.find((g) => g.id === id);
    await removeFile(item?.src);
    content.gallery = content.gallery.filter((g) => g.id !== id);
  } else if (kind === "music") {
    const item = content.music.find((t) => t.id === id);
    await removeFile(item?.src);
    content.music = content.music.filter((t) => t.id !== id);
  }
  await writeContent(content);
  return NextResponse.json({ content });
}
