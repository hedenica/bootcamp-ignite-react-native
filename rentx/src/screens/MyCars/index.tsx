import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { useTheme } from 'styled-components';

import { CarDTO } from '../../dtos/CarDTO';

import api from '../../services/api';

import { BackButton } from '../../components/BackButton/index';
import { Car } from '../../components/Car/index';
import { LoaderAnimated } from '../../components/LoaderAnimated';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWrapper,
  CarFooter,
  CardFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from './styles';

type NavigationProps = {
  goBack: () => void;
}

interface CarProps {
  id: string;
  user: string;
  car: CarDTO
  startDate: string;
  endDate: string;
}

export function MyCars() {
  const theme = useTheme()
  const { goBack } = useNavigation<NavigationProps>();
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      try {
        const { data } = await api.get('/cars')
        setCars(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

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
        <SubTitle>
          Conforto, segurança e praticidade.
        </SubTitle>
      </Header>
      {loading ? (
        <LoaderAnimated />
      ) : (
        <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantity>
              {String(cars.length).padStart(2, '0')}
            </AppointmentsQuantity>
          </Appointments>

          <FlatList 
            data={cars}
            keyExtractor={item => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CarWrapper>
                <Car carInfo={item.car} />
                <CarFooter>
                  <CardFooterTitle>Período</CardFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign 
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>
            )}
          />
        </Content>
      )}
    </Container>
  );
}