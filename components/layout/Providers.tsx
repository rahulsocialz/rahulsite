"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ThemeProvider, useTheme } from "next-themes";
import Lenis from "lenis";
import { dominantColor, refineAccent, readableInk, type RGB } from "@/lib/accent";
import Cursor from "./Cursor";

/* ---------- Smooth scroll (Lenis) ---------- */
function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, wheelMultiplier: 1 });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}

/* ---------- Dynamic accent colour ---------- */
interface AccentApi {
  setFromImage: (src: string) => void;
  setColor: (hex: string) => void;
  reset: () => void;
}
const AccentContext = createContext<AccentApi>({
  setFromImage: () => {},
  setColor: () => {},
  reset: () => {},
});
export const useAccent = () => useContext(AccentContext);

function AccentProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [rgb, setRgb] = useState<RGB | null>(null);
  const cache = useRef(new Map<string, RGB | null>());

  const setFromImage = useCallback((src: string) => {
    const cached = cache.current.get(src);
    if (cached !== undefined) {
      setRgb(cached);
      return;
    }
    dominantColor(src).then((c) => {
      cache.current.set(src, c);
      setRgb(c);
    });
  }, []);

  const setColor = useCallback((hex: string) => {
    const n = parseInt(hex.replace("#", ""), 16);
    if (Number.isNaN(n)) return;
    setRgb([(n >> 16) & 255, (n >> 8) & 255, n & 255]);
  }, []);

  const reset = useCallback(() => setRgb(null), []);

  useEffect(() => {
    const root = document.documentElement;
    if (!rgb) {
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-ink");
      return;
    }
    const dark = resolvedTheme === "dark";
    const accent = refineAccent(rgb, dark);
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-ink", readableInk(accent));
  }, [rgb, resolvedTheme]);

  const api = useMemo(
    () => ({ setFromImage, setColor, reset }),
    [setFromImage, setColor, reset]
  );
  return <AccentContext.Provider value={api}>{children}</AccentContext.Provider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <AccentProvider>
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </AccentProvider>
    </ThemeProvider>
  );
}
