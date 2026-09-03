import { create } from 'zustand';

interface CardOrderSheetState {
  open: boolean;
  show: () => void;
  hide: () => void;
}

// 홈 카드 롱프레스뿐 아니라 설정 → 홈 카드 순서에서도 열 수 있어야 해서 전역으로 둔다.
export const useCardOrderSheetStore = create<CardOrderSheetState>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));
