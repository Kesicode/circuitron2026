"use client";
import { motion } from "framer-motion";
import { Cpu, Lock, Layers, Calendar, Terminal } from "lucide-react";
import { usePhaseTheme } from "@/lib/ConfigContext";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function EventPhases() {
  const { color } = usePhaseTheme();

  return (
    <section id="ecosystem" className="cc-section relative overflow-hidden py-20 bg-slate-950/20">
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }} />

      <div className="cc-container relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="cc-label" style={{ ["--cyan" as any]: color }}>ECOSYSTEM PHASES</span>
          <h2 className="cc-h2 font-orbitron text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
            The Innovation Roadmap
          </h2>
          <p className="cc-body text-slate-400 mt-4 leading-relaxed">
            Circuitron is structured into three progressive phases, taking you from learning the fundamentals to delivering real-world engineering prototypes.
          </p>
        </div>

        {/* Phase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Phase 1 Card */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl border bg-slate-950/40 backdrop-blur-sm transition-all"
            style={{
              borderColor: `${color}35`,
              boxShadow: `0 10px 30px -15px rgba(0,0,0,0.7), 0 0 25px -10px ${color}1e`,
            }}
            whileHover={{ y: -5, borderColor: color, boxShadow: `0 15px 35px -10px rgba(0,0,0,0.8), 0 0 35px -5px ${color}2e` }}
          >
            <div>
              {/* Phase Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="cc-phase cc-phase-1 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{
                    background: `${color}10`,
                    color: color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  PHASE 01 • ACTIVE
                </span>
                <Cpu size={20} style={{ color }} />
              </div>

              {/* Title & Dates */}
              <h3 className="font-orbitron font-extrabold text-xl sm:text-2xl text-slate-100 mb-2">
                Tech Bootcamp
              </h3>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4 font-orbitron">
                <Calendar size={13} style={{ color }} />
                <span>JUNE 01 - JUNE 14</span>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-slate-900 my-4" />

              {/* Topics */}
              <div className="flex items-center gap-2 mb-3">
                <Terminal size={14} className="text-slate-500" />
                <span className="font-rajdhani text-xs tracking-wider font-bold text-slate-300 uppercase">
                  IoT & EMBEDDED SYSTEMS
                </span>
              </div>

              {/* Content */}
              <p className="font-exo text-sm text-slate-400 leading-relaxed font-light">
                A beginner-friendly, hands-on 2-week online program. Learn the fundamentals of microcontrollers, circuit interfacing, sensors, and cloud communication. Build fully functional IoT systems from scratch.
              </p>
            </div>

            {/* Bottom info */}
            <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-between">
              <span className="text-xs font-rajdhani text-slate-400 tracking-wider">Format:</span>
              <span className="text-xs font-orbitron font-bold text-slate-200 uppercase tracking-widest bg-slate-900 px-2.5 py-1 rounded-md">
                100% Online
              </span>
            </div>
          </motion.div>

          {/* Phase 2 Card */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl border bg-slate-950/20 backdrop-blur-sm border-white/5 opacity-75 grayscale hover:grayscale-0 transition-all duration-300"
            whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.12)" }}
          >
            <div>
              {/* Phase Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="cc-phase font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 text-slate-500 border border-white/5">
                  PHASE 02
                </span>
                <Lock size={18} className="text-slate-600" />
              </div>

              {/* Title & Dates */}
              <h3 className="font-orbitron font-extrabold text-xl sm:text-2xl text-slate-400 mb-2">
                Industry Internship
              </h3>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4 font-orbitron">
                <Calendar size={13} />
                <span>COMING SOON</span>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-slate-900 my-4" />

              {/* Content */}
              <p className="font-exo text-sm text-slate-500 leading-relaxed font-light">
                Take your skills to the professional level. Work on industry-led, real-world development projects with dedicated engineering mentors. Details will be unlocked soon.
              </p>
            </div>

            {/* Bottom info */}
            <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-between">
              <span className="text-xs font-rajdhani text-slate-600 tracking-wider">Status:</span>
              <span className="text-xs font-orbitron font-bold text-slate-500 uppercase tracking-widest bg-slate-900/30 px-2.5 py-1 rounded-md">
                Locked
              </span>
            </div>
          </motion.div>

          {/* Phase 3 Card */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl border bg-slate-950/20 backdrop-blur-sm border-white/5 opacity-75 grayscale hover:grayscale-0 transition-all duration-300"
            whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.12)" }}
          >
            <div>
              {/* Phase Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="cc-phase font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 text-slate-500 border border-white/5">
                  PHASE 03
                </span>
                <Lock size={18} className="text-slate-600" />
              </div>

              {/* Title & Dates */}
              <h3 className="font-orbitron font-extrabold text-xl sm:text-2xl text-slate-400 mb-2">
                Maker Hackathon
              </h3>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4 font-orbitron">
                <Calendar size={13} />
                <span>COMING SOON</span>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-slate-900 my-4" />

              {/* Content */}
              <p className="font-exo text-sm text-slate-500 leading-relaxed font-light">
                Collaborate, prototype, and pitch. Put your learning to the test in a high-stakes engineering sprint. Build a functional hardware-software prototype and pitch to tech investors.
              </p>
            </div>

            {/* Bottom info */}
            <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-between">
              <span className="text-xs font-rajdhani text-slate-600 tracking-wider">Status:</span>
              <span className="text-xs font-orbitron font-bold text-slate-500 uppercase tracking-widest bg-slate-900/30 px-2.5 py-1 rounded-md">
                Locked
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
