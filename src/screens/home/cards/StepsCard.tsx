import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import GlassCard from '../../../components/GlassCard';
import ProgressBar from '../../../components/ProgressBar';
import { useTheme } from '../../../theme/useTheme';
import { useAppStore } from '../../../store/useAppStore';
import { dateKey } from '../../../utils/timeOfDay';
import { MOCK_STEPS_PAST6, getWeekDayLabels } from '../mockData';
import { typography } from '../../../theme/tokens';

const BAR_MAX_HEIGHT = 34;

export default function StepsCard() {
  const navigation = useNavigation<any>();
  const { colors, brand } = useTheme();
  const goal = useAppStore((s) => s.goals.steps);
  const steps = useAppStore((s) => s.dailyRecords[dateKey()]?.steps ?? 0);

  const week = [...MOCK_STEPS_PAST6, steps];
  const labels = getWeekDayLabels();
  const avg = Math.round(week.reduce((a, v) => a + v, 0) / week.length);
  const maxVal = Math.max(...week, 1);

  // README: 걸음수 카드는 어디를 탭해도 걸음 상세로 이동한다.
  return (
    <Pressable onPress={() => navigation.navigate('StepsDetail')} style={styles.pressFill}>
      <GlassCard fill>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressFill: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
  },
  label: typography.unit,
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
  goalNum: typography.unit,
  barWrap: {
    marginTop: 10,
  },
  // README: 하단(margin-top:auto)에 최근 7일 미니 막대 — 카드가 늘어나도 빈 공간을 남기지 않는다.
  chartRow: {
    flexDirection: 'row',
    marginTop: 'auto',
    paddingTop: 16,
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
  dayLabel: typography.micro,
  caption: {
    ...typography.captionSm,
    marginTop: 8,
  },
});
