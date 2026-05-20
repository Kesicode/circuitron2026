"use client";
import React from 'react';
import { usePhaseTheme } from '@/lib/ConfigContext';

export default function Logo({ size = 32, className = "", color: propColor }: { size?: number, className?: string, color?: string }) {
  const { color: themeColor } = usePhaseTheme();
  const activeColor = propColor || themeColor || "#38bdf8";

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Glow filter */}
        <filter id="glow-c" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Outer glow layer (duplicates for neon effect) ── */}
      <g stroke={activeColor} strokeWidth="5.5" strokeLinecap="butt" fill="none" filter="url(#glow-c)" opacity="0.45">
        {/* Outer Arc Part A */}
        <path d="M 95.4,24.6 A 50,50 0 1,0 19.0,88.7" />
        {/* Outer Arc Part B */}
        <path d="M 19.0,88.7 A 50,50 0 0,1 95.4,95.4" />
        {/* Middle Arc */}
        <path d="M 86.9,33.1 A 38,38 0 1,0 91.1,81.8" />
        {/* Inner Arc */}
        <path d="M 78.4,41.6 A 26,26 0 1,0 78.4,78.4" />
      </g>

      {/* ── Main Crisp Lines ── */}
      <g stroke={activeColor} strokeWidth="5.5" strokeLinecap="butt" fill="none">
        {/* Outer Arc Part A */}
        <path d="M 95.4,24.6 A 50,50 0 1,0 19.0,88.7" />
        {/* Outer Arc Part B */}
        <path d="M 19.0,88.7 A 50,50 0 0,1 95.4,95.4" />
        {/* Middle Arc */}
        <path d="M 86.9,33.1 A 38,38 0 1,0 91.1,81.8" />
        {/* Inner Arc */}
        <path d="M 78.4,41.6 A 26,26 0 1,0 78.4,78.4" />
      </g>

      {/* ── Hollow Junction Circles (Nodes) ── */}
      {/* Glow layer for circles */}
      <g stroke={activeColor} strokeWidth="4.5" fill="#060912" filter="url(#glow-c)" opacity="0.4">
        <circle cx="95.4" cy="24.6" r="7.5" />
        <circle cx="19.0" cy="88.7" r="7.5" />
        <circle cx="91.1" cy="81.8" r="7.5" />
      </g>
      {/* Crisp layer for circles */}
      <g stroke={activeColor} strokeWidth="4.5" fill="#060912">
        <circle cx="95.4" cy="24.6" r="7.5" />
        <circle cx="19.0" cy="88.7" r="7.5" />
        <circle cx="91.1" cy="81.8" r="7.5" />
      </g>
    </svg>
  );
}
