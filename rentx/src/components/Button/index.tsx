import React from 'react';
import { ActivityIndicator } from 'react-native';
import { RectButtonProps } from 'react-native-gesture-handler';

import { useTheme } from 'styled-components';

import {
  Container,
  Title,
} from './styles';

interface Props extends RectButtonProps {
  title: string;
  color?: string;
  enabled?: boolean;
  loading?: boolean;
}

export function Button({ title, color, enabled = true, loading = false, ...rest }: Props) {
  const theme = useTheme();

  return (
    <Container 
      color={color} 
      enabled={enabled}
      style={{ opacity: (enabled === false || loading === true) ? .5 : 1 }}
      {...rest} 
    > 
      {loading ? (
        <ActivityIndicator color={theme.colors.shape} />
      ):(
        <Title>{title}</Title>
      )}
    </Container>
  );
}