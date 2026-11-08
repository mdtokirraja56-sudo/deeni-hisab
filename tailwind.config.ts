import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: { deen: "#0f5132", cream: "#faf8f1" },
      fontFamily: {
        urdu: ["var(--font-urdu-stack)"],
        hindi: ["var(--font-hindi-stack)"]
      }
    }
  },
  plugins: []
};
export default config;
