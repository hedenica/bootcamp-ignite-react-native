import React from 'react';
import { StatusBar, useWindowDimensions } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import LogoSvg from '../../assets/logo_background_gray.svg';
import DoneSvg from '../../assets/done.svg';

import { ConfirmButton } from '../../components/ConfirmButton';

import {
  Container,
  Content,
  Title,
  Message,
  Footer,
} from './styles';

type NavigationProps = {
  navigate:(screen:string) => void;
}

type Params = {
  title: string
  message: string
  nextScreen: string
}

export function Confirmation() {
  const { width } = useWindowDimensions()
  const { navigate } = useNavigation<NavigationProps>();
  const { params } = useRoute()
  const { title, message, nextScreen } = params as Params

  function handleReturnHome() {
    navigate(nextScreen);
  }

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LogoSvg width={width} />

      <Content>
        <DoneSvg width={80} height={80} />
        <Title>{title}</Title>
        <Message>{message}</Message>
      </Content>
      <Footer>
        <ConfirmButton title="ok" onPress={handleReturnHome} />
      </Footer>
    </Container>
  );
}