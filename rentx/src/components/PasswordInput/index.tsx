import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { useTheme } from 'styled-components'

import {
  Container,
  IconContainer,
  InputText,
  VisibilityContainer,
  ChangeVisibilityButton,
} from './styles';

interface InputProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name']
  value?: string;
}

export function PasswordInput({ iconName, value, ...rest }:InputProps) {
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  function handleInputFocus() {
    setIsFocused(true)
  }

  function handleInputBlur() {
    setIsFocused(false)
    setIsFilled(!!value)
  }


  const handlePasswordVisibilityChange = () => {
    setIsPasswordVisible(prevState => !prevState)
  }

  return (
    <Container>
      <IconContainer isFocused={isFocused}>
        <Feather 
          name={iconName}
          size={24}
          color={isFocused || isFilled ? theme.colors.main : theme.colors.text}
        />
      </IconContainer>

      <InputText
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        secureTextEntry={isPasswordVisible}
        isFocused={isFocused}
        {...rest} 
      />
      <VisibilityContainer isFocused={isFocused}>
        <ChangeVisibilityButton onPress={handlePasswordVisibilityChange}>
          <Feather 
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={24}
            color={isFocused || isFilled ? theme.colors.main : theme.colors.text}
          />
        </ChangeVisibilityButton>
      </VisibilityContainer>
    </Container>
  );
}