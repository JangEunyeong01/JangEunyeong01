import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/useTheme';
import { accentGradient } from '../../theme/tokens';

interface ProgressDotsProps {
  total: number;
  current: number; // 0-indexed
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) =>
        i <= current ? (
          <LinearGradient key={i} colors={accentGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.segment} />
        ) : (
          <View key={i} style={[styles.segment, { backgroundColor: colors.ink }]} />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 3,
  },
});
