export const APP_IDS = [
  "finder",
  "projects",
  "skills",
  "certs",
  "resume",
  "photos",
  "music",
  "safari",
  "mail",
  "terminal",
] as const;

export type AppId = (typeof APP_IDS)[number];

export type AppMeta = {
  id: AppId;
  name: string;
  dock: boolean;
};

export const APPS: AppMeta[] = [
  { id: "projects", name: "Projects", dock: true },
  { id: "resume", name: "Resume", dock: true },
  { id: "certs", name: "Certificates", dock: true },
  { id: "finder", name: "Finder", dock: true },
  { id: "music", name: "Music", dock: true },
  { id: "safari", name: "Safari", dock: true },
  { id: "skills", name: "Skills", dock: true },
  { id: "terminal", name: "Terminal", dock: true },
  { id: "photos", name: "Photos", dock: false },
  { id: "mail", name: "Mail", dock: false },
];
