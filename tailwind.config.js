module.exports = {
  important: true,
  mode: 'jit',
  // darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/component/**/*.{js,ts,jsx,tsx}",
    "./src/component/**/*.{js,ts,jsx,tsx}",
    "./src/styles/templates/**/*.{js,ts,jsx,tsx}",
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      "business",
      {
        "permacast": {
          primary: "#FFFF00",
          secondary: "#18181b",
        }
      }
    ]
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    require("daisyui"),
  ],
};
