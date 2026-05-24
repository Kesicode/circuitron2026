"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSiteConfig, usePhaseTheme } from "@/lib/ConfigContext";

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
    transition: {
      duration: 0.04,
    }
  }
};

export default function HeroSection() {
  const { config } = useSiteConfig();
  const { color } = usePhaseTheme();
  
  const [statusText, setStatusText] = useState("PRE-REGISTRATION LIVE");
  const [ctaActive, setCtaActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ days: string; hours: string; minutes: string; seconds: string } | null>(null);

  useEffect(() => {
    const updateHeroStatusAndTimer = () => {
      const now = new Date().getTime();
      const preStart = new Date("2026-05-24T00:00:00+05:30").getTime();
      const preEnd = new Date("2026-05-25T23:59:59+05:30").getTime();
      const regStart = new Date("2026-05-26T00:00:00+05:30").getTime();
      const regEnd = new Date("2026-05-30T23:59:59+05:30").getTime();

      if (now < preStart) {
        setStatusText("PRE-REGISTRATION LIVE"); // Early access open
        setCtaActive(true);
      } else if (now >= preStart && now <= preEnd) {
        setStatusText("PRE-REGISTRATION LIVE");
        setCtaActive(true);
      } else if (now >= regStart && now <= regEnd) {
        setStatusText("REGISTRATION LIVE");
        setCtaActive(true);
      } else if (now > preEnd && now < regStart) {
        setStatusText("REGISTRATION LIVE");
        setCtaActive(true);
      } else {
        setStatusText("REGISTRATION CLOSED");
        setCtaActive(false);
      }

      const diff = regEnd - now;
      if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({
          days: String(d).padStart(2, "0"),
          hours: String(h).padStart(2, "0"),
          minutes: String(m).padStart(2, "0"),
          seconds: String(s).padStart(2, "0"),
        });
      } else {
        setTimeLeft(null);
      }
    };

    updateHeroStatusAndTimer();
    const interval = setInterval(updateHeroStatusAndTimer, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  const ctaLabel = statusText === "PRE-REGISTRATION LIVE" ? "PRE-REGISTER NOW" : "REGISTER NOW";

  const textSegments = [
    { text: "A transformative program designed to take you from a ", highlight: false },
    { text: "student to an industry-ready innovator.", highlight: true },
    { text: " The details are classified. The impact is guaranteed.", highlight: false }
  ];

  const chars = textSegments.flatMap((seg, segIdx) => 
    seg.text.split("").map((char, charIdx) => ({
      char,
      highlight: seg.highlight,
      id: `char-${segIdx}-${charIdx}`
    }))
  );

  return (
    <section id="home" className="cc-grid relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{ background:"linear-gradient(to top, #060912, transparent)" }} />

      {/* ── Content ── */}
      <div className="cc-container relative z-10 flex flex-col items-center justify-between text-center min-h-[calc(100vh-80px)] pt-10 sm:pt-12 pb-4 px-4 sm:px-6">

        <div className="flex-grow flex flex-col items-center justify-center w-full py-1 mt-1 sm:mt-2">
          {/* ── CIRCUITRON title ── */}
          <motion.div
            initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.85, delay:.2, ease:[.16,1,.3,1] }}>
            <h1 className="font-rostex leading-none text-center mb-2"
              style={{ 
                fontWeight:900, 
                fontSize:"clamp(1.7rem, 7.5vw, 5.5rem)", 
                letterSpacing:".04em",
                marginRight:"-0.04em",
                ["--active-color" as any]: color,
                ["--active-color-dim" as any]: `${color}2e`
              }}>
              <span className="selection-swap-white" style={{ color:"#f8fafc" }}>CIRCUIT</span>
              <span className="selection-swap-cyan" style={{ color }}>RON</span>
            </h1>
          </motion.div>

          {/* Divider */}
          <motion.div className="flex items-center gap-3 my-4 w-32 mx-auto"
            initial={{ opacity:0, scaleX:0 }} animate={{ opacity:1, scaleX:1 }}
            transition={{ duration:.6, delay:.7, ease:[.16,1,.3,1] }}>
            <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,.07)" }} />
            <div className="w-1 h-1 rounded-full" style={{ background:`${color}99` }} />
            <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,.07)" }} />
          </motion.div>

          {/* Dynamic Registration Indicator */}
          <motion.div 
            className="relative mt-4 mb-2 flex flex-col items-center justify-center text-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease: [.16,1,.3,1] }}
          >
            {statusText.split(" ").map((word, wIdx) => {
              const prevCharsLength = wIdx === 0 ? 0 : statusText.split(" ")[0].length;
              return (
                <div 
                  key={word} 
                  className={`flex items-center justify-center select-none font-orbitron uppercase font-black ${
                    wIdx === 0 ? "" : "mt-1 sm:mt-2"
                  }`}
                  style={{
                    fontSize: wIdx === 0 
                      ? "clamp(1.125rem, 4.5vw, 3rem)" 
                      : "clamp(1.875rem, 8vw, 5rem)"
                  }}
                >
                  {word.split("").map((char, cIdx) => {
                    const i = prevCharsLength + cIdx;
                    return (
                      <motion.span 
                        key={`${char}-${i}`} 
                        className="inline-block mr-[0.05em] sm:mr-[0.1em] last:mr-0 sm:last:mr-0 origin-bottom"
                        style={{
                          background: `linear-gradient(to bottom, #ffffff 30%, ${color} 100%)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          filter: `drop-shadow(0 0 ${wIdx === 0 ? '8px' : '15px'} ${color}22)`,
                        }}
                        animate={{
                          scale: [1, 1.06, 0.99, 1],
                          y: [0, -4, 0.5, 0],
                        }}
                        transition={{
                          duration: 0.7,
                          repeat: Infinity,
                          repeatDelay: 2.8,
                          delay: i * 0.07,
                          ease: "easeInOut",
                        }}
                      >
                        {char}
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
              transition={{ duration: 0.8, delay: 0.95, ease: [.16,1,.3,1] }}
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
                  <span className="font-orbitron font-black text-lg sm:text-2xl text-slate-100 tracking-wide">{timeLeft.days}</span>
                  <span className="font-exo text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Days</span>
                </div>
                <div className="w-px h-6 sm:h-8 bg-white/10" />
                <div className="flex flex-col items-center w-10 sm:w-12">
                  <span className="font-orbitron font-black text-lg sm:text-2xl text-slate-100 tracking-wide">{timeLeft.hours}</span>
                  <span className="font-exo text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Hours</span>
                </div>
                <div className="w-px h-6 sm:h-8 bg-white/10" />
                <div className="flex flex-col items-center w-10 sm:w-12">
                  <span className="font-orbitron font-black text-lg sm:text-2xl text-slate-100 tracking-wide">{timeLeft.minutes}</span>
                  <span className="font-exo text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Mins</span>
                </div>
                <div className="w-px h-6 sm:h-8 bg-white/10" />
                <div className="flex flex-col items-center w-10 sm:w-12">
                  <span className="font-orbitron font-black text-lg sm:text-2xl tracking-wide" style={{ color }}>{timeLeft.seconds}</span>
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
              transition={{ duration: 0.8, delay: 1.05, ease: [.16,1,.3,1] }}
              className="mt-5 mb-1 z-20"
            >
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-pre-register"))}
                className="font-orbitron font-bold text-xs sm:text-sm tracking-widest px-8 py-3.5 rounded-full uppercase text-slate-950 active:scale-[0.98] hover:scale-[1.03] transition-all cursor-pointer select-none"
                style={{
                  background: `linear-gradient(135deg, #ffffff 0%, ${color} 100%)`,
                  boxShadow: `0 0 30px -5px ${color}80, 0 10px 20px -5px ${color}33`,
                }}
              >
                {ctaLabel}
              </button>
            </motion.div>
          )}

        </div>

        {/* Subtitle (Description) with Typewriter Effect */}
        <motion.p className="font-exo font-300 max-w-lg mx-auto mb-0 pt-3 leading-relaxed mt-auto select-none"
          style={{ fontSize:"clamp(.875rem, 2vw, 1.05rem)" }}
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
    </section>
  );
}
