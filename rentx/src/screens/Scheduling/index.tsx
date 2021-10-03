import React from 'react';
import { StatusBar } from 'react-native';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { Calendar } from '../../components/Calendar';

import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native'

import ArrowSvg from '../../assets/arrow.svg'

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValueWrapper,
  DateValue,
  Content,
  Footer,
} from './styles';

type NavigationProps = {
  navigate:(screen:string) => void;
  goBack: () => void;
}

export function Scheduling() {
  const { navigate, goBack } = useNavigation<NavigationProps>();
  const theme = useTheme();


  function handleConfirmRentalPeriod() {
    navigate('SchedulingDetails');
  }

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Header>
        <BackButton color={theme.colors.shape} onPress={() => goBack()} />

        <Title>
          Escolha uma {'\n'}
          data de início e {'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>de</DateTitle>
            <DateValueWrapper isSelected={false}>
              <DateValue>18/06/2021</DateValue>
            </DateValueWrapper>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>até</DateTitle>
            <DateValueWrapper isSelected={false}>
              <DateValue></DateValue>
            </DateValueWrapper>
          </DateInfo>
        </RentalPeriod>
      </Header>

      <Content>
        <Calendar />
      </Content>

      <Footer>
        <Button title="Confirmar" onPress={handleConfirmRentalPeriod} />
      </Footer>
    </Container>
  );
}