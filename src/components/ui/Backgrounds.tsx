"use client";

import { useEffect, useRef } from "react";

interface NightSkyProps {
  accentHue?: number;
}

export function NightSkyBackground({ accentHue = 200 }: NightSkyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Stars
    const stars: {
      x: number; y: number; r: number; alpha: number;
      twinkle: number; ts: number; col: string;
    }[] = [];

    const starColors = ["#ffffff", "#ffe8cc", "#cce0ff", "#ffeedd"];

    for (let i = 0; i < 800; i++) {
      const z = Math.random();
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: z < 0.05 ? 1.6 + Math.random() * 0.8 : 0.3 + Math.random() * 1.0,
        alpha: 0.25 + z * 0.7,
        twinkle: Math.random() * Math.PI * 2,
        ts: 0.01 + Math.random() * 0.025,
        col: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Constellations
    const CONSTELLATIONS = [
      { stars: [{ x: .52, y: .18 }, { x: .55, y: .23 }, { x: .50, y: .23 }, { x: .535, y: .29 }, { x: .515, y: .35 }, { x: .555, y: .35 }], lines: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5]] },
      { stars: [{ x: .12, y: .15 }, { x: .16, y: .13 }, { x: .20, y: .14 }, { x: .23, y: .18 }, { x: .20, y: .22 }, { x: .16, y: .24 }, { x: .13, y: .22 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]] },
      { stars: [{ x: .72, y: .10 }, { x: .76, y: .14 }, { x: .80, y: .11 }, { x: .84, y: .15 }, { x: .88, y: .12 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
      { stars: [{ x: .30, y: .25 }, { x: .34, y: .20 }, { x: .38, y: .22 }, { x: .40, y: .28 }, { x: .36, y: .32 }, { x: .32, y: .30 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]] },
    ];

    const constStars: { x: number; y: number; r: number; alpha: number; twinkle: number; ts: number; col: string; }[] = [];
    CONSTELLATIONS.forEach(c => {
      c.stars.forEach(s => {
        constStars.push({
          x: s.x * canvas.width, y: s.y * canvas.height,
          r: 2 + Math.random() * 0.6, alpha: 0.95,
          twinkle: Math.random() * Math.PI * 2, ts: 0.012,
          col: "#e0eaff",
        });
      });
    });

    // Shooters
    class Shooter {
      x: number; y: number; len: number; speed: number;
      a: number; alpha: number;
      constructor() {
        this.x = Math.random() * (canvas?.width ?? 800) * 0.8;
        this.y = Math.random() * (canvas?.height ?? 600) * 0.5;
        this.len = 60 + Math.random() * 100;
        this.speed = 9 + Math.random() * 5;
        this.a = Math.PI / 4 + Math.random() * 0.4;
        this.alpha = 1;
      }
      update() {
        this.x += Math.cos(this.a) * this.speed;
        this.y += Math.sin(this.a) * this.speed;
        this.alpha -= 0.025;
      }
      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const grd = ctx.createLinearGradient(
          this.x - Math.cos(this.a) * this.len,
          this.y - Math.sin(this.a) * this.len,
          this.x, this.y
        );
        grd.addColorStop(0, "rgba(255,255,255,0)");
        grd.addColorStop(1, "rgba(255,255,255,0.85)");
        ctx.beginPath();
        ctx.moveTo(this.x - Math.cos(this.a) * this.len, this.y - Math.sin(this.a) * this.len);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.shadowColor = "white";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }
      dead() { return this.alpha <= 0 || this.x > canvas.width + 50 || this.y > canvas.height + 50; }
    }

    let shooters: Shooter[] = [];

    function drawMilkyWay() {
      const W = canvas.width, H = canvas.height;
      const pts = [
        { x: 0.0, y: 0.65 }, { x: 0.12, y: 0.58 }, { x: 0.25, y: 0.48 },
        { x: 0.38, y: 0.38 }, { x: 0.52, y: 0.32 }, { x: 0.65, y: 0.36 },
        { x: 0.78, y: 0.44 }, { x: 0.90, y: 0.54 }, { x: 1.0, y: 0.62 },
      ];
      [{ w: 18, a: 0.055 }, { w: 35, a: 0.03 }, { w: 55, a: 0.015 }].forEach(({ w, a }) => {
        for (let i = 0; i < pts.length - 1; i++) {
          const x1 = pts[i].x * W, y1 = pts[i].y * H;
          const x2 = pts[i + 1].x * W, y2 = pts[i + 1].y * H;
          const grd = ctx!.createLinearGradient(x1, y1 - w, x1, y1 + w);
          grd.addColorStop(0, "rgba(160,140,220,0)");
          grd.addColorStop(0.5, `rgba(160,140,220,${a})`);
          grd.addColorStop(1, "rgba(160,140,220,0)");
          ctx!.beginPath();
          ctx!.moveTo(x1, y1); ctx!.lineTo(x2, y2);
          ctx!.strokeStyle = grd;
          ctx!.lineWidth = w * 2;
          ctx!.stroke();
        }
      });
      for (let i = 0; i < 500; i++) {
        const t = Math.random();
        const idx = Math.floor(t * (pts.length - 1));
        const n = Math.min(idx + 1, pts.length - 1);
        const f = t * (pts.length - 1) - idx;
        const cx = (pts[idx].x + (pts[n].x - pts[idx].x) * f) * W;
        const cy = (pts[idx].y + (pts[n].y - pts[idx].y) * f) * H;
        const spread = 8 + Math.abs(Math.sin(t * Math.PI)) * 22;
        ctx!.beginPath();
        ctx!.arc(cx + (Math.random() - 0.5) * spread * 2, cy + (Math.random() - 0.5) * spread, Math.random() * 1.1, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200,190,255,${Math.random() * 0.1})`;
        ctx!.fill();
      }
    }

    function drawConstellations() {
      const W = canvas.width, H = canvas.height;
      let base = 0;
      CONSTELLATIONS.forEach(c => {
        c.lines.forEach(([a, b]) => {
          const s1 = constStars[base + a], s2 = constStars[base + b];
          if (!s1 || !s2) return;
          ctx!.beginPath();
          ctx!.moveTo(s1.x * (W / canvas.width), s1.y * (H / canvas.height));
          ctx!.lineTo(s2.x * (W / canvas.width), s2.y * (H / canvas.height));
          ctx!.strokeStyle = "rgba(160,185,255,0.1)";
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        });
        base += c.stars.length;
      });
    }

    function drawMoon() {
      const W = canvas.width, H = canvas.height;
      const mx = W * 0.9, my = H * 0.06;
      const mg = ctx!.createRadialGradient(mx, my, 0, mx, my, 70);
      mg.addColorStop(0, `hsla(${accentHue},80%,80%,0.08)`);
      mg.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = mg; ctx!.fillRect(0, 0, W, H);
      ctx!.beginPath(); ctx!.arc(mx, my, 11, 0, Math.PI * 2);
      ctx!.fillStyle = "rgba(238,244,255,0.88)";
      ctx!.shadowColor = `hsla(${accentHue},80%,80%,0.6)`;
      ctx!.shadowBlur = 22;
      ctx!.fill(); ctx!.shadowBlur = 0;
    }

    function loop() {
      frame++;
      const W = canvas.width, H = canvas.height;
      ctx!.fillStyle = "#02020a";
      ctx!.fillRect(0, 0, W, H);
      drawMilkyWay();
      drawConstellations();

      // Stars
      [...stars, ...constStars].forEach(s => {
        s.twinkle += s.ts;
        const a = s.alpha * (0.75 + Math.sin(s.twinkle) * 0.25);
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = s.col;
        ctx!.globalAlpha = a;
        if (s.r > 1.4) { ctx!.shadowColor = s.col; ctx!.shadowBlur = 5; }
        ctx!.fill();
        ctx!.shadowBlur = 0;
      });
      ctx!.globalAlpha = 1;

      if (Math.random() < 0.007) shooters.push(new Shooter());
      shooters = shooters.filter(s => { s.update(); s.draw(); return !s.dead(); });
      drawMoon();
      animId = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [accentHue]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// Page-specific exports with different accent hues
export function HomeBackground() { return <NightSkyBackground accentHue={200} />; }
export function WorkBackground() { return <NightSkyBackground accentHue={260} />; }
export function AboutBackground() { return <NightSkyBackground accentHue={160} />; }
export function ContactBackground() { return <NightSkyBackground accentHue={180} />; }

// Keep old exports as aliases so nothing breaks
export const DotGridBackground = WorkBackground;
export const CyanParticlesBackground = AboutBackground;
export const MeshGradientBackground = ContactBackground;
