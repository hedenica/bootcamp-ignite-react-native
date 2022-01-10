import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from 'styled-components';
import { RFValue } from 'react-native-responsive-fontsize'
import { RectButton, PanGestureHandler } from 'react-native-gesture-handler'
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring
} from 'react-native-reanimated'

import Logo from '../../assets/logo.svg'
import api from '../../services/api'

import { Car } from '../../components/Car';
import { LoaderAnimated } from '../../components/LoaderAnimated';

import { CarDTO } from '../../dtos/CarDTO';

import {
  Container,
  Header,
  HeaderContent,
  TotalCars,
  CarList,
} from './styles';
import theme from '../../styles/theme';

const ButtonAnimated = Animated.createAnimatedComponent(RectButton)

type NavigationProps = {
  navigate:(screen:string,  car?: object) => void;
}

export function Home() {
  const theme = useTheme()
  const { navigate } = useNavigation<NavigationProps>();
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<CarDTO[]>([]);

  // animations 
  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);
  const onGestureEvent = useAnimatedGestureHandler({
    onStart(_, ctx: { positionX: number, positionY: number}) {
      ctx.positionX = positionX.value;
      ctx.positionY = positionY.value;
    },
    onActive(event, ctx: any){
      positionX.value = ctx.positionX + event.translationX
      positionY.value = ctx.positionY + event.translationY
    },
    onEnd(){
      positionX.value = withSpring(0);
      positionY.value = withSpring(0);
    },
  });

  const myCarsButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: positionX.value },
        { translateY: positionY.value },
      ]
    }
  })

  function handleCarDetails(car: CarDTO) {
    navigate('CarDetails', { car });
  }

  function handleOpenMyCars() {
    navigate('MyCars');
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

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true
    })
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
          keyExtractor={(item: CarDTO) => String(item.id)}
          renderItem={({ item }) => <Car carInfo={item} onPress={() => handleCarDetails(item)} />}
        />
      )}
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[
            myCarsButtonStyle,
            { position: 'absolute', bottom: 13, right: 22 }
          ]}
        >
          <ButtonAnimated 
            style={styles.button}
            onPress={handleOpenMyCars}
          >
            <Ionicons 
              name="ios-car-sport" 
              size={32} 
              color={theme.colors.shape} 
            />
          </ButtonAnimated>
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.main,
  }
})