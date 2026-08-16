import type { TimeSlot } from '../theme/tokens';

// 시간대 경계는 README에 정확한 수치가 없어 자연스러운 기본값으로 정했다.
// dawn 4-6 · morning 6-11 · day 11-14 · after 14-17 · evening 17-20 · night 20-4
export function getTimeSlot(date: Date = new Date()): TimeSlot {
  const h = date.getHours();
  if (h >= 4 && h < 6) return 'dawn';
  if (h >= 6 && h < 11) return 'morning';
  if (h >= 11 && h < 14) return 'day';
  if (h >= 14 && h < 17) return 'after';
  if (h >= 17 && h < 20) return 'evening';
  return 'night';
}

export function dateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
