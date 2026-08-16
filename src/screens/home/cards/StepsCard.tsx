import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../../components/GlassCard';
import ProgressBar from '../../../components/ProgressBar';
import { useTheme } from '../../../theme/useTheme';
import { useAppStore } from '../../../store/useAppStore';
import { dateKey } from '../../../utils/timeOfDay';
import { MOCK_STEPS_PAST6, getWeekDayLabels } from '../mockData';

const BAR_MAX_HEIGHT = 34;

export default function StepsCard() {
  const { colors, brand } = useTheme();
  const goal = useAppStore((s) => s.goals.steps);
  const steps = useAppStore((s) => s.dailyRecords[dateKey()]?.steps ?? 0);

  const week = [...MOCK_STEPS_PAST6, steps];
  const labels = getWeekDayLabels();
  const avg = Math.round(week.reduce((a, v) => a + v, 0) / week.length);
  const maxVal = Math.max(...week, 1);

  return (
    <GlassCard>
      <View style={styles.topRow}>
        <Text style={[styles.label, { color: colors.sub }]}>걸음수</Text>
      </View>
      <View style={styles.numRow}>
        <Text style={[styles.bigNum, { color: colors.txt }]}>{steps.toLocaleString()}</Text>
        <Text style={[styles.goalNum, { color: colors.sub }]}> / {goal.toLocaleString()}</Text>
      </View>
      <View style={styles.barWrap}>
        <ProgressBar progress={steps / goal} height={8} radius={5} gradientColors={[brand.mint, brand.blue]} />
      </View>

      <View style={styles.chartRow}>
        {week.map((v, i) => {
          const isToday = i === week.length - 1;
          const h = Math.max(4, (v / maxVal) * BAR_MAX_HEIGHT);
          return (
            <View key={i} style={styles.chartCol}>
              <View style={[styles.barTrack, { height: BAR_MAX_HEIGHT }]}>
                {isToday ? (
                  <LinearGradient colors={[brand.blue, brand.blueDeep]} style={[styles.bar, { height: h }]} />
                ) : (
                  <View style={[styles.bar, { height: h, backgroundColor: colors.ink }]} />
                )}
              </View>
              <Text style={[styles.dayLabel, { color: colors.sub }]}>{labels[i]}</Text>
            </View>
          );
        })}
      </View>
      <Text style={[styles.caption, { color: colors.sub }]}>최근 7일 · 평균 {avg.toLocaleString()}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  numRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  bigNum: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  goalNum: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  barWrap: {
    marginTop: 10,
  },
  chartRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 4,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barTrack: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  dayLabel: {
    fontSize: 9.5,
    fontWeight: '500',
  },
  caption: {
    fontSize: 10.5,
    fontWeight: '500',
    marginTop: 8,
  },
});
