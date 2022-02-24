import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const { Navigator, Screen } = createBottomTabNavigator();

import { StackRoutes } from './app.stack.routes';

import { Home } from '../screens/Home'
import { MyCars } from '../screens/MyCars';

export function TabRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="Home" component={StackRoutes} />
      <Screen name="Profile" component={Home} />
      <Screen name="MyCars" component={MyCars} />
    </Navigator>
  )
}