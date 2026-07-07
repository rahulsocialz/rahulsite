"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { Placeholder } from "@/components/ui/Placeholder";
import { Media } from "@/components/ui/Media";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface BeholdPost {
  permalink: string;
  sizes?: { medium?: { mediaUrl?: string } };
}

const TILE_COUNT = 6;

/* Six square tiles in one row, sourced live from the Behold Instagram feed
   (behold.so). Falls back to images added in the CMS, then to neutral
   placeholders, so the section never shows broken tiles. */
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
      <div className="shell mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {Array.from({ length: TILE_COUNT }, (_, i) => {
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
              className="group block overflow-hidden"
            >
              {feedImage ? (
                // Instagram's own CDN hostnames rotate constantly, so this
                // bypasses next/image optimisation (a plain <img>, same as
                // any Instagram embed) rather than allow-listing domains.
                <div className="relative aspect-square overflow-hidden bg-surface">
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
                  className="aspect-square"
                  imgClassName="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]"
                />
              ) : (
                <Placeholder className="aspect-square transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]" />
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}
