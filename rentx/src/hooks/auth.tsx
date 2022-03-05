import React, { 
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import api from '../services/api';
import { database } from '../database'
import { User as UserModel } from '../database/model/User'

interface User {
  id: string;
  user_id: string;
  email: string;
  name: string;
  driver_license: string;
  avatar: string;
  token: string;
}

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: User;
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut: () => Promise<void>
  updateUser: (user: User) => Promise<void>
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
  const [data, setData] = useState<User>({} as User)

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const { data }: SignInResponse = await api.post('sessions', {
        email,
        password 
      });
  
      const { token, user } = data
  
      // inserindo por default em todas as requisições que fizer
      // um cabeçalho/header, passando o `token`
      api.defaults.headers.authorization = `Bearer ${token}`;

      // salvando o usuário no banco
      const userCollection = database.get<UserModel>('users');
      await database.write(async () => {
        await userCollection.create(( newUser ) => {
          newUser.user_id = user.id,
          newUser.name = user.name,
          newUser.email = user.email,
          newUser.driver_license = user.driver_license,
          newUser.avatar = user.avatar,
          newUser.token = token
        })
      })

      setData({ ...user, token })
    } catch (error) {
      throw new Error(error);
    }
  }
  
  const signOut = async () => {
    try {
      const userCollection = database.get<UserModel>('users');

      await database.write(async () => {
        const currentUser = await userCollection.find(data.id);

        await currentUser.destroyPermanently();
      });

      setData({} as User);

    } catch (error) {
      throw new Error(error)
    }
  }

  const updateUser = async (user: User) => {
    try {
      const userCollection = database.get<UserModel>('users');

      await database.write(async () => {
        const currentUser = await userCollection.find(user.id);

        await currentUser.update((currentUserData => {
          currentUserData.name = user.name,
          currentUserData.driver_license = user.driver_license,
          currentUserData.avatar = user.avatar
        }))
      });

      setData(user)

    } catch (error) {
      throw new Error(error)
    }
  }

  useEffect(() => {
    async function loadUserData() {
      const userCollection = database.get<UserModel>('users');
      const response = await userCollection.query().fetch()

      if (response.length > 0) {
        const userData = response[0]._raw as unknown as User

        api.defaults.headers.authorization = `Bearer ${userData.token}`;
        setData(userData)
      }
    }

    loadUserData()
  }, [])

  return (
    <AuthContext.Provider 
      value={{
        user: data,
        signIn,
        signOut,
        updateUser,
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