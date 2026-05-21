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

export default function LoadingScreen({ onComplete, color = "#38bdf8" }: { onComplete: () => void; color?: string }) {
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(true);
  const [logIdx,   setLogIdx]   = useState(0);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("circuitron_loaded") === "true") {
      onComplete();
      return;
    }
    setShouldRender(true);

    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(t);
          setTimeout(() => { setVisible(false); setTimeout(onComplete, 600); }, 350);
          return 100;
        }
        return Math.min(100, p + (p<70 ? 2.4 : 1.2) + Math.random()*1.6);
      });
    }, 36);
    return () => clearInterval(t);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.floor((progress/100) * LOGS.length);
    if (idx > logIdx) setLogIdx(idx);
  }, [progress, logIdx]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ 
            background: "transparent"
          }}
          exit={{ opacity:0 }}
          transition={{ duration: .55 }}
        >
          {/* Minimal, soft central glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle 350px at 50% 50%, rgba(56,189,248,0.04) 0%, transparent 100%)" }} />

          <div className="relative z-10 flex flex-col items-center justify-center gap-6 sm:gap-8 px-6 w-full max-w-xs sm:max-w-md">

            {/* Pulsing Logo Core */}
            <motion.div
              animate={{
                scale: [0.96, 1.04, 0.96],
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 sm:w-24 sm:h-24"
            >
              <Logo className="w-full h-full" color={color} />
            </motion.div>

            {/* Wordmark */}
            <div className="text-center mt-2 select-none">
              <span className="font-rostex text-2xl sm:text-4xl font-bold tracking-[0.08em] text-[#f8fafc]">
                CIRCUIT<span style={{ color }}>RON</span>
              </span>
              <p className="font-exo font-medium tracking-[0.06em] text-[11px] sm:text-[14px] mt-3 sm:mt-4 leading-relaxed max-w-[260px] sm:max-w-md mx-auto"
                style={{ color: "rgba(148, 163, 184, 0.45)" }}>
                It's the beginning of machines taking over the world
              </p>
            </div>

            {/* Minimalist Progress bar */}
            <div className="w-full max-w-[180px] sm:max-w-[280px] flex flex-col items-center mt-6 sm:mt-8">
              <div className="w-full h-[2px] sm:h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div 
                  className="h-full transition-all duration-100 ease-out"
                  style={{ 
                    width: `${progress}%`, 
                    background: `linear-gradient(90deg, #38bdf8, ${color})`,
                    boxShadow: "0 0 10px rgba(56, 189, 248, 0.55)"
                  }} 
                />
              </div>
              <div className="flex justify-between w-full mt-2.5 font-rajdhani text-[9px] sm:text-[11px] tracking-[0.18em]" style={{ color: "rgba(148,163,184,0.35)" }}>
                <span>LOADING</span>
                <span className="font-orbitron font-600" style={{ color: "rgba(56, 189, 248, 0.65)" }}>
                  {Math.min(100, Math.round(progress))}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
