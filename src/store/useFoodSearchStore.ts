import { create } from 'zustand';

interface FoodSearchState {
  open: boolean;
  /** 최근 검색어. 앱을 껐다 켜면 사라지는 세션 상태로 둔다. */
  recent: string[];
  show: () => void;
  hide: () => void;
  addRecent: (keyword: string) => void;
}

const MAX_RECENT = 6;

export const useFoodSearchStore = create<FoodSearchState>((set) => ({
  open: false,
  recent: [],
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
  addRecent: (keyword) =>
    set((s) => {
      const k = keyword.trim();
      if (!k) return {};
      return { recent: [k, ...s.recent.filter((r) => r !== k)].slice(0, MAX_RECENT) };
    }),
}));
