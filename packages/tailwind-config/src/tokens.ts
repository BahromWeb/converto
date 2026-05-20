/**
 * Converto brand tokens.
 *
 * Surface these as CSS variables in the shared globals.css, then reference
 * them via Tailwind's HSL-channel pattern (e.g. `bg-background`).
 *
 * The palette mirrors the warm-cream + signal-orange identity from the
 * reference design: paper-like background, near-black ink, vivid orange accent.
 */
export const brand = {
  // Signal orange — primary CTA, accents, highlight color
  orange: {
    50: "#FFF1EA",
    100: "#FFDDCC",
    200: "#FFB89A",
    300: "#FF8E63",
    400: "#F26A3C",
    500: "#E35323", // primary
    600: "#C84411",
    700: "#A2370D",
    800: "#7A2A0A",
    900: "#4D1A05",
  },
  // Cream / paper — page background gradient
  cream: {
    50: "#FAF6EE",
    100: "#F4EFE3",
    200: "#EBE3D0",
    300: "#DED3B8",
    400: "#C9BB99",
    500: "#B0A079",
  },
  // Ink — near-black for type and dark sections
  ink: {
    50: "#F5F4F2",
    100: "#E5E3DE",
    200: "#C9C5BC",
    300: "#9D978A",
    400: "#6E695F",
    500: "#4A463E",
    600: "#2E2B26",
    700: "#1B1A16",
    800: "#0F0E0C",
    900: "#07060A",
  },
} as const;
