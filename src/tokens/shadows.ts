/** Codestra design tokens — elevation shadows. */
export const shadows = {
  card: '0 1px 3px rgba(15,23,42,.08)',
  floating: '0 8px 24px rgba(15,23,42,.12)',
} as const

export const borders = {
  standard: '1px solid #E5EAF1',
  dark: '1px solid #1E3654',
} as const

export type ShadowTokens = typeof shadows
export type BorderTokens = typeof borders
