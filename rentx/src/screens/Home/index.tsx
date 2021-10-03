import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { RFValue } from 'react-native-responsive-fontsize'

import Logo from '../../assets/logo.svg'
import api from '../../services/api'

import { Car } from '../../components/Car';
import { Loader } from '../../components/Loader';

import { CarDTO } from '../../dtos/CarDTO';

import {
  Container,
  Header,
  HeaderContent,
  TotalCars,
  CarList,
} from './styles';

type NavigationProps = {
  navigate:(screen:string,  car: object) => void;
}

export function Home() {
  const { navigate } = useNavigation<NavigationProps>();
  const [loading, setLoading] = useState(true);
  const [cards, setCars] = useState<CarDTO[]>([]);

  function handleCarDetails(car: CarDTO) {
    navigate('CarDetails', { car });
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const { data } = await api.get('/cars')
        setCars(data)
      } catch (error) {
        console.log( error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo 
            width={RFValue(108)}
            height={RFValue(12)}
          />
          <TotalCars>
            Total de 12 carros
          </TotalCars>
        </HeaderContent>
      </Header>

      {loading ? <Loader /> : (
        <CarList 
          data={cards}
          keyExtractor={(item: CarDTO) => String(item.id)}
          renderItem={({ item }) => <Car carInfo={item} onPress={() => handleCarDetails(item)} />}
        />
      )}
    </Container>
  );
}