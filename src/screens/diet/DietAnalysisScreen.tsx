import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenBackground from '../../components/ScreenBackground';
import GlassCard from '../../components/GlassCard';
import DetailHeader from '../detail/DetailHeader';
import { useTheme } from '../../theme/useTheme';
import { alpha, brand, semantic } from '../../theme/tokens';
import { useAppStore } from '../../store/useAppStore';
import { dateKey } from '../../utils/timeOfDay';
import { sumMealKcal } from '../../utils/health';
import { MOCK_INTAKE_PAST6, getWeekDayLabels } from '../home/mockData';
import { buildWeekMacros, summarizeWeek, getDiffStatus, RECOMMENDED, type DiffStatus } from '../../utils/dietAnalysis';

const BAR_HEIGHT = 104;

export default function DietAnalysisScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const record = useAppStore((s) => s.dailyRecords[dateKey()]);

  const todayKcal = record ? sumMealKcal(record.meals) : 0;
  const labels = getWeekDayLabels();
  const days = buildWeekMacros(labels, [...MOCK_INTAKE_PAST6, todayKcal]);
  const summary = summarizeWeek(days);

  const statusColor: Record<DiffStatus, string> = {
    good: semantic.good,
    over: semantic.warn,
    under: brand.blue,
  };

  const rows = [
    { label: '탄수화물', current: summary.carbsPct, rec: RECOMMENDED.carbs, color: brand.blue },
    { label: '단백질', current: summary.proteinPct, rec: RECOMMENDED.protein, color: brand.mint },
    { label: '지방', current: summary.fatPct, rec: RECOMMENDED.fat, color: brand.lavender },
  ];

  const comments = [
    summary.weekendFatPct >= 35
      ? `주말 지방 비율이 ${summary.weekendFatPct}%예요. 다음 주말엔 조금만 덜어내 볼까요?`
      : '주말에도 지방 비율을 잘 지키고 있어요.',
    summary.proteinPct >= RECOMMENDED.protein
      ? `단백질 ${summary.proteinPct}%로 권장치를 채웠어요. 좋아요!`
      : `단백질이 ${summary.proteinPct}%예요. 권장 ${RECOMMENDED.protein}%까지 조금 더 채워봐요.`,
    '식이섬유가 19g으로 권장 25g보다 부족해요. 채소를 한 접시 더해보세요.',
  ];

  return (
    <ScreenBackground showTimeGradient={false}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <DetailHeader title="식단 분석" />

        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.txt }]}>주간 영양 밸런스</Text>
          <Text style={[styles.avgKcal, { color: colors.txt }]}>
            {summary.avgKcal.toLocaleString()}
            <Text style={[styles.avgUnit, { color: colors.sub }]}> kcal · 하루 평균</Text>
          </Text>

          <View style={styles.macroList}>
            {rows.map((r) => {
              const status = getDiffStatus(r.current, r.rec);
              const diff = r.current - r.rec;
              return (
                <View key={r.label} style={styles.macroRow}>
                  <View style={styles.macroHeader}>
                    <Text style={[styles.macroLabel, { color: colors.txt }]}>{r.label}</Text>
                    <Text style={[styles.macroRec, { color: colors.sub }]}>권장 {r.rec}%</Text>
                    <View style={[styles.diffBadge, { backgroundColor: alpha(statusColor[status], 0.2) }]}>
                      <Text style={[styles.diffText, { color: colors.txt }]}>
                        {diff > 0 ? '+' : ''}
                        {diff}%p
                      </Text>
                    </View>
                    <Text style={[styles.macroCurrent, { color: colors.txt }]}>{r.current}%</Text>
                  </View>
                  <View style={[styles.ratioTrack, { backgroundColor: colors.ink }]}>
                    <View style={[styles.ratioFill, { width: `${Math.min(100, r.current)}%`, backgroundColor: r.color }]} />
                    {/* 권장선 마커 */}
                    <View style={[styles.recMarker, { left: `${r.rec}%`, backgroundColor: alpha(colors.txt, 0.32) }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.txt }]}>요일별 구성</Text>
          <View style={styles.stackRow}>
            {days.map((d, i) => {
              const total = d.carbs * 4 + d.protein * 4 + d.fat * 9 || 1;
              const carbsH = ((d.carbs * 4) / total) * BAR_HEIGHT;
              const proteinH = ((d.protein * 4) / total) * BAR_HEIGHT;
              const fatH = ((d.fat * 9) / total) * BAR_HEIGHT;
              return (
                <View key={`${d.label}-${i}`} style={styles.stackCol}>
                  <View style={[styles.stackTrack, { height: BAR_HEIGHT }]}>
                    <View style={{ height: fatH, backgroundColor: brand.lavender }} />
                    <View style={{ height: proteinH, backgroundColor: brand.mint }} />
                    <View style={{ height: carbsH, backgroundColor: brand.blue }} />
                  </View>
                  <Text style={[styles.stackLabel, { color: colors.sub }]}>{d.label}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.legendRow}>
            <Legend color={brand.blue} label="탄수화물" colors={colors} />
            <Legend color={brand.mint} label="단백질" colors={colors} />
            <Legend color={brand.lavender} label="지방" colors={colors} />
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.summaryRow}>
            <Summary label="평균 단백질" value={`${summary.avgProtein}g`} colors={colors} />
            {/* 나트륨·식이섬유는 아직 기록하지 않는 값이라 README 예시 수치를 그대로 둔다. */}
            <Summary label="평균 나트륨" value="2,410mg" caption="권장 2,000 이하" colors={colors} />
            <Summary label="식이섬유" value="19g" caption="권장 25g" colors={colors} />
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.txt }]}>피또의 코멘트</Text>
          <View style={styles.commentList}>
            {comments.map((c) => (
              <Text key={c} style={[styles.comment, { color: colors.sub }]}>
                · {c}
              </Text>
            ))}
          </View>
          <Text style={[styles.notice, { color: colors.sub }]}>
            분석은 기록된 식단만 반영합니다. 의료 진단을 대체하지 않아요.
          </Text>
        </GlassCard>
      </ScrollView>
    </ScreenBackground>
  );
}

