// README "1. 온보딩 — 목표 계산식"을 그대로 옮긴 것. 수치를 임의로 바꾸지 않는다.

export const ACTIVITY_FACTORS: Record<string, number> = {
  '거의 안 움직여요': 1.2,
  '가볍게 움직여요': 1.375,
  '보통이에요': 1.55,
  '많이 움직여요': 1.725,
  '매우 활동적이에요': 1.9,
};

export const GOAL_ADJUSTMENTS: Record<string, number> = {
  '체중 감량': -350,
  '체중 증가': 350,
  '체중 유지': 0,
  '건강 관리': 0,
  '근력 강화': 200,
  '체력 증진': 100,
};

// 값이 비었을 때 기본값 (README 명시)
const DEFAULT_AGE = 28;
const DEFAULT_HEIGHT = 165;
const DEFAULT_WEIGHT = 58;
const DEFAULT_ACTIVITY_FACTOR = 1.375;

export interface GoalInput {
  gender: string;
  age: string | number;
  height: string | number;
  weight: string | number;
  activity: string;
  goal: string;
}

export interface GoalResult {
  bmr: number;
  tdee: number;
  kcal: number;
  water: number;
  weight: number;
}

function num(value: string | number, fallback: number): number {
  const n = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function calculateGoals(input: GoalInput): GoalResult {
  const age = num(input.age, DEFAULT_AGE);
  const height = num(input.height, DEFAULT_HEIGHT);
  const weight = num(input.weight, DEFAULT_WEIGHT);

  // Mifflin-St Jeor. 남성만 +5, 그 외(여성·선택 안 함)는 -161.
  const bmr = Math.round(
    10 * weight + 6.25 * height - 5 * age + (input.gender === '남성' ? 5 : -161)
  );

  const factor = ACTIVITY_FACTORS[input.activity] ?? DEFAULT_ACTIVITY_FACTOR;
  const tdee = Math.round(bmr * factor);

  const adjust = GOAL_ADJUSTMENTS[input.goal] ?? 0;
  const kcal = Math.max(1200, tdee + adjust);

  const water = Math.round((weight * 33) / 50) * 50;

  return { bmr, tdee, kcal, water, weight };
}
