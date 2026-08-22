import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenBackground from '../../components/ScreenBackground';
import DetailHeader from './DetailHeader';
import PeriodChips, { Period } from './PeriodChips';
import PeriodBar, { MonthPreset } from './PeriodBar';
import DetailSummaryCard from './DetailSummaryCard';
import DetailBarChart from './DetailBarChart';
import GoalField from './GoalField';
import CupSizeField from './CupSizeField';
import { useAppStore } from '../../store/useAppStore';
import { dateKey, getTimeSlot } from '../../utils/timeOfDay';
import { MOCK_WATER_PAST6, getWeekDayLabels } from '../home/mockData';
import {
  TIME_SLOT_LABELS,
  splitByTimeSlot,
  getMonthWeeklyMock,
  getMonthlyRangeMock,
  ymAdd,
  ymRange,
  ymRangeLabel,
  YearMonth,
} from '../../utils/periodMock';

const TIME_SLOT_ORDER = ['dawn', 'morning', 'day', 'after', 'evening', 'night'];

function currentYearMonth(): YearMonth {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export default function WaterDetailScreen() {
  const insets = useSafeAreaInsets();
  const goal = useAppStore((s) => s.goals.water);
  const cup = useAppStore((s) => s.goals.cup);
  const setGoals = useAppStore((s) => s.setGoals);
  const today = useAppStore((s) => s.dailyRecords[dateKey()]?.water ?? 0);

  const [period, setPeriod] = useState<Period>('day');
  const [preset, setPreset] = useState<MonthPreset>('1m');
  const now = currentYearMonth();
  const [anchor, setAnchor] = useState<YearMonth>(now);
  const [customStart, setCustomStart] = useState<YearMonth>(ymAdd(now, -3));
  const [customEnd, setCustomEnd] = useState<YearMonth>(now);

  const windowSize = preset === '1m' ? 1 : preset === '3m' ? 3 : preset === '6m' ? 6 : null;
  const start = preset === 'custom' ? customStart : ymAdd(anchor, -((windowSize ?? 1) - 1));
  const end = preset === 'custom' ? customEnd : anchor;

  const shift = (delta: number) => {
    if (preset === 'custom') {
      setCustomStart((s) => ymAdd(s, delta));
      setCustomEnd((e) => ymAdd(e, delta));
      return;
    }
    setAnchor((a) => {
      const next = ymAdd(a, delta);
      return next.year * 12 + next.month > now.year * 12 + now.month ? a : next;
    });
  };

  let chartLabels: string[] = [];
  let chartValues: number[] = [];
  let highlightIndex: number | undefined;
  let summaryValue = 0;
  let summaryDesc = '';

  if (period === 'day') {
    chartLabels = TIME_SLOT_LABELS;
    chartValues = splitByTimeSlot('water', today);
    highlightIndex = TIME_SLOT_ORDER.indexOf(getTimeSlot());
    summaryValue = today;
    summaryDesc = '오늘';
  } else if (period === 'week') {
    const week = [...MOCK_WATER_PAST6, today];
    chartLabels = getWeekDayLabels();
    chartValues = week;
    highlightIndex = week.length - 1;
    summaryValue = Math.round(week.reduce((a, v) => a + v, 0) / week.length);
    summaryDesc = '이번 주 7일 평균';
  } else {
    const months = ymRange(start, end);
    const isSingle = months.length === 1;
    chartLabels = isSingle ? ['1주', '2주', '3주', '4주'] : months.map((m) => `${m.month}월`);
    chartValues = isSingle ? getMonthWeeklyMock('water', start) : getMonthlyRangeMock('water', months);
    const totalDays = isSingle ? 28 : months.length * 30;
    summaryValue = Math.round(chartValues.reduce((a, v) => a + v, 0) / totalDays);
    summaryDesc = `${ymRangeLabel(start, end)} 평균`;
  }

  return (
    <ScreenBackground showTimeGradient={false}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <DetailHeader title="물 섭취" />
        <PeriodChips value={period} onChange={setPeriod} />

        {period === 'month' && (
          <PeriodBar
            preset={preset}
            onPresetChange={setPreset}
            start={start}
            end={end}
            onShift={shift}
            onCustomChange={(s, e) => {
              setCustomStart(s);
              setCustomEnd(e);
            }}
            currentMonth={now}
          />
        )}

        <DetailSummaryCard value={summaryValue} unit="ml" goal={goal} periodDesc={summaryDesc} />
        <DetailBarChart labels={chartLabels} values={chartValues} highlightIndex={highlightIndex} />

        <GoalField title="물 목표" value={goal} min={500} max={4000} unit="ml" onCommit={(v) => setGoals({ water: v })} />
        <CupSizeField value={cup} onChange={(v) => setGoals({ cup: v })} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
});
