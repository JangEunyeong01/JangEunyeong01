import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { selection, radius, typography } from '../theme/tokens';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

// 성격 3택·화면 모드 3택처럼 값 하나만 고르는 짧은 세그먼트 선택기.
// 온보딩의 OptionRow(세로로 쌓이고 설명이 붙는 형태)와 달리 가로 한 줄짜리라 따로 만든다.
export default function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.seg,
              { backgroundColor: on ? selection.bg : colors.card2, borderColor: on ? selection.border : colors.line },
            ]}
          >
            <Text style={[styles.label, { color: colors.txt, fontWeight: on ? '700' : '500' }]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  seg: {
    flex: 1,
    height: 40,
    borderRadius: radius.chip,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.value.fontSize,
  },
});
