import {
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
  theme as baseTheme,
  withDefaultProps,
} from "@chakra-ui/react";
import { CardConfig, InputConfig } from "./card";
const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: "system",
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
    },
    sizes,
    styles: {
      global: {
        ":root": {
          "--dash-sidebar-mini-w": "60px",
          "--dash-sidebar-w": "230px",
          "--dash-header-h": "65px",
          "--custom-accent-color": "#0070f3",
          "--link-color": "var(--chakra-colors-brand-500)",
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
