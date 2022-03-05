import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../hooks/auth';
import { TabRoutes } from './app.tab.routes copy';
import { AuthRoutes } from './auth.routes';

export function Routes() {
  const { user } = useAuth()
  return (
    <NavigationContainer>
      { user.id ? <TabRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}