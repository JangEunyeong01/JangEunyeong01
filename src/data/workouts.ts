/**
 * 오늘의 퍼스널 트레이닝 추천 (README 7장). 지금은 룰 기반 고정 목록이고,
 * 나중에 활동량·목표·기록을 반영한 추천 로직으로 바꾼다.
 */
export interface WorkoutSuggestion {
  id: string;
  name: string;
  detail: string;
  minutes: number;
  kcal: number;
  reason: string;
}

export const WORKOUT_SUGGESTIONS: WorkoutSuggestion[] = [
  {
    id: 'w1',
    name: '빠르게 걷기',
    detail: '20분 · 130kcal',
    minutes: 20,
    kcal: 130,
    reason: '어제보다 걸음이 적어요. 가장 부담 없는 운동이에요.',
  },
  {
    id: 'w2',
    name: '의자 스쿼트',
    detail: '3세트 × 12회',
    minutes: 10,
    kcal: 60,
    reason: '하체 근력은 기초대사량을 올려줘요.',
  },
  {
    id: 'w3',
    name: '상체 스트레칭',
    detail: '8분',
    minutes: 8,
    kcal: 25,
    reason: '앉은 시간이 길어 어깨가 굳어 있어요.',
  },
];

/** 운동 기록 퀵칩 (홈 운동 카드와 동일한 3종). */
export const QUICK_WORKOUTS = ['걷기', '스트레칭', '홈트'] as const;
