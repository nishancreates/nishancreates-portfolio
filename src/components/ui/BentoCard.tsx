"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { clsx } from "clsx";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  span?: "1" | "2" | "3";
  rowSpan?: "1" | "2";
  glowOnHover?: boolean;
  delay?: number;
}

export default function BentoCard({
  children,
  className = "",
  glowOnHover = true,
  delay = 0,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={glowOnHover ? { scale: 1.01 } : undefined}
      className={clsx(
        "relative overflow-hidden rounded-card p-6",
        "bg-bg-card border border-border",
        "transition-all duration-300",
        glowOnHover && "hover:border-accent-cyan/30 hover:shadow-card-hover",
        className
      )}
    >
      {/* Shine overlay */}
      <div className="absolute inset-0 bg-card-shine pointer-events-none" />
      {children}
    </motion.div>
  );
}
