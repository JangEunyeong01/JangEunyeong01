import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/useTheme';
import { alpha, timeSlots } from '../theme/tokens';
import { getTimeSlot } from '../utils/timeOfDay';

interface ScreenBackgroundProps {
  children?: React.ReactNode;
  showTimeGradient?: boolean;
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
          colors={[alpha(color, 0.4), alpha(color, 0.13), alpha(color, 0)]}
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
