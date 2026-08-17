// Reanimated 4는 워크릿 babel 플러그인이 있어야 useAnimatedStyle이 값 변화에 반응한다.
// babel-preset-expo가 react-native-worklets 설치를 감지해 플러그인을 자동으로 넣어준다.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
