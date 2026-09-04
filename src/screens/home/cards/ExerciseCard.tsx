import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GlassCard from '../../../components/GlassCard';
import { useTheme } from '../../../theme/useTheme';
import { useAppStore } from '../../../store/useAppStore';
import { dateKey } from '../../../utils/timeOfDay';
import { useToastStore } from '../../../store/useToastStore';
import { typography } from '../../../theme/tokens';

const QUICK_CHIPS = ['걷기', '스트레칭', '홈트'];

export default function ExerciseCard() {
  const { colors, brand } = useTheme();
  const navigation = useNavigation<any>();
  const record = useAppStore((s) => s.dailyRecords[dateKey()]);
  const addExercise = useAppStore((s) => s.addExercise);
  const showToast = useToastStore((s) => s.show);
  const exercises = record?.exercises ?? [];

  const handleQuickAdd = (name: string) => {
    addExercise(dateKey(), { id: `${Date.now()}`, name, minutes: 15, kcal: 60 });
    showToast(`${name} 기록 완료`);
  };

  return (
    <GlassCard>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.txt }]}>오늘 운동</Text>
        <Pressable onPress={() => navigation.navigate('Health')}>
          <Text style={[styles.link, { color: brand.blue }]}>헬스 탭 →</Text>
        </Pressable>
      </View>

      {exercises.length === 0 ? (
        <Text style={[styles.empty, { color: colors.sub }]}>아직 기록된 운동이 없어요.</Text>
      ) : (
        <View style={styles.list}>
          {exercises.map((e) => (
            <View key={e.id} style={styles.row}>
              <View style={[styles.dot, { backgroundColor: brand.mint }]} />
              <Text style={[styles.name, { color: colors.txt }]}>{e.name}</Text>
              <Text style={[styles.detail, { color: colors.sub }]}>
                {e.minutes}분 · {e.kcal}kcal
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.chipRow, { borderTopColor: colors.line }]}>
        {QUICK_CHIPS.map((c) => (
          <Pressable key={c} onPress={() => handleQuickAdd(c)} style={[styles.chip, { borderColor: colors.line }]}>
            <Text style={[styles.chipText, { color: colors.txt }]}>+ {c}</Text>
          </Pressable>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: typography.sectionTitle,
  link: typography.label,
  empty: {
    ...typography.body,
    marginTop: 10,
  },
  list: {
    marginTop: 10,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  name: {
    ...typography.rowLabel,
    flex: 1,
  },
  detail: typography.caption,
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  chipText: typography.label,
});
