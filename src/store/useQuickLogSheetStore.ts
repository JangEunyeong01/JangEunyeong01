import { create } from 'zustand';

interface QuickLogSheetState {
  open: boolean;
  show: () => void;
  hide: () => void;
}

export const useQuickLogSheetStore = create<QuickLogSheetState>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));
