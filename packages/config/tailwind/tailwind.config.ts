import type { Config } from "tailwindcss";

const config: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#0C693A",
          "green-light": "#39B44B",
          amber: "#F49221",
          "green-50": "#F0F9F4",
          "green-100": "#D1EFE0",
          "green-200": "#A3DEC1",
          "green-900": "#084D2B",
          "amber-50": "#FEF6EC",
          "amber-100": "#FDEBD0",
          "amber-700": "#C47218",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["3rem", { lineHeight: "1.15", fontWeight: "700" }],
        h1: ["2rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        h4: ["0.9375rem", { lineHeight: "1.5", fontWeight: "600" }],
        body: ["0.9375rem", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["0.8125rem", { lineHeight: "1.5", fontWeight: "400" }],
        micro: ["0.6875rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)",
        "card-hover":
          "0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)",
        modal: "0 20px 60px -10px rgba(0,0,0,0.20)",
      },
      spacing: {
        sidebar: "240px",
        "sidebar-collapsed": "64px",
        header: "64px",
      },
    },
  },
};

export default config;
