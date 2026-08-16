import { create } from 'zustand';

interface ToastState {
  message: string | null;
  seq: number;
  show: (message: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  seq: 0,
  show: (message) => set((s) => ({ message, seq: s.seq + 1 })),
}));
