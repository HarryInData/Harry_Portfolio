import type { SiteContent } from "./types";

type Row = Record<string, unknown>;
const object = (x: unknown): x is Row => typeof x === "object" && x !== null && !Array.isArray(x);
const text = (x: unknown) => typeof x === "string";
const fields = (row: Row, ...keys: string[]) => keys.every((k) => text(row[k]));
const strings = (x: unknown) => Array.isArray(x) && x.every(text);
const rows = (x: unknown, check: (row: Row) => boolean) =>
  Array.isArray(x) && x.every((r) => object(r) && text(r.id) && check(r));
const link = (x: unknown) => x === undefined || x === "" ||
  (typeof x === "string" && /^https?:\/\/[^/\s]+/i.test(x));
const asset = (x: unknown) => typeof x === "string" && x !== "" &&
  (/^\/(?![\\/])/.test(x) || link(x));

export function isSiteContent(x: unknown): x is SiteContent {
  if (!object(x) || !object(x.profile)) return false;
  const p = x.profile;
  return fields(p, "name", "headline", "location", "about", "avatar", "email", "instagram", "linkedin", "github", "education")
    && (p.avatar === "" || asset(p.avatar)) && [p.instagram, p.linkedin, p.github].every(link)
    && (x.resumeUrl === null || asset(x.resumeUrl))
    && rows(x.projects, r => fields(r, "title", "description") && strings(r.stack) &&
      typeof r.featured === "boolean" && link(r.github) && link(r.demo))
    && rows(x.skills, r => fields(r, "category") && strings(r.items))
    && rows(x.certifications, r => fields(r, "title", "issuer", "date") && link(r.url) &&
      (r.credentialId === undefined || text(r.credentialId)))
    && rows(x.experience, r => fields(r, "role", "org", "period") && strings(r.bullets))
    && rows(x.gallery, r => fields(r, "title") && asset(r.src))
    && rows(x.music, r => fields(r, "title", "artist") && asset(r.src));
}
