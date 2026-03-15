"use client";

import { useRef, useState } from "react";
import { useSpring } from "framer-motion";

interface MagneticOptions {
  strength?: number; // how far button moves (default 0.3)
  radius?: number;   // detection radius in px (default 80)
}

export function useMagnetic(options: MagneticOptions = {}) {
  const { strength = 0.3, radius = 80 } = options;
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX ** 2 + distY ** 2);

    if (distance < radius) {
      x.set(distX * strength);
      y.set(distY * strength);
    }
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  return {
    ref,
    motionProps: { style: { x, y } },
    eventProps: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onMouseEnter: handleMouseEnter,
    },
    isHovered,
  };
}
