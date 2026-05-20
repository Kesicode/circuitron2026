"use client";
import { motion } from "framer-motion";
import { useSiteConfig, usePhaseTheme } from "@/lib/ConfigContext";

const CTA_LABELS: Record<string, string> = {
  coming_soon: "Coming Soon",
  pre_open:    "Pre-Register Now",
  open:        "Join the Bootcamp",
  closed:      "Registration Closed",
};

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.015,
      delayChildren: 1.8,
    }
  }
};

const childVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.05,
    }
  }
};

export default function HeroSection() {
  const { config } = useSiteConfig();
  const { color } = usePhaseTheme();
  const btnLabel = CTA_LABELS[config.registrationState] ?? "Pre-Register Now";
  const isActive = config.registrationState === "pre_open" || config.registrationState === "open";

  const textSegments = [
    { text: "Master ", highlight: false },
    { text: "Embedded Systems & IoT", highlight: true },
    { text: " through a innovation journey.", highlight: false }
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
      <div className="cc-container relative z-10 flex flex-col items-center justify-between text-center min-h-[calc(100vh-70px)] pt-12 sm:pt-16 pb-6 px-4 sm:px-6">

        <div className="flex-grow flex flex-col items-center justify-center w-full py-4 mt-4 sm:mt-6">
          {/* ── CIRCUITRON title ── */}
          <motion.div
            initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.75, delay:.3, ease:[.16,1,.3,1] }}>
            <h1 className="font-rostex leading-none text-center mb-3"
              style={{ 
                fontWeight:900, 
                fontSize:"clamp(1.7rem, 7.5vw, 5.5rem)", 
                letterSpacing:".04em",
                ["--active-color" as any]: color,
                ["--active-color-dim" as any]: `${color}2e`
              }}>
              <span className="selection-swap-white" style={{ color:"#f8fafc" }}>CIRCUIT</span>
              <span className="selection-swap-cyan" style={{ color }}>RON</span>
            </h1>
          </motion.div>

          {/* Divider */}
          <motion.div className="flex items-center gap-3 my-6 w-32 mx-auto"
            initial={{ opacity:0, scaleX:0 }} animate={{ opacity:1, scaleX:1 }}
            transition={{ duration:.55, delay:.65 }}>
            <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,.07)" }} />
            <div className="w-1 h-1 rounded-full" style={{ background:`${color}99` }} />
            <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,.07)" }} />
          </motion.div>

          {/* Coming Soon Indicator with Negative Mask Animation */}
          {/* Coming Soon Text (Simple, Premium Crisp White) */}
          <motion.div 
            className="relative mt-8 mb-4 flex items-center justify-center select-none font-orbitron uppercase font-black text-xl min-[360px]:text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            {"COMING SOON...".split("").map((char, i) => (
              <motion.span 
                key={i} 
                className="inline-block mr-[0.2em] min-[360px]:mr-[0.25em] sm:mr-[0.4em] md:mr-[0.45em] last:mr-0 origin-bottom"
                style={{
                  background: `linear-gradient(to bottom, #ffffff 30%, ${color} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{
                  scale: [1, 1.08, 0.98, 1],
                  y: [0, -6, 0.5, 0],
                  filter: [
                    "drop-shadow(0 0 0px transparent)",
                    `drop-shadow(0 0 12px ${color}bf)`,
                    `drop-shadow(0 0 2px ${color}33)`,
                    "drop-shadow(0 0 0px transparent)"
                  ]
                }}
                transition={{
                  duration: 0.85,
                  repeat: Infinity,
                  repeatDelay: 1.6,
                  delay: i * 0.08,
                  ease: "easeInOut",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Subtitle (Description) with Typewriter Effect */}
        <motion.p className="font-exo font-300 max-w-lg mx-auto mb-4 leading-relaxed mt-auto select-none"
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
