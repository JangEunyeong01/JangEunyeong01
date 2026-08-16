import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../theme/useTheme';

interface OptionRowProps {
  title: string;
  desc?: string;
  selected: boolean;
  onPress: () => void;
}

// README: 선택 옵션 행 — 패딩 15/16, r18, 글래스. 선택 시 테두리 blue.9, 배경 blue.16,
// 그림자 blue.24, 우측 20px 원형 마커가 6px solid blue 링으로 채워짐.
export default function OptionRow({ title, desc, selected, onPress }: OptionRowProps) {
  const { colors, mode } = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View
        style={[
          styles.shadowWrap,
          selected && { shadowColor: 'rgba(137,196,225,.24)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 18, elevation: 4 },
        ]}
      >
        <BlurView intensity={25} tint={mode === 'dark' ? 'dark' : 'light'} style={[styles.blur, { borderColor: selected ? 'rgba(137,196,225,.9)' : colors.stroke }]}>
          <View
            style={[
              styles.inner,
              { backgroundColor: selected ? 'rgba(137,196,225,.16)' : colors.card },
            ]}
          >
            <View style={styles.textCol}>
              <Text style={[styles.title, { color: colors.txt }]}>{title}</Text>
              {!!desc && <Text style={[styles.desc, { color: colors.sub }]}>{desc}</Text>}
            </View>
            <View style={[styles.marker, { borderColor: selected ? '#89C4E1' : colors.line }]}>
              {selected && <View style={styles.markerFill} />}
            </View>
          </View>
        </BlurView>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 10,
  },
  shadowWrap: {
    borderRadius: 18,
  },
  blur: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  textCol: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  desc: {
    fontSize: 12,
    fontWeight: '500',
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerFill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: '#89C4E1',
  },
});
