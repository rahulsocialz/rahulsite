// Detects which platform a pasted video/post link belongs to, so the CMS
// can offer one "Videos" field that accepts a YouTube, Vimeo, TikTok or
// Instagram link interchangeably rather than a separate field per platform.

export type EmbedPlatform = "youtube" | "vimeo" | "tiktok" | "instagram";

export interface Embed {
  platform: EmbedPlatform;
  url: string;
  // YouTube / Vimeo — the player iframe src.
  embedUrl?: string;
  // TikTok only — the numeric video ID the official embed blockquote needs.
  tiktokVideoId?: string;
}

// Covers watch?v= (with an optional playlist via &list=), youtu.be/, /embed/
// and /shorts/ shapes, and a bare playlist link (list= with no v=), any
// param order.
function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const list = u.searchParams.get("list");

    if (/(^|\.)youtube\.com$/i.test(u.hostname)) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}${list ? `?list=${list}` : ""}`;
      const path = u.pathname.match(/\/(embed|shorts)\/([\w-]{11})/);
      if (path) return `https://www.youtube-nocookie.com/embed/${path[2]}`;
      if (list) return `https://www.youtube-nocookie.com/embed/videoseries?list=${list}`;
      return null;
    }
    if (/(^|\.)youtu\.be$/i.test(u.hostname)) {
      const id = u.pathname.slice(1).split("/")[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}${list ? `?list=${list}` : ""}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function detectEmbed(url: string): Embed | null {
  const ytEmbed = youtubeEmbedUrl(url);
  if (ytEmbed) return { platform: "youtube", url, embedUrl: ytEmbed };

  if (/vimeo\.com/i.test(url)) {
    const id = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/)?.[1];
    return id ? { platform: "vimeo", url, embedUrl: `https://player.vimeo.com/video/${id}` } : null;
  }
  if (/tiktok\.com/i.test(url)) {
    const id = url.match(/\/video\/(\d+)/)?.[1];
    return id ? { platform: "tiktok", url, tiktokVideoId: id } : null;
  }
  if (/instagram\.com\/(p|reel|tv)\//i.test(url)) {
    return { platform: "instagram", url };
  }
  return null;
}
