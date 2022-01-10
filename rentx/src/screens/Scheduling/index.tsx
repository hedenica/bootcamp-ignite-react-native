import React, { useState } from 'react';
import { format } from 'date-fns';
import { StatusBar } from 'react-native';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { 
  Calendar,
  DayProps,
  MarkedDatesProps,
  generateInterval
} from '../../components/Calendar';

import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native'
import { getPlataformDate } from '../../utils/getPlataformDate';

import { CarDTO } from '../../dtos/CarDTO';

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
  navigate:(screen:string, car: object) => void;
  goBack: () => void;
}

interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

interface Params {
  car: CarDTO;
}

export function Scheduling() {
  const { navigate, goBack } = useNavigation<NavigationProps>();
  const route = useRoute();
  const { car } = route.params as Params;
  const theme = useTheme();

  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
  const [markedDates, setMarkedDates] = useState<MarkedDatesProps>({} as MarkedDatesProps);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

  function handleConfirmRentalPeriod() {
    navigate('SchedulingDetails', {
      car,
      dates: Object.keys(markedDates),
      rentalPeriod
    });
  }

  function handleChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if (start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    setLastSelectedDate(end)
    const interval = generateInterval(start, end)
    setMarkedDates(interval)

    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      startFormatted: format(getPlataformDate(new Date(firstDate)), 'dd/MM/yyyy'),
      endFormatted: format(getPlataformDate(new Date(endDate)), 'dd/MM/yyyy'),
    })
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
            <DateValueWrapper isSelected={!!rentalPeriod.startFormatted}>
              <DateValue>{rentalPeriod.startFormatted}</DateValue>
            </DateValueWrapper>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>até</DateTitle>
            <DateValueWrapper isSelected={!!rentalPeriod.endFormatted}>
              <DateValue>{rentalPeriod.endFormatted}</DateValue>
            </DateValueWrapper>
          </DateInfo>
        </RentalPeriod>
      </Header>

      <Content>
        <Calendar 
          markedDates={markedDates}
          onDayPress={handleChangeDate}
        />
      </Content>

      <Footer>
        <Button 
          title="Confirmar" 
          onPress={handleConfirmRentalPeriod}
          enabled={!!rentalPeriod.startFormatted}
        />
      </Footer>
    </Container>
  );
}