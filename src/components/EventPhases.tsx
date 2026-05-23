"use client";
import { motion } from "framer-motion";
import {
  Cpu, Lock, Calendar, Wifi, Zap, Code2, Radio,
  Cloud, BookOpen, Users, Clock, MonitorSmartphone,
  CheckCircle2, ChevronRight, Layers
} from "lucide-react";
import { usePhaseTheme } from "@/lib/ConfigContext";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const CURRICULUM = [
  { icon: Cpu,              label: "Microcontrollers",     desc: "Arduino & ESP32 from scratch" },
  { icon: Zap,              label: "Circuit Interfacing",  desc: "Sensors, actuators & GPIO" },
  { icon: Radio,            label: "Wireless Protocols",   desc: "Bluetooth, Wi-Fi & UART" },
  { icon: Cloud,            label: "Cloud & IoT",          desc: "MQTT, dashboards & data" },
  { icon: Code2,            label: "Embedded C/C++",       desc: "Programming for hardware" },
  { icon: Wifi,             label: "IoT Projects",         desc: "End-to-end build & deploy" },
];

const HIGHLIGHTS = [
  "Beginner-friendly — zero prior experience needed",
  "Live online sessions with expert mentors",
  "Hands-on project every week",
  "Certificate of completion",
  "Access to private community & resources",
  "IEEE member networking opportunities",
];

const SCHEDULE = [
  { week: "Week 1", label: "Jun 01 – Jun 07", title: "Foundations", desc: "Microcontrollers, Circuits & Programming basics" },
  { week: "Week 2", label: "Jun 08 – Jun 14", title: "Build & Deploy", desc: "IoT Systems, Cloud integration & Final Project" },
];

