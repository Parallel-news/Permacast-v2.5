module.exports = {
  important: true,
  mode: 'jit',
  // darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      transitionDuration: {
        '3500': '3500ms',
        '5000': '5000ms',
      }
    },
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
