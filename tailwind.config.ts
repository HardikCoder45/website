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
        sand:    "#F5EFE0",
        brass:   { DEFAULT: "#B8892A", dark: "#8A6318", light: "#D4A84B" },
        charcoal:"#2C2416",
        surface: "#FAFAF7",
        mute:    "#6B6358",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body:    ["var(--font-inter)", "system-ui", "sans-serif"],
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
