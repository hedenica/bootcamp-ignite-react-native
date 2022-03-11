import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import { mocked } from 'jest-mock'
import fetchMock from 'jest-fetch-mock';
import { mockAsyncStorage } from '../../jestSetupFile';
import { AuthProvider, useAuth } from './auth';
import { startAsync } from 'expo-auth-session'
import AsyncStorage from '@react-native-async-storage/async-storage';

fetchMock.enableMocks();

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('expo-auth-session');

// const googleMock = startAsync as jest.Mock
const googleMock = mocked(startAsync as jest.Mock)

const mockedResponse = {
  id: 'any_id',
  name: 'Jane Doe',
  email: 'jane-doe@email.com',
  photo: 'any_photo.png'
}

fetchMock.mockResponse(JSON.stringify(mockedResponse));

describe('Authentication Hook 🪝', () => {
  beforeEach(async () => {
    const userCollectionKey = "@gofinances:user";
    await AsyncStorage.removeItem(userCollectionKey);
    jest.clearAllMocks()
  });

  it('sign in using an existing Google account', async () => {
    googleMock.mockImplementationOnce(() => ({
      type: 'success',
      params: { access_token: 'test-token' },
    }))

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await waitFor(() => {
      result.current.signInWithGoogle();
      expect(result.current.user.email)
        .toBe('jane-doe@email.com');
    })
  });

  it('does not connect if user cancels authentication with Google', async () => {
    googleMock.mockImplementationOnce(() => ({ type: 'cancel' }))

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await waitFor(() => {
      result.current.signInWithGoogle();
      expect(result.current.user).not.toHaveProperty('id')
    })
  });

  it('throws error if theres wrong params', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    try {
      await waitFor(() => {
        result.current.signInWithGoogle();
      })
    } catch (error) {
      expect(result.current.user).toThrowError()
    }
  });

});

