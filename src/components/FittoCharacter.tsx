import React, { useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { FITTO_FACE, FITTO_HELLO } from '../theme/assets';
import { getWaterStageSpec } from '../utils/health';
import { brand, characterOverlay, motion } from '../theme/tokens';

interface FittoCharacterProps {
  current: number;
  goal: number;
  size?: number;
  variant?: 'full' | 'face';
  glow?: boolean;
  glowSize?: number;
}

// CSS filter(grayscale/saturate/brightness)는 RN Image에 직접 적용할 수 없어
// 반투명 오버레이로 근사한다. 최종 5단계 일러스트가 준비되면 이미지 스왑으로 교체 권장(README 참고).
export default function FittoCharacter({ current, goal, size = 78, variant = 'full', glow = true, glowSize }: FittoCharacterProps) {
  const spec = getWaterStageSpec(current, goal);
  const scale = useSharedValue(spec.scale);
  const floatY = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(spec.scale, { duration: motion.characterState, easing: Easing.out(Easing.ease) });
  }, [spec.scale]);

  useEffect(() => {
    cancelAnimation(floatY);
    if (spec.floatDurationMs) {
      floatY.value = withRepeat(
        withSequence(
          withTiming(motion.floatOffsetY, { duration: spec.floatDurationMs / 2, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: spec.floatDurationMs / 2, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    } else {
      floatY.value = withTiming(0, { duration: motion.characterFloatReset });
    }
  }, [spec.floatDurationMs]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { scale: scale.value }],
  }));

  const grayOverlayOpacity = spec.grayscale * 0.55;
  const vividOverlayOpacity = Math.max(0, spec.saturate - 1) * 0.28;
  const brightOverlayOpacity = Math.max(0, spec.brightness - 1) * 0.5;

  const source = variant === 'face' ? FITTO_FACE : FITTO_HELLO;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {glow && (
        <View
          style={[
            styles.glow,
            {
              width: glowSize ?? size + 28,
              height: glowSize ?? size + 28,
              borderRadius: (glowSize ?? size + 28) / 2,
              backgroundColor: brand.blue,
              opacity: 0.18,
            },
          ]}
        />
      )}
      <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
        <Image source={source} style={StyleSheet.absoluteFill} resizeMode="contain" />
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: characterOverlay.desaturate, opacity: grayOverlayOpacity, borderRadius: size / 2 }]}
        />
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: characterOverlay.vivid, opacity: vividOverlayOpacity, borderRadius: size / 2 }]}
        />
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: characterOverlay.brighten, opacity: brightOverlayOpacity, borderRadius: size / 2 }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
  },
});
