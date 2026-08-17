import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FittoCharacter from '../../components/FittoCharacter';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { calculateGoals } from '../../utils/goals';

// README "완료 화면": 인사 → 목표 카드 2개 → 요약 블록 → 의료 면책 안내.
export default function CompleteStep() {
  const { colors } = useTheme();
  const obInfo = useAppStore((s) => s.obInfo);
  const obTags = useAppStore((s) => s.obTags);
  const obPick = useAppStore((s) => s.obPick);

  const result = calculateGoals({
    gender: obInfo.gender,
    age: obInfo.age,
    height: obInfo.height,
    weight: obInfo.weight,
    activity: obPick.activity,
    goal: obPick.goal,
  });

  const name = obInfo.name.trim() || '피또 친구';
  const summaryRows = [
    { label: '건강 상태', values: obTags.health, empty: '해당사항 없음' },
    { label: '식단 취향', values: obTags.taste, empty: '가리지 않음' },
    { label: '제외 음식', values: obTags.avoid, empty: '없음' },
  ];

  return (
    <View>
      <View style={styles.greetRow}>
        <FittoCharacter current={4} goal={5} size={62} variant="face" glowSize={74} />
        <View style={styles.greetText}>
          <Text style={[styles.greetName, { color: colors.txt }]}>{name}님, 반가워요!</Text>
          <Text style={[styles.greetMeta, { color: colors.sub }]}>
            {[obPick.activity, obPick.goal].filter(Boolean).join(' · ')}
          </Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={[styles.card, { backgroundColor: colors.card2, borderColor: colors.stroke }]}>
          <Text style={[styles.cardLabel, { color: colors.sub }]}>목표 칼로리</Text>
          <Text style={[styles.cardValue, { color: colors.txt }]}>{result.kcal.toLocaleString()}</Text>
          <Text style={[styles.cardCaption, { color: colors.sub }]}>kcal · BMR {result.bmr.toLocaleString()}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card2, borderColor: colors.stroke }]}>
          <Text style={[styles.cardLabel, { color: colors.sub }]}>물 목표</Text>
          <Text style={[styles.cardValue, { color: colors.txt }]}>{result.water.toLocaleString()}</Text>
          <Text style={[styles.cardCaption, { color: colors.sub }]}>ml · 체중 기준</Text>
        </View>
      </View>

      <View style={[styles.summary, { backgroundColor: colors.card2 }]}>
        {summaryRows.map((row) => (
          <View key={row.label} style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.sub }]}>{row.label}</Text>
            <Text style={[styles.summaryValue, { color: colors.txt }]} numberOfLines={2}>
              {row.values.length ? row.values.join(', ') : row.empty}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.notice, { color: colors.sub }]}>
        이 정보를 반영한 추천 식단이 준비됐어요. 의료 진단을 대체하지 않습니다.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  greetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greetText: {
    flex: 1,
    gap: 3,
  },
  greetName: {
    fontSize: 14,
    fontWeight: '600',
  },
  greetMeta: {
    fontSize: 12,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 4,
  },
  cardLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 27,
    fontWeight: '700',
    letterSpacing: -1,
  },
  cardCaption: {
    fontSize: 10.5,
  },
  summary: {
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  summaryLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    width: 62,
  },
  summaryValue: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
  },
  notice: {
    fontSize: 11.5,
    lineHeight: 11.5 * 1.5,
    marginTop: 14,
  },
});
