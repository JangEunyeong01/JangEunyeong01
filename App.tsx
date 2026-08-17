import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import Toast from './src/components/Toast';
import QuickLogSheet from './src/components/QuickLogSheet';
import FoodSearchSheet from './src/screens/diet/FoodSearchSheet';
import { useTheme } from './src/theme/useTheme';

function AppShell() {
  const { mode } = useTheme();
  return (
    <>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <QuickLogSheet />
      <FoodSearchSheet />
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
