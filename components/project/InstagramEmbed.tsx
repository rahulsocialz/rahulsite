"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

let scriptLoading: Promise<void> | null = null;
function loadInstagramScript(): Promise<void> {
  if (window.instgrm) return Promise.resolve();
  if (scriptLoading) return scriptLoading;
  scriptLoading = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
  return scriptLoading;
}

/* Renders Instagram's official embed blockquote. The script is loaded once
   and reused; each mount calls Embeds.process() so newly-added blockquotes
   (e.g. after navigating between projects) get hydrated too. */
export function InstagramEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadInstagramScript().then(() => {
      if (!cancelled) window.instgrm?.Embeds.process();
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  // Instagram is meant to resize the eventual iframe itself via a postMessage
  // handshake once its content loads — but this is unreliable in practice
  // (well-documented flakiness for Reels specifically) and can silently never
  // fire, leaving the iframe stuck at a ~2px placeholder height. Rather than
  // depend on that, this wraps the embed in a fixed-aspect box and forces
  // whatever iframe Instagram inserts to fill it via the ig-embed-fixed CSS
  // rule (global.css), so the post is reliably visible either way.
  const permalink = `${url}${url.includes("?") ? "&" : "?"}utm_source=ig_embed&utm_campaign=loading`;

  return (
    <div
      ref={ref}
      className="ig-embed-fixed relative mx-auto aspect-[9/16] w-full max-w-[400px] overflow-hidden bg-surface"
    >
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={{ background: "#FFF", border: 0, margin: 0, padding: 0, width: "100%", height: "100%" }}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full w-full items-center justify-center text-center text-[0.8rem] text-[#3897f0]"
        >
          View this post on Instagram
        </a>
      </blockquote>
    </div>
  );
}
