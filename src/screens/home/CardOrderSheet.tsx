import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { useAppStore, CardId } from '../../store/useAppStore';
import PrimaryButton from '../../components/PrimaryButton';
import { overlay } from '../../theme/tokens';

interface CardOrderSheetProps {
  visible: boolean;
  onClose: () => void;
}

const CARD_LABELS: Record<CardId, string> = {
  kcal: '칼로리',
  water: '물 섭취',
  act: '활동',
  steps: '걸음수',
  ex: '오늘 운동',
  week: '주간 요약',
  period: '생리 주기',
};

export default function CardOrderSheet({ visible, onClose }: CardOrderSheetProps) {
  const { colors, radius, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const cardOrder = useAppStore((s) => s.cardOrder);
  const cardHidden = useAppStore((s) => s.cardHidden);
  const setCardOrder = useAppStore((s) => s.setCardOrder);
  const setCardHidden = useAppStore((s) => s.setCardHidden);
  const resetCardOrder = useAppStore((s) => s.resetCardOrder);

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= cardOrder.length) return;
    const next = [...cardOrder];
    [next[index], next[target]] = [next[target], next[index]];
    setCardOrder(next);
  };

  const toggleHidden = (id: CardId) => {
    setCardHidden(cardHidden.includes(id) ? cardHidden.filter((c) => c !== id) : [...cardHidden, id]);
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheetWrap, { paddingBottom: insets.bottom + 16 }]}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.solid, paddingHorizontal: spacing.screenX, borderTopLeftRadius: radius.sheetTop, borderTopRightRadius: radius.sheetTop },
          ]}
        >
          <View style={[styles.grabber, { backgroundColor: colors.line }]} />
          <Text style={[styles.title, { color: colors.txt }]}>홈 카드 순서</Text>

          {cardOrder.map((id, index) => {
            const hidden = cardHidden.includes(id);
            return (
              <View key={id} style={[styles.row, { borderColor: colors.line }]}>
                <Text style={[styles.rowLabel, { color: hidden ? colors.sub : colors.txt }]}>{CARD_LABELS[id]}</Text>
                <View style={styles.rowActions}>
                  <Pressable onPress={() => move(index, -1)} disabled={index === 0} style={styles.iconBtn}>
                    <Text style={[styles.iconText, { color: index === 0 ? colors.line : colors.txt }]}>↑</Text>
                  </Pressable>
                  <Pressable onPress={() => move(index, 1)} disabled={index === cardOrder.length - 1} style={styles.iconBtn}>
                    <Text style={[styles.iconText, { color: index === cardOrder.length - 1 ? colors.line : colors.txt }]}>↓</Text>
                  </Pressable>
                  <Pressable onPress={() => toggleHidden(id)} style={[styles.toggleBtn, { borderColor: colors.line }]}>
                    <Text style={[styles.toggleText, { color: colors.txt }]}>{hidden ? '표시' : '숨김'}</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}

          <View style={styles.bottomRow}>
            <Pressable onPress={resetCardOrder} style={[styles.defaultBtn, { borderColor: colors.line }]}>
              <Text style={[styles.defaultLabel, { color: colors.txt }]}>기본값</Text>
            </Pressable>
            <PrimaryButton label="완료" onPress={onClose} style={styles.doneBtn} />
          </View>
        </View>
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
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 15,
    fontWeight: '700',
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 4,
  },
  toggleText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  defaultBtn: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultLabel: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  doneBtn: {
    flex: 1,
  },
});
