"use client";
import { useEffect, useRef, useState } from "react";
import { usePhaseTheme } from "@/lib/ConfigContext";

interface Node {
  x: number;
  y: number;
  phase: number;
  type: number;
  vx: number;
  vy: number;
}

function hexToRgb(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

// ── Vector Component Drawing Functions ──

const drawIC = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rgb: string, alpha: number) => {
  ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
  ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.08})`;
  ctx.lineWidth = 1.15;

  const w = size * 1.4;
  const h = size;
  ctx.beginPath();
  ctx.rect(x - w / 2, y - h / 2, w, h);
  ctx.fill();
  ctx.stroke();

  // Pins (3 on each side)
  const pinLen = size * 0.22;
  const pinGap = h / 4;
  for (let i = -1; i <= 1; i++) {
    const py = y + i * pinGap;
    // Left side pins
    ctx.beginPath();
    ctx.moveTo(x - w / 2, py);
    ctx.lineTo(x - w / 2 - pinLen, py);
    ctx.stroke();
    // Right side pins
    ctx.beginPath();
    ctx.moveTo(x + w / 2, py);
    ctx.lineTo(x + w / 2 + pinLen, py);
    ctx.stroke();
  }

  // Pin 1 Indicator Notch
  ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.7})`;
  ctx.beginPath();
  ctx.arc(x - w / 2 + 2.5, y - h / 2 + 2.5, 1, 0, Math.PI * 2);
  ctx.fill();
};

const drawResistor = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rgb: string, alpha: number) => {
  ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
  ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.08})`;
  ctx.lineWidth = 1.15;

  const w = size * 1.4;
  const h = size * 0.45;

  // Leads
  ctx.beginPath();
  ctx.moveTo(x - w, y);
  ctx.lineTo(x - w / 2, y);
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();

  // Resistor Body
  ctx.beginPath();
  ctx.rect(x - w / 2, y - h / 2, w, h);
  ctx.fill();
  ctx.stroke();

  // Color bands
  ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.45})`;
  ctx.fillRect(x - w / 4 - 0.75, y - h / 2, 1.5, h);
  ctx.fillRect(x - 0.75, y - h / 2, 1.5, h);
  ctx.fillRect(x + w / 4 - 0.75, y - h / 2, 1.5, h);
};

const drawCapacitor = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rgb: string, alpha: number) => {
  ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
  ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.08})`;
  ctx.lineWidth = 1.15;

  const h = size * 1.05;
  const gap = 3.5;

  // Leads
  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.lineTo(x - gap / 2, y);
  ctx.moveTo(x + gap / 2, y);
  ctx.lineTo(x + size, y);
  ctx.stroke();

  // Plates
  ctx.beginPath();
  ctx.moveTo(x - gap / 2, y - h / 2);
  ctx.lineTo(x - gap / 2, y + h / 2);
  ctx.moveTo(x + gap / 2, y - h / 2);
  ctx.lineTo(x + gap / 2, y + h / 2);
  ctx.stroke();

  // Plus label for polarization
  ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.6})`;
  ctx.font = "8px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("+", x - gap - 4, y - 4);
};

