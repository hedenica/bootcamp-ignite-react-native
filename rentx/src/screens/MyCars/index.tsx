import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { useTheme } from 'styled-components';
import { format, parseISO } from 'date-fns'

import { Car as CarModel } from '../../database/model/Car';

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

interface DataProps {
  id: string;
  car: CarModel;
  start_date: string;
  end_date: string;
}

export function MyCars() {
  const theme = useTheme()
  const { goBack } = useNavigation<NavigationProps>();
  const [cars, setCars] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const isScreenFocused = useIsFocused()

  useEffect(() => {
    async function fetchCars() {
      try {
        const { data } = await api.get<DataProps[]>('/rentals')
        const dataFormatted = data.map((data: DataProps) => {
          return {
            id: data.id,
            car: data.car,
            start_date: format(parseISO(data.start_date), 'dd/MM/yyyy'),
            end_date: format(parseISO(data.end_date), 'dd/MM/yyyy'),
          }
        });

        setCars(dataFormatted)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [isScreenFocused])

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
                    <CarFooterDate>{item.start_date}</CarFooterDate>
                    <AntDesign 
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.end_date}</CarFooterDate>
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