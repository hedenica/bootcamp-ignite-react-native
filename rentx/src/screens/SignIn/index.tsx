import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import { 
  StatusBar, 
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard, 
  Alert
} from 'react-native';
import * as Yup from 'yup';
import { useTheme } from 'styled-components';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Form,
  Footer,
} from './styles';


type NavigationProps = {
  navigate:(screen:string) => void;
}

export function SignIn() {
  const { navigate } = useNavigation<NavigationProps>();
  const theme = useTheme();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = useAuth()

  async function handleSignIn() {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('Email obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string()
          .required('A senha é obrigatória'),
      });
  
      await schema.validate({ email, password })

      signIn({ email, password })
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        Alert.alert('Opa', error.message)
      } else {
        Alert.alert('Erro na autenticação', 'Verifique seus dados')
      }
    }
  }

  function handleNewAccount() {
    navigate('SignUpFirstStep');
  }

  return (
    <KeyboardAvoidingView behavior='position' enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar 
            barStyle='dark-content'
            backgroundColor="transparent"
            translucent
          />
          <Header>
            <Title>
            Estamos{'\n'}quase lá.
            </Title>
            <SubTitle>
            Faça seu login para começar{'\n'}
            uma experiência incrível.
            </SubTitle>
          </Header>
          <Form>
            <Input 
              iconName='mail' 
              placeholder='E-mail' 
              keyboardType='email-address' 
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={setEmail}
              value={email}
            />
            <PasswordInput 
              iconName='lock' 
              placeholder='Senha'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={setPassword}
              value={password}
            />
          </Form>

          <Footer>
            <Button 
              title="Login" 
              enabled={true}
              loading={false} 
              onPress={handleSignIn} 
              />
            <Button
              light
              color={theme.colors.shape}
              title="Criar conta gratuita" 
              enabled={true} 
              loading={false} 
              onPress={handleNewAccount}
            />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}