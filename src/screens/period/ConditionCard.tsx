import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import GlassCard from '../../components/GlassCard';
import { useTheme } from '../../theme/useTheme';
import { selection, radius } from '../../theme/tokens';
import { useAppStore, type DailyRecord } from '../../store/useAppStore';

const CONDITIONS: { value: NonNullable<DailyRecord['periodCondition']>; label: string }[] = [
  { value: 'good', label: '좋음' },
  { value: 'normal', label: '보통' },
  { value: 'bad', label: '나쁨' },
];

export const SYMPTOMS = ['복통', '두통', '부기', '피로', '예민', '허리 통증'];

interface ConditionCardProps {
  dateKey: string;
  label: string;
}

// README: 컨디션 카드 — {선택일} 컨디션 + 3택 + 증상 칩(복수 선택) + 메모 안내.
export default function ConditionCard({ dateKey, label }: ConditionCardProps) {
  const { colors } = useTheme();
  const record = useAppStore((s) => s.dailyRecords[dateKey]);
  const setDayCondition = useAppStore((s) => s.setDayCondition);
  const toggleDaySymptom = useAppStore((s) => s.toggleDaySymptom);

  const condition = record?.periodCondition;
  const symptoms = record?.periodSymptoms ?? [];

  return (
    <GlassCard style={styles.card}>
      <Text style={[styles.title, { color: colors.txt }]}>{label} 컨디션</Text>
      <Text style={[styles.desc, { color: colors.sub }]}>그날의 몸 상태를 남겨두면 다음 주기를 예측할 때 참고해요.</Text>

      <View style={styles.conditionRow}>
        {CONDITIONS.map((c) => {
          const on = condition === c.value;
          return (
            <Pressable
              key={c.value}
              onPress={() => setDayCondition(dateKey, on ? undefined : c.value)}
              style={[
                styles.conditionBtn,
                { backgroundColor: on ? selection.bg : colors.card2, borderColor: on ? selection.border : colors.line },
              ]}
            >
              <Text style={[styles.conditionLabel, { color: colors.txt, fontWeight: on ? '700' : '500' }]}>{c.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.sectionLabel, { color: colors.sub }]}>증상</Text>
      <View style={styles.symptomWrap}>
        {SYMPTOMS.map((s) => {
          const on = symptoms.includes(s);
          return (
            <Pressable
              key={s}
              onPress={() => toggleDaySymptom(dateKey, s)}
              style={[
                styles.symptomChip,
                { backgroundColor: on ? selection.bg : colors.card2, borderColor: on ? selection.border : colors.line },
              ]}
            >
              <Text style={[styles.symptomLabel, { color: colors.txt, fontWeight: on ? '700' : '500' }]}>{s}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.memoBlock, { backgroundColor: colors.card2 }]}>
        <Text style={[styles.memoText, { color: colors.sub }]}>
          메모 기능은 준비 중이에요. 지금은 컨디션과 증상만 기록돼요.
        </Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  desc: {
    fontSize: 11.5,
    lineHeight: 11.5 * 1.5,
    marginTop: 6,
  },
  conditionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  conditionBtn: {
    flex: 1,
    height: 42,
    borderRadius: radius.chip,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionLabel: {
    fontSize: 13,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  symptomWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.chip,
    borderWidth: 1,
  },
  symptomLabel: {
    fontSize: 12,
  },
  memoBlock: {
    borderRadius: 15,
    padding: 12,
    marginTop: 14,
  },
  memoText: {
    fontSize: 11,
    lineHeight: 11 * 1.5,
  },
});
