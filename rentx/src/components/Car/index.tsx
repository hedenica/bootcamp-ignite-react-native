import React from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import { RectButtonProps } from 'react-native-gesture-handler';

import { Car as CarModel } from '../../database/model/Car';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import { CarDTO } from '../../dtos/CarDTO';

import {
  Container,
  Details,
  Brand,
  Name,
  About,
  Rent,
  Period,
  Price,
  Type,
  CarImage,
} from './styles';

interface Props extends RectButtonProps {
  carInfo: CarModel;
}

export function Car({ carInfo, ...rest }: Props) {
  const { 
    brand,
    name,
    thumbnail,
    fuel_type,
    period,
    price
  } = carInfo;
  const { isConnected } = useNetInfo();

  const MotorIcon = getAccessoryIcon(fuel_type)

  return (
    <Container {...rest}>
      <Details>
        <Brand>{brand}</Brand>
        <Name>{name}</Name>

        <About>
          <Rent>
            <Period>{period}</Period>
            <Price>{`R$ ${isConnected ? price : '...'}`}</Price>
          </Rent>

          <Type>
            <MotorIcon />
          </Type>
        </About>
      </Details>
      <CarImage source={{ uri: thumbnail }} resizeMode="contain"/>
    </Container>
  );
}