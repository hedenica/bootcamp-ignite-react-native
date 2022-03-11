import React from 'react';
import { 
  View,
  Text,
  TextInput,
  Button,
} from 'react-native';

export const Profile = () => {
  return (
    <View>
      <Text testID='profile-title'>Perfil</Text>
      <TextInput 
        testID='input-name'
        placeholder='Nome'
        autoCorrect={false}
        value='Hedênica'
      />
      <TextInput 
        testID='input-lastname'
        placeholder='Sobrenome'
        autoCorrect={false}
        value='Morais'
      />

      <Button title='Salvar' onPress={() => {}} />
    </View>
  );
}
