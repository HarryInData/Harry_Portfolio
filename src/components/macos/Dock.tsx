"use client";

import { APPS, type AppId } from "@/lib/apps";
import { DockIcon } from "./DockIcon";

export function Dock({
  openIds,
  onOpen,
}: {
  openIds: AppId[];
  onOpen: (id: AppId) => void;
}) {
  return (
    <nav aria-label="Application dock" className="pointer-events-none absolute inset-x-0 bottom-2 z-[200] flex justify-center">
      <div className="dock-shell pointer-events-auto flex items-end gap-1 rounded-2xl px-2 py-1.5">
        {APPS.filter((a) => a.dock).map((app) => (
          <button
            key={app.id}
            className="group relative flex w-12 flex-col items-center"
            onClick={() => onOpen(app.id)}
            title={app.name}
            aria-label={app.name}
          >
            <span className="pointer-events-none absolute -top-8 hidden rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-medium text-black shadow group-hover:block">
              {app.name}
            </span>
            <span className="transition-transform duration-150 group-hover:-translate-y-2 group-hover:scale-125">
              <DockIcon id={app.id} />
            </span>
            <span
              className={`mt-0.5 h-1 w-1 rounded-full bg-black/70 ${
                openIds.includes(app.id) ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}
