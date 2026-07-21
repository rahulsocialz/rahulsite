"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Placeholder } from "@/components/ui/Placeholder";
import { Media } from "@/components/ui/Media";
import { Masonry } from "@/components/ui/Masonry";
import { detectEmbed, type Embed } from "@/lib/embeds";
import { focalPosition } from "@/lib/focal";
import type { GalleryImage, ProjectVideo } from "@/data/projects";
import { TikTokEmbed } from "./TikTokEmbed";
import { InstagramEmbed } from "./InstagramEmbed";

// Varied aspect ratios for the "uneven but perfect" masonry grid.
const ASPECTS = [
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[1/1]",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[1/1]",
  "aspect-[4/5]",
];

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      {dir === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

// A single grid of photos and videos (Vimeo, YouTube, TikTok or Instagram
// links, auto-detected). Clicking any tile opens a lightbox showing that
// item full-size, with arrows to step through every item and an X to close —
// nothing on the page scrolls or re-flows when you pick a different one.
type GalleryItem =
  | { kind: "image"; imgIndex: number; src: string; caption?: string; focalPoint?: string }
  | { kind: "video"; embed: Embed; caption?: string };

// Vimeo/YouTube support ?autoplay=1 on their embed URL; TikTok/Instagram
// embeds don't, so they just open ready to press play.
function autoplaySrc(embed: Embed) {
  if (!embed.embedUrl) return embed.embedUrl;
  const sep = embed.embedUrl.includes("?") ? "&" : "?";
  return `${embed.embedUrl}${sep}autoplay=1`;
}

function VideoEmbed({ embed, title, autoplay }: { embed: Embed; title: string; autoplay?: boolean }) {
  if (embed.platform === "youtube" || embed.platform === "vimeo") {
    return (
      <div className="aspect-video w-full overflow-hidden bg-surface">
        <iframe
          src={autoplay ? autoplaySrc(embed) : embed.embedUrl}
          title={`${title}, video`}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    );
  }
  if (embed.platform === "tiktok") return <TikTokEmbed videoId={embed.tiktokVideoId!} url={embed.url} />;
  return <InstagramEmbed url={embed.url} />;
}

export function ProjectShowcase({
  images,
  videos = [],
  placeholderCount,
  accent,
  title,
}: {
  images: GalleryImage[];
  videos?: ProjectVideo[];
  placeholderCount: number;
  accent: string;
  title: string;
}) {
  const hasImages = images.length > 0;
  const count = hasImages ? images.length : Math.max(placeholderCount, 1);
  const pad = (n: number) => String(n + 1).padStart(2, "0");

  // Videos lead the grid (e.g. award-winning trailers belong up top), photos
  // follow.
  const galleryItems: GalleryItem[] = [
    ...videos.flatMap((v): GalleryItem[] => {
      const embed = detectEmbed(v.url);
      return embed ? [{ kind: "video" as const, embed, caption: v.caption }] : [];
    }),
    ...Array.from({ length: count }, (_, i) => ({
      kind: "image" as const,
      imgIndex: i,
      src: hasImages ? images[i].image : "",
      caption: hasImages ? images[i].caption : undefined,
      focalPoint: hasImages ? images[i].focalPoint : undefined,
    })),
  ];

  const [lightbox, setLightbox] = useState<number | null>(null);
  const stepLightbox = useCallback(
    (delta: number) => setLightbox((i) => (i === null ? i : (i + delta + galleryItems.length) % galleryItems.length)),
    [galleryItems.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, stepLightbox]);

  const imageTile = (imgIndex: number, aspectClass: string) =>
    hasImages ? (
      <Media
        src={images[imgIndex].image}
        alt={`${title}, image ${pad(imgIndex)}`}
        sizes="(min-width:1024px) 30vw, 50vw"
        focal={focalPosition(images[imgIndex].focalPoint)}
        className={aspectClass}
        imgClassName="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
      />
    ) : (
      <Placeholder
        accent={accent}
        label={pad(imgIndex)}
        className={`${aspectClass} transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]`}
      />
    );

  const arrowBtn =
    "pointer-events-auto flex h-11 w-11 items-center justify-center rounded-pill border border-white/20 bg-black/40 text-white backdrop-blur-md transition-[transform,background-color] duration-300 ease-[var(--ease-out)] hover:-translate-y-px hover:bg-black/60";

  const current = lightbox !== null ? galleryItems[lightbox] : null;

  return (
    <div>
      <Masonry
        items={galleryItems}
        render={(item, i) =>
          item.kind === "video" ? (
            <div className="group relative">
              <VideoEmbed embed={item.embed} title={title} />
              <button
                onClick={() => setLightbox(i)}
                aria-label={`Play ${title} video`}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-fg shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <PlayIcon />
                </span>
              </button>
              {item.caption && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-left text-[0.7rem] text-white"
                >
                  {item.caption}
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={() => setLightbox(i)}
              aria-label={`Show image ${pad(item.imgIndex)}`}
              className="group relative block w-full overflow-hidden"
            >
              {imageTile(item.imgIndex, ASPECTS[i % ASPECTS.length])}
              {item.caption && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-1 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-left text-[0.7rem] text-white opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-out)] group-hover:translate-y-0 group-hover:opacity-100"
                >
                  {item.caption}
                </span>
              )}
            </button>
          )
        }
      />

      <AnimatePresence>
        {current && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/92 p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(null);
              }}
              aria-label="Close"
              className={`${arrowBtn} absolute right-4 top-4 sm:right-6 sm:top-6`}
            >
              <CloseIcon />
            </button>

            {galleryItems.length > 1 && (
              <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-3 sm:px-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    stepLightbox(-1);
                  }}
                  aria-label="Previous"
                  className={arrowBtn}
                >
                  <Chevron dir="left" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    stepLightbox(1);
                  }}
                  aria-label="Next"
                  className={arrowBtn}
                >
                  <Chevron dir="right" />
                </button>
              </div>
            )}

            <div
              className="flex max-w-[92vw] flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {current.kind === "image" ? (
                <>
                  <div className="relative h-[70vh] w-[92vw] max-w-5xl sm:h-[78vh]">
                    <Media
                      src={current.src}
                      alt={`${title}, image ${pad(current.imgIndex)}`}
                      sizes="92vw"
                      priority
                      fit="contain"
                      className="h-full w-full"
                    />
                  </div>
                  {current.caption && <p className="text-center text-[0.8rem] text-white/80">{current.caption}</p>}
                </>
              ) : (
                <>
                  <div className="w-[92vw] max-w-3xl">
                    <VideoEmbed embed={current.embed} title={title} autoplay />
                  </div>
                  {current.caption && <p className="text-center text-[0.8rem] text-white/80">{current.caption}</p>}
                </>
              )}
            </div>

            {galleryItems.length > 1 && (
              <div className="mt-4 font-mono text-[0.7rem] text-white/60">
                {pad(lightbox!)} / {pad(galleryItems.length - 1)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
