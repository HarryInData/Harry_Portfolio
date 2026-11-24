"use client";

import { useCallback, useMemo, useState } from "react";
import { APPS, type AppId } from "@/lib/apps";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { Wallpaper } from "./Wallpaper";
import { WindowFrame } from "./WindowFrame";
import {
  CertsApp,
  FinderApp,
  MailApp,
  MusicApp,
  PhotosApp,
  ProjectsApp,
  ResumeApp,
  SafariApp,
  SkillsApp,
  TerminalApp,
} from "../apps/AppViews";

type Win = {
  id: AppId;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  open: boolean;
  min: boolean;
  max: boolean;
};

const START: Record<AppId, Partial<Win>> = {
  finder: { x: 80, y: 60, w: 780, h: 520 },
  projects: { x: 140, y: 80, w: 820, h: 540 },
  skills: { x: 160, y: 90, w: 640, h: 420 },
  certs: { x: 180, y: 100, w: 680, h: 460 },
  resume: { x: 120, y: 50, w: 720, h: 560 },
  photos: { x: 200, y: 80, w: 760, h: 500 },
  music: { x: 220, y: 90, w: 520, h: 520 },
  safari: { x: 90, y: 70, w: 640, h: 420 },
  mail: { x: 240, y: 110, w: 520, h: 420 },
  terminal: { x: 260, y: 140, w: 560, h: 360 },
};

function makeWins(): Win[] {
  return APPS.map((a) => ({
    id: a.id,
    x: START[a.id].x ?? 100,
    y: START[a.id].y ?? 80,
    w: START[a.id].w ?? 640,
    h: START[a.id].h ?? 440,
    z: START[a.id].z ?? 1,
    open: START[a.id].open ?? false,
    min: false,
    max: false,
  }));
}

function view(id: AppId) {
  switch (id) {
    case "finder":
      return <FinderApp />;
    case "projects":
      return <ProjectsApp />;
    case "skills":
      return <SkillsApp />;
    case "certs":
      return <CertsApp />;
    case "resume":
      return <ResumeApp />;
    case "photos":
      return <PhotosApp />;
    case "music":
      return <MusicApp />;
    case "safari":
      return <SafariApp />;
    case "mail":
      return <MailApp />;
    case "terminal":
      return <TerminalApp />;
  }
}

export function Desktop() {
  const [wins, setWins] = useState<Win[]>(makeWins);
  const openApp = useCallback((id: AppId) => {
    setWins((prev) => {
      const order = prev.filter((w) => w.id !== id).sort((a, b) => a.z - b.z);
      return prev.map((w) => w.id === id
        ? { ...w, open: true, min: false, z: prev.length }
        : { ...w, z: order.indexOf(w) + 1 });
    });
  }, []);

  const openIds = useMemo(
    () => wins.filter((w) => w.open).map((w) => w.id),
    [wins],
  );
  const active = [...wins].sort((a, b) => b.z - a.z).find((w) => w.open && !w.min)?.id ?? null;

  return (
    <main className="macos-desktop boot-in relative isolate h-dvh w-full overflow-hidden">
      <Wallpaper />
      <MenuBar active={active} onOpen={openApp} />

      {wins
        .filter((w) => w.open && !w.min)
        .map((w) => (
          <WindowFrame
            key={w.id}
            id={w.id}
            title={APPS.find((a) => a.id === w.id)?.name ?? w.id}
            z={w.z}
            x={w.x}
            y={w.y}
            w={w.w}
            h={w.h}
            maximized={w.max}
            onFocus={() => openApp(w.id)}
            onClose={() =>
              setWins((prev) => prev.map((x) => (x.id === w.id ? { ...x, open: false } : x)))
            }
            onMin={() =>
              setWins((prev) => prev.map((x) => (x.id === w.id ? { ...x, min: true } : x)))
            }
            onMax={() =>
              setWins((prev) => prev.map((x) => (x.id === w.id ? { ...x, max: !x.max } : x)))
            }
            onMove={(x, y) =>
              setWins((prev) => prev.map((item) => (item.id === w.id ? { ...item, x, y } : item)))
            }
          >
            {view(w.id)}
          </WindowFrame>
        ))}

      <Dock openIds={openIds} onOpen={openApp} />

    </main>
  );
}
