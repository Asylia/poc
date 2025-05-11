/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}', './node_modules/preline/preline.js',],
    plugins: [require('@tailwindcss/forms'), require('preline/plugin'), // require("@tailwindcss/typography"),
    ],
    darkMode: 'class',
    theme: {
    },
    safelist: []
}