"use client";

import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";
import { ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  variant?: "primary" | "outline" | "ghost";
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  target,
  rel,
  variant = "outline",
  disabled = false,
}: MagneticButtonProps) {
  const { ref, motionProps, eventProps } = useMagnetic({ strength: 0.25, radius: 80 });

  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-btn font-mono text-sm font-bold transition-all duration-200 cursor-pointer select-none";

  const variantStyles = {
    primary:
      "bg-accent-cyan text-bg-primary hover:bg-accent-cyan-dim active:scale-95",
    outline:
      "border border-border-strong text-text-primary hover:border-accent-cyan hover:text-accent-cyan active:scale-95",
    ghost:
      "text-text-secondary hover:text-text-primary active:scale-95",
  };

  const combinedClass = `${baseStyles} ${variantStyles[variant]} ${
    disabled ? "opacity-40 cursor-not-allowed" : ""
  } ${className}`;

  const motionEl = (
    <motion.div
      // @ts-expect-error ref type mismatch
      ref={ref}
      {...motionProps}
      {...eventProps}
      className="inline-block"
    >
      {href ? (
        <a
          href={href}
          target={target}
          rel={rel}
          className={combinedClass}
        >
          {children}
        </a>
      ) : (
        <button
          onClick={onClick}
          disabled={disabled}
          className={combinedClass}
        >
          {children}
        </button>
      )}
    </motion.div>
  );

  return motionEl;
}
