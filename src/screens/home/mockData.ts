// 실제 걸음/영양 데이터 소스 연동 전까지 주간 차트를 채우는 예시 데이터(오늘 이전 6일치).
// 오늘 값은 각 카드에서 store의 실제 기록으로 대체된다.
const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export function getWeekDayLabels(): string[] {
  const today = new Date();
  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    labels.push(WEEKDAY_LABELS[d.getDay()]);
  }
  return labels;
}

export const MOCK_STEPS_PAST6 = [8210, 6540, 9120, 7460, 8890, 5310];
export const MOCK_INTAKE_PAST6 = [1620, 1900, 1480, 2050, 1750, 1340];
export const MOCK_BURN_PAST6 = [520, 610, 480, 700, 550, 430];
export const MOCK_WATER_PAST6 = [1750, 1400, 2100, 1600, 1950, 1300];
