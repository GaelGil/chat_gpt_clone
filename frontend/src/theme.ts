import { createTheme } from "@mantine/core";

export const theme = createTheme({
  /** Define your brand colors */
  colors: {
    brand: [
      "#ffffff", // shade 0
      "#9f9fa9", // shade 1
      "#414141", // shade 2
      "#181818", // shade 3
      "#000000", // shade 4
      "#0066ff", // shade 5
      "#0044cc", // shade 6
      "#003399", // shade 7
      "#001966", // shade 8
      "#000d33", // shade 9
    ],
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
