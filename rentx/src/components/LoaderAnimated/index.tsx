import React from 'react';
import LottieView from 'lottie-react-native';

import loadingCard from '../../assets/load_animated.json'

import {
  Container,
} from './styles';

export function LoaderAnimated() {
  return (
    <Container>
      <LottieView 
        style={{ height: 250 }}
        resizeMode='contain'
        source={loadingCard}
        autoPlay
        loop
      />
    </Container>
  );
}