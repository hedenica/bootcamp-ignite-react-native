import React, { useEffect }from 'react';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated'

import BrandSvg from '../../assets/brand.svg';
import LogoSvg from '../../assets/logo.svg';

import {
  Container,
} from './styles';

type NavigationProps = {
  navigate:(screen:string) => void;
}

export function Splash() {
  const splashAnimation = useSharedValue(0);

  const { navigate } = useNavigation<NavigationProps>()

  const brandStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value, 
        [0, 50],
        [1, 0],
      ),
      transform: [
        {
          translateX: interpolate(splashAnimation.value,
            [0, 50],
           [0, -50],
           Extrapolate.CLAMP
          )
        }
      ]
    }
  })

  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value, 
        [0, 25, 50],
        [0, .3, 1]
      ),
      transform: [
        {
          translateX: interpolate(splashAnimation.value, 
            [0, 50],
            [-50, 0],
           Extrapolate.CLAMP
          )
        }
      ] 
    }
  })

  function startApp() {
    // todo: se o usuário tiver logado tem que ir para home
    // se o usuario tiver deslogado tem que ir para sign in
    navigate('SignIn')
  }

  useEffect(() => {
    splashAnimation.value = withTiming(
      50, 
      { duration: 1000 },
      () => {
        'worklet'
        runOnJS(startApp)()
      }
    );

  }, [])

  return (
    <Container>
      <Animated.View style={[brandStyle, { position: 'absolute' }]}>
        <BrandSvg width={80} height={50} />
      </Animated.View>
      <Animated.View style={[logoStyle, { position: 'absolute' }]}>
        <LogoSvg width={180} height={20} />
      </Animated.View>
    </Container>
  );
}
