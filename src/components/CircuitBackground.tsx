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

      // Cap delta time to prevent huge animation jumps when the tab is backgrounded/restored
      const dt = Math.min(100, delta);
      
      // Calculate speed based on delta time
      const speed = isMobile ? 0.00048 : 0.00072;
      t += dt * speed;

      ctx.clearRect(0,0,W,H);

      // Parse theme RGB and complementary RGB
      const themeRgb = hexToRgb(color);
      let secondaryRgb = "168,85,247"; // Default purple
      if (color.toLowerCase() === "#a855f7") {
        secondaryRgb = "34,211,238"; // Complementary cyan
      } else if (color.toLowerCase() === "#6366f1") {
        secondaryRgb = "34,211,238"; // Complementary cyan
      }

      // 1. Create linear gradient for lines
      const lineGrad = ctx.createLinearGradient(0, 0, 0, H);
      const pulse = (Math.sin(t)+1)/2;
      const alpha = isMobile ? (.04 + pulse*.05) : (.06 + pulse*.10);
      lineGrad.addColorStop(0, `rgba(${themeRgb},${alpha.toFixed(3)})`);
      lineGrad.addColorStop(1, `rgba(${secondaryRgb},${alpha.toFixed(3)})`);

      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = .85;

      // Helper to get drifted position
      const getPos = (node: Node) => {
        const driftAmount = isMobile ? 4 : 8;
        return {
          x: node.x + Math.sin(t + node.phase) * driftAmount,
          y: node.y + Math.cos(t * 0.8 + node.phase) * driftAmount
        };
      };

      // 2. Draw connections (straight routing)
      nodes.forEach(n => {
        const p1 = getPos(n);
        n.connections.forEach(j => {
          const p2 = getPos(nodes[j]);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          const midX = p1.x + (p2.x - p1.x) * 0.5;
          ctx.lineTo(midX, p1.y); 
          ctx.lineTo(midX, p2.y); 
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });
      });

      // 3. Create linear gradient for dots (brighter fill)
      const dotGrad = ctx.createLinearGradient(0, 0, 0, H);
      dotGrad.addColorStop(0, `rgba(${themeRgb},0.45)`);
      dotGrad.addColorStop(1, `rgba(${secondaryRgb},0.45)`);
      ctx.fillStyle = dotGrad;

      // 4. Draw dots
      nodes.forEach(n => {
        const p1 = getPos(n);
        const dotPulse = (Math.sin(t*1.3+n.phase)+1)/2;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, (isMobile ? .8 : 1) + dotPulse*(isMobile ? .8 : 1.5), 0, Math.PI*2);
        ctx.fill();
      });
    };
    raf.current = requestAnimationFrame(draw);

    const onResize = () => {
      W=window.innerWidth; H=window.innerHeight;
      canvas.width=W; canvas.height=H; nodes=build();
    };
    window.addEventListener("resize", onResize, { passive:true });
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", onResize); };
  }, [color]);

  return (
    <canvas 
      ref={ref} 
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`} 
      aria-hidden="true" 
    />
  );
}
