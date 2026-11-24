"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useContent } from "@/context/ContentContext";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-black/8 px-2.5 py-0.5 text-[11px] font-medium text-black/75">
      {children}
    </span>
  );
}

export function FinderApp() {
  const { content } = useContent();
  if (!content) return null;
  const p = content.profile;
  return (
    <div className="flex min-h-full">
      <aside className="hidden w-44 shrink-0 border-r border-black/10 bg-white/30 p-3 text-[12px] md:block">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-black/40">
          Favorites
        </p>
        {["About Me", "Experience", "Education"].map((item) => (
          <a href={`#finder-${item.split(" ")[0]}`} key={item} className="block rounded-md px-2 py-1.5 hover:bg-blue-500/15">
            {item}
          </a>
        ))}
      </aside>
      <div className="flex-1 p-6">
        <div id="finder-About" className="flex flex-col items-start gap-5 sm:flex-row">
          <Image width={112} height={112} unoptimized={!p.avatar.startsWith("/")}
            src={p.avatar || "/avatar.png"}
            alt={p.name}
            className="h-28 w-28 rounded-3xl object-cover shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{p.name}</h1>
            <p className="mt-1 text-sm text-black/65">{p.headline}</p>
            <p className="mt-1 text-sm text-black/50">{p.location}</p>
            <p id="finder-Education" className="mt-2 text-sm text-black/55">{p.education}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a className="text-sm text-blue-700 underline" href={p.linkedin} target="_blank">
                LinkedIn
              </a>
              <a className="text-sm text-blue-700 underline" href={p.github} target="_blank">
                GitHub
              </a>
              {p.instagram && (
                <a className="text-sm text-blue-700 underline" href={p.instagram} target="_blank">
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-[15px] leading-7 text-black/75">{p.about}</p>
        <h2 id="finder-Experience" className="mt-8 text-lg font-semibold">Experience</h2>
        <div className="mt-3 space-y-4">
          {content.experience.map((job) => (
            <article key={job.id} className="rounded-xl bg-white/50 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold">{job.role}</h3>
                <span className="text-xs text-black/50">{job.period}</span>
              </div>
              <p className="text-sm text-black/60">{job.org}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-black/70">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsApp() {
  const { content } = useContent();
  const [q, setQ] = useState("");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const list = useMemo(() => {
    return (content?.projects ?? []).filter((p) => {
      const hit = `${p.title} ${p.description} ${p.stack.join(" ")}`
        .toLowerCase()
        .includes(q.toLowerCase());
      return hit && (!onlyFeatured || p.featured);
    });
  }, [content, q, onlyFeatured]);

  if (!content) return null;
  return (
    <div className="p-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search projects"
          aria-label="Search projects"
          className="h-9 w-64 rounded-lg border border-black/10 bg-white/70 px-3 text-sm outline-none"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyFeatured}
            onChange={(e) => setOnlyFeatured(e.target.checked)}
          />
          Featured
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {!list.length && <p role="status" className="text-sm">No projects match these filters.</p>}
        {list.map((p) => (
          <article key={p.id} className="rounded-2xl bg-white/55 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              {p.featured && <Chip>Featured</Chip>}
            </div>
            <p className="mt-2 text-sm leading-6 text-black/70">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
            <div className="mt-3 flex gap-3 text-sm">
              {p.github && (
                <a className="text-blue-700 underline" href={p.github} target="_blank">
                  GitHub
                </a>
              )}
              {p.demo && (
                <a className="text-blue-700 underline" href={p.demo} target="_blank">
                  Live demo
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function SkillsApp() {
  const { content } = useContent();
  if (!content) return null;
  return (
    <div className="grid gap-4 p-6 sm:grid-cols-2">
      {content.skills.map((g) => (
        <section key={g.id} className="rounded-2xl bg-white/55 p-4">
          <h3 className="font-semibold">{g.category}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {g.items.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function CertsApp() {
  const { content } = useContent();
  if (!content) return null;
  return (
    <div className="space-y-3 p-5">
      {content.certifications.map((c) => (
        <article key={c.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white/55 p-4">
          <div>
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-black/60">
              {c.issuer} · {c.date}
            </p>
            {c.credentialId && (
              <p className="text-xs text-black/45">ID {c.credentialId}</p>
            )}
          </div>
          {c.url && (
            <a className="text-sm text-blue-700 underline" href={c.url} target="_blank">
              View
            </a>
          )}
        </article>
      ))}
    </div>
  );
}

export function ResumeApp() {
  const { content } = useContent();
  if (!content) return null;
  if (!content.resumeUrl) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-semibold">Resume not attached yet</p>
        <p className="mt-2 max-w-sm text-sm text-black/60">
          Open Admin from the dock, sign in, and upload a PDF. It will appear here instantly.
        </p>
        <a href="/admin" className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">
          Open Admin
        </a>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-2 text-sm">
        <span>Resume.pdf</span>
        <a className="text-blue-700 underline" href={content.resumeUrl} download>
          Download
        </a>
      </div>
      <iframe title="Resume" src={content.resumeUrl} className="min-h-0 flex-1 bg-white" />
    </div>
  );
}

export function PhotosApp() {
  const { content } = useContent();
  const [active, setActive] = useState<string | null>(null);
  if (!content) return null;
  if (!content.gallery.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-semibold">Gallery is empty</p>
        <p className="mt-2 text-sm text-black/60">
          Upload images from the Admin panel to show them here.
        </p>
      </div>
    );
  }
  const current = content.gallery.find((g) => g.id === active);
  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {content.gallery.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g.id)}
            className="overflow-hidden rounded-lg bg-black/5"
          >
            <Image width={224} height={112} sizes="180px" unoptimized={!g.src.startsWith("/")} src={g.src} alt={g.title} className="h-28 w-full object-cover" />
          </button>
        ))}
      </div>
      {current && (
        <button type="button" aria-label={`Close preview: ${current.title}`} autoFocus
          onKeyDown={(e) => { if (e.key === "Escape") setActive(null); }}
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 p-6"
          onClick={() => setActive(null)}
        >
          <Image fill sizes="100vw" unoptimized={!current.src.startsWith("/")} src={current.src} alt={current.title} className="object-contain p-6" />
        </button>
      )}
    </div>
  );
}

export function MusicApp() {
  const { content } = useContent();
  const audio = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  if (!content) return null;
  const tracks = content.music;
  const track = tracks[current];

  const play = (i: number) => {
    setCurrent(i);
    setTimeout(() => {
      void audio.current?.play();
      setPlaying(true);
    }, 30);
  };

  if (!tracks.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-semibold">No tracks yet</p>
        <p className="mt-2 text-sm text-black/60">
          Add favourite songs from Admin. MP3, WAV, or OGG files work.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-rose-200/40 to-white/40">
      <div className="p-6">
        <p className="text-xs uppercase tracking-widest text-black/40">Now playing</p>
        <h2 className="mt-1 text-2xl font-semibold">{track.title}</h2>
        <p className="text-sm text-black/55">{track.artist}</p>
        <audio
          ref={audio}
          src={track.src}
          className="mt-4 w-full"
          controls
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <p className="mt-2 text-xs text-black/40">{playing ? "Playing" : "Paused"}</p>
      </div>
      <ul className="min-h-0 flex-1 overflow-auto px-3 pb-4">
        {tracks.map((t, i) => (
          <li key={t.id}>
            <button
              onClick={() => play(i)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                i === current ? "bg-white/70" : "hover:bg-white/40"
              }`}
            >
              <span>
                {t.title}
                <span className="ml-2 text-black/45">{t.artist}</span>
              </span>
              <span>▶</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SafariApp() {
  const { content } = useContent();
  if (!content) return null;
  const links = [
    { name: "LinkedIn", href: content.profile.linkedin },
    { name: "GitHub", href: content.profile.github },
    { name: "Instagram", href: content.profile.instagram },
    { name: "TeamFit AI", href: "https://team-fit-ai.vercel.app" },
    { name: "Commit Desk", href: "https://commitdesk-dun.vercel.app" },
  ];
  return (
    <div>
      <div className="border-b border-black/10 bg-white/40 px-4 py-2 text-sm text-black/50">
        hari://portfolio
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2">
        {links
          .filter((l) => l.href)
          .map((l) => (
            <a
              key={l.name}
              href={l.href}
              target="_blank"
              className="rounded-2xl bg-white/60 p-4 hover:bg-white/80"
            >
              <p className="font-semibold">{l.name}</p>
              <p className="mt-1 truncate text-xs text-black/50">{l.href}</p>
            </a>
          ))}
      </div>
    </div>
  );
}

export function MailApp() {
  const { content } = useContent();
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const mail = content?.profile.email;
  const href = mail
    ? `mailto:${mail}?subject=${encodeURIComponent("Hello from your portfolio")}&body=${encodeURIComponent(`${name}\n\n${msg}`)}`
    : content?.profile.linkedin;

  return (
    <div className="mx-auto max-w-lg p-6">
      <h2 className="text-xl font-semibold">Say hello</h2>
      <p className="mt-1 text-sm text-black/60">
        {mail
          ? "This opens your mail app."
          : "Email is not set yet. Add it in Admin, or reach Hari on LinkedIn."}
      </p>
      <input
        className="mt-4 h-10 w-full rounded-lg border border-black/10 bg-white/70 px-3 text-sm"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="mt-3 h-32 w-full rounded-lg border border-black/10 bg-white/70 p-3 text-sm"
        placeholder="Message"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <a
        href={href}
        target="_blank"
        className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
      >
        Send
      </a>
    </div>
  );
}

export function TerminalApp() {
  const { content } = useContent();
  const [lines, setLines] = useState<string[]>([
    "HariOS 26.1 — type help",
  ]);
  const [cmd, setCmd] = useState("");

  const run = (raw: string) => {
    const c = raw.trim().toLowerCase();
    const out: string[] = [`$ ${raw}`];
    if (c === "help") out.push("whoami, skills, projects, github, linkedin, clear");
    else if (c === "whoami") out.push(content?.profile.name ?? "guest");
    else if (c === "skills")
      out.push(content?.skills.flatMap((s) => s.items).join(", ") ?? "");
    else if (c === "projects")
      out.push(content?.projects.map((p) => p.title).join(" · ") ?? "");
    else if (c === "github") out.push(content?.profile.github ?? "");
    else if (c === "linkedin") out.push(content?.profile.linkedin ?? "");
    else if (c === "clear") {
      setLines([]);
      return;
    } else out.push("command not found");
    setLines((prev) => [...prev, ...out]);
  };

  return (
    <div className="h-full bg-[#1e1e1e] p-4 font-mono text-[13px] text-green-300">
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(cmd);
          setCmd("");
        }}
      >
        <span>$</span>
        <input
          className="flex-1 bg-transparent outline-none"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          autoFocus
        />
      </form>
    </div>
  );
}
