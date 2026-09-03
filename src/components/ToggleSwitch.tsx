import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface ToggleSwitchProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

const WIDTH = 50;
const HEIGHT = 30;
const THUMB = 24;
const PAD = 3;

// README: 스위치 50×30. 생리 주기 기능(설정), 알림 5종 전부 이 컴포넌트를 공유한다.
export default function ToggleSwitch({ value, onChange }: ToggleSwitchProps) {
  const { colors, brand } = useTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false, // backgroundColor/translateX 보간이라 네이티브 드라이버 불가
    }).start();
  }, [value]);

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.ink, brand.blue],
  });
  const thumbX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [PAD, WIDTH - THUMB - PAD],
  });

  return (
    <Pressable onPress={() => onChange(!value)} hitSlop={6}>
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
