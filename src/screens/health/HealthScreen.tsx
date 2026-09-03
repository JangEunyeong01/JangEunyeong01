import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ScreenBackground from '../../components/ScreenBackground';
import GlassCard from '../../components/GlassCard';
import { useTheme } from '../../theme/useTheme';
import { alpha, brand } from '../../theme/tokens';
import { useAppStore } from '../../store/useAppStore';
import { useToastStore } from '../../store/useToastStore';
import { dateKey } from '../../utils/timeOfDay';
import { personaCopy } from '../../copy/persona';
import { WORKOUT_SUGGESTIONS, QUICK_WORKOUTS } from '../../data/workouts';
import { MOCK_STEPS_PAST6 } from '../home/mockData';

export default function HealthScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { colors, typography } = useTheme();
  const persona = useAppStore((s) => s.persona);
  const periodOn = useAppStore((s) => s.periodOn);
  const record = useAppStore((s) => s.dailyRecords[dateKey()]);
  const addExercise = useAppStore((s) => s.addExercise);
  const removeExercise = useAppStore((s) => s.removeExercise);
  const showToast = useToastStore((s) => s.show);

  const exercises = record?.exercises ?? [];
  const steps = record?.steps ?? 0;

  // 움직임 현황: 실제 헬스 API 연동 전까지 주간 목데이터 + 오늘 기록으로 계산한다.
  const week = [...MOCK_STEPS_PAST6, steps];
  const activeDays = week.filter((v) => v >= 5000).length;
  const avgSteps = Math.round(week.reduce((a, v) => a + v, 0) / week.length);
  const sittingHours = 6.5; // 기기 센서 연동 전 예시값

  const trainingComment = personaCopy.exerciseComment[persona]();

  const handleAdd = (name: string, minutes: number, kcal: number) => {
    addExercise(dateKey(), { id: `${Date.now()}`, name, minutes, kcal });
    showToast(`${name} 기록 완료`);
  };

  return (
    <ScreenBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: 108 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[typography.screenTitle, { color: colors.txt, marginBottom: 16 }]}>헬스</Text>

        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.txt }]}>움직임 현황</Text>
          <View style={styles.statRow}>
            <Stat label="주간 활동" value={`${activeDays}일`} colors={colors} />
            <Stat label="평균 걸음" value={`${(avgSteps / 1000).toFixed(1)}천`} colors={colors} />
            <Stat label="앉은 시간" value={`${sittingHours}h`} colors={colors} />
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={[styles.cardTitle, { color: colors.txt }]}>오늘의 퍼스널 트레이닝</Text>
            <View style={[styles.badge, { backgroundColor: colors.ink }]}>
              <Text style={[styles.badgeText, { color: colors.sub }]}>룰 기반</Text>
            </View>
          </View>
          <Text style={[styles.comment, { color: colors.txt }]}>{trainingComment}</Text>

          <View style={styles.suggestList}>
            {WORKOUT_SUGGESTIONS.map((w) => (
              <View key={w.id} style={[styles.suggestRow, { backgroundColor: colors.card2 }]}>
                <View style={styles.suggestText}>
                  <Text style={[styles.suggestName, { color: colors.txt }]}>
                    {w.name} <Text style={[styles.suggestDetail, { color: colors.sub }]}>{w.detail}</Text>
                  </Text>
                  <Text style={[styles.suggestReason, { color: colors.sub }]}>{w.reason}</Text>
                </View>
                <Pressable
                  onPress={() => handleAdd(w.name, w.minutes, w.kcal)}
                  style={[styles.addBtn, { borderColor: colors.stroke, backgroundColor: colors.card }]}
                >
                  <Text style={[styles.addLabel, { color: colors.txt }]}>기록에 추가</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.txt }]}>운동 기록</Text>
          {exercises.length === 0 ? (
            <Text style={[styles.empty, { color: colors.sub }]}>아직 기록된 운동이 없어요.</Text>
          ) : (
            <View style={styles.recordList}>
              {exercises.map((e) => (
                <View key={e.id} style={styles.recordRow}>
                  <View style={[styles.dot, { backgroundColor: brand.mint }]} />
                  <Text style={[styles.recordName, { color: colors.txt }]}>{e.name}</Text>
                  <Text style={[styles.recordDetail, { color: colors.sub }]}>
                    {e.minutes}분 · {e.kcal}kcal
                  </Text>
                  <Pressable onPress={() => removeExercise(dateKey(), e.id)} hitSlop={8}>
                    <Text style={[styles.remove, { color: colors.sub }]}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <View style={[styles.chipRow, { borderTopColor: colors.line }]}>
            {QUICK_WORKOUTS.map((c) => (
              <Pressable
                key={c}
                onPress={() => handleAdd(c, 15, 60)}
                style={[styles.chip, { borderColor: colors.line }]}
              >
                <Text style={[styles.chipText, { color: colors.txt }]}>+ {c}</Text>
              </Pressable>
            ))}
          </View>
        </GlassCard>

        {periodOn && (
          <Pressable onPress={() => navigation.navigate('PeriodDetail')}>
            <GlassCard style={styles.card}>
              <View style={styles.periodRow}>
                <View style={[styles.periodBadge, { backgroundColor: alpha(brand.lavender, 0.28) }]}>
                  <Text style={styles.periodIcon}>🌙</Text>
                </View>
                <View style={styles.periodText}>
                  <Text style={[styles.cardTitle, { color: colors.txt }]}>생리 주기 상세</Text>
                  <Text style={[styles.periodSub, { color: colors.sub }]}>캘린더와 컨디션 기록 보기</Text>
                </View>
                <Text style={[styles.chevron, { color: colors.sub }]}>›</Text>
              </View>
            </GlassCard>
          </Pressable>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

// KcalCard의 섭취/소모/남음 3열 패턴과 통일: 라벨 → 값 순서로 세로로 쌓는다.
function Stat({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={styles.statCol}>
      <Text style={[styles.statLabel, { color: colors.sub }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.txt }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  statCol: {
    flex: 1,
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  comment: {
    fontSize: 12.5,
    lineHeight: 12.5 * 1.5,
    marginTop: 10,
  },
  suggestList: {
    marginTop: 12,
    gap: 8,
  },
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 15,
  },
  suggestText: {
    flex: 1,
    gap: 3,
  },
  suggestName: {
    fontSize: 13,
    fontWeight: '700',
  },
  suggestDetail: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  suggestReason: {
    fontSize: 11,
    lineHeight: 11 * 1.45,
  },
  addBtn: {
    height: 32,
    paddingHorizontal: 11,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  empty: {
    fontSize: 12.5,
    marginTop: 10,
  },
  recordList: {
    marginTop: 10,
    gap: 8,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  recordName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  recordDetail: {
    fontSize: 11,
  },
  remove: {
    fontSize: 16,
    paddingHorizontal: 4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  periodBadge: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodIcon: {
    fontSize: 18,
  },
  periodText: {
    flex: 1,
    gap: 2,
  },
  periodSub: {
    fontSize: 11.5,
  },
  chevron: {
    fontSize: 20,
  },
});
