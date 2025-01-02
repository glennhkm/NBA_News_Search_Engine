import type { Config } from "tailwindcss"


export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1.4s infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
