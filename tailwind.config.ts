import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#050816",
        graphite: "#0B1023",
        panel: "#10182B",
        chrome: "#A7B0C0",
        muted: "#6B7280",
        emeraldx: "#00F5D4",
        signal: "#4CC9F0",
        violetx: "#7C3AED",
        successx: "#00E676",
        warningx: "#FFB703",
        dangerx: "#FF4D6D"
      },
      boxShadow: {
        glow: "0 22px 70px rgba(0, 0, 0, 0.34), 0 0 36px rgba(0, 245, 212, 0.07)",
        "signal-inset": "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 28px rgba(76,201,240,0.025)"
      },
      backgroundImage: {
        "bio-grid":
          "linear-gradient(rgba(76,201,240,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(76,201,240,0.055) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
