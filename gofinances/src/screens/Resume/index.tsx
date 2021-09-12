import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { HistoryCard } from '../../components/HistoryCard'

import { categories } from '../../utils/categories';

import {
  Container,
  Header,
  Title,
  Content,
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
  total: string;
  color: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

  async function getTransactions() {
    const dataKey = '@gofinances:transactions';
    const storedData = await AsyncStorage.getItem(dataKey);
    const currentTransactions = storedData ? JSON.parse(storedData) : [];

    const outcomes = currentTransactions
      .filter((transaction: TransactionData) => transaction.type === 'outcome');

    const totalByCategory: CategoryData[] = []

    categories.forEach(category => {
      let categorySum = 0;

      outcomes.forEach((outcome: TransactionData) => {
        if (outcome.category === category.key) {
          categorySum += Number(outcome.amount);
        }
      });

      if (categorySum > 0) {
        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total,
        })
      }

    })

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    getTransactions();
  }, [])

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content>
        {
          totalByCategories.map(category => (
            <HistoryCard
              key={category.key}
              color={category.color}
              title={category.name}
              amount={category.total}
            />
          ))
        }
      </Content>
    </Container>
  )
}