"use client";
import React from "react";

export default function Logo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
  color?: string; // kept for backwards compat — ignored since we use the exact image
}) {
  return (
    <img
      src="/logo-circuitron.png"
      alt="Circuitron Logo"
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: "contain",
        display: "block",
        /* mix-blend-mode makes the white background invisible
           against the dark site backgrounds, showing only the
           cyan C-circuit logo mark — without modifying the
           original image file in any way */
        mixBlendMode: "screen",
      }}
      draggable={false}
    />
  );
}
