import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../../../components/GlassCard';
import { useTheme } from '../../../theme/useTheme';
import { useAppStore } from '../../../store/useAppStore';
import { dateKey } from '../../../utils/timeOfDay';
import { sumMealKcal, getBurnedKcal } from '../../../utils/health';
import { MOCK_INTAKE_PAST6, MOCK_BURN_PAST6, getWeekDayLabels } from '../mockData';

const MAX_KCAL = 2000;
const CHART_HEIGHT = 70;

export default function WeekCard() {
  const { colors, brand } = useTheme();
  const record = useAppStore((s) => s.dailyRecords[dateKey()]);
  const consumedToday = record ? sumMealKcal(record.meals) : 0;
  const burnedToday = getBurnedKcal(record?.exercises ?? []);

  const intake = [...MOCK_INTAKE_PAST6, consumedToday];
  const burn = [...MOCK_BURN_PAST6, burnedToday];
  const labels = getWeekDayLabels();

  return (
    <GlassCard>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.txt }]}>주간 요약</Text>
        <View style={styles.legend}>
          <LegendDot color={brand.blue} label="섭취" textColor={colors.sub} />
          <LegendDot color={brand.mint} label="소모" textColor={colors.sub} />
        </View>
      </View>

      <View style={styles.chartRow}>
        {labels.map((label, i) => {
          const isToday = i === labels.length - 1;
          const intakeH = Math.min(CHART_HEIGHT, (intake[i] / MAX_KCAL) * CHART_HEIGHT);
          const burnH = Math.min(CHART_HEIGHT, (burn[i] / MAX_KCAL) * CHART_HEIGHT);
          return (
            <View key={i} style={styles.col}>
              <View style={[styles.barsWrap, { height: CHART_HEIGHT }]}>
                <View style={[styles.bar, { height: intakeH, backgroundColor: brand.blue }]} />
                <View style={[styles.bar, { height: burnH, backgroundColor: brand.mint }]} />
              </View>
              <Text style={[styles.dayLabel, { color: isToday ? colors.txt : colors.sub, fontWeight: isToday ? '700' : '500' }]}>{label}</Text>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
}

function LegendDot({ color, label, textColor }: { color: string; label: string; textColor: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendLabel, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendLabel: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  chartRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barsWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  bar: {
    width: 9,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  dayLabel: {
    fontSize: 10.5,
  },
});
