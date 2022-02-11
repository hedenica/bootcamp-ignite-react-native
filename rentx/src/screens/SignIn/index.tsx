import React, { useState } from 'react';
import { 
  StatusBar, 
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard 
} from 'react-native';
import { useTheme } from 'styled-components';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Form,
  Footer,
} from './styles';

export function SignIn() {
  const theme = useTheme();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
              enabled={false}
              loading={false} 
              onPress={() => {}} 
              />
            <Button
              light
              color={theme.colors.shape}
              title="Criar conta gratuita" 
              enabled={true} 
              loading={false} 
              onPress={() => {}}
            />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}