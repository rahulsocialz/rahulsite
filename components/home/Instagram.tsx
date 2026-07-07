"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { Placeholder } from "@/components/ui/Placeholder";
import { Media } from "@/components/ui/Media";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Masonry } from "@/components/ui/Masonry";

interface BeholdPost {
  permalink: string;
  sizes?: { medium?: { mediaUrl?: string; width?: number; height?: number } };
}

const TILE_COUNT = 6;
// Modern Instagram default for posts without real dimensions (manual CMS
// images, placeholders) — most posts today are 4:5 rather than square.
const FALLBACK_RATIO = 4 / 5;

/* Six tiles in one row, sourced live from the Behold Instagram feed
   (behold.so). Each tile keeps that post's real aspect ratio (Instagram
   posts are rarely square anymore) instead of force-cropping to a square.
   Falls back to images added in the CMS, then to neutral placeholders, so
   the section never shows broken tiles. */
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
    <section className="py-7 lg:py-10">
      <Divider />
      <div className="shell mt-6 flex items-end justify-between">
        <Eyebrow as="h2">Latest on Instagram</Eyebrow>
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link text-[0.72rem] uppercase tracking-[0.14em] light:text-[var(--accent)]"
        >
          Follow {site.instagramHandle}
        </a>
      </div>
      <div className="shell mt-6">
        <Masonry
          items={tiles}
          gap="gap-2 sm:gap-3"
          columns={{ base: 3, sm: 6, lg: 6 }}
          render={(i) => {
            const post = posts?.[i];
            const feedImage = post?.sizes?.medium?.mediaUrl;
            const { width, height } = post?.sizes?.medium ?? {};
            const ratio = width && height ? width / height : FALLBACK_RATIO;
            const cmsImage = site.instagram.images[i];
            const href = post?.permalink ?? site.instagramUrl;

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram post"
                className="group block overflow-hidden"
              >
                {feedImage ? (
                  // Instagram's own CDN hostnames rotate constantly, so this
                  // bypasses next/image optimisation (a plain <img>, same as
                  // any Instagram embed) rather than allow-listing domains.
                  <div
                    className="relative w-full overflow-hidden bg-surface"
                    style={{ aspectRatio: ratio }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={feedImage}
                      alt="Instagram post"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]"
                    />
                  </div>
                ) : cmsImage ? (
                  <Media
                    src={cmsImage}
                    alt="Instagram post"
                    sizes="(min-width:640px) 16vw, 33vw"
                    className="w-full"
                    style={{ aspectRatio: FALLBACK_RATIO }}
                    imgClassName="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]"
                  />
                ) : (
                  <Placeholder
                    className="w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]"
                    style={{ aspectRatio: FALLBACK_RATIO }}
                  />
                )}
              </a>
            );
          }}
        />
      </div>
    </section>
  );
}
