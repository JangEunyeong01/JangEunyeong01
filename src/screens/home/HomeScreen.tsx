import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenBackground from '../../components/ScreenBackground';
import HomeHeader from './HomeHeader';
import HeroRow from './HeroRow';
import KcalCard from './cards/KcalCard';
import WaterCard from './cards/WaterCard';
import ActivityCard from './cards/ActivityCard';
import StepsCard from './cards/StepsCard';
import ExerciseCard from './cards/ExerciseCard';
import WeekCard from './cards/WeekCard';
import PeriodCard from './cards/PeriodCard';
import LayDownBanner from './LayDownBanner';
import CardOrderSheet from './CardOrderSheet';
import BirthdayBanner from './BirthdayBanner';
import { useAppStore, CardId } from '../../store/useAppStore';
import { useCardOrderSheetStore } from '../../store/useCardOrderSheetStore';
import { useBirthdayModalStore } from '../../store/useBirthdayModalStore';
import { useTutorialStore, type TutorialTargetId } from '../../store/useTutorialStore';
import TutorialOverlay from '../../components/TutorialOverlay';
import { dateKey, isBirthdayToday } from '../../utils/timeOfDay';

// B 히어로(확정 기본안): 물·걸음만 반폭 2열, 나머지는 전폭.
const HALF_WIDTH_CARDS = new Set<CardId>(['water', 'steps']);

const CARD_COMPONENTS: Record<CardId, React.ComponentType> = {
  kcal: KcalCard,
  water: WaterCard,
  act: ActivityCard,
  steps: StepsCard,
  ex: ExerciseCard,
  week: WeekCard,
  period: PeriodCard,
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const cardOrder = useAppStore((s) => s.cardOrder);
  const cardHidden = useAppStore((s) => s.cardHidden);
  const periodOn = useAppStore((s) => s.periodOn);
  const seedMockToday = useAppStore((s) => s.seedMockToday);
  const record = useAppStore((s) => s.dailyRecords[dateKey()]);
  const profile = useAppStore((s) => s.profile);
  const setBirthdayShownYear = useAppStore((s) => s.setBirthdayShownYear);
  const sheetVisible = useCardOrderSheetStore((s) => s.open);
  const showSheet = useCardOrderSheetStore((s) => s.show);
  const hideSheet = useCardOrderSheetStore((s) => s.hide);
  const showBirthday = useBirthdayModalStore((s) => s.show);
  const setTutorialTarget = useTutorialStore((s) => s.setTarget);
  const startTutorial = useTutorialStore((s) => s.start);
  const tutorialOpen = useTutorialStore((s) => s.open);
  const tutorialStep = useTutorialStore((s) => s.step);
  const tutorialDone = useAppStore((s) => s.tutorialDone);
  const setTutorialDone = useAppStore((s) => s.setTutorialDone);

  // 튜토리얼 하이라이트 프레임이 가리킬 실제 화면 좌표. onLayout의 좌표는 부모 기준이라
  // 스크롤 오프셋이 빠지므로 measureInWindow로 절대 좌표를 받는다.
  const kcalRef = useRef<View>(null);
  const waterRef = useRef<View>(null);
  const gridRef = useRef<View>(null);

  const measureTarget = (ref: React.RefObject<View | null>, id: TutorialTargetId) => {
    ref.current?.measureInWindow((x, y, width, height) => {
      // 웹에서는 레이아웃 직후 0이 잡히는 경우가 있어 유효한 값일 때만 등록한다.
      if (width > 0 && height > 0) setTutorialTarget(id, { x, y, width, height });
    });
  };

  // 튜토리얼이 열리는 시점의 스크롤 위치 기준으로 다시 재야 프레임이 카드에 정확히 붙는다.
  useEffect(() => {
    if (!tutorialOpen) return;
    measureTarget(kcalRef, 'kcal');
    measureTarget(waterRef, 'water');
    measureTarget(gridRef, 'grid');
  }, [tutorialOpen, tutorialStep]);

  // 배너는 생일 당일 내내 떠 있고 몇 번이든 다시 열 수 있다.
  // birthdayShownYear는 올해 축하를 이미 전달했다는 기록으로, 배너 노출을 막지는 않는다.
  const isBirthday = isBirthdayToday(profile.birthdayMonth, profile.birthdayDay);

  const openBirthday = () => {
    showBirthday();
    setBirthdayShownYear(new Date().getFullYear());
  };

  useEffect(() => {
    seedMockToday(dateKey());
  }, []);

  // 온보딩을 막 끝낸 사용자에게 한 번만 보여준다. 이후에는 설정에서 다시 볼 수 있다.
  useEffect(() => {
    if (tutorialDone) return;
    const timer = setTimeout(() => {
      startTutorial();
      setTutorialDone(true);
    }, 600); // 카드 레이아웃 측정이 끝난 뒤 띄운다.
    return () => clearTimeout(timer);
  }, [tutorialDone]);

  const visibleCards = cardOrder.filter((id) => !cardHidden.includes(id) && (id !== 'period' || periodOn));
  const noExerciseToday = (record?.exercises?.length ?? 0) === 0;

  return (
    <ScreenBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: 108 }]}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        {isBirthday && <BirthdayBanner name={profile.nickname} onPress={openBirthday} />}
        <HeroRow />

        <Pressable
          onLongPress={showSheet}
          delayLongPress={550}
          style={styles.grid}
          ref={gridRef}
          onLayout={() => measureTarget(gridRef, 'grid')}
        >
          {visibleCards.map((id) => {
            const Card = CARD_COMPONENTS[id];
            const half = HALF_WIDTH_CARDS.has(id);
            const tutorialRef = id === 'kcal' ? kcalRef : id === 'water' ? waterRef : null;
            return (
              <View
                key={id}
                style={half ? styles.slotHalf : styles.slotFull}
                ref={tutorialRef}
                onLayout={tutorialRef ? () => measureTarget(tutorialRef, id as TutorialTargetId) : undefined}
              >
                <Card />
              </View>
            );
          })}
        </Pressable>

        {noExerciseToday && <LayDownBanner />}
      </ScrollView>

      <CardOrderSheet visible={sheetVisible} onClose={hideSheet} />
      <TutorialOverlay />
    </ScreenBackground>
  );
}

const GUTTER = 6; // 카드 간격 12px의 절반을 각 슬롯 좌우에 준다.

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  // B 히어로: 반폭 카드(물·걸음)가 같은 행에 나란히 흐르도록 wrap 그리드로 둔다.
  // gap 대신 슬롯 패딩 + 컨테이너 음수 마진을 쓰는 이유는 RN에 calc()가 없어
  // width:50% 와 gap 을 함께 쓰면 행이 넘치기 때문이다.
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    marginHorizontal: -GUTTER,
  },
  slotFull: {
    width: '100%',
    paddingHorizontal: GUTTER,
    paddingBottom: 12,
  },
  slotHalf: {
    width: '50%',
    paddingHorizontal: GUTTER,
    paddingBottom: 12,
  },
  cardSlot: {
    width: '100%',
  },
});
