"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ── Animated Dot Grid (Work page) ──────────────────────────────
export function DotGridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#101014",
          backgroundImage: "radial-gradient(circle, rgba(0,232,255,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Fade edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101014] via-transparent to-[#101014]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#101014] via-transparent to-[#101014]" />
      {/* Moving glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,232,255,0.06) 0%, transparent 70%)" }}
        animate={{ x: ["0%", "60%", "20%", "0%"], y: ["0%", "40%", "80%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// ── Glowing Cyan Particles (About page) ────────────────────────
export function CyanParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#101014";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 232, 255, ${p.alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, `rgba(0, 232, 255, ${p.alpha * 0.3})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// ── Dark Mesh Gradient (Contact page) ──────────────────────────
export function MeshGradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: "#101014" }}>
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 0% 0%, rgba(0,232,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(0,100,180,0.08) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, rgba(0,232,255,0.04) 0%, transparent 40%)",
            "radial-gradient(ellipse at 50% 100%, rgba(0,232,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 0% 50%, rgba(0,100,180,0.08) 0%, transparent 50%), radial-gradient(ellipse at 100% 50%, rgba(0,232,255,0.04) 0%, transparent 40%)",
            "radial-gradient(ellipse at 100% 0%, rgba(0,232,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, rgba(0,100,180,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(0,232,255,0.04) 0%, transparent 40%)",
            "radial-gradient(ellipse at 0% 0%, rgba(0,232,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(0,100,180,0.08) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, rgba(0,232,255,0.04) 0%, transparent 40%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      {/* Mesh lines */}
      <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mesh" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(0,232,255,1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mesh)" />
      </svg>
    </div>
  );
}
