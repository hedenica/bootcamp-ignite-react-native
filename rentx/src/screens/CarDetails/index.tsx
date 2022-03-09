import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTheme } from 'styled-components';
import { useNetInfo } from '@react-native-community/netinfo';

import Animated, { 
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated'

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { CarDTO } from '../../dtos/CarDTO';
import { Car as ModelCar } from '../../database/model/Car';

import api from '../../services/api';

import {
  Container,
  Header,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  About,
  Footer,
  OfflineInfo,
} from './styles';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

type NavigationProps = {
  navigate:(screen:string, car: object) => void;
  goBack: () => void;
}

interface Params {
  car: ModelCar;
}

export function CarDetails() {
  const { isConnected } = useNetInfo();
  const theme = useTheme()
  const { navigate, goBack } = useNavigation<NavigationProps>();
  const route = useRoute();
  const { car } = route.params as Params;
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
  const scrollY = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y
  })

  const headerStyleAnimation = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 200],
        [200, 70],
        Extrapolate.CLAMP
      )
    }
  })

  const sliderCarsStyleAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 150],
        [1,0],
        Extrapolate.CLAMP
      ),
    }
  })

  function handleChooseRentalPeriod() {
    navigate('Scheduling', { car });
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
      <Animated.View style={[
        headerStyleAnimation,
        styles.header,
        { backgroundColor: theme.colors.background_secondary }
      ]}>
        <Header>
          <BackButton onPress={() => goBack() } />
        </Header>

        <Animated.View style={[sliderCarsStyleAnimation, styles.carSlider]}>
          <ImageSlider imagesUrl={
            !!carUpdated.photos ? carUpdated.photos 
            : [{ id: car.thumbnail, photo: car.thumbnail}]
          } />
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: getStatusBarHeight() + 160,
          paddingHorizontal: 24,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ { isConnected ? car.price : '...'}</Price>
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
        <About>
          {carUpdated.about}
          {carUpdated.about}
        </About>
      </Animated.ScrollView>

      <Footer>
        <Button 
          title="Escolher período do aluguel"
          onPress={handleChooseRentalPeriod}
          enabled={isConnected}
        />

        {!isConnected && (
          <OfflineInfo>
            Conecte-se a Internet para ver mais detalhes e 
            agendar o aluguel do veículo
          </OfflineInfo>
        )}
      </Footer>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 1,
  },
  carSlider: {
    marginTop: getStatusBarHeight() + 32
  }
})