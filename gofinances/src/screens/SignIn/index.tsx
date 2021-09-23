import React, { useState } from 'react'
import { ActivityIndicator, Alert, Platform } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components'

import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'

import { useAuth } from '../../hooks/auth';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignTitle,
  Footer,
  FooterWrapper,
} from './styles'

export function SignIn() {
  const [isLoading, setLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();
  const theme = useTheme();

  function handleSignInWithGoogle() {
    try {
      setLoading(true)
      return signInWithGoogle()
    } catch (error) {
      console.log(error);
      setLoading(false)
      Alert.alert('Ops, tivemos um erro ao logar, tente novamente!')
    }
  }

  function handleSignInWithApple() {
    try {
      setLoading(true)
      return signInWithApple()
    } catch (error) {
      console.log(error);
      setLoading(false)
      Alert.alert('Ops, tivemos um erro ao logar, tente novamente!')
    }
  }

  return(
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>
        </TitleWrapper>

        {Platform.OS === 'ios' ? (
          <SignTitle>
            Faça seu login com {'\n'}
            uma das contas abaixo
          </SignTitle>
        ) : (
          <SignTitle>
            Faça seu login com {'\n'}
            a Google
          </SignTitle>
        )}
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === 'ios' && (
            <SignInSocialButton
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>

        { isLoading && 
          <ActivityIndicator
            color={theme.colors.shape}
            style={{ marginTop: 20 }}
          />
        }
      </Footer>
    </Container>
  )
}