const colors = require("tailwindcss/colors");

module.exports = {
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      colors: {
        ...colors,
        primary: "#3b82f6", // instead of oklch blue
        secondary: "#ef4444", // instead of oklch red
      },
    },
  },
  future: {
    // force fallback to rgb() instead of oklch()
    disableColorSpaces: true,
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
