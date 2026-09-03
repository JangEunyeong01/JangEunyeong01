import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../../components/GlassCard';
import { useTheme } from '../../theme/useTheme';
import { brand } from '../../theme/tokens';
import { calcNutrition, getNutritionComment, type RecipeLine } from '../../data/ingredients';
import { useAppStore } from '../../store/useAppStore';

interface NutritionCardProps {
  lines: RecipeLine[];
}

// README: 영양 분석 카드 — 총 kcal + 탄/단/지 3칼럼 + 100% 스택 비율 바 + 코멘트.
export default function NutritionCard({ lines }: NutritionCardProps) {
  const { colors } = useTheme();
  const avoid = useAppStore((s) => s.profile.allergies);

  const totals = calcNutrition(lines);
  const comment = getNutritionComment(lines, totals, avoid);

  return (
    <GlassCard style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.txt }]}>영양 분석</Text>
        <View style={[styles.badge, { backgroundColor: colors.ink }]}>
          <Text style={[styles.badgeText, { color: colors.sub }]}>룰 기반 · API 연동 예정</Text>
        </View>
      </View>

      <Text style={[styles.totalKcal, { color: colors.txt }]}>
        {totals.kcal.toLocaleString()}
        <Text style={[styles.totalUnit, { color: colors.sub }]}> kcal</Text>
      </Text>

      <View style={styles.macroRow}>
        <Macro label="탄수화물" value={totals.carbs} pct={totals.carbsPct} colors={colors} />
        <Macro label="단백질" value={totals.protein} pct={totals.proteinPct} colors={colors} />
        <Macro label="지방" value={totals.fat} pct={totals.fatPct} colors={colors} />
      </View>

      <View style={[styles.stackBar, { backgroundColor: colors.ink }]}>
        <View style={{ width: `${totals.carbsPct}%`, backgroundColor: brand.blue }} />
        <View style={{ width: `${totals.proteinPct}%`, backgroundColor: brand.mint }} />
        <View style={{ width: `${totals.fatPct}%`, backgroundColor: brand.lavender }} />
      </View>

      <Text style={[styles.comment, { color: colors.sub }]}>{comment}</Text>
    </GlassCard>
  );
}

function Macro({ label, value, pct, colors }: { label: string; value: number; pct: number; colors: any }) {
  return (
    <View style={styles.macroCol}>
      <Text style={[styles.macroLabel, { color: colors.sub }]}>{label}</Text>
      <Text style={[styles.macroValue, { color: colors.txt }]}>{value}g</Text>
      <Text style={[styles.macroPct, { color: colors.sub }]}>{pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  totalKcal: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1,
    marginTop: 12,
  },
  totalUnit: {
    fontSize: 13,
    fontWeight: '600',
  },
  macroRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  macroCol: {
    flex: 1,
    gap: 3,
  },
  macroLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  macroValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  macroPct: {
    fontSize: 10.5,
  },
  stackBar: {
    flexDirection: 'row',
    height: 9,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 14,
  },
  comment: {
    fontSize: 11.5,
    lineHeight: 11.5 * 1.5,
    marginTop: 12,
  },
});
