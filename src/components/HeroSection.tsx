"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useSiteConfig, usePhaseTheme } from "@/lib/ConfigContext";

// Pre-compute static data outside component to avoid recalculation on re-render
const textSegments = [
  { text: "A transformative program designed to take you from a ", highlight: false },
  { text: "student to an industry-ready innovator.", highlight: true },
  { text: " The details are classified. The impact is guaranteed.", highlight: false }
];

// Build the chars array once at module level — never rebuilt
const chars = textSegments.flatMap((seg, segIdx) =>
  seg.text.split("").map((char, charIdx) => ({
    char,
    highlight: seg.highlight,
    id: `char-${segIdx}-${charIdx}`
  }))
);

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.012,
      delayChildren: 1.2,
    }
  }
};

const childVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.04 },
  }
};

// Pre-compute scroll indicator positions
const scrollArrows = [0, 1, 2];

function getPhaseStatus(now: number) {
  const preStart         = 1779561000000; // 2026-05-24T00:00:00+05:30
  const preEnd           = 1779733799000; // 2026-05-25T23:59:59+05:30
  const regStart         = 1779733800000; // 2026-05-26T00:00:00+05:30
  const closingSoonStart = 1780079400000; // 2026-05-30T00:00:00+05:30
  const regEnd           = 1780165799000; // 2026-05-30T23:59:59+05:30

  if (now >= closingSoonStart && now <= regEnd) return { text: "REGISTRATION CLOSING_SOON", active: true };
  if (now >= regStart && now < closingSoonStart) return { text: "REGISTRATION LIVE", active: true };
  if (now >= preStart && now <= preEnd) return { text: "PRE-REGISTRATION LIVE", active: true };
  if (now < preStart) return { text: "PRE-REGISTRATION LIVE", active: true };
  if (now > preEnd && now < regStart) return { text: "REGISTRATION LIVE", active: true };
  return { text: "REGISTRATION CLOSED", active: false };
}

function getTimeLeft(now: number) {
  const regEnd = 1780165799000;
  const diff = regEnd - now;
  if (diff <= 0) return null;
  return {
    days:    String(Math.floor(diff / 86400000)).padStart(2, "0"),
    hours:   String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
    minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
    seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
  };
}

// Stable animation variants defined outside — prevents object recreation on render
const bounceVariants = {
  animate: { scale: [1, 1.06, 0.99, 1], y: [0, -4, 0.5, 0] },
};
const bounceTransitionBase = {
  duration: 0.7,
  repeat: Infinity,
  repeatDelay: 2.8,
  ease: "easeInOut" as const,
};

