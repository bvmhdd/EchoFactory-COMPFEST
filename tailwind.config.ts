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
        background: "#000000",
        foreground: "#FFFFFF",
        surface: {
          DEFAULT: "#0A0A0B",
          card: "#111113",
          alt: "#18181B",
          hover: "#1F1F23",
          border: "#2A2A2E",
          subtle: "#1C1C1F",
        },
        muted: {
          DEFAULT: "#8B8B93",
          foreground: "#5C5C63",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-fade": "glowFade 2s ease-in-out infinite alternate",
        "waveform": "waveform 1.2s ease-in-out infinite alternate",
        "marquee-right": "marqueeRight 25s linear infinite",
      },
      keyframes: {
        glowFade: {
          "0%": { opacity: "0.4" },
          "100%": { opacity: "0.9" },
        },
        waveform: {
          "0%": { height: "15%" },
          "100%": { height: "95%" },
        },
        marqueeRight: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
