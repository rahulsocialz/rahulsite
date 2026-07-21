"use client";

import { useCallback, useState } from "react";
import { Media } from "@/components/ui/Media";
import { FilmEdge, CircledNumber, Sprockets } from "@/components/analog/Analog";
import { detectEmbed, type Embed } from "@/lib/embeds";
import { focalPosition } from "@/lib/focal";
import type { GalleryImage, ProjectVideo } from "@/data/projects";
import { TikTokEmbed } from "./TikTokEmbed";
import { InstagramEmbed } from "./InstagramEmbed";
import { Lightbox, type ViewerItem } from "./Lightbox";

const pad = (n: number) => String(n + 1).padStart(2, "0");

/* One continuous editorial sequence of photographs and videos. Modules
   alternate between full-width, paired and single frames so the page reads
   as a laid-out spread rather than a uniform grid. Clicking any frame opens
   the darkroom viewer at that item. */
type Item =
  | { kind: "image"; src: string; caption?: string; focalPoint?: string }
  | { kind: "video"; embed: Embed; caption?: string };

// Repeating layout rhythm: wide, then a pair, then a tall single.
const LAYOUT = ["wide", "pair", "pair", "single", "wide", "single"] as const;

function VideoEmbed({ embed, title }: { embed: Embed; title: string }) {
  if (embed.platform === "youtube" || embed.platform === "vimeo") {
    return (
      <div className="aspect-video w-full bg-[#0c0c0a]">
        <iframe
          src={embed.embedUrl}
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
  title,
  subtitle,
  year,
}: {
  images: GalleryImage[];
  videos?: ProjectVideo[];
  placeholderCount?: number;
  accent?: string;
  title: string;
  subtitle?: string;
  year?: string;
}) {
  // Videos lead the sequence — award-winning trailers belong at the top.
  const items: Item[] = [
    ...videos.flatMap((v): Item[] => {
      const embed = detectEmbed(v.url);
      return embed ? [{ kind: "video", embed, caption: v.caption }] : [];
    }),
    ...images.map((g): Item => ({
      kind: "image",
      src: g.image,
      caption: g.caption,
      focalPoint: g.focalPoint,
    })),
  ];

  const viewerItems: ViewerItem[] = items.map((it) =>
    it.kind === "image"
      ? { kind: "image", src: it.src, caption: it.caption }
      : { kind: "video", embed: it.embed, caption: it.caption }
  );

  const [open, setOpen] = useState<number | null>(null);
  const step = useCallback(
    (delta: number) => setOpen((i) => (i === null ? i : (i + delta + items.length) % items.length)),
    [items.length]
  );

  if (items.length === 0) return null;

  return (
    <>
      {/* Media count + viewer affordance */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="ul-link label inline-flex min-h-11 items-center gap-3"
        >
          View / Lightbox <span aria-hidden>↗</span>
        </button>
        <p className="meta tabular-nums text-[var(--muted)]">
          {items.length} {items.length === 1 ? "frame" : "frames"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-12">
        {items.map((item, i) => {
          const shape = LAYOUT[i % LAYOUT.length];
          const span =
            shape === "wide" ? "sm:col-span-12" : shape === "pair" ? "sm:col-span-6" : "sm:col-span-7";
          const aspect =
            shape === "wide" ? "aspect-[16/9]" : shape === "pair" ? "aspect-[4/5]" : "aspect-[3/4]";

          if (item.kind === "video") {
            return (
              <div key={i} className={`${span} relative`}>
                <div className="film relative">
                  <FilmEdge side="l" text={`${pad(i)} · 400`} />
                  <FilmEdge side="r" text="400 · 36 EXP" />
                  <div className="px-[1.375rem] py-[1.375rem]">
                    <VideoEmbed embed={item.embed} title={title} />
                    {item.caption && <p className="meta pt-3 text-[#cfcabc]/80">{item.caption}</p>}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={i} className={span}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View frame ${pad(i)}`}
                className="film group relative block w-full text-left"
              >
                <FilmEdge side="l" text={`${pad(i)} · 400`} />
                <FilmEdge side="r" text="400 · 36 EXP" />
                <div className="px-[1.375rem] py-[1.375rem]">
                  <Media
                    src={item.src}
                    alt={item.caption || `${title}, frame ${pad(i)}`}
                    sizes="(min-width:1024px) 60vw, 100vw"
                    focal={focalPosition(item.focalPoint)}
                    className={`w-full ${aspect}`}
                    imgClassName="transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.02]"
                  />
                  {item.caption && <p className="meta pt-3 text-[#cfcabc]/80">{item.caption}</p>}
                </div>
                {i === 2 && (
                  <span className="absolute right-7 top-7">
                    <CircledNumber value={pad(i)} className="h-9 w-16 text-[#cfcabc]" />
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Contact strip of the whole roll */}
      {items.length > 2 && (
        <div className="mt-1.5 bg-[#0c0c0a]">
          <Sprockets />
          <div className="no-scrollbar overflow-x-auto">
            <ul className="flex gap-px">
              {items.map((it, i) => (
                <li key={i} className="w-28 shrink-0 sm:w-32">
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    aria-label={`View frame ${pad(i)}`}
                    className="group block w-full"
                  >
                    {it.kind === "image" ? (
                      <Media
                        src={it.src}
                        alt=""
                        sizes="130px"
                        className="aspect-[4/3] w-full opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    ) : (
                      <span className="flex aspect-[4/3] w-full items-center justify-center bg-[#1a1a18] text-[#cfcabc]">
                        <span aria-hidden>▶</span>
                      </span>
                    )}
                    <span className="flex items-center justify-between px-1.5 py-1">
                      <span className="font-mono text-[0.5rem] tracking-[0.1em] text-[#cfcabc]/70">{pad(i)}</span>
                      <span aria-hidden className="font-mono text-[0.5rem] text-[#cfcabc]/70">
                        {it.kind === "video" ? "▶" : "◻"}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <Sprockets />
        </div>
      )}

      {open !== null && (
        <Lightbox
          items={viewerItems}
          index={open}
          onClose={() => setOpen(null)}
          onStep={step}
          onSelect={(i) => setOpen(i)}
          title={title}
          subtitle={subtitle}
          year={year}
          credit={`Photo by ${"Rahul Bhatt"}`}
        />
      )}
    </>
  );
}
