import React, { useEffect, useRef } from 'react';
import { Image, View, StyleSheet, Animated, Easing } from 'react-native';
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
  const scale = useRef(new Animated.Value(spec.scale)).current;
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: spec.scale,
      duration: motion.characterState,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [spec.scale]);

  useEffect(() => {
    if (!spec.floatDurationMs) {
      Animated.timing(floatY, {
        toValue: 0,
        duration: motion.characterFloatReset,
        useNativeDriver: false,
      }).start();
      return;
    }
    const half = spec.floatDurationMs / 2;
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
  }, [spec.floatDurationMs]);

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
      <Animated.View
        style={[
          styles.stage,
          { width: size, height: size, transform: [{ translateY: floatY }, { scale }] },
        ]}
      >
        {/* absoluteFill에는 width/height가 없어 웹에서 Image가 원본 크기(578x731)로 삐져나온다.
            크기를 명시해 컨테이너에 맞춘다. */}
        <Image source={source} style={styles.fill} resizeMode="contain" />
        <View
          pointerEvents="none"
          style={[styles.fill, { backgroundColor: characterOverlay.desaturate, opacity: grayOverlayOpacity, borderRadius: size / 2 }]}
        />
        <View
          pointerEvents="none"
          style={[styles.fill, { backgroundColor: characterOverlay.vivid, opacity: vividOverlayOpacity, borderRadius: size / 2 }]}
        />
        <View
          pointerEvents="none"
          style={[styles.fill, { backgroundColor: characterOverlay.brighten, opacity: brightOverlayOpacity, borderRadius: size / 2 }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
  },
  stage: {
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
