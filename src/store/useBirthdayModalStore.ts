import { create } from 'zustand';

interface BirthdayModalState {
  open: boolean;
  show: () => void;
  hide: () => void;
}

// 생일 배너뿐 아니라 설정 → 생일 축하 메시지 미리보기에서도 열 수 있어야 해서 전역으로 둔다.
export const useBirthdayModalStore = create<BirthdayModalState>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));