export default function EventPhases() {
  const { color } = usePhaseTheme();

  return (
    <section id="ecosystem" className="cc-section relative overflow-hidden py-24">
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none opacity-10"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />

      <div className="cc-container relative z-10 max-w-5xl mx-auto px-4">

        {/* ── Section Header ── */}
        <motion.div
          className="text-center mb-14"
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp}
        >
          <span
            className="inline-block text-[10px] font-orbitron font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-3 border"
            style={{ color, borderColor: `${color}30`, background: `${color}10` }}
          >
            PHASE 01 · NOW ACTIVE
          </span>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-slate-100 tracking-tight">
            Tech Bootcamp
          </h2>
          <p className="font-exo text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed text-sm">
            A hands-on, beginner-friendly online program on <strong className="text-slate-200">IoT & Embedded Systems</strong> — 
            2 weeks that will transform you from a student into a builder.
          </p>
        </motion.div>

        {/* ── Main Phase 1 Card ── */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={1}
          className="rounded-2xl border overflow-hidden mb-8"
          style={{
            borderColor: `${color}30`,
            background: "rgba(2, 6, 23, 0.7)",
            boxShadow: `0 0 60px -20px ${color}25, 0 25px 50px -20px rgba(0,0,0,0.8)`,
          }}
        >
          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

          <div className="p-6 sm:p-10">

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span
                className="flex items-center gap-1.5 text-[10px] font-orbitron font-bold tracking-wider uppercase px-3 py-1 rounded-full border"
                style={{ color, borderColor: `${color}40`, background: `${color}12` }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: color }} />
                ACTIVE
              </span>
              <span className="flex items-center gap-1.5 text-xs font-orbitron text-slate-400 bg-slate-900/60 border border-white/5 px-3 py-1 rounded-full">
                <Calendar size={11} style={{ color }} />
                June 01 – June 14, 2026
              </span>
              <span className="flex items-center gap-1.5 text-xs font-orbitron text-slate-400 bg-slate-900/60 border border-white/5 px-3 py-1 rounded-full">
                <Clock size={11} style={{ color }} />
                2 Weeks
              </span>
              <span className="flex items-center gap-1.5 text-xs font-orbitron text-slate-400 bg-slate-900/60 border border-white/5 px-3 py-1 rounded-full">
                <MonitorSmartphone size={11} style={{ color }} />
                100% Online
              </span>
            </div>

            {/* Main grid: curriculum + highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* Left: Curriculum */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen size={15} style={{ color }} />
                  <span className="font-rajdhani text-xs tracking-[0.15em] font-bold text-slate-300 uppercase">
                    What You'll Learn
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CURRICULUM.map(({ icon: Icon, label, desc }, i) => (
                    <motion.div
                      key={label}
                      custom={i * 0.5 + 2}
                      initial="hidden" whileInView="visible" viewport={{ once: true }}
                      variants={fadeUp}
                      className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-slate-950/50 hover:border-white/10 transition-all"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                      >
                        <Icon size={14} style={{ color }} />
                      </div>
                      <div>
                        <p className="font-orbitron text-[11px] font-bold text-slate-200 tracking-wide leading-tight">{label}</p>
                        <p className="font-exo text-[10px] text-slate-500 mt-0.5 leading-normal">{desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: Highlights + Schedule */}
              <div className="flex flex-col gap-7">
                {/* Highlights */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={15} style={{ color }} />
                    <span className="font-rajdhani text-xs tracking-[0.15em] font-bold text-slate-300 uppercase">
                      Program Highlights
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {HIGHLIGHTS.map((h, i) => (
                      <motion.li
                        key={i}
                        custom={i * 0.4 + 3}
                        initial="hidden" whileInView="visible" viewport={{ once: true }}
                        variants={fadeUp}
                        className="flex items-start gap-2.5"
                      >
                        <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color }} />
                        <span className="font-exo text-xs text-slate-300 leading-normal">{h}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Schedule */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={15} style={{ color }} />
                    <span className="font-rajdhani text-xs tracking-[0.15em] font-bold text-slate-300 uppercase">
                      Weekly Schedule
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {SCHEDULE.map(({ week, label, title, desc }, i) => (
                      <motion.div
                        key={week}
                        custom={i + 5}
                        initial="hidden" whileInView="visible" viewport={{ once: true }}
                        variants={fadeUp}
                        className="relative flex gap-4 pl-4"
                      >
                        {/* Timeline bar */}
                        <div
                          className="absolute left-0 top-1.5 w-0.5 h-full rounded-full"
                          style={{ background: i === 0 ? color : `${color}30` }}
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className="text-[9px] font-orbitron font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                              style={{ color, background: `${color}15` }}
                            >
                              {week}
                            </span>
                            <span className="text-[10px] font-exo text-slate-500">{label}</span>
                          </div>
                          <p className="font-orbitron text-xs font-bold text-slate-200">{title}</p>
                          <p className="font-exo text-[11px] text-slate-400 mt-0.5 leading-normal">{desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom stats bar */}
            <div
              className="mt-10 pt-6 border-t grid grid-cols-3 gap-4 text-center"
              style={{ borderColor: `${color}15` }}
            >
              {[
                { icon: Users,            val: "Beginner",  sub: "Level" },
                { icon: MonitorSmartphone, val: "Online",   sub: "Format" },
                { icon: Layers,           val: "2 Weeks",   sub: "Duration" },
              ].map(({ icon: Icon, val, sub }) => (
                <div key={sub} className="flex flex-col items-center gap-1">
                  <Icon size={16} style={{ color }} className="mb-1" />
                  <span className="font-orbitron font-extrabold text-sm text-slate-100">{val}</span>
                  <span className="font-exo text-[10px] text-slate-500 uppercase tracking-wider">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Phase 2 & 3 Teaser Pills ── */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={6}
          className="flex flex-col sm:flex-row gap-4"
        >
          {[
            { num: "02", title: "To Be Revealed", desc: "Details locked until Phase 01 completion" },
            { num: "03", title: "Classified",     desc: "Top secret final challenge" },
          ].map(({ num, title, desc }) => (
            <div
              key={num}
              className="flex-1 flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border border-white/5 bg-slate-950/30 backdrop-blur-sm opacity-60"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-center shrink-0">
                  <Lock size={14} className="text-slate-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-orbitron font-bold text-slate-500 tracking-widest uppercase bg-slate-900 px-2 py-0.5 rounded">
                      PHASE {num}
                    </span>
                    <span className="text-[9px] font-orbitron text-slate-600 tracking-widest uppercase">· Coming Soon</span>
                  </div>
                  <p className="font-orbitron text-xs font-bold text-slate-400">{title}</p>
                  <p className="font-exo text-[10px] text-slate-600 mt-0.5">{desc}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-700 shrink-0" />
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
