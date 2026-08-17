import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenBackground from '../../components/ScreenBackground';
import GlassCard from '../../components/GlassCard';
import PrimaryButton from '../../components/PrimaryButton';
import FittoCharacter from '../../components/FittoCharacter';
import MealSlotCard from './MealSlotCard';
import RecommendCard from './RecommendCard';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { useFoodSearchStore } from '../../store/useFoodSearchStore';
import { useToastStore } from '../../store/useToastStore';
import { dateKey } from '../../utils/timeOfDay';
import { sumMealKcal } from '../../utils/health';

const SLOTS = ['아침', '점심', '저녁', '간식'] as const;

export default function DietScreen() {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const record = useAppStore((s) => s.dailyRecords[dateKey()]);
  const openSearch = useFoodSearchStore((s) => s.show);
  const showToast = useToastStore((s) => s.show);

  const meals = record?.meals ?? { 아침: [], 점심: [], 저녁: [], 간식: [] };
  const totalKcal = sumMealKcal(meals);
  const isEmpty = totalKcal === 0;

  return (
    <ScreenBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: 108 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={[typography.screenTitle, { color: colors.txt }]}>식단</Text>
          <PrimaryButton small label="+ 음식 기록" onPress={openSearch} style={styles.recordBtn} />
        </View>

        {isEmpty ? (
          <GlassCard style={styles.emptyCard}>
            <View style={styles.emptyInner}>
              <View style={styles.emptyChar}>
                <FittoCharacter current={1} goal={5} size={96} glow={false} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.txt }]}>아직 기록이 없어요</Text>
              <Text style={[styles.emptyDesc, { color: colors.sub }]}>
                먹은 음식을 한 개만 추가해도 피또가 오늘 상태를 알려줄 수 있어요.
              </Text>
              <PrimaryButton label="첫 기록 시작하기" onPress={openSearch} style={styles.emptyBtn} />
            </View>
          </GlassCard>
        ) : (
          SLOTS.map((slot) => (
            <MealSlotCard key={slot} slot={slot} items={meals[slot]} onAdd={openSearch} />
          ))
        )}

        <RecommendCard />

        <View style={styles.bottomRow}>
          <Pressable
            onPress={() => showToast('다음 단계에서 구현될 화면이에요')}
            style={[styles.bottomBtn, { borderColor: colors.line, backgroundColor: colors.card2 }]}
          >
            <Text style={[styles.bottomLabel, { color: colors.txt }]}>나만의 레시피</Text>
          </Pressable>
          <Pressable
            onPress={() => showToast('다음 단계에서 구현될 화면이에요')}
            style={[styles.bottomBtn, { borderColor: colors.line, backgroundColor: colors.card2 }]}
          >
            <Text style={[styles.bottomLabel, { color: colors.txt }]}>식단 분석</Text>
          </Pressable>
        </View>
      </ScrollView>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recordBtn: {
    height: 36,
    paddingHorizontal: 14,
  },
  emptyCard: {
    marginBottom: 12,
  },
  emptyInner: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  emptyChar: {
    opacity: 0.72,
  },
  emptyTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 12.5,
    lineHeight: 12.5 * 1.5,
    textAlign: 'center',
    marginTop: 6,
  },
  emptyBtn: {
    alignSelf: 'stretch',
    marginTop: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  bottomBtn: {
    flex: 1,
    height: 48,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
