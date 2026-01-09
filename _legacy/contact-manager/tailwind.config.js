/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#2463eb",
                "background-light": "#f6f6f8",
                "background-dark": "#111621",
                "surface-light": "#ffffff",
                "surface-dark": "#1e293b",
                "border-light": "#e2e8f0",
                "border-dark": "#334155",
            },
        },
    },
    plugins: [],
}
