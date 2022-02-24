import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen } = createStackNavigator();

import { Confirmation } from '../screens/Confirmation';
import { FirstStep } from '../screens/SignUp/FirstStep'
import { SecondStep } from '../screens/SignUp/SecondStep'
import { SignIn } from '../screens/SignIn'
import { Splash } from '../screens/Splash'

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash" >
      <Screen name="Splash" component={Splash} />
      <Screen name="SignIn" component={SignIn} />
      <Screen name="SignUpFirstStep" component={FirstStep} />
      <Screen name="SignUpSecondStep" component={SecondStep} />
      <Screen name="Confirmation" component={Confirmation} />
    </Navigator>
  )
}