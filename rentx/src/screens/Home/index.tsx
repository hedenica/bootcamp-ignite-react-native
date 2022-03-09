import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '../../database';

import Logo from '../../assets/logo.svg'
import api from '../../services/api'

import { Car } from '../../components/Car';
import { LoaderAnimated } from '../../components/LoaderAnimated';
import { Car as CarModel } from '../../database/model/Car'

import { CarDTO } from '../../dtos/CarDTO';

import {
  Container,
  Header,
  HeaderContent,
  TotalCars,
  CarList,
} from './styles';

type NavigationProps = {
  navigate:(screen:string,  car?: object) => void;
}

export function Home() {
  const { isConnected } = useNetInfo();
  const { navigate } = useNavigation<NavigationProps>();
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<CarModel[]>([]);

  function handleCarDetails(car: CarDTO) {
    navigate('CarDetails', { car });
  }

  async function offlineSync() {
    await synchronize({
      database,
      // ℹ️ Função que pega as atualizações online do Backend
      pullChanges: async ({ lastPulledAt }) => {
        const { data } = await api
          .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);
        
          const { changes, latestVersion } = data;

          console.log('### SINCRONIZAÇÃO 🔥')
          console.log({ changes })
          return { changes, timestamp: latestVersion }

      },
      // ℹ️ Função que envia as atualização offline para o backend
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        console.log('PUSH 🔥')
        console.log(user)
        await api.post('users/sync', user).catch(console.log);
      },
    });
  }

  useEffect(() => {
    let isMounted = true;
    async function fetchCars() {
      try {
        const carCollection = database.get<CarModel>('cars');
        const updatedCars = await carCollection.query().fetch();

        if (isMounted) {
          setCars(updatedCars)
        }
      } catch (error) {
        console.log(error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCars()
    return () => {
      isMounted = false;
    }
  }, [])

  useEffect(() => {
    const syncChanges = async () => {
      if (isConnected) {
        try {
          await offlineSync(); //Watermelon
        }
        catch (error) {
          console.log('ERROR AQUI', error.message);
        }
      }
    }

    syncChanges();
  }, [isConnected]);

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
          {!!cars.length && (
            <TotalCars>
              Total de {cars.length} carros
            </TotalCars>
          )}
        </HeaderContent>
      </Header>

      {loading ? <LoaderAnimated /> : (
        <CarList 
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => 
            <Car 
              carInfo={item} 
              onPress={() => handleCarDetails(item)} 
            />}
        />
      )}
    </Container>
  )
}