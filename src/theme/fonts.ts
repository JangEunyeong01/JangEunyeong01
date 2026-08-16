// Pretendard Variable 폰트 파일이 준비되면 여기서 expo-font로 로드한다.
// 현재 번들에는 폰트 파일이 없어 README의 폴백 규칙(플랫폼 한글 시스템 폰트)을 따라
// fontFamily를 지정하지 않고 시스템 기본값을 사용한다. 폰트 추가 시:
//   1) assets/fonts/PretendardVariable.ttf 배치
//   2) useFonts({ Pretendard: require('../../assets/fonts/PretendardVariable.ttf') })
//   3) tokens.ts의 각 typography 항목에 fontFamily: 'Pretendard' 추가
export function useFittoFonts() {
  return true;
}
