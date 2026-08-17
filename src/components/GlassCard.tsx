import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/useTheme';

interface GlassCardProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  variant?: 'card' | 'card2' | 'solid';
  intensity?: number; // README: 카드 blur(20px), 탭바 blur(24px)
  noPadding?: boolean;
  /** 2열로 나란히 놓일 때 같은 행 카드끼리 높이를 맞추기 위해 세로로 늘린다. */
  fill?: boolean;
}

export default function GlassCard({ children, style, radius, variant = 'card', intensity = 30, noPadding, fill }: GlassCardProps) {
  const { colors, shadow, radius: radiusTokens, spacing, mode } = useTheme();
  const r = radius ?? radiusTokens.cardBig;
  const bg = variant === 'solid' ? colors.solid : variant === 'card2' ? colors.card2 : colors.card;

  return (
    <View style={[{ borderRadius: r }, shadow, fill && styles.fill, style]}>
      <BlurView
        intensity={intensity}
        tint={mode === 'dark' ? 'dark' : 'light'}
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        style={[
          styles.blur,
          fill && styles.fill,
          { borderRadius: r, borderColor: colors.stroke },
        ]}
      >
        <View
          style={[
            { backgroundColor: bg, padding: noPadding ? 0 : spacing.cardPadding },
            styles.inner,
          ]}
        >
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  blur: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  inner: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
});
