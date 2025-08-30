import { createTheme } from "@mantine/core";
// --bg-primary: #212121;
//   --bg-primary-inverted: #fff;
//   --bg-secondary: #303030;
//   --bg-tertiary: #414141;
//   --bg-scrim: #0d0d0d80;
//   --bg-elevated-primary: #303030;
//   --bg-elevated-secondary: #181818;
//   --bg-status-warning: #4a2206;
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
  },

  shadows: {
    md: "1px 1px 3px rgba(0, 0, 0, .25)",
    xl: "5px 5px 3px rgba(0, 0, 0, .25)",
  },
  /** Set your primary color */
  primaryColor: "brand",

  components: {
    AppShell: {
      defaultProps: {
        padding: "md",
        styles: (theme) => ({
          main: {
            // You can use a fixed background here or refer to CSS variables
            backgroundColor: "#212121", // your default background
          },
        }),
      },
    },
  }, // default theme (can be 'dark')
});
