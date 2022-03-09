import React, { useState, useEffect } from 'react';
import { StatusBar, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native'
import { useNetInfo } from '@react-native-community/netinfo';

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
  navigate:(screen:string, params: object) => void;
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
  const { isConnected } = useNetInfo();
  const { car, dates, rentalPeriod } = route.params as Params;

  const [isRenting, setIsRenting] = useState(false)
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);

  const rentalTotal = Number(dates.length * car.price)

  async function handleConfirmRental() {
    setIsRenting(true)

    await api.post('/rentals', {
      user_id: 1,
      car_id: car.id,
      start_date: new Date(dates[0]),
      end_date: new Date(dates[dates.length - 1]),
      total: rentalTotal,
    })
    .then(response => {
      navigate('Confirmation', {
        title: 'Carro alugado!', 
        message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar seu automóvel.`, 
        nextScreen: 'StackHome'
      })
    })
    .catch(() => {
      setIsRenting(false)
      Alert.alert('Não foi possivel fazer o agendamento.')
    })
  }

  useEffect(() => {
    async function fetchCarUpdated() {
      const { data } = await api.get<CarDTO>(`/cars/${car.id}`);
      setCarUpdated(data);
    }
    if (isConnected === true) {
      fetchCarUpdated();
    }
  }, [isConnected]);

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <Header>
        <BackButton onPress={() => goBack()} />
      </Header>

      <CarImages>
        <ImageSlider imagesUrl={
            !!carUpdated.photos ? carUpdated.photos 
            : [{ id: car.thumbnail, photo: car.thumbnail}]
          } 
        />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>Ao dia</Period>
            <Price>R$ {car.price}</Price>
          </Rent>
        </Details>
        { Boolean(carUpdated.accessories) && (
          <Accessories>
            {carUpdated.accessories.map(accessory => (
              <Accessory
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)} 
              />
            ))}
          </Accessories>
        )}

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
            <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
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