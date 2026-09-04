import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenBackground from '../../components/ScreenBackground';
import FittoCharacter from '../../components/FittoCharacter';
import PrimaryButton from '../../components/PrimaryButton';
import OptionRow from './OptionRow';
import ProgressDots from './ProgressDots';
import TagPicker from './TagPicker';
import BasicInfoForm from './BasicInfoForm';
import CompleteStep from './CompleteStep';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { useToastStore } from '../../store/useToastStore';
import { INPUT_LIMITS } from '../../utils/goals';
import {
  ACTIVITY_OPTIONS,
  AVOID_TAGS,
  GOAL_OPTIONS,
  HEALTH_TAGS,
  PERSONA_OPTIONS,
  STEP_LABELS,
  TASTE_TAGS,
  TOTAL_STEPS,
} from './onboardingData';

const TITLES = [
  '물방울 요정 피또와\n오늘도 또, 건강하게',
  '먼저 간단히 알려주세요',
  '평소 활동량은 어느 정도인가요?',
  '어떤 목표로 시작할까요?',
  '건강 상태를 알려주세요',
  '어떤 음식을 즐겨 드세요?',
  '알레르기가 있거나\n못 먹는 음식이 있나요?',
  '피또는 어떤 말투가 좋을까요?',
  '준비 완료!',
];

const DESCRIPTIONS: (string | null)[] = [
  '숫자 대신 표정으로 건강을 알려주는 앱이에요.',
  null,
  null,
  null,
  '해당되는 질환을 선택하거나 입력해주세요',
  '추천 식단에 반영해요. 복수 선택 가능해요.',
  '추천과 검색에서 자동으로 걸러드려요.',
  null,
  null,
];

