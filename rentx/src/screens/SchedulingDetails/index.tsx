import React, { useState } from 'react';
import { StatusBar, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native'

import api from '../../services/api';

import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateValue,
  DateTitle,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal,
  Footer,
} from './styles';

type NavigationProps = {
  navigate:(screen:string) => void;
  goBack: () => void;
}

interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}


interface Params {
  car: CarDTO;
  dates: string[],
  rentalPeriod: RentalPeriod;
}

interface Response {
  unavailable_dates: string[];
}

export function SchedulingDetails() {
  const { navigate, goBack } = useNavigation<NavigationProps>();
  const theme = useTheme();
  const route = useRoute();
  const { car, dates, rentalPeriod } = route.params as Params;

  const [isRenting, setIsRenting] = useState(false)

  const rentalTotal = Number(dates.length * car.rent.price)

  async function handleConfirmRental() {
    setIsRenting(true)
    const schedulesByCar = await api.get<Response>(`/schedules_bycars/${car.id}`)

    const unavailable_dates = [
      ...schedulesByCar.data.unavailable_dates,
      ...dates,
    ]

    await api.post('schedules_byuser', {
      user_id: 1,
      car,
      startDate: rentalPeriod.startFormatted,
      endDate: rentalPeriod.endFormatted,
    })

    await api.put(`schedules_bycars/${car.id}`, {
      id: car.id,
      unavailable_dates,
    })
    .then(response => {
      navigate('SchedulingComplete')
    })
    .catch(() => {
      setIsRenting(false)
      Alert.alert('Não foi possivel fazer o agendamento.')
    })
  }

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <Header>
        <BackButton onPress={() => goBack()} />
      </Header>

      <CarImages>
        <ImageSlider imagesUrl={car.photos} />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>Ao dia</Period>
            <Price>R$ {car.rent.price}</Price>
          </Rent>
        </Details>
        <Accessories>
          {car.accessories.map(accesory => (
            <Accessory 
              key={accesory.type}
              name={accesory.name}
              icon={getAccessoryIcon(accesory.type)}
            />
          ))}
        </Accessories>

        <RentalPeriod>
          <CalendarIcon>
            <Feather name="calendar" size={RFValue(24)} color={theme.colors.shape} />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.startFormatted}</DateValue>
          </DateInfo>

          <Feather name="chevron-right" size={RFValue(12)} color={theme.colors.shape} />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.endFormatted}</DateValue>
          </DateInfo>
        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.rent.price} x${dates.length} diárias`}</RentalPriceQuota>
            <RentalPriceTotal>R$ {rentalTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>

      <Footer>
        <Button 
          title='Alugar agora'
          color={theme.colors.success} 
          enabled={!isRenting}
          onPress={handleConfirmRental} 
          loading={isRenting}
        />
      </Footer>

    </Container>
  );
}