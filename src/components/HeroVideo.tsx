"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

/**
 * Full-bleed video hero. The video itself depicts the site's core problem —
 * someone boxed in by noise from every direction. Scrolling zooms and calms
 * that chaos: the frame pushes in toward the center (cropping the noisy
 * insets out of view), color and playback speed settle down, and a scrim
 * deepens behind the headline. Pinned via `sticky` for one viewport of
 * scroll distance, then releases back into normal document flow.
 *
 * The scroll-linked version is an enhancement, applied only after confirming
 * the visitor doesn't prefer reduced motion — the base render is a static,
 * single-viewport hero with no pinning or scroll-jacking.
 */
export default function HeroVideo({ children }: { children: React.ReactNode }) {
  const [enhanced, setEnhanced] = useState(false);
  const [playing, setPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a media query unavailable during SSR, matches TableOfContents.tsx's pattern.
    setEnhanced(!prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (!enhanced) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!section || !video || !overlay || !content) return;

    let ticking = false;

    function update() {
      ticking = false;
      const rect = section!.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;

      video!.style.transform = `scale(${lerp(1, 1.5, progress)})`;
      video!.style.filter = `saturate(${lerp(1.3, 0.4, progress)}) contrast(${lerp(1.08, 0.96, progress)}) blur(${lerp(0, 2.5, progress)}px)`;
      video!.playbackRate = lerp(1, 0.18, progress);
      overlay!.style.opacity = String(lerp(0.4, 0.8, progress));
      content!.style.transform = `translateY(${lerp(0, -10, progress)}px)`;
      content!.style.opacity = String(lerp(1, 0.94, progress));
    }

    function onScrollOrResize() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [enhanced]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${enhanced ? "h-[200vh]" : "h-screen"}`}
    >
      <div
        className={`w-full h-screen overflow-hidden flex items-center bg-tertiary ${enhanced ? "sticky top-0" : ""}`}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: "transform, filter" }}
          src="/videos/hero-noise.mp4"
          poster="/images/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/10 pointer-events-none"
          style={{ opacity: 0.4 }}
        />
        <div
          ref={contentRef}
          className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop"
        >
          {children}
        </div>
        <button
          type="button"
          onClick={togglePlayback}
          className="absolute bottom-6 right-6 z-10 w-10 h-10 border border-background/40 bg-background/10 backdrop-blur-sm flex items-center justify-center hover:bg-background/20 transition-colors"
          aria-label={playing ? "Pause background video" : "Play background video"}
        >
          {playing ? (
            <Pause size={18} className="text-background" />
          ) : (
            <Play size={18} className="text-background" />
          )}
        </button>
      </div>
    </section>
  );
}
