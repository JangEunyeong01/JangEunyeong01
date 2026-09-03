import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import Toast from './src/components/Toast';
import QuickLogSheet from './src/components/QuickLogSheet';
import FoodSearchSheet from './src/screens/diet/FoodSearchSheet';
import BirthdayModal from './src/screens/home/BirthdayModal';
import { useTheme } from './src/theme/useTheme';

function AppShell() {
  const { mode } = useTheme();
  return (
    <>
      {/* 시트들은 화면 전체를 덮는 오버레이지만 useNavigation을 쓰므로
          NavigationContainer 안에 둔다. */}
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <RootNavigator />
          <QuickLogSheet />
          <FoodSearchSheet />
        </View>
      </NavigationContainer>
      <BirthdayModal />
      <Toast />
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppShell />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
