import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pertamina: {
          blue: "#0055B8",
          darkBlue: "#003B82",
          red: "#ED1C24",
          green: "#00A651",
        },
      },
    },
  },
  plugins: [],
};
export default config;