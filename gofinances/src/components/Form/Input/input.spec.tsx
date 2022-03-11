import React from 'react';
import { render } from '@testing-library/react-native';

import { Input } from '.'
import { ThemeProvider } from 'styled-components/native'
import theme from '../../../global/styles/theme'

const Providers: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    { children }
  </ThemeProvider>
)

describe('Input Component', () => {
  it('should render red border color when active', () => {
    const { getByTestId } = render(
      <Input
        testID='input-email'
        active
        placeholder='E-mail'
        keyboardType='email-address' 
      />,
      {
        wrapper:Providers
      })

    const input = getByTestId('input-email')

    expect(input.props.style[0].borderColor)
      .toEqual(theme.colors.attention)
  });
})