const drawDiode = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rgb: string, alpha: number) => {
  ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
  ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.08})`;
  ctx.lineWidth = 1.15;

  const w = size * 0.9;
  const h = size * 0.85;

  // Leads
  ctx.beginPath();
  ctx.moveTo(x - w, y);
  ctx.lineTo(x - w / 3, y);
  ctx.moveTo(x + w / 3, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();

  // Triangle (Pointing right)
  ctx.beginPath();
  ctx.moveTo(x - w / 3, y - h / 2);
  ctx.lineTo(x + w / 3, y);
  ctx.lineTo(x - w / 3, y + h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Vertical line at anode/cathode junction
  ctx.beginPath();
  ctx.moveTo(x + w / 3, y - h / 2);
  ctx.lineTo(x + w / 3, y + h / 2);
  ctx.stroke();

  // LED Light rays
  ctx.beginPath();
  ctx.moveTo(x + 1, y - h / 2 - 1);
  ctx.lineTo(x + 5, y - h / 2 - 5);
  ctx.moveTo(x - 3, y - h / 2 - 2);
  ctx.lineTo(x + 1, y - h / 2 - 6);
  ctx.stroke();
};

const drawSensor = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rgb: string, alpha: number) => {
  ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
  ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.08})`;
  ctx.lineWidth = 1.15;

  const r = size * 0.55;

  // Core sensor casing
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Wireless signal arcs (Antenna telemetry)
  ctx.beginPath();
  ctx.arc(x, y, r * 1.5, -Math.PI / 4, Math.PI / 4);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, r * 1.5, Math.PI * 3 / 4, Math.PI * 5 / 4);
  ctx.stroke();

  // Core dot
  ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.7})`;
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
};

export default function CircuitBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [mounted, setMounted] = useState(false);
  const { color } = usePhaseTheme();

  useEffect(() => {
    setMounted(true);
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const isMobile = W < 768;

    // Sparse, clean collection of schematic icons scattered over the screen
    const build = (): Node[] => {
      const count = isMobile ? 12 : 28;
      const nodes: Node[] = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          phase: Math.random() * Math.PI * 2,
          type: Math.floor(Math.random() * 5),
          vx: (Math.random() - 0.5) * (isMobile ? 0.06 : 0.12),
          vy: (Math.random() - 0.5) * (isMobile ? 0.06 : 0.12),
        });
      }
      return nodes;
    };

    let nodes = build();
    let t = 0;
    let lastTime = performance.now();

    const draw = (timestamp: number) => {
      raf.current = requestAnimationFrame(draw);

      const delta = timestamp - lastTime;
      lastTime = timestamp;

      // Cap delta time to prevent jumps
      const dt = Math.min(100, delta);
      const speed = isMobile ? 0.0003 : 0.0005;
      t += dt * speed;

      ctx.clearRect(0, 0, W, H);

      const themeRgb = hexToRgb(color);
      let secondaryRgb = "168,85,247"; // purple fallback
      if (color.toLowerCase() === "#a855f7" || color.toLowerCase() === "#6366f1") {
        secondaryRgb = "34,211,238"; // cyan
      }

      // Base line/dot overlay alpha
      const pulse = (Math.sin(t) + 1) / 2;
      const baseAlpha = isMobile ? (0.05 + pulse * 0.04) : (0.08 + pulse * 0.08);

      nodes.forEach((n) => {
        // Slow float movement
        n.x += n.vx * (dt * 0.25);
        n.y += n.vy * (dt * 0.25);

        // Screen wrap
        if (n.x < -30) n.x = W + 30;
        if (n.x > W + 30) n.x = -30;
        if (n.y < -30) n.y = H + 30;
        if (n.y > H + 30) n.y = -30;

        // Individual node pulse phase
        const dotPulse = (Math.sin(t * 1.5 + n.phase) + 1) / 2;
        const currentAlpha = baseAlpha * (0.35 + dotPulse * 0.65);

        // Alternate color gradient mix per node
        const rgbToUse = n.type % 2 === 0 ? themeRgb : secondaryRgb;
        const size = isMobile ? 12 : 16;

        // Draw the specific schematic component
        switch (n.type) {
          case 0:
            drawIC(ctx, n.x, n.y, size, rgbToUse, currentAlpha);
            break;
          case 1:
            drawResistor(ctx, n.x, n.y, size, rgbToUse, currentAlpha);
            break;
          case 2:
            drawCapacitor(ctx, n.x, n.y, size, rgbToUse, currentAlpha);
            break;
          case 3:
            drawDiode(ctx, n.x, n.y, size, rgbToUse, currentAlpha);
            break;
          case 4:
            drawSensor(ctx, n.x, n.y, size, rgbToUse, currentAlpha);
            break;
        }
      });
    };

    raf.current = requestAnimationFrame(draw);

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      nodes = build();
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
    };
  }, [color]);

  return (
    <canvas
      ref={ref}
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    />
  );
}
