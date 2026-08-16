import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { personaCopy } from '../../copy/persona';
import { useToastStore } from '../../store/useToastStore';

// README: 운동 기록 3일 공백 시 자동 노출(여기서는 오늘 운동 기록 없음으로 근사).
export default function LayDownBanner() {
  const { colors } = useTheme();
  const persona = useAppStore((s) => s.persona);
  const showToast = useToastStore((s) => s.show);

  const title = personaCopy.layDownTitle[persona]();
  const body = personaCopy.layDownBody[persona]();

  return (
    <Pressable onPress={() => showToast(body)} style={[styles.wrap, { borderColor: colors.line }]}>
      <Text style={[styles.title, { color: colors.txt }]}>{title}</Text>
      <Text style={[styles.body, { color: colors.sub }]} numberOfLines={2}>
        {body}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 18,
    padding: 14,
    marginTop: 4,
    gap: 4,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  body: {
    fontSize: 11.5,
    fontWeight: '500',
  },
});
