import React, { 
  createContext,
  useContext,
  useState,
  ReactNode
} from 'react'
import api from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  driver_license: string;
  avatar: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: User;
  signIn: (credentials: SignInCredentials) => Promise<void>
}

interface SignInResponse {
  data: {
    token: string;
    user: User;
  }
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);


interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<AuthState>({} as AuthState)

  const signIn = async ({ email, password }: SignInCredentials) => {
    const { data }: SignInResponse = await api.post('sessions', {
      email,
      password 
    });

    const { token, user } = data

    // inserindo por default em todas as requisições que fizer
    // um cabeçalho/header, passando o `token`
    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user })
  }

  return (
    <AuthContext.Provider 
      value={{
        user: data.user,
        signIn
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }