import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import GlassCard from '../../../components/GlassCard';
import { useTheme } from '../../../theme/useTheme';
import { useAppStore } from '../../../store/useAppStore';
import { dateKey } from '../../../utils/timeOfDay';
import { getBurnedKcal } from '../../../utils/health';

const SIZE = 104;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

export default function ActivityCard() {
  const { colors, brand } = useTheme();
  const stepsGoal = useAppStore((s) => s.goals.steps);
  const record = useAppStore((s) => s.dailyRecords[dateKey()]);

  const steps = record?.steps ?? 0;
  const exerciseMinutes = (record?.exercises ?? []).reduce((a, e) => a + e.minutes, 0);
  const burned = getBurnedKcal(record?.exercises ?? []);
  const percent = Math.max(0, Math.min(100, Math.round((steps / stepsGoal) * 100)));
  const dashOffset = CIRC * (1 - percent / 100);

  return (
    <GlassCard>
      <View style={styles.row}>
        <View style={styles.ringWrap}>
          <Svg width={SIZE} height={SIZE}>
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={colors.ink} strokeWidth={STROKE} fill="none" />
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={brand.blue}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${CIRC} ${CIRC}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={[styles.percent, { color: colors.txt }]}>{percent}%</Text>
            <Text style={[styles.percentLabel, { color: colors.sub }]}>활동</Text>
          </View>
        </View>

        <View style={styles.statCol}>
          <StatRow dot={brand.blue} label="걸음수" value={steps.toLocaleString()} colors={colors} />
          <StatRow dot={brand.mint} label="운동 시간" value={`${exerciseMinutes}분`} colors={colors} />
          <StatRow dot={brand.lavender} label="소모 칼로리" value={`${burned.toLocaleString()}kcal`} colors={colors} />
        </View>
      </View>
    </GlassCard>
  );
}

function StatRow({ dot, label, value, colors }: { dot: string; label: string; value: string; colors: any }) {
  return (
    <View style={styles.statRow}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={[styles.statLabel, { color: colors.sub }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.txt }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ringWrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  percent: {
    fontSize: 16,
    fontWeight: '700',
  },
  percentLabel: {
    fontSize: 9,
    fontWeight: '600',
  },
  statCol: {
    flex: 1,
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  statLabel: {
    fontSize: 11.5,
    fontWeight: '500',
    flex: 1,
  },
  statValue: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
