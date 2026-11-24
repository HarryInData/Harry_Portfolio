import { promises as fs } from "fs";
import path from "path";
import type { SiteContent } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");

export async function readContent(): Promise<SiteContent> {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export async function writeContent(content: SiteContent) {
  const temp = `${DATA_PATH}.${crypto.randomUUID()}.tmp`;
  try {
    await fs.writeFile(temp, JSON.stringify(content, null, 2), "utf8");
    await fs.rename(temp, DATA_PATH);
  } finally {
    await fs.rm(temp, { force: true });
  }
}
