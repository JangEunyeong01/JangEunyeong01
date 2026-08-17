import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { useToastStore } from '../store/useToastStore';
import { motion, overlay, radius, spacing, white } from '../theme/tokens';

// README: left/right 16, bottom 88, padding 13/15, r16, 어두운 반투명+blur(10), 흰 글씨 12.5/700, fin, 1.9초 자동 소멸
export default function Toast() {
  const { message, seq } = useToastStore();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(motion.fadeInOffsetY)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [text, setText] = React.useState('');

  useEffect(() => {
    if (!message) return;
    setText(message);
    setVisible(true);
    opacity.setValue(0);
    translateY.setValue(motion.fadeInOffsetY);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motion.fadeIn,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motion.fadeIn,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: motion.fadeOut,
        useNativeDriver: false,
      }).start(() => setVisible(false));
    }, motion.toastVisible);

    return () => {
      if (timer.current) clearTimeout(timer.current);
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
    color: white,
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'center',
  },
});
