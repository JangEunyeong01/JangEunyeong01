import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from './TabBar';
import HomeStack from './HomeStack';
import DietScreen from '../screens/diet/DietScreen';
import HealthScreen from '../screens/health/HealthScreen';
import SettingsStack from './SettingsStack';

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
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Diet" component={DietScreen} />
      <Tab.Screen name="Health" component={HealthScreen} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}
