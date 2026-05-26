"use client";
import { useEffect, useState } from "react";
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
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(true);
  const [logIdx,   setLogIdx]   = useState(0);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (hasLoadedOnce) {
      onComplete();
      return;
    }
    setShouldRender(true);

    // RAF-based progress — tied to vsync, no jank from timer threads
    let rafId: number;
    let lastTs = performance.now();

    const tick = (ts: number) => {
      const dt = ts - lastTs;
      lastTs = ts;

      setProgress(p => {
        if (p >= 100) return 100;
        return Math.min(100, p + (p < 70 ? 2.4 : 1.2) * (dt / 36) + Math.random() * 1.6 * (dt / 36));
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  // Exit once 100% reached
  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        setVisible(false);
        hasLoadedOnce = true;
        setTimeout(onComplete, 600);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  useEffect(() => {
    const idx = Math.floor((progress / 100) * LOGS.length);
    if (idx > logIdx) setLogIdx(idx);
  }, [progress, logIdx]);

  if (!shouldRender) return null;

  // Overlay fades from 0.94 → 0.15 once progress passes 50%
  // giving a smooth reveal of the circuit background underneath
  const overlayOpacity = progress < 50
    ? 0.94
    : 0.94 - ((progress - 50) / 50) * 0.79;   // 0.94 → 0.15

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: `rgba(6,9,18,${overlayOpacity.toFixed(3)})`,
            // Smooth overlay transition in CSS so it doesn't fight the RAF loop
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

              {/* Bar track */}
              <div
                className="flex-1 h-[2px] sm:h-[3px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                {/* Fill — no glow, no shadow */}
                <div
                  className="h-full transition-all duration-100 ease-out"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, #38bdf8, ${color})`,
                  }}
                />
              </div>

              {/* Percentage */}
              <span
                className="font-orbitron font-semibold shrink-0 text-[9px] sm:text-[11px]"
                style={{
                  color: "rgba(56,189,248,0.75)",
                  fontVariantNumeric: "tabular-nums",
                  fontFeatureSettings: '"tnum"',
                  minWidth: "2.8ch",
                  textAlign: "right",
                }}
              >
                {Math.min(100, Math.round(progress))}%
              </span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
