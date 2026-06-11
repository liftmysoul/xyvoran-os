import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#050807",
        graphite: "#111716",
        chrome: "#c5d2cf",
        emeraldx: "#16f2a4",
        signal: "#7dfed0"
      },
      boxShadow: {
        glow: "0 0 40px rgba(22, 242, 164, 0.18)"
      },
      backgroundImage: {
        "bio-grid":
          "linear-gradient(rgba(125,254,208,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(125,254,208,0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
