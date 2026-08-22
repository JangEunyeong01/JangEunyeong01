import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import GlassCard from '../../components/GlassCard';
import PrimaryButton from '../../components/PrimaryButton';
import { useTheme } from '../../theme/useTheme';
import { selection, radius } from '../../theme/tokens';

const PRESETS = [100, 200, 250, 330, 500];

interface CupSizeFieldProps {
  value: number;
  onChange: (ml: number) => void;
}

// README: 컵 100/200/250/330/500ml 칩 + 직접 입력.
export default function CupSizeField({ value, onChange }: CupSizeFieldProps) {
  const { colors } = useTheme();
  const isCustom = !PRESETS.includes(value);
  const [showCustom, setShowCustom] = useState(isCustom);
  const [draft, setDraft] = useState(isCustom ? String(value) : '');

  const commitCustom = () => {
    const n = parseInt(draft.replace(/[^0-9]/g, ''), 10);
    if (Number.isFinite(n) && n > 0) onChange(Math.min(2000, n));
  };

  return (
    <GlassCard style={styles.card}>
      <Text style={[styles.title, { color: colors.txt }]}>1회 컵 용량</Text>
      <View style={styles.chipRow}>
        {PRESETS.map((size) => {
          const on = !showCustom && value === size;
          return (
            <Pressable
              key={size}
              onPress={() => {
                setShowCustom(false);
                onChange(size);
              }}
              style={[
                styles.chip,
                { backgroundColor: on ? selection.bg : colors.card2, borderColor: on ? selection.border : colors.line },
              ]}
            >
              <Text style={[styles.chipLabel, { color: colors.txt, fontWeight: on ? '700' : '500' }]}>{size}ml</Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={() => setShowCustom(true)}
          style={[
            styles.chip,
            { backgroundColor: showCustom ? selection.bg : colors.card2, borderColor: showCustom ? selection.border : colors.line },
          ]}
        >
          <Text style={[styles.chipLabel, { color: colors.txt, fontWeight: showCustom ? '700' : '500' }]}>직접 입력</Text>
        </Pressable>
      </View>

      {showCustom && (
        <View style={styles.customRow}>
          <TextInput
            value={draft}
            onChangeText={(t) => setDraft(t.replace(/[^0-9]/g, ''))}
            placeholder={`현재 ${value}ml`}
            placeholderTextColor={colors.sub}
            keyboardType="numeric"
            style={[styles.input, { borderColor: colors.stroke, backgroundColor: colors.card, color: colors.txt }]}
          />
          <PrimaryButton small label="설정" onPress={commitCustom} style={styles.setBtn} />
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.chip,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 12.5,
  },
  customRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  setBtn: {
    width: 72,
  },
});
