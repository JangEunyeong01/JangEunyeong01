import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore } from '../store/useToastStore';
import { motion, overlay, radius, spacing, white } from '../theme/tokens';

// README: left/right 16, bottom 88, padding 13/15, r16, 어두운 반투명+blur(10), 흰 글씨 12.5/700, fin, 1.9초 자동 소멸
export default function Toast() {
  const { message, seq } = useToastStore();
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [text, setText] = React.useState('');

  useEffect(() => {
    if (!message) return;
    setText(message);
    setVisible(true);
    opacity.value = 0;
    translateY.value = motion.fadeInOffsetY;
    opacity.value = withTiming(1, { duration: motion.fadeIn, easing: Easing.out(Easing.ease) });
    translateY.value = withTiming(0, { duration: motion.fadeIn, easing: Easing.out(Easing.ease) });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      opacity.value = withTiming(0, { duration: motion.fadeOut });
      setTimeout(() => setVisible(false), motion.fadeOut);
    }, motion.toastVisible);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [seq]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { bottom: 88 + (insets.bottom > 0 ? 0 : 0) }, animatedStyle]}>
      <BlurView intensity={20} tint="dark" style={styles.blur}>
        <Text style={styles.text}>{text}</Text>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.screenX,
    right: spacing.screenX,
    zIndex: 999,
    alignItems: 'center',
  },
  blur: {
    backgroundColor: overlay.toastBg,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: radius.blockMid,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  text: {
    color: white,
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'center',
  },
});
