/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,js}'],
  theme: {
    extend: {
      colors: {
        urgency: {
          critical: '#dc2626',   // red-600
          attention: '#d97706',  // amber-600
          normal: '#16a34a',     // green-600
        },
        us: {
          primary: '#2563eb',    // blue-600
        },
      },
    },
  },
  plugins: [],
};
