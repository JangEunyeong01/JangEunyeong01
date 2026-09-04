import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, Animated, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { useToastStore } from '../store/useToastStore';
import { motion, overlay, radius, spacing, typography, white } from '../theme/tokens';

// README: left/right 16, bottom 88, padding 13/15, r16, 어두운 반투명+blur(10), 흰 글씨 12.5/700, fin, 1.9초 자동 소멸
export default function Toast() {
  const { message, seq } = useToastStore();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(motion.fadeInOffsetY)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!message) return;

    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);

    setText(message);
    setVisible(true);
    opacity.setValue(0);
    translateY.setValue(motion.fadeInOffsetY);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motion.fadeIn,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motion.fadeIn,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // 사라지는 건 타이머로 확정한다. 애니메이션 완료 콜백에 맡기면
    // 앱이 백그라운드로 가서 rAF가 멈췄을 때 토스트가 화면에 그대로 남는다.
    fadeTimer.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: motion.fadeOut,
        useNativeDriver: true,
      }).start();
    }, motion.toastVisible);

    hideTimer.current = setTimeout(() => setVisible(false), motion.toastVisible + motion.fadeOut);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, [seq]);

  if (!visible) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { opacity, transform: [{ translateY }] }]}>
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
    bottom: 88,
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
    ...typography.value,
    color: white,
    textAlign: 'center',
  },
});
