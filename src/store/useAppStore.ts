import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Persona = 'friendly' | 'strict' | 'neutral';

export type CardId = 'kcal' | 'water' | 'act' | 'steps' | 'ex' | 'week' | 'period';

export const DEFAULT_CARD_ORDER: CardId[] = ['kcal', 'water', 'act', 'steps', 'ex', 'week', 'period'];

export interface Profile {
  nickname: string;
  birthdayMonth: number | null;
  birthdayDay: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  targetWeight: number | null;
  activity: string | null;
  allergies: string[];
  conditions: string[];
  goalType: string | null;
}

export interface Goals {
  kcal: number;
  water: number;
  steps: number;
  cup: number;
}

export interface ExerciseEntry {
  id: string;
  name: string;
  minutes: number;
  kcal: number;
}

export interface MealItem {
  id: string;
  name: string;
  amount: string;
  kcal: number;
  allergy?: boolean;
}

export interface DailyRecord {
  water: number;
  meals: { 아침: MealItem[]; 점심: MealItem[]; 저녁: MealItem[]; 간식: MealItem[] };
  exercises: ExerciseEntry[];
  steps: number;
  periodCondition?: 'good' | 'normal' | 'bad';
  periodSymptoms?: string[];
}

export interface Alarms {
  water: boolean;
  waterEvery: number;
  meal: boolean;
  mealTimes: string[];
  move: boolean;
  moveAfter: number;
  weigh: boolean;
  report: boolean;
  quiet: boolean;
  quietFrom: string;
  quietTo: string;
}

export interface Recipe {
  id: string;
  name: string;
  photoUri: string | null;
  ingredients: { name: string; grams: number; kcal: number }[];
  totalKcal: number;
}

export interface CustomIngredient {
  name: string;
  kcal100: number;
  carbs100: number;
  protein100: number;
  fat100: number;
  allergy?: boolean;
}

interface AppState {
  theme: ThemeMode;
  persona: Persona;
  profile: Profile;
  goals: Goals;
  periodOn: boolean;
  cardOrder: CardId[];
  cardHidden: CardId[];
  alarms: Alarms;
  recipes: Recipe[];
  customIngredients: CustomIngredient[];
  dailyRecords: Record<string, DailyRecord>;
  onboardingDone: boolean;
  tutorialDone: boolean;
  birthdayShownYear: number | null;
  timeSlotOverride: string | null;
  mockSeeded: boolean;

  setTheme: (t: ThemeMode) => void;
  setPersona: (p: Persona) => void;
  setProfile: (patch: Partial<Profile>) => void;
  setGoals: (patch: Partial<Goals>) => void;
  setPeriodOn: (v: boolean) => void;
  setCardOrder: (order: CardId[]) => void;
  setCardHidden: (hidden: CardId[]) => void;
  resetCardOrder: () => void;
  completeOnboarding: () => void;
  setTutorialDone: (v: boolean) => void;
  setBirthdayShownYear: (y: number) => void;
  addWater: (dateKey: string, deltaMl: number) => void;
  addExercise: (dateKey: string, entry: ExerciseEntry) => void;
  removeExercise: (dateKey: string, id: string) => void;
  addMealItem: (dateKey: string, slot: keyof DailyRecord['meals'], item: MealItem) => void;
  getRecord: (dateKey: string) => DailyRecord;
  seedMockToday: (dateKey: string) => void;
}

function emptyRecord(): DailyRecord {
  return {
    water: 0,
    meals: { 아침: [], 점심: [], 저녁: [], 간식: [] },
    exercises: [],
    steps: 0,
  };
}

const defaultProfile: Profile = {
  nickname: '피또 친구',
  birthdayMonth: null,
  birthdayDay: null,
  gender: null,
  height: null,
  weight: null,
  targetWeight: null,
  activity: null,
  allergies: [],
  conditions: [],
  goalType: null,
};

const defaultGoals: Goals = { kcal: 1850, water: 1900, steps: 8000, cup: 250 };

