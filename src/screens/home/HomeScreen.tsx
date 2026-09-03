import React, { useEffect } from 'react';
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

        <Pressable onLongPress={showSheet} delayLongPress={550} style={styles.grid}>
          {visibleCards.map((id) => {
            const Card = CARD_COMPONENTS[id];
            const half = HALF_WIDTH_CARDS.has(id);
            return (
              <View key={id} style={half ? styles.slotHalf : styles.slotFull}>
                <Card />
              </View>
            );
          })}
        </Pressable>

        {noExerciseToday && <LayDownBanner />}
      </ScrollView>

      <CardOrderSheet visible={sheetVisible} onClose={hideSheet} />
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