function Legend({ color, label, colors }: { color: string; label: string; colors: any }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendLabel, { color: colors.sub }]}>{label}</Text>
    </View>
  );
}

function Summary({ label, value, caption, colors }: { label: string; value: string; caption?: string; colors: any }) {
  return (
    <View style={styles.summaryCol}>
      <Text style={[styles.summaryLabel, { color: colors.sub }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: colors.txt }]}>{value}</Text>
      {!!caption && <Text style={[styles.summaryCaption, { color: colors.sub }]}>{caption}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  avgKcal: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -1,
    marginTop: 10,
  },
  avgUnit: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  macroList: {
    marginTop: 16,
    gap: 14,
  },
  macroRow: {
    gap: 7,
  },
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  macroLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  macroRec: {
    fontSize: 11,
    flex: 1,
  },
  diffBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 7,
  },
  diffText: {
    fontSize: 10,
    fontWeight: '700',
  },
  macroCurrent: {
    fontSize: 12.5,
    fontWeight: '700',
    minWidth: 34,
    textAlign: 'right',
  },
  ratioTrack: {
    height: 11,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  ratioFill: {
    height: '100%',
    borderRadius: 6,
  },
  recMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
  },
  stackRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 6,
  },
  stackCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  stackTrack: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  stackLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  legendLabel: {
    fontSize: 10.5,
    fontWeight: '500',
  },
  summaryRow: {
    flexDirection: 'row',
  },
  summaryCol: {
    flex: 1,
    gap: 3,
  },
  summaryLabel: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  summaryCaption: {
    fontSize: 9.5,
  },
  commentList: {
    marginTop: 12,
    gap: 7,
  },
  comment: {
    fontSize: 11.5,
    lineHeight: 11.5 * 1.5,
  },
  notice: {
    fontSize: 10.5,
    lineHeight: 10.5 * 1.5,
    marginTop: 12,
  },
});
