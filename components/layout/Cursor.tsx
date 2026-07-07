"use client";

import { useEffect, useRef } from "react";

/* Minimal custom cursor. Elements opt in with data-cursor="view" (or any
   label via data-cursor-label). Pointer devices only; never on touch. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let scale = 0.4;
    let targetScale = 0.4;
    let raf = 0;

    const render = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      scale += (targetScale - scale) * 0.2;
      el.style.transform = `translate(${cx}px, ${cy}px) scale(${scale.toFixed(3)})`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      if (target) {
        el.dataset.active = "true";
        targetScale = 1;
        if (label.current)
          label.current.textContent = target.dataset.cursorLabel ?? "View";
      } else {
        el.dataset.active = "false";
        targetScale = 0.4;
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-dot" aria-hidden data-active="false">
      <span ref={label}>View</span>
    </div>
  );
}
