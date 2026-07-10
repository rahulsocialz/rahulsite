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

function youtubeId(url: string): string | null {
  // Covers watch?v=, youtu.be/, /embed/ and /shorts/ shapes, any param order.
  try {
    const u = new URL(url);
    if (/(^|\.)youtube\.com$/i.test(u.hostname)) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const path = u.pathname.match(/\/(embed|shorts)\/([\w-]{11})/);
      if (path) return path[2];
    }
    if (/(^|\.)youtu\.be$/i.test(u.hostname)) {
      return u.pathname.slice(1).split("/")[0] || null;
    }
  } catch {
    return null;
  }
  return null;
}

export function detectEmbed(url: string): Embed | null {
  const yt = youtubeId(url);
  if (yt) return { platform: "youtube", url, embedUrl: `https://www.youtube-nocookie.com/embed/${yt}` };

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
