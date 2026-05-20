"use client";
import { CircuitBoard, Globe, Camera, Users2, Mail, MapPin } from "lucide-react";
import { usePhaseTheme } from "@/lib/ConfigContext";

const NAV = ["Home","Ecosystem","Bootcamp","Internship","Hackathon","Community","Register"];

export default function Footer() {
  const year = new Date().getFullYear();
  const { color } = usePhaseTheme();
  const go = (id:string) => document.querySelector(`#${id.toLowerCase()}`)?.scrollIntoView({ behavior:"smooth" });

  return (
    <footer style={{ background:"rgba(6,9,18,.98)", position:"relative" }}>
      <div className="absolute top-0 left-6 right-6 sm:left-12 sm:right-12 h-px"
        style={{ background:`linear-gradient(90deg, transparent, rgba(255,255,255,.08) 15%, ${color}40 50%, rgba(255,255,255,.08) 85%, transparent)` }} />

      <div className="cc-container py-5 sm:py-7 md:py-6 flex flex-col justify-between min-h-[300px] md:min-h-[190px]">
        <div className="flex flex-col md:flex-row justify-between gap-5 md:gap-8 mb-4 md:mb-3">

          {/* Brand */}
          <div className="max-w-md">
            <button onClick={() => go("home")} className="flex items-center gap-2.5 mb-2">
              <span className="font-rostex text-sm font-bold" 
                style={{ 
                  letterSpacing:".07em",
                  ["--active-color" as any]: color,
                  ["--active-color-dim" as any]: `${color}2e`
                }}>
                <span className="selection-swap-white" style={{ color:"#e2e8f0" }}>CIRCUIT</span>
                <span className="selection-swap-cyan" style={{ color }}>RON</span>
              </span>
            </button>
            <p className="font-exo text-sm leading-relaxed mb-2" style={{ color:"rgba(148,163,184,.5)" }}>
              A Bootcamp focused on Embedded Systems, IoT, and Intelligent Devices, designed to foster innovation and industry-ready skills.
            </p>
            {/* IEEE badges */}
            <div className="flex items-center flex-wrap gap-3.5 mb-3 mt-1 select-none">
              <img 
                src="/logo-sbranch.png" 
                alt="IEEE CE Kidangoor Student Branch" 
                className="h-5 w-auto object-contain opacity-55 hover:opacity-85 transition-opacity"
              />
              <div className="w-[1px] h-3 bg-white/5" />
              <img 
                src="/logo-ias.png" 
                alt="IEEE IAS" 
                className="h-6 w-auto object-contain opacity-55 hover:opacity-85 transition-opacity"
              />
              <div className="w-[1px] h-3 bg-white/5" />
              <img 
                src="/logo-ras.png" 
                alt="IEEE RAS" 
                className="h-6 w-auto object-contain opacity-55 hover:opacity-85 transition-opacity"
              />
            </div>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=College+of+Engineering+Kidangoor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-exo text-xs hover:text-[#e2e8f0] transition-colors" 
              style={{ color:"rgba(148,163,184,.4)" }}
            >
              <MapPin size={12} /> College of Engineering, Kidangoor, Kerala 686583
            </a>
          </div>

          {/* Contact */}
          <div className="flex flex-col md:items-end">
            <p className="font-rajdhani font-700 text-xs tracking-[.2em] uppercase mb-1.5 md:mb-4 animate-connect-blink">Connect</p>
            <a href="https://ieee.ce-kgr.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 font-exo text-sm mb-2.5 md:mb-4 hover:text-[#e2e8f0] transition-colors"
              style={{ color:"rgba(148,163,184,.5)" }}>
              <Globe size={14} /> ieee.ce-kgr.org
            </a>
            <div className="flex items-center gap-2">
              {[
                { icon:Camera, label:"Instagram", href:"#" },
                { icon:Users2, label:"LinkedIn",  href:"#" },
                { icon:Globe,  label:"Website",   href:"https://ieee.ce-kgr.org" },
              ].map(({ icon:Icon, label, href }) => (
                <a key={label} href={href} aria-label={label}
                  className="p-2 rounded-lg transition-all"
                  style={{ border:"1px solid rgba(255,255,255,.07)", color:"rgba(148,163,184,.45)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "rgba(148,163,184,.45)"; }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="h-px mb-3 md:mb-3" style={{ background:"rgba(255,255,255,.05)" }} />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-exo text-xs text-left" style={{ color:"rgba(148,163,184,.3)" }}>
              © {year} Circuitron · IEEE IAS · IEEE RAS · VAZA · All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 font-exo text-xs" style={{ color:"rgba(148,163,184,.2)" }}>
              <CircuitBoard size={11} /> v2.0.0
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
