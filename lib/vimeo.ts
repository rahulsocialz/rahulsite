// Pulls the numeric video ID out of any common Vimeo URL shape, e.g.
// https://vimeo.com/123456789 or https://vimeo.com/channels/staff/123456789
export function vimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
  return match ? match[1] : null;
}

export function vimeoEmbedUrl(url: string): string | null {
  const id = vimeoId(url);
  return id ? `https://player.vimeo.com/video/${id}` : null;
}
