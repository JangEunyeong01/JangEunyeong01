import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../../components/GlassCard';
import { useTheme } from '../../../theme/useTheme';
import { periodBadgeGradient, white } from '../../../theme/tokens';

// 생리 주기 상세 화면은 다음 단계에서 구현 예정 — 카드는 예시 수치(3일차)를 보여준다.
export default function PeriodCard() {
  const { colors } = useTheme();

  return (
    <GlassCard>
      <View style={styles.row}>
        <LinearGradient
          colors={periodBadgeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badge}
        >
          <Text style={styles.badgeText}>D+3</Text>
        </LinearGradient>
        <View style={styles.textCol}>
          <Text style={[styles.title, { color: colors.txt }]}>생리 주기</Text>
          <Text style={[styles.sub, { color: colors.sub }]}>3일차 · 가임기까지 9일</Text>
        </View>
        <Text style={[styles.chevron, { color: colors.sub }]}>›</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: white,
    fontSize: 12,
    fontWeight: '700',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  sub: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    fontWeight: '400',
  },
});
