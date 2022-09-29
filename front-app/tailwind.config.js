const HEADER_HEIGHT = "3.5rem";

module.exports = {
  content: [
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderWidth: {
      DEFAULT: "1px",
      0: "0",
      2: "2px",
      3: "3px",
      4: "4px",
      6: "6px",
      8: "8px",
    },
    extend: {
      colors: {
        white: "#FFFFFF",
        pink: {
          DEFAULT: "#FF04A9",
          hover: "#C70B8A",
        },
        purple: "#A192DD",
        green: "#63C89B",
        gray: {
          light: "#A9ACBB",
          dark: "#242832",
        },
        black: "#21212C",
        red: "FF4E36"
      },
      gradientColorStops: {
        eerieblack: "#17191B",
        independance: "#505061",
      },
      spacing: {
        124: "31rem",
      },
      inset: {
        header: HEADER_HEIGHT,
        50: "12.5rem",
      },
      height: {
        header: HEADER_HEIGHT,
        dashboardViewport: `calc(100vh - ${HEADER_HEIGHT})`,
      },
      minHeight: {
        dashboardViewport: `calc(100vh - ${HEADER_HEIGHT})`,
      },
      gridTemplateColumns: {
        cards: "repeat(auto-fill, minmax(292px, 1fr))",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "bottom-table": "inset 0 -1px 0 #CADCE8",
        top: "0px -4px 8px rgba(36, 81, 149, 0.08)",
        left: "-4px 0px 8px rgba(36, 81, 149, 0.08)",
        right: "4px 0px 8px rgba(36, 81, 149, 0.08)",
      },
      width: {
        "modal-content": "336px",
        "centered-content": "650px",
      },
      fontSize: {
        xxs: ".5rem",
      },
      maxWidth: {
        xxs: "14rem",
        xxxs: "8rem",
      },
    },
    fontFamily: {
      default: ["DM Sans"],
    },
    maxHeight: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
      modal: "calc(100vh - 5rem)",
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    require("@tailwindcss/line-clamp"),
  ],
};
