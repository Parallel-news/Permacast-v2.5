module.exports = {
  important: true,
  mode: 'jit',
  // darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'bg-zinc-950': '#0c0c0e',
      },
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
    require("daisyui"),
  ],
};
