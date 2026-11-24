"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type WallpaperMode = "coast" | "video";

export function Wallpaper() {
  const video = useRef<HTMLVideoElement>(null);
  const modeRef = useRef<WallpaperMode>("coast");
  const [mode, setMode] = useState<WallpaperMode>("coast");
  const [playing, setPlaying] = useState(false);

  const syncPlayback = useCallback(() => {
    const player = video.current;
    if (!player) return;
    if (modeRef.current === "video" && !document.hidden) {
      void player.play().catch(() => {
        modeRef.current = "coast";
        setMode("coast");
      });
    } else {
      player.pause();
    }
  }, []);

  useEffect(() => {
    const player = video.current;
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      player?.pause();
    };
  }, [syncPlayback]);

  const toggle = () => {
    const next = modeRef.current === "coast" ? "video" : "coast";
    modeRef.current = next;
    setMode(next);
    if (next === "video") syncPlayback();
    else video.current?.pause();
  };

  return (
    <>
      <div className="coastal-wallpaper absolute inset-0" aria-hidden="true" />
      <video
        ref={video}
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="none"
        poster="/wallpaper-poster.jpg"
        src="/wallpaper-wide.mp4"
        className={`wallpaper-video pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          mode === "video" ? "opacity-100" : "opacity-0"
        }`}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        className="absolute right-1 top-0 z-[190] grid h-7 w-8 place-items-center rounded text-xs text-white hover:bg-white/20"
        aria-label={mode === "coast" ? "Switch to animated wallpaper" : "Switch to coastal wallpaper"}
        title={mode === "coast" ? "Animated wallpaper" : "Coastal wallpaper"}
        onClick={toggle}
      >
        {mode === "video" && playing ? "◉" : "▶"}
      </button>
    </>
  );
}
