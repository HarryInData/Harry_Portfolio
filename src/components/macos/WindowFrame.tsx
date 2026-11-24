"use client";

import { useRef } from "react";
import type { AppId } from "@/lib/apps";

type Props = {
  id: AppId;
  title: string;
  z: number;
  x: number;
  y: number;
  w: number;
  h: number;
  maximized: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMin: () => void;
  onMax: () => void;
  onMove: (x: number, y: number) => void;
  children: React.ReactNode;
};

export function WindowFrame({
  title,
  z,
  x,
  y,
  w,
  h,
  maximized,
  onFocus,
  onClose,
  onMin,
  onMax,
  onMove,
  children,
}: Props) {
  const dragging = useRef<{ dx: number; dy: number } | null>(null);
  const width = `min(${w}px, calc(100% - 16px))`;
  const height = `min(${h}px, calc(100% - 126px))`;
  const style = maximized
    ? { top: 28, left: 8, width: "calc(100% - 16px)", height: "calc(100% - 110px)" }
    : { top: `clamp(32px, ${y}px, calc(100% - ${height} - 88px))`,
      left: `clamp(8px, ${x}px, calc(100% - ${width} - 8px))`, width, height };

  return (
    <section
      aria-label={title}
      className="window-chrome glass absolute flex flex-col overflow-hidden rounded-xl"
      style={{ ...style, zIndex: z }}
      onPointerDown={onFocus}
    >
      <header
        className="flex h-11 shrink-0 touch-none select-none cursor-default items-center border-b border-black/10 px-3"
        onDoubleClick={onMax}
        onPointerDown={(e) => {
          if (maximized) return;
          const target = e.target as HTMLElement;
          if (target.closest("button")) return;
          const rect = e.currentTarget.parentElement!.getBoundingClientRect();
          dragging.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (dragging.current) onMove(e.clientX - dragging.current.dx, e.clientY - dragging.current.dy);
        }}
        onLostPointerCapture={() => { dragging.current = null; }}
      >
        <div className="flex items-center gap-2">
          <button className="traffic bg-[#ff5f57]" aria-label="Close" onClick={onClose} />
          <button className="traffic bg-[#febc2e]" aria-label="Minimize" onClick={onMin} />
          <button className="traffic bg-[#28c840]" aria-label="Maximize" onClick={onMax} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-medium text-black/70">
          {title}
        </div>
      </header>
      <div className="scrollbar-thin min-h-0 flex-1 overflow-auto">{children}</div>
    </section>
  );
}
