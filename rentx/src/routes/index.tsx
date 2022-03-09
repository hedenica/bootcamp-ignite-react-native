import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../hooks/auth';
import { TabRoutes } from './app.tab.routes copy';
import { AuthRoutes } from './auth.routes';
import { LoaderAnimated } from '../components/LoaderAnimated/index';

export function Routes() {
  const { user, loading } = useAuth()
  return (
    loading ? <LoaderAnimated /> : (
      <NavigationContainer>
        { user.id ? <TabRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    )
  );
}