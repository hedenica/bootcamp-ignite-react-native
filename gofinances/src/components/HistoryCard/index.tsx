import React from 'react'

import { 
  Container,
  Title,
  Amount,
} from './styles'

interface Props {
  color: string;
  title: string;
  amount: string;
}

export function HistoryCard({ title, amount, color }: Props) {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  )
}
