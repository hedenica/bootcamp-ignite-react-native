import React, { useCallback, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { VictoryPie } from 'victory-native'
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { useFocusEffect  } from '@react-navigation/native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useTheme } from 'styled-components'

import { HistoryCard } from '../../components/HistoryCard'

import { categories } from '../../utils/categories';

import {
  Container,
  LoadContainer,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
} from './styles'

export interface TransactionData {
  type: 'income' | 'outcome';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  percent: string;
  color: string;
}

export function Resume() {
  const theme = useTheme();

  const [isLoading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

  function handleChangeDate(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1))
    } else {
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }

  async function getTransactions() {
    setLoading(true)
    const dataKey = '@gofinances:transactions';
    const storedData = await AsyncStorage.getItem(dataKey);
    const currentTransactions = storedData ? JSON.parse(storedData) : [];

    const outcomes = currentTransactions
      .filter((transaction: TransactionData) =>
        transaction.type === 'outcome' &&
        new Date(transaction.date).getMonth() === selectedDate.getMonth() &&
        new Date(transaction.date).getFullYear() === selectedDate.getFullYear()
      );

    const outcomesTotal = outcomes
      .reduce((accumulator: number, outcome: TransactionData) => {
        return accumulator + Number(outcome.amount);
      }, 0);

    const totalByCategory: CategoryData[] = []

    categories.forEach(category => {
      let categorySum = 0;

      outcomes.forEach((outcome: TransactionData) => {
        if (outcome.category === category.key) {
          categorySum += Number(outcome.amount);
        }
      });

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })

        const percent = `${(categorySum / outcomesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
        })
      }

    })

    setTotalByCategories(totalByCategory);
    setLoading(false);
  }

  useFocusEffect(useCallback(() => {
    getTransactions();
  }, [selectedDate]))

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeDate('prev')}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, 'MMMM, yyyy', {
                locale: ptBR,
              })}
            </Month>

            <MonthSelectButton onPress={() => handleChangeDate('next')}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              x="percent"
              y="total"
              colorScale={totalByCategories.map(category => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={60}
            />
          </ChartContainer>
          {
            totalByCategories.map(category => (
              <HistoryCard
                key={category.key}
                color={category.color}
                title={category.name}
                amount={category.totalFormatted}
              />
            ))
          }
        </Content>
      )}
    </Container>
  )
}