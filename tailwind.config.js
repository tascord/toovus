const colours = require('tailwindcss/colors');

module.exports = {
    mode: "jit",
    purge: ["./app/**/*.{ts,tsx}"],
    darkMode: "media",
    theme: {
        extend: {
            colors: {
                gray: {
                    ...colours.neutral,
                    900: '#121212'
                }
            }
        },
    },
    variants: {},
    plugins: [],
};