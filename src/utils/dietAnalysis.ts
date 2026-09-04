/**
 * 식단 분석용 주간 매크로(탄/단/지) 데이터.
 * 지금 앱의 식단 기록에는 kcal만 있고 매크로 정보가 없어서, 실제 영양성분 API를 붙이기 전까지
 * 하루 섭취 kcal을 시드 기반으로 흔들어 탄/단/지 그램을 만들어 쓴다.
 */
import { seededRatio } from './periodMock';

/** README: 권장 비율 탄 50 / 단 25 / 지 25. */
export const RECOMMENDED = { carbs: 50, protein: 25, fat: 25 };

export interface DayMacros {
  label: string;
  kcal: number;
  carbs: number; // g
  protein: number; // g
  fat: number; // g
}

/**
 * labels는 "최근 7일(6일 전 → 오늘)"이라 인덱스가 요일이 아니다.
 * 주말인지는 요일 라벨로 판단해야 한다.
 */
function isWeekendLabel(label: string): boolean {
  return label === '토' || label === '일';
}

export function buildWeekMacros(labels: string[], kcalByDay: number[]): DayMacros[] {
  return labels.map((label, i) => {
    const kcal = kcalByDay[i] ?? 0;
    // 권장 비율 근처에서 ±10%p 정도 흔들고, 주말은 지방을 좀 더 얹는다.
    const isWeekend = isWeekendLabel(label);
    const fatPct = 25 + (seededRatio(`fat-${label}-${i}`) * 20 - 10) + (isWeekend ? 8 : 0);
    const proteinPct = 25 + (seededRatio(`pro-${label}-${i}`) * 12 - 6);
    const carbsPct = Math.max(0, 100 - fatPct - proteinPct);

    return {
      label,
      kcal,
      carbs: Math.round(((kcal * carbsPct) / 100 / 4) * 10) / 10,
      protein: Math.round(((kcal * proteinPct) / 100 / 4) * 10) / 10,
      fat: Math.round(((kcal * fatPct) / 100 / 9) * 10) / 10,
    };
  });
}

export interface WeekSummary {
  avgKcal: number;
  avgProtein: number;
  carbsPct: number;
  proteinPct: number;
  fatPct: number;
  /** 주말 이틀의 평균 지방 비율 — 코멘트 규칙에 쓴다. */
  weekendFatPct: number;
}

export function summarizeWeek(days: DayMacros[]): WeekSummary {
  const n = Math.max(1, days.length);
  const sum = days.reduce(
    (a, d) => {
      a.kcal += d.kcal;
      a.carbs += d.carbs;
      a.protein += d.protein;
      a.fat += d.fat;
      return a;
    },
    { kcal: 0, carbs: 0, protein: 0, fat: 0 }
  );

  const carbsKcal = sum.carbs * 4;
  const proteinKcal = sum.protein * 4;
  const fatKcal = sum.fat * 9;
  const macroKcal = carbsKcal + proteinKcal + fatKcal || 1;

  const weekendDays = days.filter((d) => isWeekendLabel(d.label));
  const weekendFat = weekendDays.reduce((a, d) => a + d.fat * 9, 0);
  const weekendTotal = weekendDays.reduce((a, d) => a + d.carbs * 4 + d.protein * 4 + d.fat * 9, 0) || 1;

  return {
    avgKcal: Math.round(sum.kcal / n),
    avgProtein: Math.round((sum.protein / n) * 10) / 10,
    carbsPct: Math.round((carbsKcal / macroKcal) * 100),
    proteinPct: Math.round((proteinKcal / macroKcal) * 100),
    fatPct: Math.round((fatKcal / macroKcal) * 100),
    weekendFatPct: Math.round((weekendFat / weekendTotal) * 100),
  };
}

/** README: 차이 ≤6%p면 좋음, 초과면 주의, 부족이면 blue. */
export type DiffStatus = 'good' | 'over' | 'under';

export function getDiffStatus(current: number, recommended: number): DiffStatus {
  const diff = current - recommended;
  if (Math.abs(diff) <= 6) return 'good';
  return diff > 0 ? 'over' : 'under';
}
