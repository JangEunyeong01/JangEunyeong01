import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/useTheme';
import { accentGradient, timeSlots } from '../../theme/tokens';
import { getTimeSlot } from '../../utils/timeOfDay';

export default function HomeHeader() {
  const { colors, mode } = useTheme();
  const navigation = useNavigation<any>();
  const slot = getTimeSlot();

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <LinearGradient colors={accentGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logo} />
        <Text style={[styles.title, { color: colors.txt }]}>Fitto</Text>
      </View>
      <View style={styles.right}>
        <View style={[styles.chip, { backgroundColor: colors.card2, borderColor: colors.stroke }]}>
          <Text style={[styles.chipText, { color: colors.sub }]}>{timeSlots[slot].greeting}</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('Settings')}>
          <BlurView
            intensity={25}
            tint={mode === 'dark' ? 'dark' : 'light'}
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            style={[styles.settingsBtn, { borderColor: colors.stroke }]}
          >
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card2 }]} />
            <Text style={styles.settingsIcon}>⚙</Text>
          </BlurView>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 26,
    height: 26,
    borderRadius: 9,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  settingsBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  settingsIcon: {
    fontSize: 16,
  },
});
