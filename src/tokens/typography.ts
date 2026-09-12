/** Codestra design tokens — typography scale. Font size / line height, in px. */
export const typography = {
  fontFamily: '"Inter", "Manrope", "IBM Plex Sans", system-ui, sans-serif',
  scale: {
    display: { size: 32, lineHeight: 40 },
    pageTitle: { size: 24, lineHeight: 32 },
    sectionTitle: { size: 18, lineHeight: 26 },
    cardTitle: { size: 16, lineHeight: 24 },
    body: { size: 14, lineHeight: 22 },
    small: { size: 12, lineHeight: 18 },
    label: { size: 12, lineHeight: 16 },
    button: { size: 14, lineHeight: 20 },
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
  },
} as const

export type TypographyTokens = typeof typography
