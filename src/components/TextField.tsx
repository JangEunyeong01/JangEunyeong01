import React from 'react';
import { TextInput, StyleSheet, StyleProp, TextStyle, TextInputProps } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { typography } from '../theme/tokens';

type FieldSize = 'md' | 'sm';

interface TextFieldProps extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  /** md: 화면에 바로 놓이는 폼 입력, sm: 카드·시트 안에 끼워 넣는 좁은 입력. */
  size?: FieldSize;
  center?: boolean;
  /**
   * 카드 안이 아니라 배경 그라데이션 위에 바로 놓일 때(온보딩, 레시피 이름).
   * 이때만 유리 표면(card/stroke)을 쓴다 — 카드 위에서 이 색을 쓰면 카드와
   * 같은 흰색이라 입력창이 통째로 사라진다.
   */
  onBackground?: boolean;
  style?: StyleProp<TextStyle>;
}

/**
 * 앱의 모든 텍스트 입력. 원래 화면마다 높이(50/46/44/42)와 라운드(15/13)가 제각각이었고,
 * 카드 안에서도 유리 색을 그대로 써서 테두리가 안 보이는 화면이 있었다.
 * placeholder 색과 테마 색은 여기서 붙이므로 호출부에서 넘기지 않는다.
 */
export default function TextField({ size = 'md', center, onBackground, style, ...rest }: TextFieldProps) {
  const { colors } = useTheme();

  return (
    <TextInput
      placeholderTextColor={colors.sub}
      style={[
        styles.base,
        sizeStyles[size],
        center && styles.center,
        {
          backgroundColor: onBackground ? colors.card : colors.ink,
          borderColor: onBackground ? colors.stroke : colors.line,
          color: colors.txt,
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    ...typography.input,
    borderWidth: 1,
    // 웹에서 input은 min-width가 auto라 flex:1을 줘도 기본 너비 밑으로 안 줄어든다.
    // 생일 월/일이나 레시피 탄단지처럼 한 줄에 여러 개 놓으면 부모를 넘어간다.
    minWidth: 0,
  },
  center: {
    textAlign: 'center',
  },
});

const sizeStyles = StyleSheet.create({
  md: {
    height: 46,
    borderRadius: 15,
    paddingHorizontal: 14,
  },
  sm: {
    height: 42,
    borderRadius: 13,
    paddingHorizontal: 12,
  },
});
