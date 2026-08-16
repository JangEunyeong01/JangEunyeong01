import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../../components/GlassCard';
import PrimaryButton from '../../../components/PrimaryButton';
import { useTheme } from '../../../theme/useTheme';
import { useAppStore } from '../../../store/useAppStore';
import { dateKey } from '../../../utils/timeOfDay';
import { getWaterStageSpec } from '../../../utils/health';
import { waterStageNames } from '../../../copy/persona';
import { useToastStore } from '../../../store/useToastStore';

export default function WaterCard() {
  const { colors, brand } = useTheme();
  const goal = useAppStore((s) => s.goals.water);
  const cup = useAppStore((s) => s.goals.cup);
  const water = useAppStore((s) => s.dailyRecords[dateKey()]?.water ?? 0);
  const addWater = useAppStore((s) => s.addWater);
  const showToast = useToastStore((s) => s.show);

  const stage = getWaterStageSpec(water, goal);
  const filledCells = water <= 0 ? 0 : Math.min(5, Math.ceil((water / goal) * 5));

  const applyDelta = (deltaMl: number) => {
    if (deltaMl === 0) return;
    addWater(dateKey(), deltaMl);
    const next = Math.max(0, water + deltaMl);
    const nextStage = getWaterStageSpec(next, goal);
    showToast(`${deltaMl > 0 ? '+' : ''}${deltaMl}ml · ${waterStageNames[nextStage.stage]}`);
  };

  // README: 세로 드래그로 증감 — 위로 끌면 증가, 아래로 끌면 감소, 약 4px당 50ml, 50ml 단위 스냅.
  const pan = Gesture.Pan().onEnd((e) => {
    'worklet';
    const delta = Math.round(-e.translationY / 4 / 50) * 50;
    if (delta !== 0) runOnJS(applyDelta)(delta);
  });

  return (
    <GestureDetector gesture={pan}>
      <GlassCard>
        <View style={styles.topRow}>
          <Text style={[styles.label, { color: colors.sub }]}>물 섭취</Text>
          <View style={styles.topRight}>
            <Text style={[styles.stageName, { color: brand.blue }]}>{stage.name}</Text>
            <Text style={[styles.detailLink, { color: colors.sub }]}>상세 ›</Text>
          </View>
        </View>
        <View style={styles.numRow}>
          <Text style={[styles.bigNum, { color: colors.txt }]}>{water.toLocaleString()}</Text>
          <Text style={[styles.goalNum, { color: colors.sub }]}> / {goal.toLocaleString()} ml</Text>
        </View>
        <Text style={[styles.dragHint, { color: colors.sub }]}>카드를 위로 끌면 늘고, 아래로 끌면 줄어요</Text>

        <View style={styles.gauge}>
          {Array.from({ length: 5 }).map((_, i) =>
            i < filledCells ? (
              <LinearGradient key={i} colors={[brand.blue, brand.blueDeep]} style={styles.cell} />
            ) : (
              <View key={i} style={[styles.cell, { backgroundColor: colors.ink }]} />
            )
          )}
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            onPress={() => applyDelta(-cup)}
            style={[styles.minusBtn, { borderColor: colors.line }]}
          >
            <Text style={[styles.minusLabel, { color: colors.txt }]}>−</Text>
          </Pressable>
          <PrimaryButton small label={`+${cup} ml`} onPress={() => applyDelta(cup)} style={styles.plusBtn} />
        </View>
      </GlassCard>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageName: {
    fontSize: 11,
    fontWeight: '600',
  },
  detailLink: {
    fontSize: 11,
    fontWeight: '600',
  },
  dragHint: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  numRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  bigNum: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.9,
  },
  goalNum: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  gauge: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
  },
  cell: {
    flex: 1,
    height: 34,
    borderRadius: 11,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  minusBtn: {
    width: 46,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  plusBtn: {
    flex: 1,
  },
});
