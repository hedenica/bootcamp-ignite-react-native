import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize'

export const Container = styled.View`
  width: 100%;
`;

export const Error = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(13)}px;
  color: ${({ theme }) => theme.colors.attention};
  margin-bottom: 7px;
`;