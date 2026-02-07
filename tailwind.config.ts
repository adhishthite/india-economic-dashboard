import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#fff8f0",
          100: "#ffedd5",
          200: "#fddcab",
          300: "#fcc277",
          400: "#fba446",
          500: "#ff9933",
          600: "#e07b1a",
          700: "#b85e12",
          800: "#944b14",
          900: "#7a3f14",
        },
        india: {
          green: "#138808",
          saffron: "#FF9933",
          navy: "#1e3a5f",
          white: "#FFFFFF",
        },
        slate: {
          925: "#0d1321",
          950: "#0b0f1a",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        glass: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "glass-lg": "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)",
        "glow-saffron": "0 0 20px rgba(255, 153, 51, 0.15)",
        "glow-green": "0 0 20px rgba(19, 136, 8, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
