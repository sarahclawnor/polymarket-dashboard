import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        surface: "#12121a",
        "surface-light": "#1a1a2e",
        accent: "#00ff88",
        danger: "#ff4444",
        warning: "#ffaa00",
        muted: "#6b7280",
        "text-primary": "#f0f0f0",
        "text-secondary": "#9ca3af",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
