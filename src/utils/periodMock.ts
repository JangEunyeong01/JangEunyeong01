/**
 * 물/걸음 상세 화면의 일간(시간대)·월간 차트를 채우는 예시 데이터 생성기.
 * 실제 헬스 API 연동 전까지 쓰는 자리표시자이며, 문자열 시드 기반이라
 * 같은 kind·기간에는 항상 같은 값을 낸다(리렌더마다 값이 바뀌지 않는다).
 */

export type PeriodKind = 'water' | 'steps';

function seededRatio(seed: string): number {
  // FNV-1a 해시. 'water-2026-8-w0'처럼 끝자리만 다른 시드가 많아서,
  // 단순 다항식 해시(h*31+code)는 마지막 문자 차이가 그대로 h 값 차이로 남아
  // w0~w3가 사실상 같은 값을 냈다. murmur3 계열 최종 믹싱을 한 번 더 거쳐 비트를 흩뜨린다.
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return ((h >>> 0) % 1000) / 1000; // 0..1
}

export const TIME_SLOT_LABELS = ['새벽', '아침', '낮', '오후', '저녁', '밤'];

// 시간대별 가중치(합 1). 물·걸음 모두 낮 시간대에 몰리는 패턴을 근사한다.
const TIME_SLOT_WEIGHTS: Record<PeriodKind, number[]> = {
  water: [0.03, 0.18, 0.27, 0.24, 0.2, 0.08],
  steps: [0.01, 0.15, 0.32, 0.28, 0.19, 0.05],
};

/** 오늘 총량을 시간대 6칸으로 나눈다. 마지막 칸에서 반올림 오차를 보정해 합이 total과 정확히 같다. */
export function splitByTimeSlot(kind: PeriodKind, total: number): number[] {
  const weights = TIME_SLOT_WEIGHTS[kind];
  const raw = weights.map((w) => Math.round(total * w));
  const diff = total - raw.reduce((a, b) => a + b, 0);
  raw[raw.length - 1] += diff;
  return raw.map((v) => Math.max(0, v));
}

const WEEKLY_BASE: Record<PeriodKind, number> = { water: 1900 * 7, steps: 8000 * 7 };
const MONTHLY_BASE: Record<PeriodKind, number> = { water: 1900 * 30, steps: 8000 * 30 };

export interface YearMonth {
  year: number;
  month: number; // 1-12
}

export function ymAdd(ym: YearMonth, delta: number): YearMonth {
  const total = ym.year * 12 + (ym.month - 1) + delta;
  return { year: Math.floor(total / 12), month: (((total % 12) + 12) % 12) + 1 };
}

export function ymIndex(ym: YearMonth): number {
  return ym.year * 12 + (ym.month - 1);
}

export function ymFromIndex(index: number): YearMonth {
  return { year: Math.floor(index / 12), month: (((index % 12) + 12) % 12) + 1 };
}

export function ymRange(start: YearMonth, end: YearMonth): YearMonth[] {
  const s = ymIndex(start);
  const e = ymIndex(end);
  const out: YearMonth[] = [];
  for (let i = s; i <= e; i++) out.push({ year: Math.floor(i / 12), month: (i % 12) + 1 });
  return out;
}

export function ymLabel(ym: YearMonth): string {
  return `${ym.year}년 ${ym.month}월`;
}

/** README 예시 형식: 단월 "2026년 8월", 복수월 "5월 – 8월 (4개월)". */
export function ymRangeLabel(start: YearMonth, end: YearMonth): string {
  const months = ymRange(start, end);
  if (months.length === 1) return ymLabel(start);
  const startLabel = start.year === end.year ? `${start.month}월` : `${start.year}년 ${start.month}월`;
  return `${startLabel} – ${end.month}월 (${months.length}개월)`;
}

/** 특정 월의 1~4주 합계 예시값. */
export function getMonthWeeklyMock(kind: PeriodKind, ym: YearMonth): number[] {
  const base = WEEKLY_BASE[kind];
  return [0, 1, 2, 3].map((w) => {
    const r = seededRatio(`${kind}-${ym.year}-${ym.month}-w${w}`);
    return Math.round(base * (0.75 + r * 0.5)); // base의 75%~125%
  });
}

/** 여러 달 구간의 월별 합계 예시값. */
export function getMonthlyRangeMock(kind: PeriodKind, months: YearMonth[]): number[] {
  const base = MONTHLY_BASE[kind];
  return months.map((ym) => {
    const r = seededRatio(`${kind}-${ym.year}-${ym.month}-m`);
    return Math.round(base * (0.75 + r * 0.5));
  });
}