export default function HeroSection() {
  const { config } = useSiteConfig();
  const { color } = usePhaseTheme();

  // Use a single state object to halve the number of re-renders
  const [tick, setTick] = useState(() => Date.now());
  const rafRef = useRef<number>(0);
  const lastSecRef = useRef<number>(0);

  // RAF-driven timer — replaces setInterval for smooth second-by-second updates
  const rafLoop = useCallback(() => {
    const now = Date.now();
    // Only trigger re-render once per second (saves ~59 unnecessary renders/sec)
    if (Math.floor(now / 1000) !== lastSecRef.current) {
      lastSecRef.current = Math.floor(now / 1000);
      setTick(now);
    }
    rafRef.current = requestAnimationFrame(rafLoop);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(rafLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rafLoop]);

  const { text: statusText, active: ctaActive } = getPhaseStatus(tick);
  const timeLeft = getTimeLeft(tick);
  const ctaLabel = statusText === "PRE-REGISTRATION LIVE" ? "PRE-REGISTER NOW" : "REGISTER NOW";

  // Split status text into words for per-character animation  
  const statusWords = statusText.split(" ");

  return (
    <section id="home" className="cc-grid relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{ background: "linear-gradient(to top, #060912, transparent)" }} />

      {/* ── Content ── */}
      <div className="cc-container relative z-10 flex flex-col items-center justify-between text-center min-h-[calc(100vh-80px)] pt-10 sm:pt-12 md:pt-40 lg:pt-56 pb-4 px-4 sm:px-6">

        <div className="flex-grow flex flex-col items-center justify-center w-full py-1 mt-1 sm:mt-2">

          {/* ── CIRCUITRON title ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .85, delay: .2, ease: [.16, 1, .3, 1] }}>
            <h1 className="font-rostex leading-none text-center mb-2"
              style={{
                fontWeight: 900,
                fontSize: "clamp(1.7rem, 7.5vw, 5.5rem)",
                letterSpacing: ".04em",
                marginRight: "-0.04em",
                ["--active-color" as any]: color,
                ["--active-color-dim" as any]: `${color}2e`
              }}>
              <span className="selection-swap-white" style={{ color: "#f8fafc" }}>CIRCUIT</span>
              <span className="selection-swap-cyan" style={{ color }}>RON</span>
            </h1>
          </motion.div>

          {/* Divider */}
          <motion.div className="flex items-center gap-3 my-4 w-32 mx-auto"
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: .6, delay: .7, ease: [.16, 1, .3, 1] }}>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,.07)" }} />
            <div className="w-1 h-1 rounded-full" style={{ background: `${color}99` }} />
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,.07)" }} />
          </motion.div>

          {/* Dynamic Registration Indicator */}
          <motion.div
            className="relative mt-4 mb-2 flex flex-col items-center justify-center text-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease: [.16, 1, .3, 1] }}
          >
            {statusWords.map((word, wIdx) => {
              const prevCharsLength = wIdx === 0 ? 0 : statusWords[0].length;
              return (
                <div
                  key={word}
                  className={`flex items-center justify-center select-none font-orbitron uppercase font-extrabold tracking-wider leading-[1.05] ${wIdx === 0 ? "" : "mt-0 sm:mt-0.5"}`}
                  style={{
                    fontSize: wIdx === 0
                      ? "clamp(1rem, 4vw, 2.5rem)"
                      : "clamp(1.625rem, 7vw, 4rem)"
                  }}
                >
                  {word.split("").map((char, cIdx) => {
                    const i = prevCharsLength + cIdx;
                    return (
                      <motion.span
                        key={`${char}-${i}`}
                        className={`inline-block origin-bottom ${char === "_" ? "w-[0.4em]" : "mr-[0.12em] sm:mr-[0.22em] last:mr-0 sm:last:mr-0"}`}
                        style={{
                          background: char === "_" ? "transparent" : `linear-gradient(to bottom, #ffffff 30%, ${color} 100%)`,
                          WebkitBackgroundClip: char === "_" ? "none" : "text",
                          WebkitTextFillColor: char === "_" ? "inherit" : "transparent",
                          backgroundClip: char === "_" ? "none" : "text",
                          filter: char === "_" ? "none" : `drop-shadow(0 0 ${wIdx === 0 ? "8px" : "15px"} ${color}22)`,
                        }}
                        animate={bounceVariants.animate}
                        transition={{ ...bounceTransitionBase, delay: i * 0.07 }}
                      >
                        {char === "_" ? "\u00A0" : char}
                      </motion.span>
                    );
                  })}
                </div>
              );
            })}
          </motion.div>

          {/* Countdown Timer */}
          {timeLeft && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.95, ease: [.16, 1, .3, 1] }}
              className="mt-4 mb-2 flex flex-col items-center gap-3"
            >
              <span className="font-orbitron text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase select-none">
                Registration Closes on May 30
              </span>
              <div
                className="flex items-center gap-3 sm:gap-4 bg-slate-950/60 border border-white/5 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl"
                style={{ boxShadow: `0 0 25px ${color}12` }}
              >
                <div className="flex flex-col items-center w-10 sm:w-12">
                  <span className="font-orbitron font-black text-lg sm:text-2xl text-slate-100 tracking-wide tabular-nums">{timeLeft.days}</span>
                  <span className="font-exo text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Days</span>
                </div>
                <div className="w-px h-6 sm:h-8 bg-white/10" />
                <div className="flex flex-col items-center w-10 sm:w-12">
                  <span className="font-orbitron font-black text-lg sm:text-2xl text-slate-100 tracking-wide tabular-nums">{timeLeft.hours}</span>
                  <span className="font-exo text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Hours</span>
                </div>
                <div className="w-px h-6 sm:h-8 bg-white/10" />
                <div className="flex flex-col items-center w-10 sm:w-12">
                  <span className="font-orbitron font-black text-lg sm:text-2xl text-slate-100 tracking-wide tabular-nums">{timeLeft.minutes}</span>
                  <span className="font-exo text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Mins</span>
                </div>
                <div className="w-px h-6 sm:h-8 bg-white/10" />
                <div className="flex flex-col items-center w-10 sm:w-12">
                  <span className="font-orbitron font-black text-lg sm:text-2xl tracking-wide tabular-nums" style={{ color }}>{timeLeft.seconds}</span>
                  <span className="font-exo text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Secs</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Glowing CTA Button */}
          {ctaActive && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.05, ease: [.16, 1, .3, 1] }}
              className="mt-5 mb-1 z-20"
            >
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-pre-register"))}
                className="font-orbitron font-bold text-xs sm:text-sm tracking-widest px-8 py-3.5 rounded-full uppercase text-slate-950 active:scale-[0.98] hover:scale-[1.03] transition-transform cursor-pointer select-none"
                style={{
                  background: `linear-gradient(135deg, #ffffff 0%, ${color} 100%)`,
                  boxShadow: `0 0 30px -5px ${color}80, 0 10px 20px -5px ${color}33`,
                }}
              >
                {ctaLabel}
              </button>
            </motion.div>
          )}

          {/* Subtitle with Typewriter Effect */}
          <motion.p
            className="font-exo font-300 max-w-lg mx-auto mb-0 pt-3 leading-relaxed mt-6 sm:mt-8 select-none"
            style={{ fontSize: "clamp(.875rem, 2vw, 1.05rem)" }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {chars.map(c => (
              <motion.span
                key={c.id}
                variants={childVariants}
                className={c.highlight ? "text-[#f8fafc] font-medium" : "text-slate-400/85"}
              >
                {c.char}
              </motion.span>
            ))}
          </motion.p>

        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="flex flex-col items-center gap-1 mt-auto pt-12 sm:pt-20 mb-4 z-20"
        >
          <span className="font-orbitron text-[9px] font-bold tracking-[0.25em] text-slate-500 transition-colors uppercase select-none">
            Scroll Down
          </span>
          <div className="flex flex-col items-center -space-y-1.5 h-10 w-10 justify-center">
            {scrollArrows.map((i) => (
              <motion.svg
                key={i}
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ opacity: [0, 1, 0], y: [-4, 6, 16] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              >
                <path
                  d="M2 2L8 8L14 2"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-70"
                  style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
                />
              </motion.svg>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
