import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from './TabBar';
import HomeScreen from '../screens/home/HomeScreen';
import PlaceholderScreen from '../screens/placeholder/PlaceholderScreen';

export type MainTabsParamList = {
  Home: undefined;
  Diet: undefined;
  Health: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Diet">{() => <PlaceholderScreen title="식단" />}</Tab.Screen>
      <Tab.Screen name="Health">{() => <PlaceholderScreen title="헬스" />}</Tab.Screen>
      <Tab.Screen name="Settings">{() => <PlaceholderScreen title="설정" />}</Tab.Screen>
    </Tab.Navigator>
  );
}