/** 범위를 벗어난 첫 항목의 안내 문구를 돌려준다. 다 정상이면 null. */
function checkRange(info: { age: string; height: string; weight: string }): string | null {
  const checks: { value: string; limit: { min: number; max: number }; label: string; unit: string }[] = [
    { value: info.age, limit: INPUT_LIMITS.age, label: '나이', unit: '세' },
    { value: info.height, limit: INPUT_LIMITS.height, label: '키', unit: 'cm' },
    { value: info.weight, limit: INPUT_LIMITS.weight, label: '몸무게', unit: 'kg' },
  ];
  for (const c of checks) {
    if (!c.value.trim()) continue; // 빈 값은 기본값으로 계산되므로 통과시킨다.
    const n = parseFloat(c.value);
    if (!Number.isFinite(n) || n < c.limit.min || n > c.limit.max) {
      return `${c.label}는 ${c.limit.min}~${c.limit.max}${c.unit} 사이로 입력해 주세요`;
    }
  }
  return null;
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const showToast = useToastStore((s) => s.show);

  const obInfo = useAppStore((s) => s.obInfo);
  const obTags = useAppStore((s) => s.obTags);
  const obPick = useAppStore((s) => s.obPick);
  const setObInfo = useAppStore((s) => s.setObInfo);
  const toggleObTag = useAppStore((s) => s.toggleObTag);
  const clearObTags = useAppStore((s) => s.clearObTags);
  const setObPick = useAppStore((s) => s.setObPick);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);

  // README 유효성 검사: 통과하지 못하면 토스트를 띄우고 다음 단계로 넘어가지 않는다.
  const validate = (): boolean => {
    if (step === 1) {
      if (!obInfo.name.trim()) {
        showToast('이름을 입력해 주세요');
        return false;
      }
      if (!obInfo.height.trim() || !obInfo.weight.trim()) {
        showToast('키와 몸무게를 입력해 주세요');
        return false;
      }
      // 자릿수를 잘못 넣으면 목표 칼로리·물 목표가 엉뚱하게 잡히므로 여기서 막는다.
      const outOfRange = checkRange(obInfo);
      if (outOfRange) {
        showToast(outOfRange);
        return false;
      }
    }
    if (step === 2 && !obPick.activity) {
      showToast('하나를 선택해 주세요');
      return false;
    }
    if (step === 3 && !obPick.goal) {
      showToast('하나를 선택해 주세요');
      return false;
    }
    if (step === 7 && !obPick.persona) {
      showToast('하나를 선택해 주세요');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      return;
    }
    completeOnboarding();
  };

  const ctaLabel = step === 0 ? '시작하기' : step === TOTAL_STEPS - 1 ? '피또와 시작하기' : '다음';

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.root, { paddingTop: insets.top + 26, paddingBottom: insets.bottom + 30 }]}>
          <ProgressDots total={TOTAL_STEPS} current={step} />

          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.stepLabel, { color: colors.sub }]}>{STEP_LABELS[step]}</Text>
            <Text style={[typography.onboardingTitle, { color: colors.txt, marginTop: 8 }]}>{TITLES[step]}</Text>
            {DESCRIPTIONS[step] && (
              <Text style={[styles.desc, { color: colors.sub }]}>{DESCRIPTIONS[step]}</Text>
            )}

            <View style={styles.body}>
              {step === 0 && (
                <View style={styles.characterWrap}>
                  <FittoCharacter current={2} goal={5} size={172} glowSize={210} />
                </View>
              )}

              {step === 1 && <BasicInfoForm value={obInfo} onChange={setObInfo} />}

              {step === 2 &&
                ACTIVITY_OPTIONS.map((o) => (
                  <OptionRow
                    key={o.label}
                    title={o.label}
                    desc={o.desc}
                    selected={obPick.activity === o.label}
                    onPress={() => setObPick({ activity: o.label })}
                  />
                ))}

              {step === 3 &&
                GOAL_OPTIONS.map((o) => (
                  <OptionRow
                    key={o.label}
                    title={o.label}
                    desc={o.desc}
                    selected={obPick.goal === o.label}
                    onPress={() => setObPick({ goal: o.label })}
                  />
                ))}

              {step === 4 && (
                <TagPicker
                  tags={HEALTH_TAGS}
                  selected={obTags.health}
                  onToggle={(v) => toggleObTag('health', v)}
                  onClear={() => clearObTags('health')}
                  placeholder="기타 질환을 입력하세요"
                  noneLabel="해당사항 없음"
                />
              )}

              {step === 5 && (
                <TagPicker
                  tags={TASTE_TAGS}
                  selected={obTags.taste}
                  onToggle={(v) => toggleObTag('taste', v)}
                  onClear={() => clearObTags('taste')}
                  placeholder="다른 종류를 입력하세요"
                  noneLabel="가리는 것 없음"
                />
              )}

              {step === 6 && (
                <TagPicker
                  tags={AVOID_TAGS}
                  selected={obTags.avoid}
                  onToggle={(v) => toggleObTag('avoid', v)}
                  onClear={() => clearObTags('avoid')}
                  placeholder="기타 음식을 입력하세요"
                  noneLabel="해당사항 없음"
                />
              )}

              {step === 7 &&
                PERSONA_OPTIONS.map((o) => (
                  <OptionRow
                    key={o.key}
                    title={o.label}
                    desc={o.desc}
                    selected={obPick.persona === o.key}
                    onPress={() => setObPick({ persona: o.key })}
                  />
                ))}

              {step === 8 && <CompleteStep />}
            </View>
          </ScrollView>

          <View style={styles.buttonRow}>
            {step > 0 && (
              <Pressable onPress={() => setStep(step - 1)} style={[styles.prevButton, { borderColor: colors.line }]}>
                <Text style={[styles.prevLabel, { color: colors.txt }]}>이전</Text>
              </Pressable>
            )}
            <PrimaryButton label={ctaLabel} onPress={handleNext} style={styles.nextButton} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scroll: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  desc: {
    fontSize: 13.5,
    fontWeight: '500',
    marginTop: 10,
  },
  body: {
    marginTop: 20,
  },
  characterWrap: {
    alignItems: 'center',
    marginVertical: 28,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  prevButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
  },
});
