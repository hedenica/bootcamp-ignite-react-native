import React from 'react';
import { render } from '@testing-library/react-native'

import { Profile } from '../../screens/Profile';

describe('Profile Screen', () => {
  it('renders correctly', () => {
    const component = render(<Profile />)

    expect(component).toMatchSnapshot()
  })

  it('renders correctly the user input name placeholder', () => {
    const { getByPlaceholderText } = render(<Profile />)

    const placeholder = getByPlaceholderText('Nome')

    expect(placeholder).toBeTruthy()
  })

  it('loads the user data', () => {
    const { getByTestId } = render(<Profile />)

    const inputName = getByTestId('input-name')
    const inputLastname = getByTestId('input-lastname')

    expect(inputName.props.value).toEqual('Hedênica')
    expect(inputLastname.props.value).toEqual('Morais')

  })

  it('render the title correctly', () => {
    const { getByTestId } = render(<Profile />)

    const textTitle = getByTestId('profile-title')

    expect(textTitle.props.children).toContain('Perfil')
  })
});