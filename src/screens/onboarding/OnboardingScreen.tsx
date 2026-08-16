import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenBackground from '../../components/ScreenBackground';
import FittoCharacter from '../../components/FittoCharacter';
import PrimaryButton from '../../components/PrimaryButton';
import OptionRow from './OptionRow';
import ProgressDots from './ProgressDots';
import { useTheme } from '../../theme/useTheme';
import { useAppStore, Persona } from '../../store/useAppStore';
import { personaCopy, personaLabel } from '../../copy/persona';

const GOAL_OPTIONS = [
  { key: 'lose', title: '체중 감량', desc: '천천히, 무리 없이' },
  { key: 'maintain', title: '체중 유지', desc: '지금 상태를 지키기' },
  { key: 'muscle', title: '근육 증가', desc: '단백질 중심 식단' },
  { key: 'health', title: '건강 관리', desc: '질환·컨디션 관리' },
];

const CONDITION_OPTIONS = [
  { key: 'none', title: '해당 없음' },
  { key: 'diabetes', title: '당뇨', desc: '당류·GI 경고' },
  { key: 'hypertension', title: '고혈압', desc: '나트륨 경고' },
  { key: 'gout', title: '통풍', desc: '퓨린 함량 경고' },
  { key: 'hyperlipidemia', title: '고지혈증', desc: '포화지방 경고' },
];

const PERSONA_OPTIONS: { key: Persona; desc: string }[] = [
  { key: 'friendly', desc: personaCopy.kcalComment.friendly({ remainKcal: 320 }) },
  { key: 'strict', desc: personaCopy.kcalComment.strict({ consumedKcal: 1200, percent: 65 }) },
  { key: 'neutral', desc: personaCopy.kcalComment.neutral({ remainKcal: 320 }) },
];

const STEP_LABELS = ['FITTO', 'STEP 1 · 목표', 'STEP 2 · 건강 상태', 'STEP 3 · 피또 성격', '완료'];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const setProfile = useAppStore((s) => s.setProfile);
  const setPersona = useAppStore((s) => s.setPersona);
  const goals = useAppStore((s) => s.goals);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [conditions, setConditions] = useState<string[]>([]);
  const [persona, setPersonaLocal] = useState<Persona | null>(null);

  const toggleCondition = (key: string) => {
    if (key === 'none') {
      setConditions(['none']);
      return;
    }
    setConditions((prev) => {
      const withoutNone = prev.filter((k) => k !== 'none');
      return withoutNone.includes(key) ? withoutNone.filter((k) => k !== key) : [...withoutNone, key];
    });
  };

  const canNext = step === 0 || (step === 1 && !!goal) || (step === 2 && conditions.length > 0) || (step === 3 && !!persona) || step === 4;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    setProfile({ goalType: goal, conditions: conditions.filter((c) => c !== 'none') });
    if (persona) setPersona(persona);
    completeOnboarding();
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <ScreenBackground>
      <View style={[styles.root, { paddingTop: insets.top + 26, paddingBottom: insets.bottom + 30 }]}>
        <ProgressDots total={5} current={step} />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.stepLabel, { color: colors.sub }]}>{STEP_LABELS[step]}</Text>

          {step === 0 && (
            <>
              <Text style={[typography.onboardingTitle, { color: colors.txt, marginTop: 8 }]}>
                물방울 요정 피또와{'\n'}오늘도 또, 건강하게
              </Text>
              <View style={styles.characterWrap}>
                <FittoCharacter current={2} goal={5} size={172} glowSize={210} />
              </View>
              <Text style={[styles.desc, { color: colors.sub, textAlign: 'center' }]}>
                숫자 대신 표정으로 건강을 알려주는 앱이에요.
              </Text>
            </>
          )}

          {step === 1 && (
            <>
              <Text style={[typography.onboardingTitle, { color: colors.txt, marginTop: 8 }]}>어떤 목표로 시작할까요?</Text>
              <Text style={[styles.desc, { color: colors.sub }]}>미용 목적만이 아니어도 괜찮아요.</Text>
              <View style={styles.optionsWrap}>
                {GOAL_OPTIONS.map((o) => (
                  <OptionRow key={o.key} title={o.title} desc={o.desc} selected={goal === o.key} onPress={() => setGoal(o.key)} />
                ))}
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={[typography.onboardingTitle, { color: colors.txt, marginTop: 8 }]}>관리가 필요한 항목이 있나요?</Text>
              <Text style={[styles.desc, { color: colors.sub }]}>복수 선택 가능 · 의료 진단을 대체하지 않아요.</Text>
              <View style={styles.optionsWrap}>
                {CONDITION_OPTIONS.map((o) => (
                  <OptionRow key={o.key} title={o.title} desc={o.desc} selected={conditions.includes(o.key)} onPress={() => toggleCondition(o.key)} />
                ))}
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={[typography.onboardingTitle, { color: colors.txt, marginTop: 8 }]}>피또는 어떤 말투가 좋을까요?</Text>
              <View style={styles.optionsWrap}>
                {PERSONA_OPTIONS.map((o) => (
                  <OptionRow key={o.key} title={personaLabel[o.key]} desc={o.desc} selected={persona === o.key} onPress={() => setPersonaLocal(o.key)} />
                ))}
              </View>
            </>
          )}

          {step === 4 && (
            <>
              <Text style={[typography.onboardingTitle, { color: colors.txt, marginTop: 8 }]}>목표가 계산됐어요</Text>
              <View style={styles.resultRow}>
                <View style={[styles.resultCard, { backgroundColor: colors.card2, borderColor: colors.stroke }]}>
                  <Text style={[styles.resultLabel, { color: colors.sub }]}>목표 칼로리</Text>
                  <Text style={[styles.resultValue, { color: colors.txt }]}>{goals.kcal.toLocaleString()} kcal</Text>
                  <Text style={[styles.resultCaption, { color: colors.sub }]}>BMR 기반</Text>
                </View>
                <View style={[styles.resultCard, { backgroundColor: colors.card2, borderColor: colors.stroke }]}>
                  <Text style={[styles.resultLabel, { color: colors.sub }]}>물 목표</Text>
                  <Text style={[styles.resultValue, { color: colors.txt }]}>{goals.water.toLocaleString()} ml</Text>
                  <Text style={[styles.resultCaption, { color: colors.sub }]}>체중×활동량</Text>
                </View>
              </View>
              <Text style={[styles.desc, { color: colors.sub, marginTop: 16 }]}>
                알레르기(땅콩·아몬드)를 반영한 추천 식단이 준비됐어요. 의료 진단을 대체하지 않습니다.
              </Text>
            </>
          )}
        </ScrollView>

        <View style={styles.buttonRow}>
          {step > 0 && (
            <Pressable onPress={handlePrev} style={[styles.prevButton, { borderColor: colors.line }]}>
              <Text style={[styles.prevLabel, { color: colors.txt }]}>이전</Text>
            </Pressable>
          )}
          <PrimaryButton
            label={step === 0 ? '시작하기' : step === 4 ? '홈으로' : '다음'}
            onPress={handleNext}
            disabled={!canNext}
            style={styles.nextButton}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
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
  characterWrap: {
    alignItems: 'center',
    marginVertical: 28,
  },
  optionsWrap: {
    marginTop: 20,
  },
  resultRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  resultCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  resultLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  resultCaption: {
    fontSize: 10.5,
    fontWeight: '500',
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
