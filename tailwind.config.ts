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
        haq: {
          green: "#01411C",
          emerald: "#046A38",
          gold: "#D4AF37",
          light: "#F4F9F5",
        },
      },
    },
  },
  plugins: [],
};
export default config;
