import { createTheme } from "@mantine/core";
import type { CSSVariablesResolver } from "@mantine/core";

export const theme = createTheme({
  /** Define your brand colors */
  colors: {
    brand: [
      "#ffffff", // shade 0
      "#212121", // shade 1
      "#303030", // shade 2
      "#414141", // shade 3
      "#0d0d0d80", // shade 4
      "#303030", // shade 5
      "#181818", // shade 6
      "#000000", // shade 7
      "#afafaf", // shade 8
      "#000d33", // shade 9
    ],
    pink: [
      "#ff007f", // 0 - brightest / primary pink
      "#ff3399", // 1
      "#ff66b2", // 2
      "#ff99cc", // 3
      "#ffb3d9", // 4
      "#ffccf0", // 5
      "#ffd9f4", // 6
      "#ffe6fa", // 7
      "#ffffff", // 8
      "#000000", // 9
    ],
    green: [
      "#98FBCB", // 0 - brightest / primary green
      "#BFFFED", // 1
      "#00ff00", // 2
      "#00ff00", // 3
      "#00ff00", // 4
      "#00ff00", // 5
      "#00ff00", // 6
      "#00ff00", // 7
      "#00ff00", // 8
      "#000000", // 9
    ],
    red: [
      "#ff0000", // 0 - brightest / primary red
      "#ff0000", // 1
      "#ff0000", // 2
      "#ff0000", // 3
      "#ff0000", // 4
      "#ff0000", // 5
      "#ff0000", // 6
      "#ff0000", // 7
      "#ff0000", // 8
      "#000000", // 9
    ],
    black: [
      "#0d0d0d", // 0 - almost black
      "#1a1a1a", // 1 - very dark gray
      "#2e2e2e", // 2 - dark gray
      "#464646", // 3 - medium-dark gray
      "#5c5c5c", // 4 - gray
      "#737373", // 5 - medium gray
      "#8c8c8c", // 6 - light gray
      "#a6a6a6", // 7 - lighter gray
      "#c2c2c2", // 8 - very light gray
      "#ffffff", // 9 - white
    ],
    navy: [
      "#000433", // 0 - brightest / primary black
      "#000000", // 1
      "#000000", // 2
      "#000000", // 3
      "#000000", // 4
      "#000000", // 5
      "#000000", // 6
      "#000000", // 7
      "#000000", // 8
      "#ffffff", // 9
    ],
  },

  shadows: {
    md: "1px 1px 3px rgba(0, 0, 0, .25)",
    xl: "5px 5px 3px rgba(0, 0, 0, .25)",
  },
  /** Set your primary color */
  primaryColor: "gray",

  components: {}, // default theme (can be 'dark')
});

export const cssResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    "--mantine-color-text-primary": theme.colors.brand[0],
    "--mantine-color-text-secondary": theme.colors.black[1],
    "--mantine-color-text-tertiary": theme.colors.black[8],
    "--mantine-color-text-quaternary": theme.colors.black[2],
    "--mantine-color-accent": theme.colors.red[1],
    "--mantine-color-background": theme.colors.brand[7],
    "--mantine-color-background-secondary": theme.colors.brand[1],
    "--mantine-color-background-tertiary": theme.colors.brand[6],
  },
  light: {},
  dark: {},
});
