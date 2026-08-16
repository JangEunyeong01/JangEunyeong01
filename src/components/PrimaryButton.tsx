import React from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/useTheme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  small?: boolean;
  loading?: boolean;
}

export default function PrimaryButton({ label, onPress, style, disabled, small, loading }: PrimaryButtonProps) {
  const { primaryGradient, primaryButtonShadow, primaryButtonShadowSmall, radius, minTouchTarget } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          height: small ? 42 : Math.max(minTouchTarget, 52),
          borderRadius: radius.button,
          shadowColor: small ? primaryButtonShadowSmall : primaryButtonShadow,
          shadowOffset: { width: 0, height: small ? 6 : 8 },
          shadowOpacity: 1,
          shadowRadius: small ? 14 : 20,
          elevation: 5,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: radius.button }]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.label, { fontSize: small ? 13 : 15 }]}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontWeight: '700',
  },
});
