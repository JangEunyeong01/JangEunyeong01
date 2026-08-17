import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../../components/GlassCard';
import { useTheme } from '../../theme/useTheme';
import { alpha, brand } from '../../theme/tokens';
import { RECOMMENDED_MEALS, findAllergyHit } from '../../data/foods';
import { useAppStore } from '../../store/useAppStore';

/**
 * README: 퍼스널 추천 식단 카드. 배지는 온보딩에서 받은 못 먹는 음식 목록을 그대로 보여준다.
 * 썸네일은 대각 스트라이프 플레이스홀더 — 실제 음식 사진으로 교체 대상.
 */
export default function RecommendCard() {
  const { colors } = useTheme();
  const avoid = useAppStore((s) => s.profile.allergies);

  // 못 먹는 음식에 걸리는 항목은 추천에서 뺀다.
  const meals = RECOMMENDED_MEALS.filter((m) => !findAllergyHit(m, avoid));
  const badge = avoid.length > 0 ? `${avoid.join('·')} 제외` : '전체 추천';

  return (
    <GlassCard style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.txt }]}>퍼스널 추천 식단</Text>
        <View style={[styles.badge, { backgroundColor: alpha(brand.lavender, 0.28) }]}>
          <Text style={[styles.badgeText, { color: colors.txt }]} numberOfLines={1}>
            {badge}
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {meals.map((m) => (
          <View key={m.id} style={styles.row}>
            <View style={[styles.thumb, { backgroundColor: colors.ink, borderColor: colors.line }]}>
              <Text style={[styles.thumbMark, { color: colors.sub }]}>／／</Text>
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.name, { color: colors.txt }]}>{m.name}</Text>
              <Text style={[styles.amount, { color: colors.sub }]}>{m.amount}</Text>
            </View>
            <Text style={[styles.kcal, { color: colors.txt }]}>{m.kcal}</Text>
          </View>
        ))}
        {meals.length === 0 && (
          <Text style={[styles.empty, { color: colors.sub }]}>제외 조건에 맞는 추천이 아직 없어요.</Text>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 9,
    maxWidth: '55%',
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  list: {
    marginTop: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbMark: {
    fontSize: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
  },
  amount: {
    fontSize: 11,
  },
  kcal: {
    fontSize: 13,
    fontWeight: '700',
  },
  empty: {
    fontSize: 12,
  },
});
