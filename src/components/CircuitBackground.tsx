"use client";
import { useEffect, useRef, useState } from "react";
import { usePhaseTheme } from "@/lib/ConfigContext";

interface Node { x:number; y:number; connections:number[]; phase:number; }

function hexToRgb(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

// Calculates coordinate along a right-angled (orthogonal) path between two nodes
function getPathPoint(x1: number, y1: number, x2: number, y2: number, p: number) {
  const mx = x1 + (x2 - x1) * 0.5;
  const d1 = Math.abs(mx - x1);
  const d2 = Math.abs(y2 - y1);
  const d3 = Math.abs(x2 - mx);
  const total = d1 + d2 + d3;
  if (total === 0) return { x: x1, y: y1 };

  const p1 = d1 / total;
  const p2 = d2 / total;

  if (p <= p1) {
    const t = p / p1;
    return { x: x1 + (mx - x1) * t, y: y1 };
  } else if (p <= p1 + p2) {
    const t = (p - p1) / p2;
    return { x: mx, y: y1 + (y2 - y1) * t };
  } else {
    const t = (p - p1 - p2) / (1 - p1 - p2);
    return { x: mx + (x2 - mx) * t, y: y2 };
  }
}

export default function CircuitBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [mounted, setMounted] = useState(false);
  const { color } = usePhaseTheme();

  useEffect(() => {
    setMounted(true);
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const isMobile = W < 768;

    // Mouse coordinates tracker
    const mouse = { x: -9999, y: -9999 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });

    const build = (): Node[] => {
      const sp = isMobile ? 55 : 75;
      const nodes: Node[] = [];
      const cols = Math.ceil(W/sp)+1, rows = Math.ceil(H/sp)+1;
      for (let r=0; r<=rows; r++)
        for (let c=0; c<=cols; c++)
          nodes.push({ 
            x: c*sp+(Math.random()-.5)*(isMobile ? 14 : 24), 
            y: r*sp+(Math.random()-.5)*(isMobile ? 10 : 16), 
            connections:[], 
            phase: Math.random()*Math.PI*2 
          });
      
      const maxDist = isMobile ? 75 : 110;
      const prob = isMobile ? .50 : .55;
      for (let i=0;i<nodes.length;i++)
        for (let j=i+1;j<nodes.length;j++) {
          const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
          if (Math.sqrt(dx*dx+dy*dy)<maxDist && Math.random()>prob) nodes[i].connections.push(j);
        }
      return nodes;
    };

    let nodes = build(), t = 0;
    let lastTime = performance.now();

    const draw = (timestamp: number) => {
      raf.current = requestAnimationFrame(draw);

      const delta = timestamp - lastTime;
      lastTime = timestamp;

      // Cap delta time to prevent large leaps
      const dt = Math.min(100, delta);
      
      // Speed multiplier
      const speed = isMobile ? 0.00048 : 0.00072;
      t += dt * speed;

      ctx.clearRect(0,0,W,H);

      // Parse colors
      const themeRgb = hexToRgb(color);
      let secondaryRgb = "168,85,247"; // purple
      if (color.toLowerCase() === "#a855f7") {
        secondaryRgb = "34,211,238"; // complementary cyan
      } else if (color.toLowerCase() === "#6366f1") {
        secondaryRgb = "34,211,238"; // complementary cyan
      }

      // 1. Draw static grid connection lines
      const lineGrad = ctx.createLinearGradient(0, 0, 0, H);
      const pulse = (Math.sin(t)+1)/2;
      const alpha = isMobile ? (.04 + pulse*.04) : (.05 + pulse*.07);
      lineGrad.addColorStop(0, `rgba(${themeRgb},${alpha.toFixed(3)})`);
      lineGrad.addColorStop(1, `rgba(${secondaryRgb},${alpha.toFixed(3)})`);

      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = .75;

      nodes.forEach(n => {
        n.connections.forEach(j => {
          const m = nodes[j];
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          const mx = n.x+(m.x-n.x)*.5;
          ctx.lineTo(mx, n.y); ctx.lineTo(mx, m.y); ctx.lineTo(m.x, m.y);
          ctx.stroke();
        });
      });

      // 2. Draw moving electrical pulses (electrons traveling along traces)
      nodes.forEach((n, idx) => {
        n.connections.forEach((j, connIdx) => {
          const m = nodes[j];
          // Use connection and node index to vary speed/phase offset
          const pulseSpeed = 0.22 + ((idx + connIdx) % 3) * 0.08;
          const pulseProgress = (t * pulseSpeed + (idx * 0.07)) % 1.0;
          
          const pt = getPathPoint(n.x, n.y, m.x, m.y, pulseProgress);
          
          // Draw multi-layered glow dot (very fast and clean)
          // Outer soft halo glow
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isMobile ? 3 : 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${themeRgb}, 0.16)`;
          ctx.fill();

          // Inner bright core
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isMobile ? 1.0 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${themeRgb}, 0.92)`;
          ctx.fill();
        });
      });

      // 3. Draw static nodes (pulsing dots + mouse reaction)
      const dotGrad = ctx.createLinearGradient(0, 0, 0, H);
      dotGrad.addColorStop(0, `rgba(${themeRgb},0.45)`);
      dotGrad.addColorStop(1, `rgba(${secondaryRgb},0.45)`);

      nodes.forEach(n => {
        // Calculate mouse interaction
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let mouseInfluence = 0;
        
        const activeRadius = isMobile ? 120 : 180;
        if (dist < activeRadius) {
          mouseInfluence = (1 - dist / activeRadius);
        }

        const dotPulse = (Math.sin(t*1.3+n.phase)+1)/2;
        const baseSize = isMobile ? .7 : .9;
        const pulseSize = dotPulse * (isMobile ? .7 : 1.2);
        const dotSize = baseSize + pulseSize + mouseInfluence * 1.0;
        
        ctx.beginPath();
        ctx.arc(n.x, n.y, dotSize, 0, Math.PI*2);
        
        // Highlight nodes close to mouse cursor
        if (mouseInfluence > 0) {
          ctx.fillStyle = `rgba(${themeRgb}, ${Math.min(0.9, 0.45 + mouseInfluence * 0.45)})`;
        } else {
          ctx.fillStyle = dotGrad;
        }
        ctx.fill();

        // Draw radial highlight behind nodes close to mouse
        if (mouseInfluence > 0.25) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, dotSize * 3.5, 0, Math.PI*2);
          ctx.fillStyle = `rgba(${themeRgb}, ${mouseInfluence * 0.075})`;
          ctx.fill();
        }
      });
    };
    raf.current = requestAnimationFrame(draw);

    const onResize = () => {
      W=window.innerWidth; H=window.innerHeight;
      canvas.width=W; canvas.height=H; nodes=build();
    };
    window.addEventListener("resize", onResize, { passive:true });
    return () => { 
      cancelAnimationFrame(raf.current); 
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [color]);

  return (
    <canvas 
      ref={ref} 
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`} 
      aria-hidden="true" 
    />
  );
}
