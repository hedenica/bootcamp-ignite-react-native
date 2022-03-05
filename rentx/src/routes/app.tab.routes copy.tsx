import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components'

const { Navigator, Screen } = createBottomTabNavigator();

import HomeSvg from '../assets/home.svg'
import CarSvg from '../assets/car.svg'
import PeopleSvg from '../assets/people.svg'

import { StackRoutes } from './app.stack.routes';

import { MyCars } from '../screens/MyCars';
import { Platform } from 'react-native';
import { Profile } from '../screens/Profile/index';

export function TabRoutes() {
  const theme = useTheme()

  return (
    <Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.main,
        tabBarInactiveTintColor: theme.colors.text_detail,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 20,
          height: 78,
          backgroundColor: theme.colors.background_primary
        },
        // tabBarIcon -> tb dá pra fazer por aqui usando route
      })}
    >
      <Screen 
        name="Home" 
        component={StackRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg width={24} height={24} fill={color} />
          )
        }}
      />
      <Screen 
        name="MyCars" 
        component={MyCars}
        options={{
          tabBarIcon: ({ color }) => (
            <CarSvg width={24} height={24} fill={color} />
          )
        }}
      />
      <Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <PeopleSvg width={24} height={24} fill={color} />
          )
        }}
      />
    </Navigator>
  )
}