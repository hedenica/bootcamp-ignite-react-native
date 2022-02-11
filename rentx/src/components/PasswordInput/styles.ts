import styled, { css } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { TextInput } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';

interface Props {
  isFocused: boolean
}

export const Container = styled.View`
  width: 100%;
  margin-bottom: 8px;

  flex-direction: row;
`;

export const IconContainer = styled.View<Props>`
  width: 55px;
  height: 55px;
  justify-content: center;
  align-items: center;
  margin-right: 2px;
  background-color: ${({ theme }) => theme.colors.background_secondary};

  ${({ isFocused, theme }) => isFocused && css`
    border-bottom-width: 2px;
    border-bottom-color: ${theme.colors.main};
  `}
`;

export const InputText = styled(TextInput)<Props>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_secondary};
  padding: 0 20px;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary_400};
  font-size: ${RFValue(15)}px;

  ${({ isFocused, theme }) => isFocused && css`
    border-bottom-width: 2px;
    border-bottom-color: ${theme.colors.main};
  `}
`

export const VisibilityContainer = styled.View<Props>`
  ${({ isFocused, theme }) => isFocused && css`
    border-bottom-width: 2px;
    border-bottom-color: ${theme.colors.main};
  `}
`;

export const ChangeVisibilityButton = styled(BorderlessButton)`
  width: 55px;
  height: 53px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background_secondary};
`;