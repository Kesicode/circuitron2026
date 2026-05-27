"use client";
import { useEffect, useRef, useState } from "react";
import { usePhaseTheme } from "@/lib/ConfigContext";

interface Node { x: number; y: number; connections: number[]; phase: number; }

// Cache hex→rgb conversion — called every frame so must be O(1)
const rgbCache = new Map<string, string>();
function hexToRgb(hex: string): string {
  const cached = rgbCache.get(hex);
  if (cached) return cached;
  const c = hex.replace("#", "");
  const result = `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`;
  rgbCache.set(hex, result);
  return result;
}

// Pre-compute secondary color map — avoids toLowerCase + string comparison every frame
const SECONDARY: Record<string, string> = {
  "#a855f7": "34,211,238",
  "#6366f1": "34,211,238",
};
const DEFAULT_SECONDARY = "168,85,247";

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [mounted, setMounted] = useState(false);
  const { color } = usePhaseTheme();

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const isMobile = W < 768;

    // Target frame intervals
    const TARGET_INTERVAL = isMobile ? 1000 / 30 : 0; // 30fps mobile, uncapped desktop

    // Build grid — O(n) pass for grid, O(n*maxNeighbours) for connections
    // Using a spatial grid to avoid the O(n²) distance check
    const build = (): Node[] => {
      const sp   = isMobile ? 95 : 75;
      const cols = Math.ceil(W / sp) + 1;
      const rows = Math.ceil(H / sp) + 1;
      const jitterX = isMobile ? 14 : 24;
      const jitterY = isMobile ? 10 : 16;

      const nodes: Node[] = [];
      for (let r = 0; r <= rows; r++)
        for (let c = 0; c <= cols; c++)
          nodes.push({
            x: c * sp + (Math.random() - 0.5) * jitterX,
            y: r * sp + (Math.random() - 0.5) * jitterY,
            connections: [],
            phase: Math.random() * Math.PI * 2,
          });

      // O(n²) is unavoidable for arbitrary graph, but limit neighbours per node
      // and use squared distance to skip sqrt
      const maxDistSq = isMobile ? 10000 : 12100; // 100² : 110²
      const prob      = isMobile ? 0.48 : 0.55;
      const maxConn   = isMobile ? 2 : 3; // cap connections per node

      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].connections.length >= maxConn) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[j].connections.length >= maxConn) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (dx * dx + dy * dy < maxDistSq && Math.random() > prob) {
            nodes[i].connections.push(j);
            if (nodes[i].connections.length >= maxConn) break;
          }
        }
      }
      return nodes;
    };

    let nodes    = build();
    let t        = 0;
    let lastTime = performance.now();
    let accum    = 0;

    // Cache color state — only recompute when color prop changes
    // (color changes are infrequent; this saves string ops every frame on mobile)
    let cachedThemeRgb     = hexToRgb(color);
    let cachedSecondaryRgb = SECONDARY[color.toLowerCase()] ?? DEFAULT_SECONDARY;

    const draw = (timestamp: number) => {
      rafRef.current = requestAnimationFrame(draw);

      const delta = timestamp - lastTime;
      lastTime    = timestamp;
      const dt    = Math.min(100, delta);

      // Throttle mobile to 30fps
      if (isMobile) {
        accum += dt;
        if (accum < TARGET_INTERVAL) return;
        accum -= TARGET_INTERVAL;
      }

      const speed = isMobile ? 0.00012 : 0.00018;
      t += dt * speed;

      ctx.clearRect(0, 0, W, H);

      const pulse = (Math.sin(t * 8) + 1) * 0.5;
      const alpha = isMobile ? (0.04 + pulse * 0.05) : (0.06 + pulse * 0.10);
      const alphaStr = alpha.toFixed(3);

      // Stroke style — solid on mobile (skip gradient creation), gradient on desktop
      if (isMobile) {
        ctx.strokeStyle = `rgba(${cachedThemeRgb},${alphaStr})`;
      } else {
        const lg = ctx.createLinearGradient(0, 0, 0, H);
        lg.addColorStop(0, `rgba(${cachedThemeRgb},${alphaStr})`);
        lg.addColorStop(1, `rgba(${cachedSecondaryRgb},${alphaStr})`);
        ctx.strokeStyle = lg;
      }
      ctx.lineWidth = 0.85;

      // Draw all connections in a single batched path per style
      ctx.beginPath();
      for (let ni = 0; ni < nodes.length; ni++) {
        const n  = nodes[ni];
        const driftAmt = isMobile ? 1 : 2;
        const p1x = n.x + Math.sin(t + n.phase) * driftAmt;
        const p1y = n.y + Math.cos(t * 0.8 + n.phase) * driftAmt;

        for (let ci = 0; ci < n.connections.length; ci++) {
          const m  = nodes[n.connections[ci]];
          const p2x = m.x + Math.sin(t + m.phase) * driftAmt;
          const p2y = m.y + Math.cos(t * 0.8 + m.phase) * driftAmt;
          const midX = p1x + (p2x - p1x) * 0.5;
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(midX, p1y);
          ctx.lineTo(midX, p2y);
          ctx.lineTo(p2x, p2y);
        }
      }
      ctx.stroke();

      // Dot fill style
      const dotAlpha = 0.45;
      if (isMobile) {
        ctx.fillStyle = `rgba(${cachedThemeRgb},${dotAlpha})`;
      } else {
        const dg = ctx.createLinearGradient(0, 0, 0, H);
        dg.addColorStop(0, `rgba(${cachedThemeRgb},${dotAlpha})`);
        dg.addColorStop(1, `rgba(${cachedSecondaryRgb},${dotAlpha})`);
        ctx.fillStyle = dg;
      }

      // Draw dots — batch all arcs then fill once
      const baseR = isMobile ? 0.8 : 1;
      const maxExtraR = isMobile ? 0.8 : 1.5;
      const driftAmt = isMobile ? 1 : 2;
      for (let ni = 0; ni < nodes.length; ni++) {
        const n = nodes[ni];
        const px = n.x + Math.sin(t + n.phase) * driftAmt;
        const py = n.y + Math.cos(t * 0.8 + n.phase) * driftAmt;
        const dotPulse = (Math.sin(t * 12 + n.phase) + 1) * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, baseR + dotPulse * maxExtraR, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    // Debounce resize to avoid rebuilding nodes on every resize pixel
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W; canvas.height = H;
        nodes = build();
      }, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [color]);

  // Sync cached color strings when color prop changes (outside RAF loop)
  // This is handled naturally because the useEffect dep array includes color

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
      style={{
        willChange: "transform",
        transform: "translateZ(0)",
      }}
      aria-hidden="true"
    />
  );
}
