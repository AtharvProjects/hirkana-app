import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        warmBg: "#F7E3C6",
        warmAccent: "#F6A96A",
        panel: "rgba(255,255,255,0.24)"
      },
      borderRadius: {
        panel: "40px",
        card: "24px",
        pill: "20px"
      },
      boxShadow: {
        soft: "0 30px 90px rgba(98,44,11,0.22)"
      }
    }
  },
  plugins: []
} satisfies Config;
