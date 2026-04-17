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
        // Warm Cream - Main background
        cream: {
          50: "#FFFDFB",
          100: "#FDF9F3",
          200: "#FAF3E8",
          300: "#F5EBDA",
          400: "#EFE2CC",
          500: "#E8D8BD",
        },
        // Deep Navy - Primary brand color
        navy: {
          50: "#E8EBF0",
          100: "#C5CAD6",
          200: "#9FA8BC",
          300: "#7986A2",
          400: "#5C6C8F",
          500: "#3F527C",
          600: "#354669",
          700: "#2A3855",
          800: "#1E2A4A",
          900: "#111C36",
          950: "#0A1020",
        },
        // Gold - Accent color
        gold: {
          50: "#FBF6E9",
          100: "#F7EDD3",
          200: "#EEDBA7",
          300: "#E5C97B",
          400: "#DCB75F",
          500: "#D4A847",
          600: "#C4943A",
          700: "#A87B2E",
          800: "#8C6424",
          900: "#704F1C",
        },
        // Charcoal - Body text
        charcoal: {
          50: "#F5F5F5",
          100: "#E8E8E8",
          200: "#D1D1D1",
          300: "#B0B0B0",
          400: "#888888",
          500: "#6D6D6D",
          600: "#5A5A5A",
          700: "#4A4A4A",
          800: "#3A3A3A",
          900: "#2A2A2A",
          950: "#1A1A1A",
        },
        // Alias primary to navy for compatibility
        primary: {
          50: "#E8EBF0",
          100: "#C5CAD6",
          200: "#9FA8BC",
          300: "#7986A2",
          400: "#5C6C8F",
          500: "#3F527C",
          600: "#354669",
          700: "#2A3855",
          800: "#1E2A4A",
          900: "#111C36",
          950: "#0A1020",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Merriweather", "Georgia", "serif"],
      },
      backgroundColor: {
        DEFAULT: "#FDF9F3",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
