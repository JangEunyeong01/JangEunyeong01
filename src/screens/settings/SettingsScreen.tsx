import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import ScreenBackground from '../../components/ScreenBackground';
import GlassCard from '../../components/GlassCard';
import ToggleSwitch from '../../components/ToggleSwitch';
import SegmentedControl from '../../components/SegmentedControl';
import { useTheme } from '../../theme/useTheme';
import { useAppStore, ThemeMode } from '../../store/useAppStore';
import { useCardOrderSheetStore } from '../../store/useCardOrderSheetStore';
import { useBirthdayModalStore } from '../../store/useBirthdayModalStore';
import { useTutorialStore } from '../../store/useTutorialStore';
import { useToastStore } from '../../store/useToastStore';
import { PERSONA_OPTIONS } from '../onboarding/onboardingData';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
  { value: 'system', label: '시스템' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { colors, mode, accentGradient } = useTheme();

  const profile = useAppStore((s) => s.profile);
  const goals = useAppStore((s) => s.goals);
  const persona = useAppStore((s) => s.persona);
  const setPersona = useAppStore((s) => s.setPersona);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const periodOn = useAppStore((s) => s.periodOn);
  const setPeriodOn = useAppStore((s) => s.setPeriodOn);
  const resetOnboarding = useAppStore((s) => s.resetOnboarding);

  const showCardOrderSheet = useCardOrderSheetStore((s) => s.show);
  const showBirthdayModal = useBirthdayModalStore((s) => s.show);
  const startTutorial = useTutorialStore((s) => s.start);
  const showToast = useToastStore((s) => s.show);

  const personaDesc = PERSONA_OPTIONS.find((p) => p.key === persona)?.desc ?? '';
  const goalSummary = [profile.goalType, `${goals.kcal.toLocaleString()}kcal`].filter(Boolean).join(' · ');

  return (
    <ScreenBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: 108 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.txt }]}>설정</Text>

        <Pressable onPress={() => navigation.navigate('Profile')}>
          <GlassCard style={styles.card}>
            <View style={styles.profileRow}>
              <LinearGradient colors={accentGradient} style={styles.avatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
              <View style={styles.profileText}>
                <Text style={[styles.nickname, { color: colors.txt }]}>{profile.nickname}</Text>
                <Text style={[styles.goalSummary, { color: colors.sub }]} numberOfLines={1}>
                  {goalSummary || '목표를 설정해 주세요'}
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.sub }]}>›</Text>
            </View>
          </GlassCard>
        </Pressable>

        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.txt }]}>피또 성격</Text>
          <View style={styles.gap10}>
            <SegmentedControl
              options={PERSONA_OPTIONS.map((p) => ({ value: p.key, label: p.label }))}
              value={persona}
              onChange={setPersona}
            />
          </View>
          <Text style={[styles.previewText, { color: colors.sub }]}>{personaDesc}</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.txt }]}>화면 모드</Text>
          <View style={styles.gap10}>
            <SegmentedControl options={THEME_OPTIONS} value={theme} onChange={setTheme} />
          </View>

          <View style={[styles.divider, { borderTopColor: colors.line }]} />

          {/* README: 글씨 크기 조절은 V2 예정 기능이라 지금은 눌러도 반응하지 않는 자리만 잡아둔다. */}
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.txt }]}>글씨 크기 조절</Text>
            <View style={[styles.badge, { backgroundColor: colors.ink }]}>
              <Text style={[styles.badgeText, { color: colors.sub }]}>V2</Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <ToggleRow label="생리 주기 기능" value={periodOn} onChange={setPeriodOn} colors={colors} />
          <Divider colors={colors} />
          <NavRow label="알림" onPress={() => navigation.navigate('Notifications')} colors={colors} />
          <Divider colors={colors} />
          <NavRow label="홈 카드 순서" actionLabel="변경" onPress={showCardOrderSheet} colors={colors} />
          <Divider colors={colors} />
          <NavRow
            label="튜토리얼 다시 보기"
            actionLabel="실행"
            onPress={() => {
              // 튜토리얼은 홈 카드를 가리키므로 홈으로 보낸 뒤 띄운다.
              navigation.navigate('Home');
              startTutorial();
            }}
            colors={colors}
          />
          <Divider colors={colors} />
          <NavRow
            label="온보딩 다시 보기"
            actionLabel="실행"
            onPress={resetOnboarding}
            colors={colors}
          />
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowTextCol}>
              <View style={styles.rowTitleLine}>
                <Text style={[styles.rowLabel, { color: colors.txt }]}>생일 축하 메시지</Text>
                <View style={[styles.badge, { backgroundColor: colors.ink }]}>
                  <Text style={[styles.badgeText, { color: colors.sub }]}>V2</Text>
                </View>
              </View>
              <Text style={[styles.rowDesc, { color: colors.sub }]}>생일 당일 홈에서 피또가 깜짝 축하해요</Text>
            </View>
            <Pressable onPress={showBirthdayModal}>
              <BlurView intensity={20} tint={mode === 'dark' ? 'dark' : 'light'} style={[styles.previewBtn, { borderColor: colors.stroke }]}>
                <View style={[styles.previewBtnInner, { backgroundColor: colors.card }]}>
                  <Text style={[styles.previewBtnLabel, { color: colors.txt }]}>미리보기</Text>
                </View>
              </BlurView>
            </Pressable>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenBackground>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  colors: any;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.txt }]}>{label}</Text>
      <ToggleSwitch value={value} onChange={onChange} />
    </View>
  );
}

function NavRow({
  label,
  actionLabel,
  onPress,
  colors,
}: {
  label: string;
  actionLabel?: string;
  onPress: () => void;
  colors: any;
}) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.txt }]}>{label}</Text>
      <Text style={[styles.rowAction, { color: colors.sub }]}>{actionLabel ?? '›'}</Text>
    </Pressable>
  );
}

function Divider({ colors }: { colors: any }) {
  return <View style={[styles.divider, { borderTopColor: colors.line }]} />;
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.6,
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  profileText: {
    flex: 1,
    gap: 3,
  },
  nickname: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  goalSummary: {
    fontSize: 12,
  },
  chevron: {
    fontSize: 18,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  gap10: {
    marginTop: 10,
  },
  previewText: {
    fontSize: 11.5,
    lineHeight: 11.5 * 1.5,
    marginTop: 10,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  rowAction: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 7,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  rowTextCol: {
    flex: 1,
    gap: 4,
  },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  rowDesc: {
    fontSize: 11,
  },
  previewBtn: {
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  previewBtnInner: {
    flex: 1,
    paddingHorizontal: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBtnLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});
