import { create } from 'zustand';

export interface TargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 각 단계가 가리키는 홈 화면 요소. HomeScreen에서 measureInWindow로 좌표를 등록한다. */
export type TutorialTargetId = 'kcal' | 'water' | 'grid';

export const TUTORIAL_STEPS: { target: TutorialTargetId; title: string; body: string }[] = [
  {
    target: 'kcal',
    title: '칼로리는 숫자보다 표정으로',
    body: '피또 얼굴이 5단계로 오늘 상태를 알려줘요. 숫자는 그 다음에 보면 돼요.',
  },
  {
    target: 'water',
    title: '물은 한 번의 탭으로',
    body: '+250ml만 눌러주세요. 목표에 가까워지면 피또가 촉촉해져요.',
  },
  {
    target: 'grid',
    title: '카드는 원하는 순서로',
    body: '길게 눌러 카드를 옮기면 나에게 맞는 홈 화면이 돼요.',
  },
];

interface TutorialState {
  open: boolean;
  step: number;
  targets: Partial<Record<TutorialTargetId, TargetRect>>;
  start: () => void;
  next: () => void;
  close: () => void;
  setTarget: (id: TutorialTargetId, rect: TargetRect) => void;
}

export const useTutorialStore = create<TutorialState>((set, get) => ({
  open: false,
  step: 0,
  targets: {},
  start: () => set({ open: true, step: 0 }),
  next: () => {
    const { step } = get();
    if (step >= TUTORIAL_STEPS.length - 1) set({ open: false, step: 0 });
    else set({ step: step + 1 });
  },
  close: () => set({ open: false, step: 0 }),
  setTarget: (id, rect) => set((s) => ({ targets: { ...s.targets, [id]: rect } })),
}));