const defaultAlarms: Alarms = {
  water: true,
  waterEvery: 2,
  meal: true,
  mealTimes: ['08:00', '12:30', '19:00'],
  move: true,
  moveAfter: 60,
  weigh: false,
  report: true,
  quiet: true,
  quietFrom: '22:30',
  quietTo: '07:00',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      persona: 'neutral',
      profile: defaultProfile,
      goals: defaultGoals,
      periodOn: true,
      cardOrder: DEFAULT_CARD_ORDER,
      cardHidden: [],
      alarms: defaultAlarms,
      recipes: [],
      customIngredients: [],
      dailyRecords: {},
      onboardingDone: false,
      tutorialDone: false,
      birthdayShownYear: null,
      timeSlotOverride: null,
      mockSeeded: false,

      setTheme: (t) => set({ theme: t }),
      setPersona: (p) => set({ persona: p }),
      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      setGoals: (patch) => set((s) => ({ goals: { ...s.goals, ...patch } })),
      setPeriodOn: (v) => set({ periodOn: v }),
      setCardOrder: (order) => set({ cardOrder: order }),
      setCardHidden: (hidden) => set({ cardHidden: hidden }),
      resetCardOrder: () => set({ cardOrder: DEFAULT_CARD_ORDER, cardHidden: [] }),
      completeOnboarding: () => set({ onboardingDone: true }),
      setTutorialDone: (v) => set({ tutorialDone: v }),
      setBirthdayShownYear: (y) => set({ birthdayShownYear: y }),

      getRecord: (dateKey) => get().dailyRecords[dateKey] ?? emptyRecord(),

      addWater: (dateKey, deltaMl) =>
        set((s) => {
          const rec = s.dailyRecords[dateKey] ?? emptyRecord();
          const nextWater = Math.max(0, rec.water + deltaMl);
          return { dailyRecords: { ...s.dailyRecords, [dateKey]: { ...rec, water: nextWater } } };
        }),

      addExercise: (dateKey, entry) =>
        set((s) => {
          const rec = s.dailyRecords[dateKey] ?? emptyRecord();
          return {
            dailyRecords: {
              ...s.dailyRecords,
              [dateKey]: { ...rec, exercises: [...rec.exercises, entry] },
            },
          };
        }),

      removeExercise: (dateKey, id) =>
        set((s) => {
          const rec = s.dailyRecords[dateKey] ?? emptyRecord();
          return {
            dailyRecords: {
              ...s.dailyRecords,
              [dateKey]: { ...rec, exercises: rec.exercises.filter((e) => e.id !== id) },
            },
          };
        }),

      addMealItem: (dateKey, slot, item) =>
        set((s) => {
          const rec = s.dailyRecords[dateKey] ?? emptyRecord();
          return {
            dailyRecords: {
              ...s.dailyRecords,
              [dateKey]: { ...rec, meals: { ...rec.meals, [slot]: [...rec.meals[slot], item] } },
            },
          };
        }),

      // 실제 데이터 소스(건강 API·음식 영양성분 API) 연동 전까지 홈 화면을 채우는
      // 1회성 예시 데이터. README 화면 명세의 예시 수치를 그대로 사용한다.
      seedMockToday: (dateKey) =>
        set((s) => {
          if (s.mockSeeded || s.dailyRecords[dateKey]) return {};
          const rec: DailyRecord = {
            water: 950,
            meals: {
              아침: [{ id: 'm1', name: '그릭요거트', amount: '150g', kcal: 130 }],
              점심: [{ id: 'm2', name: '현미밥 · 닭가슴살 구이', amount: '1인분', kcal: 475 }],
              저녁: [],
              간식: [{ id: 'm3', name: '아몬드 한 줌', amount: '25g', kcal: 145, allergy: true }],
            },
            exercises: [{ id: 'e1', name: '아침 걷기', minutes: 20, kcal: 130 }],
            steps: 6420,
            periodCondition: undefined,
            periodSymptoms: [],
          };
          return { dailyRecords: { ...s.dailyRecords, [dateKey]: rec }, mockSeeded: true };
        }),
    }),
    {
      name: 'fitto-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
