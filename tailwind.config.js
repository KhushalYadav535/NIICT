/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0066FF",
        ink: "#0F172A",
        body: "#475569",
        'body-strong': "#1E293B",
        muted: "#94A3B8",
        'muted-soft': "#CBD5E1",
        hairline: "#E2E8F0",
        'hairline-strong': "#CBD5E1",
        canvas: "#FFFFFF",
        'surface-soft': "#F8FAFC",
        'surface-card': "#F1F5F9",
        'surface-elevated': "#FFFFFF",
        'on-primary': "#FFFFFF",
        'on-dark': "#FFFFFF",
        'on-photo': "#FFFFFF",
        link: "#0066FF",
        warning: "#F59E0B",
        success: "#10B981",
        cyan: "#06B6D4",
      },
      fontFamily: {
        display: ['"Saira Condensed"', 'sans-serif'],
        body: ['"Cormorant Garamond"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      spacing: {
        section: "120px",
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        xxl: "64px",
      },
      letterSpacing: {
        'display-lg': '4px',
        'display-md': '3px',
        'display-sm': '2px',
        'wordmark': '6px',
        'button': '2.5px',
      }
    },
  },
  plugins: [],
}

