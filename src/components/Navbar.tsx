"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import Logo from "./Logo";

import { usePhaseTheme, useSiteConfig } from "@/lib/ConfigContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { color } = usePhaseTheme();
  const { theme, toggleTheme } = useSiteConfig();
  const pathname = usePathname();
  const isNotifyPage = pathname === "/notify";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    if (!isNotifyPage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    if (!isNotifyPage) {
      e.preventDefault();
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    if (!isNotifyPage) {
      e.preventDefault();
      document.getElementById("connect")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("open-pre-register"));
    }
  };

  const bg   = scrolled ? "var(--nav-bg)" : "transparent";
  const blur = scrolled ? "blur(22px)" : "none";
  const bdr  = scrolled ? "1px solid var(--border)" : "1px solid transparent";

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background:bg, backdropFilter:blur, WebkitBackdropFilter:blur, borderBottom:bdr, transition:"all .35s" }}
      initial={{ y:-80, opacity:0 }} animate={{ y:0, opacity:1 }}
      transition={{ duration:.65, delay:.1, ease:[.16,1,.3,1] }}>

      <div className="cc-container px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo on Left */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 active:scale-95 transition-all text-left outline-none border-none bg-transparent"
          >
            <Logo size={28} />
            {/* Name only shows on screens wider than Mobile L (>425px) */}
            <span className="font-rostex text-sm font-bold tracking-widest hidden min-[480px]:inline-block"
              style={{
                ["--active-color" as any]: color,
                ["--active-color-dim" as any]: `${color}2e`
              }}>
              <span className="selection-swap-white" style={{ color:"#e2e8f0" }}>CIRCUIT</span>
              <span className="selection-swap-cyan" style={{ color }}>RON</span>
            </span>
          </a>

          {/* Navigation Links on Right */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="hidden sm:block font-orbitron text-[10px] min-[480px]:text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 hover:text-white transition-colors"
            >
              HOME
            </Link>
            <Link
              href="/#about"
              onClick={handleAboutClick}
              className="hidden sm:block font-orbitron text-[10px] min-[480px]:text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 hover:text-white transition-colors"
            >
              ABOUT
            </Link>
            <Link
              href="/#connect"
              onClick={handleContactClick}
              className="hidden sm:block font-orbitron text-[10px] min-[480px]:text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 hover:text-white transition-colors"
            >
              CONTACT
            </Link>
            
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border transition-all cursor-pointer text-slate-400 hover:text-white flex items-center justify-center bg-white/[0.02] border-white/5 active:scale-95 outline-none select-none"
              style={{
                borderColor: "var(--border)",
              }}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={14} style={{ color }} /> : <Moon size={14} style={{ color }} />}
            </button>

            <Link
              href="/notify"
              onClick={handleRegisterClick}
              className="font-orbitron text-[10px] sm:text-[11px] font-bold tracking-wider px-3 min-[480px]:px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase text-slate-950 hover:scale-[1.03] active:scale-[0.98] transition-all whitespace-nowrap"
              style={{
                background: `linear-gradient(135deg, #ffffff 0%, ${color} 100%)`,
                boxShadow: `0 0 15px -3px ${color}50`
              }}
            >
              PRE-REGISTER
            </Link>
          </div>

        </div>
      </div>
    </motion.nav>
  );
}
