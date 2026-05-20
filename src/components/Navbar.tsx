"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

import { usePhaseTheme } from "@/lib/ConfigContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { color } = usePhaseTheme();
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

  const handleContactClick = (e: React.MouseEvent) => {
    if (!isNotifyPage) {
      e.preventDefault();
      document.getElementById("connect")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const bg   = scrolled ? "rgba(6,9,18,.90)" : "transparent";
  const blur = scrolled ? "blur(22px)" : "none";
  const bdr  = scrolled ? "1px solid rgba(255,255,255,.07)" : "1px solid transparent";

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background:bg, backdropFilter:blur, WebkitBackdropFilter:blur, borderBottom:bdr, transition:"all .35s" }}
      initial={{ y:-80, opacity:0 }} animate={{ y:0, opacity:1 }}
      transition={{ duration:.55, ease:[.16,1,.3,1] }}>

      <div className="cc-container px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo on Left */}
          <Link 
            href="/"
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 active:scale-95 transition-all text-left outline-none border-none bg-transparent"
          >
            <Logo size={28} />
            <span className="font-rostex text-sm font-bold tracking-widest hidden min-[380px]:inline-block"
              style={{
                ["--active-color" as any]: color,
                ["--active-color-dim" as any]: `${color}2e`
              }}>
              <span className="selection-swap-white" style={{ color:"#e2e8f0" }}>CIRCUIT</span>
              <span className="selection-swap-cyan" style={{ color }}>RON</span>
            </span>
          </Link>

          {/* Navigation Links on Right */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="font-orbitron text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 hover:text-white transition-colors"
            >
              HOME
            </Link>
            <Link
              href="/#connect"
              onClick={handleContactClick}
              className="font-orbitron text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 hover:text-white transition-colors"
            >
              CONTACT
            </Link>
            <Link
              href="/notify"
              className="font-orbitron text-[10px] sm:text-[11px] font-bold tracking-wider px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase text-slate-950 hover:scale-[1.03] active:scale-[0.98] transition-all"
              style={{
                background: `linear-gradient(135deg, #ffffff 0%, ${color} 100%)`,
                boxShadow: `0 0 15px -3px ${color}50`
              }}
            >
              NOTIFY ME
            </Link>
          </div>

        </div>
      </div>
    </motion.nav>
  );
}
