import React, { 
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
} from 'react';
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const { CLIENT_ID } = process.env
const { REDIRECT_URI } = process.env

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle: VoidFunction;
  signInWithApple: VoidFunction;
  signOut: VoidFunction;
  userStorageLoading: boolean;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  }
  type: string;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params} = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

      if (type === 'success') {
        const response = await fetch (`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
        
        const userInfo = await response.json();

        setUser({
          id: userInfo.id,
          name: userInfo.given_name,
          email: userInfo.email,
          photo: userInfo.picture,
        });

        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userInfo));
      }

    } catch (error: any) {
      throw new Error(error);
    }
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      })

      if (credential) {
        const userInfo = {
          id: String(credential.user),
          name: credential.fullName!.givenName!,
          email: credential.email!,
          photo: `https://ui-avatars.com/api/?name=${credential.fullName!.givenName!}&length=1`,
        }

        setUser(userInfo);
        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userInfo));
      }

    } catch (error: any) {
      throw new Error(error);
    }
  }

  async function signOut() {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          onPress: () => {
            setUser({} as User);
            AsyncStorage.removeItem('@gofinances:user');
          }
        }
      ]
    )
  }

  useEffect(() => {
    async function loadStorageData() {
      const user = await AsyncStorage.getItem('@gofinances:user');

      if (user) {
        setUser(JSON.parse(user) as User);
      }

      setUserStorageLoading(false);
    }

    loadStorageData();
  }, [])

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithApple, signOut, userStorageLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context
}

export { AuthProvider, useAuth }