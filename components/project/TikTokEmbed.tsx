"use client";

import { useEffect, useRef } from "react";

/* Renders TikTok's official embed blockquote and (re)loads their embed
   script on mount. TikTok's script only auto-hydrates blockquotes present
   when it first loads, so on client-side navigation between projects we
   force a fresh script load to pick up whichever tile is on screen now. */
export function TikTokEmbed({ videoId, url }: { videoId: string; url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.querySelectorAll('script[data-tiktok-embed]').forEach((el) => el.remove());
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    script.dataset.tiktokEmbed = "true";
    document.body.appendChild(script);
  }, [videoId]);

  return (
    <div ref={ref} className="flex justify-center overflow-hidden bg-surface">
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{ maxWidth: 605, minWidth: 325 }}
      >
        <section />
      </blockquote>
    </div>
  );
}
