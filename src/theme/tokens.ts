// Fitto 디자인 토큰 — design-source/design_handoff_fitto/README.md 값 그대로 이식.
// Pretendard Variable 폰트 파일이 준비되면 fonts.ts에서 로드해 fontFamily를 교체한다.
// 현재는 README의 폴백 규칙(각 플랫폼 한글 시스템 폰트)에 따라 시스템 기본 폰트를 사용한다.

import type { TextStyle } from 'react-native';

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

export const white = '#FFFFFF';

/** #RGB 또는 #RRGGBB에 투명도를 입혀 rgba() 문자열을 만든다. 파생 색은 원본 토큰에서 계산해 쓴다. */
export function alpha(color: string, a: number): string {
  let hex = color.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export const primaryGradient = [brand.blue, brand.blueDeep] as const;
export const primaryButtonShadow = alpha(brand.blue, 0.45);
export const primaryButtonShadowSmall = alpha(brand.blue, 0.4);

/** 로고 사각형·온보딩 진행 점에 쓰는 블루→민트 그라데이션. */
export const accentGradient = [brand.blue, brand.mint] as const;

/** 생리 주기 배지 그라데이션 (README: lavender .9 → peach .75). */
export const periodBadgeGradient = [alpha(brand.lavender, 0.9), alpha(brand.peach, 0.75)] as const;

/** 선택 상태 (README 온보딩 옵션 행). */
export const selection = {
  border: alpha(brand.blue, 0.9),
  bg: alpha(brand.blue, 0.16),
  shadow: alpha(brand.blue, 0.24),
} as const;

const SCRIM_BASE = '#101A24';

export const overlay = {
  /** 토스트 배경 (README: rgba(28,42,54,.9) + blur(10)). */
  toastBg: 'rgba(28,42,54,.9)',
  /** 튜토리얼 딤 (README 명시값). */
  tutorialDim: alpha(SCRIM_BASE, 0.62),
  /** 바텀시트 배경 딤. README에 값이 없어 튜토리얼 딤과 같은 색을 옅게 썼다. */
  sheetBackdrop: alpha(SCRIM_BASE, 0.5),
} as const;

/** 탭바 그림자 (README: 0 12px 30px rgba(44,62,80,.16)). */
export const tabBarShadowColor = alpha(lightColors.txt, 0.16);

/**
 * 생일 배너·모달.
 * README 토큰 표에는 없고 원본 프로토타입에만 있는 값이라 따로 모아둔다.
 * 옅은 복숭아색은 아침 시간대 색(#FFCBB6)과 같은 값을 쓴다.
 */
const BIRTHDAY_PEACH = '#FFCBB6';
const BIRTHDAY_MODAL_INK = '#14202A';

export const birthday = {
  bannerGradient: [alpha(brand.lavender, 0.35), alpha(BIRTHDAY_PEACH, 0.35)] as const,
  avatarGradient: [brand.lavender, BIRTHDAY_PEACH] as const,
  confirmGradient: [brand.lavender, brand.blue] as const,
  modalBackdrop: alpha(BIRTHDAY_MODAL_INK, 0.44),
  modalShadow: alpha(BIRTHDAY_MODAL_INK, 0.32),
  glowLavender: alpha(brand.lavender, 0.55),
  glowPeach: alpha(BIRTHDAY_PEACH, 0.6),
  /** 모달 캐릭터 부유 주기 (프로토타입: fbob 3.4s). */
  floatDuration: 3400,
} as const;

/**
 * 캐릭터 5단계 필터 근사용 오버레이 색.
 * RN Image에 CSS filter를 걸 수 없어 반투명 레이어로 대체한다.
 * 최종 5단계 일러스트가 준비되면 이미지 스왑으로 바뀌면서 함께 제거된다.
 */
export const characterOverlay = {
  desaturate: '#8FA3B1',
  vivid: brand.blue,
  brighten: white,
} as const;

/**
 * 애니메이션 (README 애니메이션 표).
 * easing은 Easing.bezier(...)에 그대로 펼쳐 넣는 cubic-bezier 제어점이다.
 */
const EASE_OUT_SHEET: readonly [number, number, number, number] = [0.2, 0.9, 0.3, 1];

export const motion = {
  /** 물 단계 변화 시 채도·크기 전환 (README: filter .4s, transform .4s). */
  characterState: 400,
  characterFloatReset: 300,
  /** fbob 부유 진폭. 단계별 주기는 utils/health.ts의 floatDurationMs. */
  floatOffsetY: -7,
  /** 게이지 채움 (README: .5s cubic-bezier(.2,.9,.3,1)). */
  gaugeFill: 500,
  gaugeEasing: EASE_OUT_SHEET,
  /** fin — 토스트·모달 등장 (.24–.3s). */
  fadeIn: 240,
  fadeOut: 200,
  /** fin의 시작 오프셋 (translateY 10px). */
  fadeInOffsetY: 10,
  /** fsheet — 바텀시트 (.28s). */
  sheet: 280,
  sheetEasing: EASE_OUT_SHEET,
  /** 탭 전환·스위치 (.22s). */
  tab: 220,
  /** fpulse — 튜토리얼 하이라이트 (2.2s). */
  pulse: 2200,
  /** fwave — 컵 수면 물결 (2.6s). */
  wave: 2600,
  /** 토스트 자동 소멸까지 유지 시간. */
  toastVisible: 1900,
} as const;

export type TimeSlot = 'dawn' | 'morning' | 'day' | 'after' | 'evening' | 'night';

/** name은 헤더 시간대 칩에, greeting은 히어로 행 인사말에 쓴다. */
export const timeSlots: Record<TimeSlot, { color: string; name: string; greeting: string }> = {
  dawn: { color: '#2C3E50', name: '새벽', greeting: '좋은 새벽' },
  morning: { color: '#FFCBB6', name: '아침', greeting: '좋은 아침' },
  day: { color: '#89C4E1', name: '낮', greeting: '좋은 오후' },
  after: { color: '#A8D8B9', name: '오후', greeting: '나른한 오후' },
  evening: { color: '#C4B5E8', name: '저녁', greeting: '편안한 저녁' },
  night: { color: '#6B5B95', name: '밤', greeting: '늦은 밤' },
};

/**
 * 숫자가 바뀔 때 자릿수가 흔들리지 않게 고정폭 숫자를 쓴다.
 * `as const`로 두면 readonly라 StyleSheet에 넣을 수 없어서 타입을 명시한다.
 */
export const tabularNums: TextStyle['fontVariant'] = ['tabular-nums'];

/**
 * 텍스트 역할표. 화면에서 fontSize를 직접 쓰지 말고 여기서 골라 쓴다.
 *
 * 예전에는 화면마다 숫자를 직접 박아서 11/11.5/12/12.5/13/13.5/14가 뒤섞였고,
 * 같은 역할인데 0.5px씩 달라 보이는 게 UI가 어긋나 보이는 주된 원인이었다.
 * README가 픽셀을 지정한 것(화면 제목·홈 카드·큰 수치)은 그 값을 그대로 지킨다.
 */
export const typography = {
  // 화면 제목 (README 지정)
  screenTitle: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.6 },
  subScreenTitle: { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.5 },
  onboardingTitle: { fontSize: 25, fontWeight: '700' as const, letterSpacing: -0.7, lineHeight: 25 * 1.32 },

  // 수치. 카드별 크기는 README가 정해두어 각 화면에서 fontSize만 덮어쓴다.
  bigNumber: { fontSize: 27, fontWeight: '700' as const, letterSpacing: -1.05, fontVariant: tabularNums },
  midNumber: { fontSize: 23, fontWeight: '700' as const, letterSpacing: -0.9, fontVariant: tabularNums },

  /** 홈 카드 제목 (README 12.5/700). */
  cardTitle: { fontSize: 12.5, fontWeight: '700' as const },
  /** README가 픽셀을 지정하지 않은 화면들의 카드·섹션 제목. */
  sectionTitle: { fontSize: 13, fontWeight: '700' as const },
  /** 목록 행의 이름. */
  rowLabel: { fontSize: 13, fontWeight: '600' as const },
  /** 입력 위 라벨, 칩 글씨 같은 작은 라벨. */
  label: { fontSize: 11.5, fontWeight: '600' as const },
  /** 표에서 강조되는 값. */
  value: { fontSize: 12.5, fontWeight: '700' as const },
  /** 단위·보조 수치. */
  unit: { fontSize: 12.5, fontWeight: '600' as const },

  /** 설명 문단. */
  body: { fontSize: 12.5, fontWeight: '500' as const, lineHeight: 12.5 * 1.55 },
  /** 좁은 자리의 설명. */
  bodySm: { fontSize: 11.5, fontWeight: '500' as const, lineHeight: 11.5 * 1.5 },
  /** 캡션·메타 정보. */
  caption: { fontSize: 11, fontWeight: '500' as const },
  /** 차트 축 라벨, 카드 하단 캡션처럼 더 작은 자리. */
  captionSm: { fontSize: 10.5, fontWeight: '500' as const },
  /** 범례·요일 머리글처럼 아주 좁은 자리. */
  micro: { fontSize: 9.5, fontWeight: '600' as const },
  /** 시트·모달 제목. */
  sheetTitle: { fontSize: 16, fontWeight: '700' as const },
  /** 강조되는 항목 이름(닉네임, 빈 상태 제목). */
  itemTitle: { fontSize: 14.5, fontWeight: '700' as const },
  /** V2 같은 작은 배지. */
  badge: { fontSize: 10, fontWeight: '700' as const },

  // 입력·버튼
  input: { fontSize: 13.5, fontWeight: '500' as const },
  buttonLabel: { fontSize: 15, fontWeight: '700' as const },
  buttonLabelSm: { fontSize: 13, fontWeight: '700' as const },

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
  /** 하단 플로팅 탭바 (README: radius 22px). */
  tabBar: 22,
  /** 탭바 안 선택 항목·FAB. */
  tabItem: 16,
  fab: 18,
  /** 온보딩 옵션 행. */
  optionRow: 18,
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
