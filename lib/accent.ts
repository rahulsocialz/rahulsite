"use client";

/* Dynamic colour: pull one elegant dominant colour from the active image.
   The effect is subconscious — in light mode it tints only accents; in dark
   mode the UI stays monochrome and we only nudge it very slightly. */

export type RGB = [number, number, number];

export async function dominantColor(
  src: string
): Promise<RGB | null> {
  try {
    const { default: ColorThief } = await import("colorthief");
    const img = await loadImage(src);
    const thief = new ColorThief();
    const palette = thief.getPalette(img, 5) ?? [];
    // Choose the most usable colour: enough saturation, mid lightness.
    const scored = palette
      .map((rgb) => ({ rgb, score: usability(rgb) }))
      .sort((a, b) => b.score - a.score);
    return scored[0]?.rgb ?? thief.getColor(img);
  } catch {
    return null;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function usability([r, g, b]: RGB): number {
  const { s, l } = rgbToHsl(r, g, b);
  // Favour colours that read as an elegant accent, not grey or neon.
  const sScore = 1 - Math.abs(s - 0.6);
  const lScore = 1 - Math.abs(l - 0.5);
  return sScore * 0.6 + lScore * 0.4;
}

/* Refine any colour into a restrained, premium accent for the current theme. */
export function refineAccent(rgb: RGB, dark: boolean): string {
  const { h } = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  // Constrain saturation/lightness so it never turns garish or muddy.
  const s = dark ? 0.28 : 0.62;
  const l = dark ? 0.82 : 0.46;
  return hslToHex(h, s, l);
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const to = (t: number) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    let v: number;
    if (x < 1 / 6) v = p + (q - p) * 6 * x;
    else if (x < 1 / 2) v = q;
    else if (x < 2 / 3) v = p + (q - p) * (2 / 3 - x) * 6;
    else v = p;
    return Math.round(v * 255);
  };
  const rgb = [to(h + 1 / 3), to(h), to(h - 1 / 3)];
  return `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function readableInk(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#111111" : "#ffffff";
}
