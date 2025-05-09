import {
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
  theme as baseTheme,
  withDefaultProps,
} from "@chakra-ui/react";
import { CardConfig, InputConfig } from "./card";
const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: "light",
};

const sizes = {
  sizes: {
    ...baseTheme.space,
    max: "max-content",
    min: "min-content",
    full: "100%",
    "3xs": "14rem",
    "2xs": "16rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
    "8xl": "90rem",
    container: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1536px",
      "4xl": "1920px",
    },
  },
};
export const chakraTheme = extendTheme(
  config,
  {
    components: {
      Card: CardConfig,
      Input: InputConfig,
    },
    colors: {
      charcoalBlack: "#121212",
      customBlue: "#0070f3",
      brand: {
        50: "#CECEDE", // Light blue-tinted gray (much darker than previous 50)
        100: "#ACACC6", // Light-medium blue-tinted gray
        200: "#8989AB", // Medium blue-tinted gray
        300: "#686891", // Medium-dark blue-tinted gray
        400: "#4B4B6A", // Dark blue-tinted gray
        500: "#18181C", // Original color (hsl(240, 5.9%, 10%))
        600: "#141418", // Darker than original
        700: "#111114", // Very dark blue-tinted gray
        800: "#0C0C0F", // Nearly black with blue tint
        900: "#05050A", // Almost black
      },
      brandPurple: {
        50: "#F1E9FE", // Very light purple
        100: "#E3D3FD", // Light purple
        200: "#CEB0FC", // Light-medium purple
        300: "#B288FB", // Medium purple
        400: "#955EFB", // Medium-bright purple
        500: "#7734FB", // Original vibrant purple (#7734FB)
        600: "#621BFA", // Slightly darker purple
        700: "#5011D3", // Dark purple
        800: "#3E0CA6", // Very dark purple
        900: "#2C077A", // Extremely dark purple
      },
      brandBlue: {
        50: "#EEF2FF", // Very light blue
        100: "#DCE4FF", // Light blue
        200: "#BDC9FF", // Light-medium blue
        300: "#9AAFFF", // Medium blue
        400: "#7690FF", // Medium-bright blue
        500: "#5271FF", // Original bright blue (#5271FF)
        600: "#395CFF", // Slightly darker blue
        700: "#2044FF", // Dark blue
        800: "#0A30EA", // Very dark blue
        900: "#0825B8", // Extremely dark blue
      },
    },
    sizes,
    styles: {
      global: {
        ":root": {
          "--dash-sidebar-mini-w": "60px",
          "--dash-sidebar-w": "230px",
          "--dash-header-h": "65px",
          "--custom-accent-color": "#0070f3",
          "--link-color": "var(--chakra-colors-brandBlue-500)",
          "--card-raised-soft":
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          "--card-raised": "var(--card-raised-soft)",
        },
      },
    },
    fonts: {
      heading: "var(--font-heading)",
      body: "var(--font-body)",
    },
  },
  withDefaultProps({
    defaultProps: {
      rounded: "xl",
      fontWeight: 500,
    },
    components: ["Input", "NumberInput", "PinInput", "Button"],
  }),

  withDefaultProps({
    defaultProps: {
      rounded: "full",
    },
    components: ["IconButton"],
  }),
  withDefaultColorScheme({ colorScheme: "brand" })
);
