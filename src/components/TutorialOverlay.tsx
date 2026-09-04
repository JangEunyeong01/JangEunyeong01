import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { alpha, brand, radius, white } from '../theme/tokens';
import { useTutorialStore, TUTORIAL_STEPS } from '../store/useTutorialStore';

const DIM = 'rgba(16,26,36,0.62)';
const TOOLTIP_BG = 'rgba(22,32,42,0.92)';
const TOOLTIP_GAP = 12;

// README 12장: 딤 + 대상 카드 하이라이트 프레임(fpulse) + 아래 어두운 툴팁 카드.
export default function TutorialOverlay() {
  const { open, step, targets, next, close } = useTutorialStore();
  const { height: screenH } = useWindowDimensions();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!open) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [open]);

  if (!open) return null;

  const current = TUTORIAL_STEPS[step];
  const rect = targets[current.target];
  const isLast = step === TUTORIAL_STEPS.length - 1;

  // 대상 아래에 툴팁을 두되, 화면 아래로 넘치면 대상 위로 올린다.
  const tooltipTop = rect ? rect.y + rect.height + TOOLTIP_GAP : screenH / 2;
  const flipAbove = rect ? tooltipTop > screenH - 200 : false;

  const frameOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  return (
    <View style={styles.overlay}>
      {/* 딤은 탭을 먹어서 뒤 화면이 눌리지 않게 한다. */}
      <Pressable style={[styles.dim, { backgroundColor: DIM }]} onPress={() => {}} />

      {rect && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.frame,
            {
              left: rect.x - 4,
              top: rect.y - 4,
              width: rect.width + 8,
              height: rect.height + 8,
              opacity: frameOpacity,
            },
          ]}
        />
      )}

      <View
        style={[
          styles.tooltipWrap,
          rect
            ? flipAbove
              ? { bottom: screenH - rect.y + TOOLTIP_GAP }
              : { top: tooltipTop }
            : { top: screenH / 2 },
        ]}
      >
        <BlurView intensity={20} tint="dark" style={styles.tooltip}>
          <View style={styles.tooltipInner}>
            <Text style={styles.stepCount}>
              {step + 1} / {TUTORIAL_STEPS.length}
            </Text>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.body}>{current.body}</Text>

            <View style={styles.buttonRow}>
              <Pressable onPress={close} style={styles.skipBtn}>
                <Text style={styles.skipLabel}>건너뛰기</Text>
              </Pressable>
              <Pressable onPress={next} style={[styles.nextBtn, { backgroundColor: brand.blue }]}>
                <Text style={styles.nextLabel}>{isLast ? '완료' : '다음'}</Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
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
    zIndex: 960,
  },
  dim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  frame: {
    position: 'absolute',
    borderRadius: radius.sheetTop,
    borderWidth: 2,
    borderColor: alpha(brand.blue, 0.85),
    backgroundColor: alpha(brand.blue, 0.1),
  },
  tooltipWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  tooltip: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  tooltipInner: {
    backgroundColor: TOOLTIP_BG,
    padding: 18,
  },
  stepCount: {
    color: alpha(white, 0.6),
    fontSize: 10.5,
    fontWeight: '700',
  },
  title: {
    color: white,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  body: {
    color: alpha(white, 0.78),
    fontSize: 12.5,
    lineHeight: 12.5 * 1.55,
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  skipBtn: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipLabel: {
    color: alpha(white, 0.7),
    fontSize: 12.5,
    fontWeight: '600',
  },
  nextBtn: {
    height: 38,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextLabel: {
    color: white,
    fontSize: 13,
    fontWeight: '700',
  },
});
