import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/useTheme';
import { useQuickLogSheetStore } from '../store/useQuickLogSheetStore';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../store/useToastStore';
import { dateKey } from '../utils/timeOfDay';
import { getWaterStageSpec } from '../utils/health';
import { waterStageNames } from '../copy/persona';
import { overlay, typography } from '../theme/tokens';
import { useFoodSearchStore } from '../store/useFoodSearchStore';

const ACTIONS = [
  { key: 'water', label: '물 +250ml', icon: '💧' },
  { key: 'meal', label: '음식 기록', icon: '🍽️' },
  { key: 'exercise', label: '운동 기록', icon: '🏃' },
  { key: 'weight', label: '체중 기록', icon: '⚖️' },
] as const;

// README: FAB 탭 → 빠른 기록 시트(물 +250ml / 음식 기록 / 운동 기록 / 체중 기록)
export default function QuickLogSheet() {
  const { open, hide } = useQuickLogSheetStore();
  const { colors, mode, radius, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const addWater = useAppStore((s) => s.addWater);
  const cup = useAppStore((s) => s.goals.cup);
  const goalWater = useAppStore((s) => s.goals.water);
  const today = useAppStore((s) => s.dailyRecords[dateKey()]?.water ?? 0);
  const showToast = useToastStore((s) => s.show);
  const openFoodSearch = useFoodSearchStore((s) => s.show);

  const handlePress = (key: (typeof ACTIONS)[number]['key']) => {
    if (key === 'water') {
      addWater(dateKey(), cup);
      const stage = getWaterStageSpec(today + cup, goalWater);
      showToast(`+${cup}ml · ${waterStageNames[stage.stage]}`);
      hide();
      return;
    }
    if (key === 'meal') {
      hide();
      openFoodSearch();
      return;
    }
    if (key === 'exercise') {
      hide();
      navigation.navigate('Health');
      return;
    }
    // 체중 기록은 프로필 화면을 만들 때 입력 폼으로 연결한다.
    showToast('다음 단계에서 구현될 기능이에요');
    hide();
  };

  if (!open) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={hide} />
      <View style={[styles.sheetWrap, { paddingBottom: insets.bottom + 16 }]}>
        <BlurView intensity={40} tint={mode === 'dark' ? 'dark' : 'light'} style={[styles.sheet, { borderTopLeftRadius: radius.sheetTop, borderTopRightRadius: radius.sheetTop }]}>
          <View style={[styles.sheetInner, { backgroundColor: colors.solid, paddingHorizontal: spacing.screenX }]}>
            <View style={[styles.grabber, { backgroundColor: colors.line }]} />
            <Text style={[styles.title, { color: colors.txt }]}>빠른 기록</Text>
            {ACTIONS.map((a) => (
              <Pressable key={a.key} onPress={() => handlePress(a.key)} style={({ pressed }) => [styles.row, { borderColor: colors.line, opacity: pressed ? 0.7 : 1 }]}>
                <Text style={styles.icon}>{a.icon}</Text>
                <Text style={[styles.rowLabel, { color: colors.txt }]}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 900,
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: overlay.sheetBackdrop,
  },
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    overflow: 'hidden',
  },
  sheetInner: {
    paddingTop: 10,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: 14,
  },
  title: {
    ...typography.sheetTitle,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    fontSize: 18,
  },
  rowLabel: typography.rowLabel,
});
