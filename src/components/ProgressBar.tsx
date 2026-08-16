import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/useTheme';

interface ProgressBarProps {
  progress: number; // 0..1
  height?: number;
  radius?: number;
  gradientColors?: readonly [string, string, ...string[]];
  color?: string;
}

export default function ProgressBar({ progress, height = 9, radius = 6, gradientColors, color }: ProgressBarProps) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(1, progress));
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(clamped, { duration: 500, easing: Easing.bezier(0.2, 0.9, 0.3, 1) });
  }, [clamped]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={[styles.track, { height, borderRadius: radius, backgroundColor: colors.ink }]}>
      <Animated.View style={[styles.fill, { borderRadius: radius }, animatedStyle]}>
        {gradientColors ? (
          <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: color ?? colors.txt }]} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    overflow: 'hidden',
  },
});
