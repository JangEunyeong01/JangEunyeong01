import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenBackground from '../../components/ScreenBackground';
import { useTheme } from '../../theme/useTheme';

interface PlaceholderScreenProps {
  title: string;
}

// 우선순위상 다음 단계에서 구현할 화면의 자리표시자.
export default function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScreenBackground>
      <Text style={[styles.title, typography.screenTitle, { color: colors.txt, paddingTop: insets.top + 16 }]}>{title}</Text>
      <Text style={[styles.sub, { color: colors.sub }]}>다음 단계에서 구현될 화면입니다.</Text>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 16,
  },
  sub: {
    paddingHorizontal: 16,
    marginTop: 8,
    fontSize: 13,
  },
});
