import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/useTheme';
import { timeSlots } from '../theme/tokens';
import { getTimeSlot } from '../utils/timeOfDay';

interface ScreenBackgroundProps {
  children?: React.ReactNode;
  showTimeGradient?: boolean;
}

function withAlpha(hex: string, alpha: number) {
  // hex는 항상 #RRGGBB 형태(timeSlots 값)
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}

// A안(기본): 높이 300, linear-gradient(180deg, C40% -> C13% 42% -> transparent)
export default function ScreenBackground({ children, showTimeGradient = true }: ScreenBackgroundProps) {
  const { colors } = useTheme();
  const slot = getTimeSlot();
  const color = timeSlots[slot].color;

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {showTimeGradient && (
        <LinearGradient
          pointerEvents="none"
          colors={[withAlpha(color, 0.4), withAlpha(color, 0.13), withAlpha(color, 0)]}
          locations={[0, 0.42, 1]}
          style={styles.headerGradient}
        />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
});
