import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import GlassCard from '../../../components/GlassCard';
import { useTheme } from '../../../theme/useTheme';
import { periodBadgeGradient, white } from '../../../theme/tokens';
import { useAppStore } from '../../../store/useAppStore';
import { dateKey } from '../../../utils/timeOfDay';
import { getCycleDayNumber, getDaysUntilFertile } from '../../../utils/periodCycle';

export default function PeriodCard() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const settings = useAppStore((s) => s.periodSettings);

  const today = dateKey();
  const cycleDay = getCycleDayNumber(today, settings);
  const untilFertile = getDaysUntilFertile(today, settings);
  const subtitle = untilFertile === 0 ? `${cycleDay}일차 · 가임기` : `${cycleDay}일차 · 가임기까지 ${untilFertile}일`;

  return (
    <Pressable onPress={() => navigation.navigate('PeriodDetail')}>
      <GlassCard>
        <View style={styles.row}>
          <LinearGradient
            colors={periodBadgeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>D+{cycleDay - 1}</Text>
          </LinearGradient>
          <View style={styles.textCol}>
            <Text style={[styles.title, { color: colors.txt }]}>생리 주기</Text>
            <Text style={[styles.sub, { color: colors.sub }]}>{subtitle}</Text>
          </View>
          <Text style={[styles.chevron, { color: colors.sub }]}>›</Text>
        </View>
      </GlassCard>
    </Pressable>
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
