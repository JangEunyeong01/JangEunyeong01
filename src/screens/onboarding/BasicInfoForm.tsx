import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { selection } from '../../theme/tokens';
import { GENDERS } from './onboardingData';
import type { ObInfo } from '../../store/useAppStore';

interface BasicInfoFormProps {
  value: ObInfo;
  onChange: (patch: Partial<ObInfo>) => void;
}

// README 2단계: 이름(50px) / 성별 3분할(46px) / 나이·키·몸무게 3열 숫자 입력.
export default function BasicInfoForm({ value, onChange }: BasicInfoFormProps) {
  const { colors } = useTheme();

  const inputStyle = [
    styles.input,
    { borderColor: colors.stroke, backgroundColor: colors.card, color: colors.txt },
  ];

  return (
    <View>
      <TextInput
        value={value.name}
        onChangeText={(t) => onChange({ name: t })}
        placeholder="피또가 부를 이름"
        placeholderTextColor={colors.sub}
        style={[inputStyle, styles.nameInput]}
      />

      <View style={styles.genderRow}>
        {GENDERS.map((g) => {
          const on = value.gender === g;
          return (
            <Pressable
              key={g}
              onPress={() => onChange({ gender: g })}
              style={[
                styles.genderBtn,
                {
                  borderColor: on ? selection.border : colors.stroke,
                  backgroundColor: on ? selection.bg : colors.card,
                },
              ]}
            >
              <Text style={[styles.genderText, { color: colors.txt, fontWeight: on ? '700' : '500' }]}>{g}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.numRow}>
        <NumField label="나이" value={value.age} onChangeText={(t) => onChange({ age: t })} colors={colors} />
        <NumField label="키 (cm)" value={value.height} onChangeText={(t) => onChange({ height: t })} colors={colors} />
        <NumField label="몸무게 (kg)" value={value.weight} onChangeText={(t) => onChange({ weight: t })} colors={colors} />
      </View>

      <Text style={[styles.notice, { color: colors.sub }]}>
        입력한 정보는 기기에만 저장되고 언제든 프로필에서 수정할 수 있어요.
      </Text>
    </View>
  );
}

function NumField({
  label,
  value,
  onChangeText,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  colors: any;
}) {
  return (
    <View style={styles.numCol}>
      <Text style={[styles.numLabel, { color: colors.sub }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/[^0-9.]/g, ''))}
        keyboardType="numeric"
        style={[styles.input, styles.numInput, { borderColor: colors.stroke, backgroundColor: colors.card, color: colors.txt }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  nameInput: {
    height: 50,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  genderBtn: {
    flex: 1,
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: {
    fontSize: 13.5,
  },
  numRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  numCol: {
    flex: 1,
    gap: 6,
  },
  numLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  numInput: {
    height: 46,
    textAlign: 'center',
  },
  notice: {
    fontSize: 11.5,
    lineHeight: 11.5 * 1.5,
    marginTop: 14,
  },
});
