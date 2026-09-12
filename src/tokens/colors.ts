/**
 * Codestra design tokens — colors.
 * Source: platform visual/layout design specification (Core color system).
 * Do not approximate or invent values here — extend only from a spec update.
 */
export const colors = {
  brand: {
    primary: '#0F5EEA',
    primaryDark: '#174EA6',
    interactive: '#3B82F6',
    surface: '#EAF2FF',
    border: '#CFE0FF',
  },
  nav: {
    background: '#071426',
    sidebar: '#0B1D33',
    selected: '#102744',
    hover: '#183A63',
  },
  surface: {
    card: '#FFFFFF',
    page: '#F7F9FC',
    muted: '#F2F5F9',
    border: '#E5EAF1',
    borderStrong: '#D6DEE8',
  },
  text: {
    primary: '#0F172A',
    secondary: '#334155',
    muted: '#64748B',
    disabled: '#94A3B8',
    onDark: '#FFFFFF',
  },
  status: {
    success: '#16A34A',
    successBg: '#DCFCE7',
    warning: '#F59E0B',
    warningBg: '#FEF3C7',
    error: '#DC2626',
    errorBg: '#FEE2E2',
    ai: '#7C3AED',
    aiBg: '#F3E8FF',
  },
  call: {
    ready: '#16A34A',
    ringing: '#F59E0B',
    active: '#2563EB',
    hold: '#7C3AED',
    end: '#DC2626',
    offline: '#64748B',
  },
} as const

export type ColorTokens = typeof colors
