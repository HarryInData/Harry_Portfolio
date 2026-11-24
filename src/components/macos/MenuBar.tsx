"use client";

import { useEffect, useState } from "react";
import type { AppId } from "@/lib/apps";
import { APPS } from "@/lib/apps";

export function MenuBar({
  active,
  onOpen,
}: {
  active: AppId | null;
  onOpen: (id: AppId) => void;
}) {
  const [now, setNow] = useState("");
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleString("en-IN", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  const name = APPS.find((a) => a.id === active)?.name ?? "Finder";

  return (
    <header className="absolute inset-x-0 top-0 z-[180] flex h-7 items-center justify-between bg-black/45 pl-3 pr-10 text-[13px] text-white backdrop-blur-xl">
      <div className="flex items-center gap-2 font-medium sm:gap-4">
        <span className="text-base leading-none"></span>
        <span className="font-semibold">{name}</span>
        <button onClick={() => onOpen("finder")}>About</button>
        <button onClick={() => onOpen("projects")}>Work</button>
        <button className="hidden sm:inline" onClick={() => onOpen("photos")}>Gallery</button>
        <button onClick={() => onOpen("mail")}>Contact</button>
        <a href="/admin" className="hover:underline">
          Admin
        </a>
      </div>
      <div className="flex items-center gap-3 text-white/95">
        <span>HariOS</span>
        <span className="hidden sm:inline">{now}</span>
      </div>
    </header>
  );
}
