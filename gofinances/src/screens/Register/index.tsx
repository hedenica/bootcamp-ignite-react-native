import React, { useState } from 'react'
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'

import { InputForm } from '../../components/Form/InputForm'
import { Button } from '../../components/Form/Button'
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton'
import { CategorySelectButton } from '../../components/Form/CategorySelectButton'

import { CategorySelect } from '../CategorySelect'

import { useAuth } from '../../hooks/auth'

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles'

interface FormData {
  name: string;
  amount: string;
}

type NavigationProps = {
  navigate:(screen:string) => void;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome obrigatório ⚠️'),
  amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não poder ser negativo')
    .required('Preço obrigatório ⚠️'),
})

export function Register() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema)})
  const { user } = useAuth()

  const navigation = useNavigation<NavigationProps>()

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState('')
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  })

  function handleOpenCategoryModal() {
    setCategoryModalOpen(true)
  }

  function handleCloseCategoryModal() {
    setCategoryModalOpen(false)
  }

  function handleTransactionTypeSelect(type: 'income' | 'outcome') {
    setTransactionType(type)
  }

  async function handleRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert('Selecione um tipo de transação')
    }

    if (category.key === 'category') {
      return Alert.alert('Selecione uma categoria')
    }

    const newTransaction = {
      ...form,
      id: String(uuid.v4()),
      type: transactionType,
      category: category.key,
      date: new Date(),
    }

    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`
      const storedData = await AsyncStorage.getItem(dataKey);
      const parsedData = storedData ? JSON.parse(storedData) : [];

      const formattedData = [...parsedData, newTransaction]

      await AsyncStorage.setItem(dataKey, JSON.stringify(formattedData))

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      navigation.navigate('Listagem');

    } catch (error) {
      console.log(error)
      Alert.alert('Erro ao registrar transação')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton
                type="income"
                title="Entrada"
                isActive={transactionType === 'income'}
                onPress={() => handleTransactionTypeSelect('income')}
              />
              <TransactionTypeButton
                type="outcome"
                title="Saída"
                isActive={transactionType === 'outcome'}
                onPress={() => handleTransactionTypeSelect('outcome')}
              />
            </TransactionsTypes>
            <CategorySelectButton
              testID='button-category'
              title={category.name}
              onPress={handleOpenCategoryModal}
            />
          </Fields>
          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal testID='modal-category' visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}
