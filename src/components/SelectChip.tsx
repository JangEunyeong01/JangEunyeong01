import React from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { radius, selection, typography } from '../theme/tokens';

type ChipSize = 'sm' | 'md' | 'lg';

interface SelectChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** sm: 알림 간격 칩, md: 일반 칩, lg: 컨디션 3택처럼 높이가 있는 칩. */
  size?: ChipSize;
  /** 가로를 균등 분할해야 하는 자리(기간 칩, 컨디션 3택)에서 쓴다. */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * 선택 상태를 색으로 보여주는 칩. 알림 간격·컨디션·증상·컵 용량·기간 프리셋·재료 선택이
 * 전부 같은 모양이었는데 화면마다 따로 만들어 미묘하게 달랐다.
 */
export default function SelectChip({ label, selected, onPress, size = 'md', fill, style }: SelectChipProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        sizeStyles[size],
        fill && styles.fill,
        {
          backgroundColor: selected ? selection.bg : colors.card2,
          borderColor: selected ? selection.border : colors.line,
        },
        style,
      ]}
    >
      <Text
        style={[
          size === 'sm' ? typography.label : typography.value,
          { color: colors.txt, fontWeight: selected ? '700' : '500' },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.chip,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  lg: {
    height: 42,
    paddingHorizontal: 12,
  },
});
