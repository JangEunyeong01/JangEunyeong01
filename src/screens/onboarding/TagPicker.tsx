import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/useTheme';
import { alpha, brand, radius, selection } from '../../theme/tokens';
import { useToastStore } from '../../store/useToastStore';

interface TagPickerProps {
  tags: string[];
  selected: string[];
  /** 최신 상태 기준으로 토글하도록 값 하나만 넘긴다(연속 선택 시 덮어쓰기 방지). */
  onToggle: (value: string) => void;
  onClear: () => void;
  placeholder: string;
  noneLabel: string;
}

/**
 * README "태그 + 직접 입력 단계 구조" (건강 상태·식단 취향·못 먹는 음식 공통).
 * 2열 태그 그리드 → 직접 입력 + 추가 → 선택 칩(× 제거) → 없음 링크.
 * 직접 입력한 값도 선택 칩으로 들어가고 그대로 저장된다.
 */
export default function TagPicker({ tags, selected, onToggle, onClear, placeholder, noneLabel }: TagPickerProps) {
  const { colors, mode } = useTheme();
  const showToast = useToastStore((s) => s.show);
  const [draft, setDraft] = useState('');

  const addCustom = () => {
    const value = draft.trim();
    if (!value) {
      showToast('내용을 입력해 주세요');
      return;
    }
    if (selected.includes(value)) {
      showToast('이미 선택했어요');
      return;
    }
    onToggle(value);
    setDraft('');
  };

  return (
    <View>
      <View style={styles.grid}>
        {tags.map((tag) => {
          const on = selected.includes(tag);
          return (
            <Pressable key={tag} onPress={() => onToggle(tag)} style={styles.gridSlot}>
              <View style={[on && styles.tagShadow]}>
                <BlurView
                  intensity={20}
                  tint={mode === 'dark' ? 'dark' : 'light'}
                  experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
                  style={[styles.tag, { borderColor: on ? selection.border : colors.stroke }]}
                >
                  <View style={[styles.tagInner, { backgroundColor: on ? selection.bg : colors.card }]}>
                    <Text style={[styles.tagText, { color: colors.txt, fontWeight: on ? '700' : '500' }]} numberOfLines={1}>
                      {tag}
                    </Text>
                  </View>
                </BlurView>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.sectionLabel, { color: colors.sub }]}>직접 입력</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={addCustom}
          placeholder={placeholder}
          placeholderTextColor={colors.sub}
          returnKeyType="done"
          style={[styles.input, { borderColor: colors.stroke, backgroundColor: colors.card, color: colors.txt }]}
        />
        <Pressable onPress={addCustom}>
          <LinearGradient
            colors={[brand.mint, brand.blue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addBtn}
          >
            <Text style={styles.addLabel}>추가</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {selected.length > 0 && (
        <>
          <Text style={[styles.sectionLabel, { color: colors.sub }]}>선택된 항목</Text>
          <View style={styles.chipWrap}>
            {selected.map((item) => (
              <Pressable
                key={item}
                onPress={() => onToggle(item)}
                style={[styles.chip, { backgroundColor: selection.bg, borderColor: alpha(brand.blue, 0.7) }]}
              >
                <Text style={[styles.chipText, { color: colors.txt }]}>{item}</Text>
                <Text style={[styles.chipX, { color: colors.sub }]}>×</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      <Pressable onPress={onClear} style={styles.noneWrap}>
        <Text style={[styles.noneText, { color: colors.sub }]}>{noneLabel}</Text>
      </Pressable>
    </View>
  );
}

const GAP = 9;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -GAP / 2,
  },
  gridSlot: {
    width: '50%',
    paddingHorizontal: GAP / 2,
    paddingBottom: GAP,
  },
  tagShadow: {
    shadowColor: alpha(brand.blue, 0.22),
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 3,
    borderRadius: 15,
  },
  tag: {
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tagInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  tagText: {
    fontSize: 13.5,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 13.5,
  },
  addBtn: {
    width: 66,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: {
    color: '#fff',
    fontSize: 13.5,
    fontWeight: '700',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    height: 34,
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  chipX: {
    fontSize: 14,
  },
  noneWrap: {
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  noneText: {
    fontSize: 12.5,
    textDecorationLine: 'underline',
  },
});
