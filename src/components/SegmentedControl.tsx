import React from 'react';
import { View, StyleSheet } from 'react-native';
import SelectChip from './SelectChip';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

// 성격 3택·화면 모드 3택처럼 값 하나만 고르는 짧은 세그먼트 선택기.
// 온보딩의 OptionRow(세로로 쌓이고 설명이 붙는 형태)와 달리 가로 한 줄짜리라 따로 만든다.
export default function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <View style={styles.row}>
      {options.map((opt) => (
        <SelectChip
          key={opt.value}
          label={opt.label}
          selected={opt.value === value}
          onPress={() => onChange(opt.value)}
          size="lg"
          fill
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
