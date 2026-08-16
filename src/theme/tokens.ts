// Fitto 디자인 토큰 — design-source/design_handoff_fitto/README.md 값 그대로 이식.
// Pretendard Variable 폰트 파일이 준비되면 fonts.ts에서 로드해 fontFamily를 교체한다.
// 현재는 README의 폴백 규칙(각 플랫폼 한글 시스템 폰트)에 따라 시스템 기본 폰트를 사용한다.

export const lightColors = {
  bg: '#F4F8FA',
  card: 'rgba(255,255,255,.62)',
  card2: 'rgba(255,255,255,.42)',
  solid: '#FFFFFF',
  stroke: 'rgba(255,255,255,.75)',
  txt: '#2C3E50',
  sub: '#8FA3B1',
  line: 'rgba(44,62,80,.09)',
  ink: 'rgba(44,62,80,.06)',
  shadowColor: 'rgba(44,62,80,.10)',
} as const;

export const darkColors = {
  bg: '#0E151B',
  card: 'rgba(255,255,255,.075)',
  card2: 'rgba(255,255,255,.05)',
  solid: '#16202A',
  stroke: 'rgba(255,255,255,.14)',
  txt: '#E7F1F6',
  sub: '#8098A8',
  line: 'rgba(255,255,255,.10)',
  ink: 'rgba(255,255,255,.07)',
  shadowColor: 'rgba(0,0,0,.35)',
} as const;

export const brand = {
  blue: '#89C4E1',
  blueDeep: '#7FB6DC',
  mint: '#A8D8B9',
  lavender: '#C4B5E8',
  yellow: '#FFE082',
  peach: '#FFAB91',
  gray: '#B0BEC5',
} as const;

export const semantic = {
  good: '#5B9E78',
  warn: '#C79A2E',
  danger: '#C1674A',
} as const;

export const primaryGradient = [brand.blue, brand.blueDeep] as const;
export const primaryButtonShadow = 'rgba(137,196,225,.45)';
export const primaryButtonShadowSmall = 'rgba(137,196,225,.4)';

export type TimeSlot = 'dawn' | 'morning' | 'day' | 'after' | 'evening' | 'night';

export const timeSlots: Record<TimeSlot, { color: string; greeting: string }> = {
  dawn: { color: '#2C3E50', greeting: '좋은 새벽' },
  morning: { color: '#FFCBB6', greeting: '좋은 아침' },
  day: { color: '#89C4E1', greeting: '좋은 오후' },
  after: { color: '#A8D8B9', greeting: '나른한 오후' },
  evening: { color: '#C4B5E8', greeting: '편안한 저녁' },
  night: { color: '#6B5B95', greeting: '늦은 밤' },
};

export const typography = {
  screenTitle: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.6 },
  subScreenTitle: { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.5 },
  onboardingTitle: { fontSize: 25, fontWeight: '700' as const, letterSpacing: -0.7, lineHeight: 25 * 1.32 },
  bigNumber: { fontSize: 27, fontWeight: '700' as const, letterSpacing: -1.05, fontVariant: ['tabular-nums'] as const },
  midNumber: { fontSize: 23, fontWeight: '700' as const, letterSpacing: -0.9, fontVariant: ['tabular-nums'] as const },
  cardTitle: { fontSize: 12.5, fontWeight: '700' as const },
  cardLabel: { fontSize: 11.5, fontWeight: '600' as const },
  body: { fontSize: 13, fontWeight: '600' as const },
  caption: { fontSize: 11, fontWeight: '500' as const },
  sectionLabel: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.8, textTransform: 'uppercase' as const },
};

export const spacing = {
  screenX: 16,
  onboardingX: 24,
  bottomTabScreen: 108,
  bottomSubScreen: 40,
  cardGap: 12,
  cardGapCompact: 10,
  cardPadding: 16,
};

export const radius = {
  cardBig: 23,
  blockMid: 16,
  button: 14,
  chip: 12,
  sheetTop: 26,
};

export const gauge = {
  kcalBarHeight: 9,
  kcalBarRadius: 6,
  stepsBarHeight: 8,
  stepsBarRadius: 5,
  ratioBarHeight: 11,
  ratioBarRadius: 6,
};

export const minTouchTarget = 44;

export const glassShadow = {
  light: {
    shadowColor: lightColors.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 6,
  },
  dark: {
    shadowColor: darkColors.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 6,
  },
};

export interface ThemeColors {
  bg: string;
  card: string;
  card2: string;
  solid: string;
  stroke: string;
  txt: string;
  sub: string;
  line: string;
  ink: string;
  shadowColor: string;
}

export function resolveColors(mode: 'light' | 'dark'): ThemeColors {
  return mode === 'dark' ? darkColors : lightColors;
}
