import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import GlassCard from '../../../components/GlassCard';
import ProgressBar from '../../../components/ProgressBar';
import { useTheme } from '../../../theme/useTheme';
import { useAppStore } from '../../../store/useAppStore';
import { dateKey } from '../../../utils/timeOfDay';
import { getKcalStatus, kcalStatusColor, kcalStatusLabel, sumMealKcal, getBurnedKcal } from '../../../utils/health';
import { personaCopy } from '../../../copy/persona';
import { FITTO_FACE } from '../../../theme/assets';
import { alpha, typography } from '../../../theme/tokens';

export default function KcalCard() {
  const { colors } = useTheme();
  const persona = useAppStore((s) => s.persona);
  const goal = useAppStore((s) => s.goals.kcal);
  const record = useAppStore((s) => s.dailyRecords[dateKey()]);

  const consumed = record ? sumMealKcal(record.meals) : 0;
  const burned = getBurnedKcal(record?.exercises ?? []);
  const remain = Math.max(0, goal - consumed);
  const status = getKcalStatus(consumed, goal);
  const statusColor = kcalStatusColor[status];
  const percent = Math.round((consumed / goal) * 100);

  const commentFn = personaCopy.kcalComment[persona] as (v: { remainKcal: number; consumedKcal: number; percent: number }) => string;
  const comment = commentFn({ remainKcal: remain, consumedKcal: consumed, percent });

  return (
    <GlassCard>
      <View pointerEvents="none" style={[styles.deco, { backgroundColor: colors.ink }]} />

      <View style={styles.topRow}>
        <View style={[styles.ring, { borderColor: statusColor, shadowColor: statusColor, backgroundColor: alpha(statusColor, 0.13) }]}>
          <Image source={FITTO_FACE} style={styles.face} resizeMode="contain" />
        </View>
        <View style={styles.numCol}>
          <Text style={[styles.label, { color: colors.sub }]}>오늘 칼로리 · {kcalStatusLabel[status]}</Text>
          <View style={styles.numRow}>
            <Text style={[styles.bigNum, { color: colors.txt }]}>{consumed.toLocaleString()}</Text>
            <Text style={[styles.goalNum, { color: colors.sub }]}> / {goal.toLocaleString()} kcal</Text>
          </View>
        </View>
      </View>

      <View style={styles.barWrap}>
        <ProgressBar progress={consumed / goal} height={9} radius={6} color={statusColor} />
      </View>

      <View style={styles.summaryRow}>
        <SummaryCol label="섭취" value={consumed} colors={colors} align="flex-start" />
        <SummaryCol label="소모" value={burned} colors={colors} align="center" />
        <SummaryCol label="남음" value={remain} colors={colors} align="flex-end" />
      </View>

      <View style={[styles.commentBox, { backgroundColor: colors.card2 }]}>
        <Text style={[styles.commentText, { color: colors.txt }]}>{comment}</Text>
      </View>
    </GlassCard>
  );
}

// 라벨과 값을 한 줄에 두고 3열을 좌·중·우로 벌린다(원본 프로토타입 배치).
function SummaryCol({
  label,
  value,
  colors,
  align,
}: {
  label: string;
  value: number;
  colors: any;
  align: 'flex-start' | 'center' | 'flex-end';
}) {
  return (
    <View style={[styles.summaryCol, { alignItems: align }]}>
      <View style={styles.summaryInline}>
        <Text style={[styles.summaryLabel, { color: colors.sub }]}>{label}</Text>
        <Text style={[styles.summaryValue, { color: colors.txt }]}>{value.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deco: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ring: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
  },
  face: {
    width: 34,
    height: 34,
  },
  numCol: {
    flex: 1,
    gap: 4,
  },
  label: typography.label,
  numRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bigNum: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -1,
  },
  goalNum: typography.unit,
  barWrap: {
    marginTop: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  summaryCol: {
    flex: 1,
  },
  summaryInline: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  summaryLabel: typography.label,
  summaryValue: typography.itemTitle,
  commentBox: {
    marginTop: 12,
    borderRadius: 15,
    paddingVertical: 11,
    paddingHorizontal: 13,
  },
  commentText: typography.body,
});
