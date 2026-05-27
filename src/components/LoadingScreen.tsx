"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const LOGS = [
  "INITIALIZING KERNEL...",
  "ESTABLISHING SECURE CONNECTION...",
  "LOADING IEEE PROTOCOLS...",
  "SYNCING MODULES: BOOTCAMP | INTERNSHIP | HACKATHON",
  "CIRCUITRON.........READY",
];

// Module-level flag: resets on page refresh, stays alive during client-side navigation
let hasLoadedOnce = false;

export default function LoadingScreen({ onComplete, color = "#38bdf8" }: { onComplete: () => void; color?: string }) {
  // We only need React state for things that drive JSX rendering.
  // Progress is stored in a ref (no re-render) and only synced to state via
  // a throttled mechanism — this cuts React renders from ~60/s to ~10/s.
  const progressRef  = useRef(0);
  const [displayPct, setDisplayPct] = useState(0);
  const [visible,    setVisible]    = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (hasLoadedOnce) { onComplete(); return; }
    setShouldRender(true);

    let rafId: number;
    let lastTs      = performance.now();
    let lastRender  = 0;       // throttle React re-renders
    const RENDER_INTERVAL = 80; // ms between state updates (~12fps for the counter)

    const tick = (ts: number) => {
      const dt = ts - lastTs;
      lastTs = ts;

      // Update progress value in ref (no re-render, zero GC pressure)
      if (progressRef.current < 100) {
        const p = progressRef.current;
        progressRef.current = Math.min(
          100,
          p + (p < 70 ? 2.4 : 1.2) * (dt / 36) + Math.random() * 1.6 * (dt / 36)
        );
      }

      // Sync to React state at most ~12fps — only the number label needs to update
      if (ts - lastRender > RENDER_INTERVAL || progressRef.current >= 100) {
        lastRender = ts;
        const rounded = Math.min(100, Math.round(progressRef.current));
        setDisplayPct(rounded);

        if (rounded >= 100) {
          cancelAnimationFrame(rafId);
          setTimeout(() => {
            setVisible(false);
            hasLoadedOnce = true;
            setTimeout(onComplete, 600);
          }, 350);
          return;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  if (!shouldRender) return null;

  // Overlay fades from 0.94 → 0.15 once progress passes 50%
  const overlayOpacity = displayPct < 50
    ? 0.94
    : 0.94 - ((displayPct - 50) / 50) * 0.79;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: `rgba(6,9,18,${overlayOpacity.toFixed(3)})`,
            transition: "background 0.6s ease",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="relative z-10 flex flex-col items-center justify-center gap-6 sm:gap-8 px-6 w-full max-w-xs sm:max-w-md">

            {/* Logo — pulsing scale/opacity only (compositor-safe) */}
            <motion.div
              animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 sm:w-48 sm:h-48 translate-y-4 sm:translate-y-6"
              style={{ willChange: "transform, opacity" }}
            >
              <Logo className="w-full h-full" color={color} />
            </motion.div>

            {/* Wordmark */}
            <div className="text-center mt-2 select-none">
              <span className="font-rostex text-2xl sm:text-4xl font-bold tracking-[0.08em] text-[#f8fafc]">
                CIRCUIT<span style={{ color }}>RON</span>
              </span>
              <p
                className="font-exo font-medium tracking-[0.06em] text-[11px] sm:text-[14px] mt-3 sm:mt-4 leading-relaxed max-w-[260px] sm:max-w-md mx-auto"
                style={{ color: "rgba(148,163,184,0.45)" }}
              >
                It&apos;s the beginning of machines taking over the world
              </p>
            </div>

            {/* Progress row: LOADING ── [bar] ── 80% */}
            <div className="w-full max-w-[260px] sm:max-w-[360px] flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6">

              {/* Label */}
              <span
                className="font-rajdhani shrink-0 text-[9px] sm:text-[11px] tracking-[0.18em] uppercase"
                style={{ color: "rgba(148,163,184,0.45)" }}
              >
                LOADING
              </span>

              {/* Bar track — width driven by CSS var to avoid React state for bar width */}
              <div
                className="flex-1 h-[2px] sm:h-[3px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <div
                  className="h-full ease-out"
                  style={{
                    width: `${displayPct}%`,
                    background: `linear-gradient(90deg, #38bdf8, ${color})`,
                    transition: "width 80ms linear",
                  }}
                />
              </div>

              {/* Percentage */}
              <span
                className="font-orbitron font-semibold shrink-0 text-[9px] sm:text-[11px] tabular-nums"
                style={{
                  color: "rgba(56,189,248,0.75)",
                  minWidth: "2.8ch",
                  textAlign: "right",
                }}
              >
                {displayPct}%
              </span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
