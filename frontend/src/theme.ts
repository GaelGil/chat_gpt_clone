// theme.ts
import { createTheme } from "@mantine/core";

export const theme = createTheme({
  /** Brand colors (10 shades required) */
  colors: {
    brand: [
      "#e6f0ff", // 0 - lightest
      "#cce0ff", // 1
      "#99c2ff", // 2
      "#66a3ff", // 3
      "#3385ff", // 4
      "#0066ff", // 5 - main brand
      "#0052cc", // 6
      "#003d99", // 7
      "#002966", // 8
      "#001433", // 9 - darkest
    ],
    secondary: [
      "#fff9e6",
      "#fff3cc",
      "#ffe799",
      "#ffdb66",
      "#ffcf33",
      "#ffc300", // main secondary
      "#cc9c00",
      "#997500",
      "#664e00",
      "#332700",
    ],
    success: [
      "#e6fff2",
      "#ccffe6",
      "#99ffcc",
      "#66ffb3",
      "#33ff99",
      "#00ff80", // main success
      "#00cc66",
      "#00994d",
      "#006633",
      "#00331a",
    ],
  },

  /** Which color palette to use as primary */
  primaryColor: "brand",

  /** Global font + radius defaults */
  fontFamily: "Inter, sans-serif",
  defaultRadius: "md",

  /** Global styles (better place for text/background than `colors`) */
  globalStyles: (theme) => ({
    body: {
      backgroundColor: theme.colors.gray[0],
      color: theme.black,
    },
  }),

  /** Component overrides */
  components: {
    Button: {
      styles: (theme, params) => ({
        root: {
          borderRadius: theme.radius.md,
          fontWeight: 600,
          ...(params.color === "brand" && {
            backgroundColor: theme.colors.brand[5],
            "&:hover": { backgroundColor: theme.colors.brand[6] },
          }),
        },
      }),
    },
  },
});
