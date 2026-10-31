import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand:    "#F1EEE7",
        brass:   { DEFAULT: "#B4502F", dark: "#8C3A1F", light: "#E07A55" },
        brick:   { DEFAULT: "#B4502F", dark: "#8C3A1F", light: "#E07A55" },
        charcoal:"#121212",
        ink:     "#121212",
        paper:   "#F1EEE7",
        bone:    "#F1EEE7",
        surface: "#F8F6F1",
        stone:   "#E3DED4",
        mute:    "#5F5B55",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "Arial Narrow", "sans-serif"],
        body:    ["var(--font-archivo)", "system-ui", "sans-serif"],
        mono:    ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        marquee:      "marquee 28s linear infinite",
        "fade-up":    "fadeUp 0.55s var(--ease-out-expo) forwards",
        shimmer:      "shimmer 2.5s linear infinite",
        spin_slow:    "spin 8s linear infinite",
        pulse_slow:   "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        marquee:  { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        fadeUp:   { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        shimmer:  { "0%": { backgroundPosition: "-200% center" }, "100%": { backgroundPosition: "200% center" } },
      },
      backgroundImage: {
        "brass-gradient": "linear-gradient(135deg, #B8892A 0%, #D4A84B 50%, #8A6318 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
