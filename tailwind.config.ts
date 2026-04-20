import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101314",
        steel: "#54616a",
        mint: "#21a67a",
        aqua: "#13a9c7",
        coral: "#e85d5a",
        gold: "#d89d2b",
        paper: "#f7f9fb"
      },
      boxShadow: {
        premium: "0 20px 60px rgba(16, 19, 20, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
