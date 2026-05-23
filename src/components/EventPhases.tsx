"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  { icon: Cpu,              label: "Microcontrollers",     desc: "Arduino & ESP32 from scratch", details: "Learn the architecture of ESP32 and Arduino UNO. Understand GPIO, memory management, and how to flash code using Arduino IDE." },
  { icon: Zap,              label: "Circuit Interfacing",  desc: "Sensors, actuators & GPIO", details: "Master the art of connecting external components. We cover pull-up/down resistors, ADC, PWM, and interfacing with various sensors (temperature, motion, light)." },
  { icon: Radio,            label: "Wireless Protocols",   desc: "Bluetooth, Wi-Fi & UART", details: "Deep dive into communication. Learn how to transmit data wirelessly using Wi-Fi (ESP32) and Bluetooth Low Energy (BLE), as well as serial UART communication." },
  { icon: Cloud,            label: "Cloud & IoT",          desc: "MQTT, dashboards & data", details: "Connect your hardware to the internet. We'll set up an MQTT broker, send telemetry data to a cloud dashboard, and trigger remote commands." },
  { icon: Code2,            label: "Embedded C/C++",       desc: "Programming for hardware", details: "Write efficient code for constrained devices. Topics include pointers, structs, interrupt service routines (ISRs), and non-blocking code logic." },
  { icon: Wifi,             label: "IoT Projects",         desc: "End-to-end build & deploy", details: "Put it all together. You'll build a smart home automation node or a weather station, taking it from breadboard prototype to a fully deployed IoT system." },
];

const HIGHLIGHTS = [
  "Beginner-friendly - zero prior experience needed",
  "Structured Curriculum - A guided pathway from Arduino to IoT.",
  "Simulation-based project every week",
  "Project-Based Learning - Apply concepts through real-world projects.",
  "Certificate of Completion",
  "Learning Resources - Access study materials and community support.",
];

const SCHEDULE = [
  { week: "Week 1", label: "Jun 01 – Jun 07", title: "Arduino", desc: "Microcontrollers, Circuits & Programming basics" },
  { week: "Week 2", label: "Jun 08 – Jun 14", title: "ESP 32",  desc: "IoT Systems, Cloud integration & Final Project" },
];

export default function EventPhases() {
  const { color } = usePhaseTheme();

  const [statusText, setStatusText] = useState("UPCOMING");
  const [pulse, setPulse] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<typeof CURRICULUM[0] | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date().getTime();
      const regStart = new Date("2026-05-24T00:00:00+05:30").getTime();
      const regEnd = new Date("2026-05-30T23:59:59+05:30").getTime();
      const eventStart = new Date("2026-06-01T00:00:00+05:30").getTime();
      const eventEnd = new Date("2026-06-14T23:59:59+05:30").getTime();

      let targetTime = 0;
      let prefix = "";

      if (now < regStart) {
        setStatusText("UPCOMING");
        setPulse(false);
        targetTime = regStart;
        prefix = "Reg opens in";
      } else if (now >= regStart && now <= regEnd) {
        setStatusText("REGISTRATION OPEN");
        setPulse(true);
        targetTime = regEnd;
        prefix = "Reg ends in";
      } else if (now > regEnd && now < eventStart) {
        setStatusText("ENROLLMENT CLOSED");
        setPulse(false);
        targetTime = eventStart;
        prefix = "Starts in";
      } else if (now >= eventStart && now <= eventEnd) {
        setStatusText("ACTIVE PHASE");
        setPulse(true);
        const dayNum = Math.floor((now - eventStart) / (1000 * 60 * 60 * 24)) + 1;
        setCountdown(`Day ${dayNum}`);
        return;
      } else {
        setStatusText("COMPLETED");
        setPulse(false);
        setCountdown("");
        return;
      }

      const diff = targetTime - now;
      if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${prefix} ${d}d ${h}h ${m}m ${s}s`);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="ecosystem" className="cc-section relative overflow-hidden pt-8 pb-16 sm:py-16">
      {/* Background glow removed as requested */}

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
            A simulation-based, beginner-friendly online program on <strong className="text-slate-200">IoT & Embedded Systems</strong> — 
            2 weeks that will transform you from a student into a builder.
          </p>
        </motion.div>

        {/* ── Main Phase 1 Card ── */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={1}
          className="relative rounded-2xl border overflow-hidden mb-8 group transition-all duration-500"
          style={{
            borderColor: `${color}30`,
            background: "rgba(2, 6, 23, 0.55)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: `0 25px 50px -20px rgba(0,0,0,0.8)`,
          }}
          whileHover={{
            borderColor: `${color}60`,
            boxShadow: `0 25px 50px -20px rgba(0,0,0,0.9)`,
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
                {pulse && <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: color }} />}
                {statusText}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-orbitron text-slate-400 bg-slate-900/60 border border-white/5 px-3 py-1 rounded-full">
                <Calendar size={11} style={{ color }} />
                June 01 – June 14, 2026
              </span>
              {countdown && (
                <span className="sm:ml-auto flex items-center gap-1.5 text-xs font-orbitron font-bold tracking-wider text-slate-200 bg-slate-900/80 border px-3 py-1 rounded-full shadow-[0_0_15px_-3px_rgba(0,0,0,0.5)]" style={{ borderColor: `${color}40` }}>
                  <Clock size={11} style={{ color }} />
                  {countdown}
                </span>
              )}
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
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  {[0, 1].map((colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-3 flex-1 w-full">
                      {CURRICULUM.filter((_, i) => i % 2 === colIndex).map((topic, i) => {
                        const { icon: Icon, label, desc, details } = topic;
                        const isSelected = selectedTopic?.label === label;
                        const originalIndex = colIndex === 0 ? i * 2 : i * 2 + 1;
                        return (
                          <motion.div
                            key={label}
                            custom={originalIndex * 0.5 + 2}
                            initial="hidden" whileInView="visible" viewport={{ once: true }}
                            variants={fadeUp}
                            onClick={() => setSelectedTopic(isSelected ? null : topic)}
                            className="group/item flex flex-col gap-3 p-3.5 rounded-xl border border-white/10 border-t-white/20 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer overflow-hidden"
                            whileHover={{ scale: isSelected ? 1 : 1.02, borderColor: `${color}60` }}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 group-hover/item:shadow-[0_0_8px_-3px_var(--glow-color)]"
                                style={{ background: `${color}15`, border: `1px solid ${color}25`, '--glow-color': color } as any}
                              >
                                <Icon size={14} style={{ color }} className="transition-transform duration-300 group-hover/item:scale-110" />
                              </div>
                              <div>
                                <p className="font-orbitron text-[11px] font-bold text-white tracking-wide leading-tight transition-colors">{label}</p>
                                <p className="font-exo text-[10px] text-slate-400 mt-0.5 leading-normal transition-colors">{desc}</p>
                              </div>
                            </div>
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1, marginTop: 4 }}
                                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                  className="font-exo text-[11px] text-slate-300 leading-relaxed border-t border-white/5 pt-2"
                                >
                                  {details}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
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
                { icon: Users,            val: "Beginner to Moderate",  sub: "Level" },
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
            <motion.div
              key={num}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(2, 6, 23, 0.4)", borderColor: "rgba(255,255,255,0.1)" }}
              className="flex-1 flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border border-white/5 bg-slate-950/30 backdrop-blur-sm opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-not-allowed"
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
            </motion.div>
          ))}
        </motion.div>

      </div>

    </section>
  );
}
