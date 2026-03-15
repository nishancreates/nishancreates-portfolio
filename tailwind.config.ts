import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#101014",
          card: "#1B1B1F",
          elevated: "#222228",
        },
        accent: {
          cyan: "#00E8FF",
          "cyan-dim": "#00B8CC",
          "cyan-glow": "rgba(0,232,255,0.15)",
        },
        border: {
          subtle: "rgba(255,255,255,0.06)",
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.14)",
        },
        text: {
          primary: "#F0F0F2",
          secondary: "#9090A0",
          muted: "#505060",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
        display: ["var(--font-syne)", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn: "10px",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "cyan-gradient":
          "linear-gradient(135deg, rgba(0,232,255,0.15) 0%, transparent 60%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      boxShadow: {
        card: "0 0 0 1px rgba(255,255,255,0.08)",
        "card-hover": "0 0 0 1px rgba(0,232,255,0.3), 0 8px 32px rgba(0,232,255,0.08)",
        glow: "0 0 24px rgba(0,232,255,0.3)",
        "glow-sm": "0 0 12px rgba(0,232,255,0.2)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        blink: "blink 1s step-end infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
