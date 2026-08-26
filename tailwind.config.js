/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-variant": "#d9e3f9",
        "on-tertiary-container": "#9aa0a4",
        "on-primary-fixed-variant": "#2d476f",
        "primary-fixed": "#d6e3ff",
        "primary-fixed-dim": "#adc7f7",
        "on-secondary-container": "#00723f",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f0f3ff",
        "surface-container": "#e7eeff",
        "surface-container-high": "#dee8ff",
        "surface-container-highest": "#d9e3f9",
        "surface-dim": "#d0daf0",
        "surface-bright": "#f9f9ff",
        "surface-tint": "#455f88",
        "on-secondary-fixed": "#00210f",
        "on-surface-variant": "#43474e",
        "tertiary-fixed-dim": "#c2c7cc",
        "tertiary-container": "#31373b",
        "secondary": "#006d3c",
        "on-secondary": "#ffffff",
        "on-primary-fixed": "#001b3c",
        "secondary-container": "#85f6ad",
        "inverse-surface": "#273141",
        "inverse-on-surface": "#ebf1ff",
        "inverse-primary": "#adc7f7",
        "tertiary-fixed": "#dee3e8",
        "surface": "#f9f9ff",
        "on-secondary-fixed-variant": "#00522c",
        "on-tertiary-fixed-variant": "#42474c",
        "on-background": "#121c2c",
        "primary": "#002045",
        "primary-container": "#1a365d",
        "on-primary": "#ffffff",
        "on-primary-container": "#86a0cd",
        "secondary-fixed": "#88f9b0",
        "secondary-fixed-dim": "#6bdc96",
        "outline": "#74777f",
        "outline-variant": "#c4c6cf",
        "tertiary": "#1c2225",
        "on-tertiary": "#ffffff",
        "on-tertiary-fixed": "#171c20",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "background": "#f9f9ff"
      },
      borderRadius: {
        "sm": "0.25rem",
        "DEFAULT": "0.5rem",
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        "gutter": "24px",
        "container-max": "1200px",
        "unit": "8px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(26, 54, 93, 0.05)',
        'lift': '0 8px 20px rgba(26, 54, 93, 0.1)',
        'drawer': '0 10px 25px rgba(26, 54, 93, 0.12)'
      }
    },
  },
  plugins: [],
}
