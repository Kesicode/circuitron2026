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
        /* mix-blend-mode: multiply or darken might be better to preserve blue colors, 
           but since background is dark, we need to remove white. 
           Actually, CSS mix-blend-mode: screen is correct for removing white on black, 
           but let's scale it up heavily to remove the built-in padding in the image file */
        mixBlendMode: "screen",
        transform: "scale(1.7)",
      }}
      draggable={false}
    />
  );
}
