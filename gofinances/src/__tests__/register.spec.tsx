import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native'
import { mockAsyncStorage } from '../../jestSetupFile';

import { Register } from '../screens/Register';
import theme from '../global/styles/theme';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}))

const Providers: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>{ children }</ThemeProvider>
)

describe('Register screen', () => {
  it('modal starts closed', () => {
    const { getByTestId } = render(<Register />, { wrapper: Providers } )

    const modal = getByTestId('modal-category');

    expect(modal.props.visible).toBeFalsy()
  });

  it('opens the modal', async () => {
    const { getByTestId } = render(<Register />, { wrapper: Providers } )

    const modal = getByTestId('modal-category');
    const button = getByTestId('button-category')

    
    fireEvent.press(button);
    expect(modal.props.visible).toBeTruthy()

    // await waitFor(() => {
    //   expect(modal.props.visible).toBeTruthy()
    // }, { timeout: 1000 })
  });
})