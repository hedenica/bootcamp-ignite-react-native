import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useFocusEffect  } from '@react-navigation/native'
import { useTheme } from 'styled-components';

import { Card } from '../../components/Card/index';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  CardsContainer,
  Transactions,
  TransactionList,
  Title,
  LogoutButton,
  LoadContainer,
} from './styles'

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface CardProps {
  amount: string;
}

interface CardData {
  income: CardProps;
  outcome: CardProps;
  total: CardProps;
}

export function Dashboard() {
  const theme = useTheme()
  const [isLoading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [cardData, setCardData] = useState<CardData>({} as CardData);

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions'
    const response = await AsyncStorage.getItem(dataKey);
    const currentTransactions = response ? JSON.parse(response) : [];

    let incomeTotal = 0;
    let outcomeTotal = 0;

    const formattedTransactions: DataListProps[] = currentTransactions.map((transaction: DataListProps) => {

      if (transaction.type === 'income') {
        incomeTotal += Number(transaction.amount);
      } else {
        outcomeTotal += Number(transaction.amount);
      }

      const amount = Number(transaction.amount)
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      const formattedDate = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(transaction.date));

      return {
        ...transaction,
        amount,
        date: formattedDate,
      }
    })

    setTransactions(formattedTransactions);
    setCardData({
      income: {
        amount: incomeTotal.toLocaleString('pt-BR', { 
          style: 'currency', 
          currency: 'BRL',
        }),
      },
      outcome: {
        amount: outcomeTotal.toLocaleString('pt-BR', { 
          style: 'currency', 
          currency: 'BRL',
        }),
      },
      total: {
        amount: (incomeTotal - outcomeTotal).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      },
    })

    setLoading(false)
  }

  useEffect(() => {
    loadTransactions();
  },[]);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/56850413?v=4'}} />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Hedênica</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={() => {}}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <CardsContainer>
            <Card
              type="income"
              title="Entradas"
              amount={cardData.income.amount}
              lastTransaction="Última entrada dia 13 de abril"
            />
            <Card
              type="outcome"
              title="Saídas"
              amount={cardData.outcome.amount}
              lastTransaction="Última saída dia 03 de abril"
            />
            <Card
              type="total"
              title="Total"
              amount={cardData.total.amount}
              lastTransaction="01 à 16 de abril"
            />
          </CardsContainer>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList 
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  )
}
