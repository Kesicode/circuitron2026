"use client";
import { CircuitBoard, Globe, Mail, MapPin } from "lucide-react";

const WhatsAppIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const InstagramIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.01" fill="currentColor" strokeWidth="3"/>
  </svg>
);

const LinkedInIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
import { usePhaseTheme } from "@/lib/ConfigContext";

const NAV = ["Home","Ecosystem","Bootcamp","Internship","Hackathon","Community","Register"];

export default function Footer() {
  const year = new Date().getFullYear();
  const { color } = usePhaseTheme();
  const go = (id:string) => document.querySelector(`#${id.toLowerCase()}`)?.scrollIntoView({ behavior:"smooth" });

  return (
    <footer id="connect" style={{ background:"rgba(6,9,18,.98)", position:"relative" }}>
      <div className="absolute top-0 left-4 right-4 sm:left-8 sm:right-8 h-px"
        style={{ background:`linear-gradient(90deg, transparent, rgba(255,255,255,.08) 15%, ${color}40 50%, rgba(255,255,255,.08) 85%, transparent)` }} />

      <div className="cc-container !px-4 sm:!px-8 py-5 sm:py-7 md:py-6 flex flex-col justify-between min-h-[300px] md:min-h-[190px]">
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
              A transformative program designed to take you from a student to an industry-ready innovator. The details are classified. The impact is guaranteed.
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
            <div className="flex items-center gap-2">
              {[
                { icon:InstagramIcon, label:"Instagram", href:"https://www.instagram.com/ieeesbcekgr?igsh=MWFiZG5iYTM0dzNtMg==" },
                { icon:WhatsAppIcon,  label:"WhatsApp",  href:"https://whatsapp.com/channel/0029Vb62xwqJZg48JsVcJn37" },
                { icon:LinkedInIcon,  label:"LinkedIn",  href:"https://www.linkedin.com/company/ieeesbcekidangoor/" },
                { icon:Globe,         label:"Website",   href:"https://ieee.ce-kgr.org" },
              ].map(({ icon:Icon, label, href }) => (
                <a key={label} href={href} aria-label={label}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all"
                  style={{ border:"1px solid rgba(255,255,255,.07)", color:"rgba(148,163,184,.45)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "rgba(148,163,184,.45)"; }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>

            {/* Mentors */}
            <div className="mt-5 flex flex-col md:items-end">
              <p className="font-rajdhani font-700 text-[10px] tracking-[.2em] uppercase mb-2 text-slate-500">Mentor Support</p>
              <div className="flex flex-col gap-1.5 md:items-end">
                {[
                  { name: "Devaj A K", link: "https://wa.me/918848718432" },
                  { name: "Adwaith Krishna S", link: "https://wa.me/917025900705" }
                ].map(({ name, link }) => (
                  <a key={name} href={link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-exo text-xs transition-all duration-300"
                    style={{ color: "rgba(148,163,184,.5)", transition: "all 0.3s" }}
                    onMouseEnter={e => { 
                      e.currentTarget.style.color = color; 
                      e.currentTarget.style.textShadow = `0 0 8px ${color}80`;
                      e.currentTarget.style.filter = `drop-shadow(0 0 4px ${color}60)`;
                    }}
                    onMouseLeave={e => { 
                      e.currentTarget.style.color = "rgba(148,163,184,.5)"; 
                      e.currentTarget.style.textShadow = "none";
                      e.currentTarget.style.filter = "none";
                    }}>
                    <span>{name}</span>
                    <WhatsAppIcon size={11} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="h-px mb-3 md:mb-3" style={{ background:"rgba(255,255,255,.05)" }} />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-exo text-xs text-left" style={{ color:"rgba(148,163,184,.3)" }}>
              © {year} Circuitron · IEEE IAS SBC CE Kidangoor · IEEE IAS SBC CE Kidangoor · All rights reserved.
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
