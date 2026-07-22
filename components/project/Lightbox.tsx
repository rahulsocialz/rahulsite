"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Media } from "@/components/ui/Media";
import { TikTokEmbed } from "./TikTokEmbed";
import { InstagramEmbed } from "./InstagramEmbed";
import type { Embed } from "@/lib/embeds";

export type ViewerItem =
  | { kind: "image"; src: string; caption?: string }
  | { kind: "video"; embed: Embed; caption?: string };

const pad = (n: number) => String(n + 1).padStart(2, "0");

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      {dir === "left" ? <path d="M15 4l-8 8 8 8" /> : <path d="M9 4l8 8-8 8" />}
    </svg>
  );
}

/* Vimeo/YouTube accept autoplay on the embed URL; TikTok and Instagram
   don't, so those simply open ready to press play. */
function autoplaySrc(embed: Embed) {
  if (!embed.embedUrl) return embed.embedUrl;
  return `${embed.embedUrl}${embed.embedUrl.includes("?") ? "&" : "?"}autoplay=1`;
}

function Viewer({ item, title }: { item: ViewerItem; title: string }) {
  if (item.kind === "video") {
    const { embed } = item;
    if (embed.platform === "youtube" || embed.platform === "vimeo") {
      // Centred and constrained so a 16:9 player never overflows the frame.
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="aspect-video max-h-full w-full max-w-full bg-black">
            <iframe
              src={autoplaySrc(embed)}
              title={`${title}, video`}
              className="h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
            />
          </div>
        </div>
      );
    }
    return (
      <div className="flex h-full w-full items-center justify-center overflow-y-auto">
        <div className="w-full max-w-md">
          {embed.platform === "tiktok" ? (
            <TikTokEmbed videoId={embed.tiktokVideoId!} url={embed.url} />
          ) : (
            <InstagramEmbed url={embed.url} />
          )}
        </div>
      </div>
    );
  }
  // Uncropped, correct aspect ratio — the frame sizes to the photograph.
  return (
    <Media
      src={item.src}
      alt={item.caption || title}
      sizes="90vw"
      priority
      fit="contain"
      className="h-full w-full"
    />
  );
}

/* Darkroom viewer. Uncropped media in a film carrier, frame count, caption
   and credit, and a contact strip of every frame in the project.
   Keyboard arrows / Escape, touch swipe, focus trap, scroll lock. */
export function Lightbox({
  items,
  index,
  onClose,
  onStep,
  onSelect,
  title,
  subtitle,
  year,
  credit,
}: {
  items: ViewerItem[];
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
  onSelect: (i: number) => void;
  title: string;
  subtitle?: string;
  year?: string;
  credit?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const current = items[index];

  // Rendered into <body> so no ancestor stacking or transform context can
  // clip the viewer or let the header/side rail paint over it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const step = useCallback((d: number) => onStep(d), [onStep]);

  // Focus management, keyboard control and scroll lock.
  useEffect(() => {
    restoreTo.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        step(-1);
        return;
      }
      if (e.key === "ArrowRight") {
        step(1);
        return;
      }
      // Trap focus inside the dialog.
      if (e.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], iframe, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreTo.current?.focus?.();
    };
  }, [onClose, step]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const arrow =
    "flex h-12 w-12 shrink-0 items-center justify-center text-[#cfcabc] transition-opacity duration-300 hover:opacity-60 disabled:opacity-25";

  if (!mounted) return null;

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — frame ${pad(index)} of ${pad(items.length - 1)}`}
      className="fixed inset-0 z-[100] flex flex-col bg-[#0a0a09]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header rule */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[rgba(207,202,188,0.18)] px-4 py-3 sm:px-6">
        <p className="meta truncate text-[#cfcabc]">
          {title}
          {subtitle ? ` / ${subtitle}` : ""}
        </p>
        <p className="meta hidden tabular-nums text-[#cfcabc]/70 sm:block">
          {pad(index)} / {pad(items.length - 1)}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="meta flex min-h-11 items-center gap-2 text-[#cfcabc] transition-opacity hover:opacity-60"
        >
          Close <span aria-hidden className="text-base">×</span>
        </button>
      </div>

      {/* Frame */}
      {/* items-stretch so the frame actually fills the row height */}
      <div className="flex min-h-0 flex-1 items-stretch gap-1 px-1 sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous frame"
          className={`${arrow} self-center`}
          disabled={items.length < 2}
        >
          <Chevron dir="left" />
        </button>

        <div className="flex min-h-0 flex-1 flex-col py-4">
          <div className="relative min-h-0 w-full flex-1 bg-[#e8e3d7] p-2 sm:p-3">
            <div className="absolute inset-2 sm:inset-3">
              <Viewer item={current} title={title} />
            </div>
          </div>

          {/* Caption / credit rule */}
          <div className="mt-3 flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[#cfcabc]">
            <p className="meta">
              {title}
              {subtitle ? ` / ${subtitle}` : ""}
              {year ? <span className="ml-3 opacity-60">{year}</span> : null}
            </p>
            {current.caption && <p className="meta opacity-80">{current.caption}</p>}
            {credit && <p className="meta opacity-60">{credit}</p>}
            <p className="meta tabular-nums opacity-60">
              Frame {pad(index)} / {pad(items.length - 1)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next frame"
          className={`${arrow} self-center`}
          disabled={items.length < 2}
        >
          <Chevron dir="right" />
        </button>
      </div>

      {/* Contact strip */}
      {items.length > 1 && (
        <div className="no-scrollbar shrink-0 overflow-x-auto border-t border-[rgba(207,202,188,0.18)] px-4 py-3 sm:px-6">
          <ul className="flex gap-2">
            {items.map((it, i) => (
              <li key={i} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-label={`Show frame ${pad(i)}`}
                  aria-current={i === index}
                  className={`relative block w-24 border p-1 transition-opacity duration-300 sm:w-28 ${
                    i === index
                      ? "border-[#cfcabc] opacity-100"
                      : "border-transparent opacity-45 hover:opacity-80"
                  }`}
                >
                  {it.kind === "image" ? (
                    <Media src={it.src} alt="" sizes="120px" className="aspect-[4/3] w-full" />
                  ) : (
                    <span className="flex aspect-[4/3] w-full items-center justify-center bg-[#1a1a18] text-[#cfcabc]">
                      <span aria-hidden className="text-lg">
                        ▶
                      </span>
                    </span>
                  )}
                  <span className="mt-1 flex items-center justify-between px-0.5">
                    <span className="font-mono text-[0.5rem] tracking-[0.1em] text-[#cfcabc]/80">{pad(i)}</span>
                    <span aria-hidden className="font-mono text-[0.5rem] text-[#cfcabc]/80">
                      {it.kind === "video" ? "▶" : "◻"}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>,
    document.body
  );
}
