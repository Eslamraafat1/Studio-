"use client";
import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Img from "@/components/ui/Img";
import { useLang } from "@/lib/i18n";
import { EASE, lockScroll, useReducedMotion } from "@/lib/motion";
import type { GalleryImage } from "@/data/projects";

/** Accessible modal image viewer: arrows / swipe / Esc, focus trap, scroll lock, captions. */
export default function ImageLightbox({ images, index, onIndex, onClose }: { images: GalleryImage[]; index: number | null; onIndex: (i: number) => void; onClose: () => void }) {
  const { t, u, n } = useLang();
  const open = index !== null;
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const len = images.length;

  const go = useCallback((d: number) => { if (index !== null) onIndex((index + d + len) % len); }, [index, len, onIndex]);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const prev = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    const key = (e: KeyboardEvent) => {
      const rtl = document.documentElement.dir === "rtl";
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(rtl ? -1 : 1);
      else if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
      else if (e.key === "Tab") {
        const f = Array.from(box.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? []);
        if (!f.length) return;
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      lockScroll(false);
      prev?.focus?.();
    };
  }, [open, go, onClose]);

  const img = index !== null ? images[index] : null;
  return (
    <AnimatePresence>
      {open && img && (
        <motion.div
          ref={box}
          role="dialog"
          aria-modal="true"
          aria-label={t(img.alt)}
          className="fixed inset-0 z-[110] flex flex-col bg-[#0b0c0a]/95 text-[#ece9e0] backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
          onPointerDown={(e) => { touch.current = { x: e.clientX, y: e.clientY }; }}
          onPointerUp={(e) => {
            const s = touch.current; touch.current = null;
            if (!s || e.pointerType === "mouse") return;
            const dx = e.clientX - s.x, dy = e.clientY - s.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
            else if (dy > 90) onClose();
          }}
        >
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="eyebrow num" aria-live="polite">{n(String((index ?? 0) + 1).padStart(2, "0"))} / {n(String(len).padStart(2, "0"))}</p>
            <button data-close type="button" onClick={onClose} aria-label={u("lb.close")} className="grid size-12 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-black">
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <div className="relative flex-1 select-none">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={img.src} className="absolute inset-0 px-2 md:px-24" initial={{ opacity: 0, scale: reduced ? 1 : 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE.cssOut }}>
                <div className="relative h-full w-full"><Img src={img.src} alt={t(img.alt)} fill sizes="100vw" quality={85} className="object-contain" priority /></div>
              </motion.div>
            </AnimatePresence>
            <button type="button" onClick={() => go(-1)} aria-label={u("lb.prev")} className="absolute start-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/30 transition-colors hover:bg-white hover:text-black md:start-6">
              <ArrowLeft aria-hidden className="size-5 rtl:-scale-x-100" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={u("lb.next")} className="absolute end-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/30 transition-colors hover:bg-white hover:text-black md:end-6">
              <ArrowRight aria-hidden className="size-5 rtl:-scale-x-100" />
            </button>
          </div>
          <p className="p-4 text-center text-sm text-[#cfccc3] md:p-6">{t(img.caption)}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
