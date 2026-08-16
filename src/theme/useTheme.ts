import { useColorScheme } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { resolveColors, glassShadow, brand, semantic, typography, spacing, radius, gauge, minTouchTarget, primaryGradient, primaryButtonShadow, primaryButtonShadowSmall } from './tokens';

export function useTheme() {
  const themeMode = useAppStore((s) => s.theme);
  const system = useColorScheme();
  const mode = themeMode === 'system' ? (system === 'dark' ? 'dark' : 'light') : themeMode;
  const colors = resolveColors(mode);

  return {
    mode,
    colors,
    shadow: glassShadow[mode],
    brand,
    semantic,
    typography,
    spacing,
    radius,
    gauge,
    minTouchTarget,
    primaryGradient,
    primaryButtonShadow,
    primaryButtonShadowSmall,
  };
}
