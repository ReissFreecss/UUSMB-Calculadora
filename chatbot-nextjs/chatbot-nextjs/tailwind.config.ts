import type { Config } from "tailwindcss";

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
        'primary': '#003D78',
        'primary-hover': '#003160',
        'primary-dark': '#002E5A',
        'secondary': '#D49F0F',
        'secondary-hover': '#AA7F0C',
        'secondary-dark': '#9F770B'
      },
    },
  },
  plugins: [],
} satisfies Config;
