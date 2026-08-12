import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0f19",
        card: "rgba(15, 23, 42, 0.65)",
        "card-border": "rgba(255, 255, 255, 0.08)",
        primary: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
          light: "#818cf8",
          glow: "rgba(99, 102, 241, 0.35)",
        },
        slate: {
          850: "#111827",
          900: "#0f172a",
          950: "#020617",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glow-gradient": "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 75%)",
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(99, 102, 241, 0.4)",
        "glow-lg": "0 0 50px -10px rgba(99, 102, 241, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
