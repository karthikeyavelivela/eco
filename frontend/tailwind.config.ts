import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
      },
      colors: {
        dark: {
          red: "#7A1C1C",
          green: "#1B4332",
          blue: "#1B263B",
          bg: "#0D0D0D",
          base: "#1A1A1A",
          card: "#2A2A2A",
        },
        neutral: {
          900: "#0D0D0D",
          800: "#1A1A1A",
          700: "#2A2A2A",
          100: "#E5E5E5",
        },
      },
      animation: {
        blob: "blob 7s infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "counter": "counter 2s ease-out forwards",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #0D0D0D 0%, #1B263B 50%, #0D0D0D 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
