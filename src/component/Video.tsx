"use client";
import { useEffect, useRef } from "react";
import { useHomeData } from "./LanguageProvider";

export default function Video({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const data = useHomeData();
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reducedMotion.matches)
          void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      onCanPlay={() => { const video = ref.current; if (video && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) void video.play().catch(() => {}); }}
      aria-label={data.ui.video}
      className="absolute inset-0 size-full object-cover"
    />
  );
}
