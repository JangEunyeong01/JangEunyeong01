import { useFonts } from 'expo-font';

/**
 * Pretendard (OFL 1.1, assets/fonts/Pretendard-LICENSE.txt).
 *
 * 가변 폰트 대신 정적 4종을 쓴다. 안드로이드에서 가변 폰트의 중간 굵기(500·600)가
 * 제대로 안 잡히는 경우가 있어, 굵기별 파일을 따로 두고 이름으로 지정한다.
 * 그래서 스타일에서는 fontWeight가 아니라 fontFamily로 굵기를 고른다 —
 * tokens.ts의 fontFor()가 그 매핑을 담당한다.
 */
export const FONT_FAMILY = {
  400: 'Pretendard-Regular',
  500: 'Pretendard-Medium',
  600: 'Pretendard-SemiBold',
  700: 'Pretendard-Bold',
} as const;

export type FontWeightKey = keyof typeof FONT_FAMILY;

export function useFittoFonts(): boolean {
  const [loaded, error] = useFonts({
    'Pretendard-Regular': require('../../assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('../../assets/fonts/Pretendard-Bold.ttf'),
  });

  // 로딩에 실패해도 앱을 막지 않는다. 시스템 폰트로 떨어질 뿐이다.
  return loaded || !!error;
}
