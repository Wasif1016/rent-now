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
        sans: ["var(--font-schibsted_grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-oranienbaum)", "ui-serif", "serif"],
        mono: ["var(--font-schibsted_grotesk)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

