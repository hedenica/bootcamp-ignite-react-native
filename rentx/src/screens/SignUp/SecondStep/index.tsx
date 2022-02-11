import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useTheme } from 'styled-components';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';

import {
  Container,
  Header,
  Steps,
  Title,
  Subtitle,
  Form,
  FormTitle,
} from './styles';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { PasswordInput } from '../../../components/PasswordInput/index';


type NavigationProps = {
  navigate:(screen:string, params: object) => void;
  goBack: () => void
}

type Params = {
  user: {
    name: string
    email: string
    driverLicense: string
  }
}

export function SecondStep() {
  const theme = useTheme()
  const { navigate, goBack } = useNavigation<NavigationProps>()
  const { params } = useRoute()

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const { user } = params as Params;

  async function handleRegister () {
    if (!password || !passwordConfirm) {
      return Alert.alert('Preencha os campos de senha corretamente')
    }

    if (password.length < 5 || passwordConfirm.length < 5) {
      return Alert.alert('Senha precisa ter no minímo 5 caracteres')
    }

    if (password !== passwordConfirm) {
      return Alert.alert('Senhas divergentes')
    }

    // TODO: Enviar para API

    navigate('Confirmation', {
      title: 'Conta criada', 
      message: `Agora é só fazer login\ne aproveitar`, 
      nextScreen: 'SignIn'
    })
  }

  return (
    <KeyboardAvoidingView behavior='position' enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={goBack} />
            <Steps>
              <Bullet />
              <Bullet active/>
            </Steps>
          </Header>
          <Title>
            Crie sua{'\n'}conta 
          </Title>
          <Subtitle>
            Faça seu cadastro de{'\n'}
            forma rápida e fácil
          </Subtitle>
          <Form>
            <FormTitle>2. Senha</FormTitle>
            <PasswordInput 
              iconName='lock'
              placeholder='Senha'
              onChangeText={setPassword}
              value={password}
            />
            <PasswordInput 
              iconName='lock'
              placeholder='Repetir senha'
              onChangeText={setPasswordConfirm}
              value={passwordConfirm}
            />
          </Form>
          <Button 
            title='Cadastrar'
            color={theme.colors.success}
            onPress={handleRegister}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}