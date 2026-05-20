"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

import { usePhaseTheme } from "@/lib/ConfigContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { color } = usePhaseTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const bg   = scrolled ? "rgba(6,9,18,.90)" : "transparent";
  const blur = scrolled ? "blur(22px)" : "none";
  const bdr  = scrolled ? "1px solid rgba(255,255,255,.07)" : "1px solid transparent";

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background:bg, backdropFilter:blur, WebkitBackdropFilter:blur, borderBottom:bdr, transition:"all .35s" }}
      initial={{ y:-80, opacity:0 }} animate={{ y:0, opacity:1 }}
      transition={{ duration:.55, ease:[.16,1,.3,1] }}>

      <div className="cc-container px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo on Left */}
          <button 
            onClick={() => { window.location.href = "/"; }}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 active:scale-95 transition-all text-left outline-none border-none bg-transparent"
          >
            <Logo size={28} />
            <span className="font-rostex text-sm font-bold tracking-widest"
              style={{
                ["--active-color" as any]: color,
                ["--active-color-dim" as any]: `${color}2e`
              }}>
              <span className="selection-swap-white" style={{ color:"#e2e8f0" }}>CIRCUIT</span>
              <span className="selection-swap-cyan" style={{ color }}>RON</span>
            </span>
          </button>


        </div>
      </div>
    </motion.nav>
  );
}
