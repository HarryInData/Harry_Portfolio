"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SiteContent } from "@/lib/types";

const empty: SiteContent = {
  profile: {
    name: "",
    headline: "",
    location: "",
    about: "",
    avatar: "/avatar.png",
    email: "",
    instagram: "",
    linkedin: "",
    github: "",
    education: "",
  },
  resumeUrl: null,
  projects: [],
  skills: [],
  certifications: [],
  experience: [],
  gallery: [],
  music: [],
};

type Tab =
  | "profile"
  | "resume"
  | "projects"
  | "skills"
  | "certs"
  | "gallery"
  | "music";

export function AdminClient({ initialContent }: { initialContent: SiteContent | null }) {
  const [authed, setAuthed] = useState(Boolean(initialContent));
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [content, setContent] = useState<SiteContent>(initialContent ?? empty);
  const [tab, setTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Wrong password");
      return;
    }
    window.location.reload();
  };

  const save = async () => {
    setSaving(true);
    setOk("");
    setError("");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    }).catch(() => null);
    setSaving(false);
    if (res?.ok) setOk("Saved");
    else setError(res?.status === 400 ? "Check the profile fields and URLs before saving." : "Could not save. Check your connection and session.");
  };

  const upload = async (
    kind: "resume" | "gallery" | "music",
    file: File,
    extra?: { title?: string; artist?: string },
  ) => {
    const form = new FormData();
    setError("");
    setOk("");
    form.set("kind", kind);
    form.set("file", file);
    if (extra?.title) form.set("title", extra.title);
    if (extra?.artist) form.set("artist", extra.artist);
    const res = await fetch("/api/upload", { method: "POST", body: form }).catch(() => null);
    if (!res?.ok) {
      setError(res ? (await res.json().catch(() => ({}))).error || "Upload failed" : "Could not connect to upload.");
      return;
    }
    const data = (await res.json()) as { content: SiteContent };
    const key = kind === "resume" ? "resumeUrl" : kind;
    setContent(prev => ({ ...prev, [key]: data.content[key] }));
    setOk("Uploaded");
  };

  const remove = async (kind: "resume" | "gallery" | "music", id?: string) => {
    const res = await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, id }),
    });
    if (!res.ok) {
      setError("Could not remove the file. Sign in again and retry.");
      return;
    }
    const data = (await res.json()) as { content: SiteContent };
    const key = kind === "resume" ? "resumeUrl" : kind;
    setContent(prev => ({ ...prev, [key]: data.content[key] }));
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center macos-desktop">
        <form
          onSubmit={login}
          className="glass w-[380px] rounded-2xl p-8 window-chrome"
        >
          <p className="text-center text-4xl"></p>
          <h1 className="mt-3 text-center text-xl font-semibold">HariOS Admin</h1>
          <p className="mt-1 text-center text-sm text-black/55">
            Sign in to attach resume, gallery, music, and projects.
          </p>
          <input
            type="password"
            className="mt-6 h-11 w-full rounded-lg border border-black/10 bg-white/80 px-3"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button className="mt-4 h-11 w-full rounded-lg bg-blue-600 text-white">
            Unlock
          </button>
          <Link href="/" className="mt-4 block text-center text-sm underline">Back to desktop</Link>
        </form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "resume", label: "Resume" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "certs", label: "Certificates" },
    { id: "gallery", label: "Gallery" },
    { id: "music", label: "Music" },
  ];

  return (
    <div className="macos-desktop min-h-screen p-6 text-[#1d1d1f]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row">
        <aside className="glass shrink-0 rounded-2xl p-3 md:w-52">
          <p className="px-2 py-2 text-sm font-semibold">System Settings</p>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
                tab === t.id ? "bg-blue-600 text-white" : "hover:bg-white/40"
              }`}
            >
              {t.label}
            </button>
          ))}
          <Link href="/" className="mt-4 block px-3 text-sm text-blue-800 underline">
            Back to desktop
          </Link>
          <button
            className="mt-2 px-3 text-sm text-black/50"
            onClick={async () => {
              await fetch("/api/auth", { method: "DELETE" });
              setAuthed(false);
            }}
          >
            Sign out
          </button>
        </aside>

        <main className="glass min-w-0 flex-1 rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">{tabs.find((t) => t.id === tab)?.label}</h1>
            <button
              onClick={save}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
          {(ok || error) && (
            <p className="mb-3 text-sm text-black/60">
              {ok} {error}
            </p>
          )}

          {tab === "profile" && (
            <div className="grid gap-3">
              {(
                [
                  ["name", "Name"],
                  ["headline", "Headline"],
                  ["location", "Location"],
                  ["education", "Education"],
                  ["email", "Email"],
                  ["linkedin", "LinkedIn"],
                  ["github", "GitHub"],
                  ["instagram", "Instagram"],
                  ["avatar", "Avatar URL"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="text-sm">
                  {label}
                  <input
                    className="mt-1 h-10 w-full rounded-lg border border-black/10 bg-white/80 px-3"
                    value={content.profile[key]}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        profile: { ...content.profile, [key]: e.target.value },
                      })
                    }
                  />
                </label>
              ))}
              <label className="text-sm">
                About
                <textarea
                  className="mt-1 h-32 w-full rounded-lg border border-black/10 bg-white/80 p-3"
                  value={content.profile.about}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      profile: { ...content.profile, about: e.target.value },
                    })
                  }
                />
              </label>
            </div>
          )}

          {tab === "resume" && (
            <div>
              <p className="text-sm text-black/60">
                Upload a PDF. Visitors can open it from the Resume app on the desktop.
              </p>
              <input
                type="file"
                accept="application/pdf"
                className="mt-4"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload("resume", file);
                }}
              />
              {content.resumeUrl && (
                <div className="mt-4 flex items-center gap-3 text-sm">
                  <a className="text-blue-700 underline" href={content.resumeUrl} target="_blank">
                    Current resume
                  </a>
                  <button className="text-red-600" onClick={() => void remove("resume")}>
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "projects" && (
            <ListEditor
              items={content.projects}
              onChange={(projects) => setContent({ ...content, projects })}
              blank={() => ({
                id: crypto.randomUUID(),
                title: "New project",
                description: "",
                stack: [],
                github: "",
                demo: "",
                featured: false,
              })}
              render={(p, patch) => (
                <div className="grid gap-2">
                  <input
                    className="h-9 rounded-lg border border-black/10 px-2"
                    value={p.title}
                    onChange={(e) => patch({ title: e.target.value })}
                  />
                  <textarea
                    className="h-20 rounded-lg border border-black/10 p-2 text-sm"
                    value={p.description}
                    onChange={(e) => patch({ description: e.target.value })}
                  />
                  <input
                    className="h-9 rounded-lg border border-black/10 px-2 text-sm"
                    placeholder="Stack, comma separated"
                    defaultValue={p.stack.join(", ")}
                    onBlur={(e) =>
                      patch({
                        stack: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                  <input
                    className="h-9 rounded-lg border border-black/10 px-2 text-sm"
                    placeholder="GitHub URL"
                    value={p.github ?? ""}
                    onChange={(e) => patch({ github: e.target.value })}
                  />
                  <input
                    className="h-9 rounded-lg border border-black/10 px-2 text-sm"
                    placeholder="Live demo URL"
                    value={p.demo ?? ""}
                    onChange={(e) => patch({ demo: e.target.value })}
                  />
                  <label className="text-sm">
                    <input
                      type="checkbox"
                      checked={p.featured}
                      onChange={(e) => patch({ featured: e.target.checked })}
                    />{" "}
                    Featured
                  </label>
                </div>
              )}
            />
          )}

          {tab === "skills" && (
            <ListEditor
              items={content.skills}
              onChange={(skills) => setContent({ ...content, skills })}
              blank={() => ({
                id: crypto.randomUUID(),
                category: "New group",
                items: [],
              })}
              render={(g, patch) => (
                <div className="grid gap-2">
                  <input
                    className="h-9 rounded-lg border border-black/10 px-2"
                    value={g.category}
                    onChange={(e) => patch({ category: e.target.value })}
                  />
                  <input
                    className="h-9 rounded-lg border border-black/10 px-2 text-sm"
                    placeholder="Skills, comma separated"
                    defaultValue={g.items.join(", ")}
                    onBlur={(e) =>
                      patch({
                        items: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
              )}
            />
          )}

          {tab === "certs" && (
            <ListEditor
              items={content.certifications}
              onChange={(certifications) => setContent({ ...content, certifications })}
              blank={() => ({
                id: crypto.randomUUID(),
                title: "New certificate",
                issuer: "",
                date: "",
                credentialId: "",
                url: "",
              })}
              render={(c, patch) => (
                <div className="grid gap-2">
                  <input
                    className="h-9 rounded-lg border border-black/10 px-2"
                    value={c.title}
                    onChange={(e) => patch({ title: e.target.value })}
                  />
                  <input
                    className="h-9 rounded-lg border border-black/10 px-2 text-sm"
                    placeholder="Issuer"
                    value={c.issuer}
                    onChange={(e) => patch({ issuer: e.target.value })}
                  />
                  <input
                    className="h-9 rounded-lg border border-black/10 px-2 text-sm"
                    placeholder="Date"
                    value={c.date}
                    onChange={(e) => patch({ date: e.target.value })}
                  />
                  <input
                    className="h-9 rounded-lg border border-black/10 px-2 text-sm"
                    placeholder="Credential ID"
                    value={c.credentialId ?? ""}
                    onChange={(e) => patch({ credentialId: e.target.value })}
                  />
                  <input
                    className="h-9 rounded-lg border border-black/10 px-2 text-sm"
                    placeholder="URL"
                    value={c.url ?? ""}
                    onChange={(e) => patch({ url: e.target.value })}
                  />
                </div>
              )}
            />
          )}

          {tab === "gallery" && (
            <div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif,.avif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload("gallery", file, { title: file.name });
                }}
              />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {content.gallery.map((g) => (
                  <figure key={g.id} className="overflow-hidden rounded-xl bg-white/50">
                    <Image width={240} height={112} sizes="220px" unoptimized={!g.src.startsWith("/")} src={g.src} alt={g.title} className="h-28 w-full object-cover" />
                    <figcaption className="flex items-center justify-between p-2 text-xs">
                      <span className="truncate">{g.title}</span>
                      <button className="text-red-600" onClick={() => void remove("gallery", g.id)}>
                        Delete
                      </button>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {tab === "music" && (
            <MusicUpload
              tracks={content.music}
              onUpload={(file, title, artist) =>
                void upload("music", file, { title, artist })
              }
              onDelete={(id) => void remove("music", id)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function ListEditor<T extends { id: string }>({
  items,
  onChange,
  blank,
  render,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  blank: () => T;
  render: (item: T, patch: (p: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <button
        className="rounded-lg bg-black/80 px-3 py-1.5 text-sm text-white"
        onClick={() => onChange([blank(), ...items])}
      >
        Add
      </button>
      {items.map((item, i) => (
        <div key={item.id} className="rounded-xl bg-white/55 p-3">
          {render(item, (p) => {
            const next = [...items];
            next[i] = { ...item, ...p };
            onChange(next);
          })}
          <button
            className="mt-2 text-xs text-red-600"
            onClick={() => onChange(items.filter((x) => x.id !== item.id))}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function MusicUpload({
  tracks,
  onUpload,
  onDelete,
}: {
  tracks: SiteContent["music"];
  onUpload: (file: File, title: string, artist: string) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState<File | null>(null);
  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          className="h-10 rounded-lg border border-black/10 px-3"
          placeholder="Track title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="h-10 rounded-lg border border-black/10 px-3"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
      </div>
      <input
        type="file"
        accept=".mp3,.m4a,.wav,.ogg"
        className="mt-3"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
        onClick={() => {
          if (!file) return;
          onUpload(file, title || file.name, artist || "Unknown");
          setTitle("");
          setArtist("");
          setFile(null);
        }}
      >
        Add track
      </button>
      <ul className="mt-4 space-y-2">
        {tracks.map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2 text-sm">
            <span>
              {t.title} — {t.artist}
            </span>
            <button className="text-red-600" onClick={() => onDelete(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
