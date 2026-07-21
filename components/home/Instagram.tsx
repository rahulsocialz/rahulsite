"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { Media } from "@/components/ui/Media";
import { Sprockets } from "@/components/analog/Analog";

interface BeholdPost {
  permalink: string;
  sizes?: { medium?: { mediaUrl?: string } };
}

const TILE_COUNT = 12;

/* Recent moments as a contact sheet rather than a social widget: a tight
   grid of frames on black stock, sprocket rails top and bottom, frame
   numbers along the base.

   Sourced live from the Behold Instagram feed (behold.so). Falls back to
   images added in the CMS, then to plain frames, so the sheet never shows
   broken tiles. */
export function Instagram() {
  const [posts, setPosts] = useState<BeholdPost[] | null>(null);

  useEffect(() => {
    if (!site.instagramFeedUrl) return;
    let cancelled = false;
    fetch(site.instagramFeedUrl)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const feed = Array.isArray(data) ? data : (data.posts ?? []);
        setPosts(feed.slice(0, TILE_COUNT));
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tiles = Array.from({ length: TILE_COUNT }, (_, i) => i);

  return (
    <section id="instagram" className="shell scroll-mt-16 border-b border-[var(--line-soft)] py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="d3">
          Instagram /<br />
          Recent Moments
        </h2>
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ul-link label inline-flex items-center gap-2"
        >
          View Instagram <span aria-hidden>↗</span>
        </a>
      </div>

      <div className="mt-8 bg-[#0c0c0a] p-2">
        <Sprockets />
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 lg:grid-cols-6">
          {tiles.map((i) => {
            const post = posts?.[i];
            const feedImage = post?.sizes?.medium?.mediaUrl;
            const cmsImage = site.instagram.images[i];
            const href = post?.permalink ?? site.instagramUrl;

            return (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram post"
                className="group relative block"
              >
                {feedImage ? (
                  // Instagram's CDN hostnames rotate constantly, so this
                  // bypasses next/image optimisation — same as any IG embed.
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#141412]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={feedImage}
                      alt="Instagram post"
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </div>
                ) : cmsImage ? (
                  <Media
                    src={cmsImage}
                    alt="Instagram post"
                    sizes="(min-width:1024px) 16vw, 33vw"
                    className="aspect-[4/5] w-full opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                  />
                ) : (
                  <span className="block aspect-[4/5] w-full bg-[#141412]" />
                )}
                <span className="absolute bottom-1 left-1.5 font-mono text-[0.5rem] tracking-[0.1em] text-[#cfcabc]/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </a>
            );
          })}
        </div>
        <Sprockets />
      </div>
    </section>
  );
}
