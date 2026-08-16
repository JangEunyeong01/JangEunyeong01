import React, { useEffect, useState } from 'react';
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
import BirthdayModal from './BirthdayModal';
import { useAppStore, CardId } from '../../store/useAppStore';
import { dateKey, isBirthdayToday } from '../../utils/timeOfDay';

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
  const [sheetVisible, setSheetVisible] = useState(false);
  const [birthdayVisible, setBirthdayVisible] = useState(false);

  const isBirthday = isBirthdayToday(profile.birthdayMonth, profile.birthdayDay);

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
        {isBirthday && <BirthdayBanner name={profile.nickname} onPress={() => setBirthdayVisible(true)} />}
        <HeroRow />

        <Pressable onLongPress={() => setSheetVisible(true)} delayLongPress={550} style={styles.grid}>
          {visibleCards.map((id) => {
            const Card = CARD_COMPONENTS[id];
            return (
              <View key={id} style={styles.cardSlot}>
                <Card />
              </View>
            );
          })}
        </Pressable>

        {noExerciseToday && <LayDownBanner />}
      </ScrollView>

      <CardOrderSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} />
      <BirthdayModal visible={birthdayVisible} onClose={() => setBirthdayVisible(false)} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  grid: {
    gap: 12,
  },
  cardSlot: {
    width: '100%',
  },
});
