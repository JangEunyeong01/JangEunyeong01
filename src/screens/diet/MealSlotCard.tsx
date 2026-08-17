import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import GlassCard from '../../components/GlassCard';
import { useTheme } from '../../theme/useTheme';
import type { MealItem } from '../../store/useAppStore';

interface MealSlotCardProps {
  slot: string;
  items: MealItem[];
  onAdd: () => void;
}

// README: 카드마다 제목 + 합계 kcal, 항목 행(이름 / 양 / kcal), 비어 있으면 점선 `+ {슬롯} 추가`.
export default function MealSlotCard({ slot, items, onAdd }: MealSlotCardProps) {
  const { colors } = useTheme();
  const total = items.reduce((a, i) => a + i.kcal, 0);

  return (
    <GlassCard style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.txt }]}>{slot}</Text>
        <Text style={[styles.total, { color: colors.sub }]}>{total.toLocaleString()} kcal</Text>
      </View>

      {items.length === 0 ? (
        <Pressable onPress={onAdd} style={[styles.emptyBtn, { borderColor: colors.line }]}>
          <Text style={[styles.emptyLabel, { color: colors.sub }]}>+ {slot} 추가</Text>
        </Pressable>
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={[styles.itemName, { color: colors.txt }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.itemAmount, { color: colors.sub }]}>{item.amount}</Text>
              <Text style={[styles.itemKcal, { color: colors.txt }]}>{item.kcal}</Text>
            </View>
          ))}
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  total: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyBtn: {
    marginTop: 12,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  list: {
    marginTop: 10,
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  itemAmount: {
    fontSize: 11,
  },
  itemKcal: {
    fontSize: 12.5,
    fontWeight: '700',
    minWidth: 34,
    textAlign: 'right',
  },
});
