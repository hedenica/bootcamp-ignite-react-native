import React, { useState } from 'react';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import * as Yup from 'yup';

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  SignOutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
  Section,
} from './styles';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput/index';
import { useAuth } from '../../hooks/auth';

type Options = 'dataEdit' | 'passwordEdit'

export function Profile() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, signOut, updateUser } = useAuth()

  const [option, setOption] = useState<Options>('dataEdit');
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [driverLicense, setDriverLicense] = useState(user.driver_license);

  const handleBack = () => navigation.goBack()

  const handleOptionPress = (selectedOption: Options) => setOption(selectedOption)

  const handleChangeAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    })

    const { uri } = result as ImageInfo

    if (result.cancelled) { 
      return 
    }

    if (uri) {
      setAvatar(uri)
    }
  }

  const handleUserUpdate = async () => {
    try {
      const schema = Yup.object().shape({
        driverLicense: Yup.string().required('CNH é obrigatório'),
        name: Yup.string().required('Nome é obrigatório')
      })

      const data = { name, driverLicense }

      await schema.validate(data);

      await updateUser({
        ...user,
        name,
        driver_license: driverLicense,
        avatar,
      });

      Alert.alert('Perfil atualizado com sucesso ✅')

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
       Alert.alert('Opa', error.message)
      }
      console.log(error)
      Alert.alert('Não foi possível atualizar o perfil, tente novamente.')
    }
  }

  const handleSignOut = () => {
    Alert.alert(
      'Tem certeza? 👀',
      'Lembre-se, que precisará de internet para logar novamente.',
      [
        { text: 'Cancelar ❌', onPress: () => {} },
        { text: 'Sair ✅', onPress: () => signOut() }
      ]
    )
  }

  return (
    <KeyboardAvoidingView behavior='position' enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <HeaderTop>
              <BackButton color={theme.colors.shape} onPress={handleBack} />
              <HeaderTitle>Editar Perfil</HeaderTitle>
              <SignOutButton onPress={handleSignOut}>
                <Feather name='power' size={24} color={theme.colors.shape} />
              </SignOutButton>
            </HeaderTop>
            <PhotoContainer>
              { !!avatar && <Photo source={{ uri: avatar }} />}
              <PhotoButton onPress={handleChangeAvatar}>
                <Feather name='camera' size={24} color={theme.colors.shape} />
              </PhotoButton>
            </PhotoContainer>
          </Header>

          <Content style={{ marginBottom: useBottomTabBarHeight()}}>
            <Options>
              <Option 
                active={option === 'dataEdit'}
                onPress={() => handleOptionPress('dataEdit')}
              >
                <OptionTitle active={option === 'dataEdit'}>
                  Dados
                </OptionTitle>
              </Option>
              <Option 
                active={option === 'passwordEdit'}
                onPress={() => handleOptionPress('passwordEdit')}
              >
                <OptionTitle active={option === 'passwordEdit'}>
                  Trocar senha
                </OptionTitle>
              </Option>
            </Options>
            {option === 'dataEdit' ? (
              <Section>
                <Input 
                  iconName='user'
                  placeholder='Nome'
                  autoCorrect={false}
                  defaultValue={user.name}
                  onChangeText={setName}
                />
                <Input 
                  iconName='mail'
                  editable={false}
                  defaultValue={user.email}
                />
                <Input 
                  iconName='credit-card'
                  placeholder='CNH'
                  keyboardType='numeric'
                  defaultValue={user.driver_license}
                  onChangeText={setDriverLicense}
                />
              </Section>
            ): (
              <Section>
                <PasswordInput iconName='lock' placeholder='Senha atual' />
                <PasswordInput iconName='lock' placeholder='Nova senha' />
                <PasswordInput iconName='lock' placeholder='Repetir senha' />
              </Section>
            )}
            <Button 
              title='Salvar alterações'
              onPress={handleUserUpdate}
            />
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}