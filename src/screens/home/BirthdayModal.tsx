import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/useTheme';
import { birthday, brand, motion, radius, white } from '../../theme/tokens';
import { personaCopy } from '../../copy/persona';
import { useAppStore } from '../../store/useAppStore';
import { FITTO_HELLO } from '../../theme/assets';

interface BirthdayModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BirthdayModal({ visible, onClose }: BirthdayModalProps) {
  const { colors } = useTheme();
  const persona = useAppStore((s) => s.persona);
  const name = useAppStore((s) => s.profile.nickname);

  const floatY = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    enter.setValue(0);
    Animated.timing(enter, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    const half = birthday.floatDuration / 2;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: motion.floatOffsetY,
          duration: half,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: half,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [visible]);

  if (!visible) return null;

  const message = personaCopy.birthdayMessage[persona]({ name });
  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [motion.fadeInOffsetY, 0] });

  return (
    <View style={styles.overlay}>
      <Pressable style={[styles.backdrop, { backgroundColor: birthday.modalBackdrop }]} onPress={onClose} />
      <View style={styles.center} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.solid,
              borderColor: colors.stroke,
              shadowColor: birthday.modalShadow,
              opacity: enter,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* 프로토타입의 radial-gradient 장식. RN에는 라디얼이 없어 흐린 원으로 근사한다. */}
          <View style={[styles.glowLeft, { backgroundColor: birthday.glowLavender }]} />
          <View style={[styles.glowRight, { backgroundColor: birthday.glowPeach }]} />

          <Text style={[styles.label, { color: brand.lavender }]}>HAPPY BIRTHDAY</Text>

          <Animated.View style={[styles.charWrap, { transform: [{ translateY: floatY }] }]}>
            <Image source={FITTO_HELLO} style={styles.char} resizeMode="contain" accessibilityLabel="축하하는 피또" />
          </Animated.View>

          <Text style={[styles.message, { color: colors.txt }]}>{message}</Text>

          <Pressable onPress={onClose} style={styles.confirmWrap}>
            <LinearGradient
              colors={birthday.confirmGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.confirm}
            >
              <Text style={styles.confirmLabel}>고마워, 피또</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 950,
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: radius.sheetTop,
    paddingTop: 26,
    paddingHorizontal: 22,
    paddingBottom: 22,
    alignItems: 'center',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 12,
  },
  glowLeft: {
    position: 'absolute',
    left: -40,
    top: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.55,
  },
  glowRight: {
    position: 'absolute',
    right: -50,
    top: -30,
    width: 170,
    height: 170,
    borderRadius: 85,
    opacity: 0.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  charWrap: {
    marginTop: 10,
    width: 128,
    height: 128,
  },
  char: {
    width: '100%',
    height: '100%',
  },
  message: {
    fontSize: 12.5,
    lineHeight: 12.5 * 1.65,
    marginTop: 12,
    textAlign: 'center',
  },
  confirmWrap: {
    width: '100%',
    marginTop: 18,
  },
  confirm: {
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLabel: {
    color: white,
    fontSize: 13.5,
    fontWeight: '700',
  },
});
