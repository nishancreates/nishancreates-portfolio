"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterHeroProps {
  lines: string[];
  speed?: number; // ms per character
  pause?: number; // ms between lines
}

export default function TypewriterHero({
  lines,
  speed = 50,
  pause = 2000,
}: TypewriterHeroProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = lines[lineIndex];

    if (!isDeleting && displayed === current) {
      // Pause at full word before deleting
      const timeout = setTimeout(() => setIsDeleting(true), pause);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayed === "") {
      // Move to next line
      setIsDeleting(false);
      setLineIndex((i) => (i + 1) % lines.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setDisplayed((prev) =>
          isDeleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
        );
      },
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, lineIndex, lines, speed, pause]);

  return (
    <span className="text-accent-cyan">
      {displayed}
      <span className="animate-blink">|</span>
    </span>
  );
}
