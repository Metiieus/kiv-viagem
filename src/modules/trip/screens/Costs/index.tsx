import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../../../core/theme';
import { Button, Input, Card } from '../../../../core/components';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #F8F8F8;
`;

const Header = styled(View)`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.l}px;
  padding-top: 60px;
`;

const HeaderTitle = styled(Text)`
  font-size: 28px;
  font-weight: bold;
  color: ${theme.colors.background};
  margin-bottom: ${theme.spacing.s}px;
`;

const HeaderSubtitle = styled(Text)`
  font-size: 14px;
  color: ${theme.colors.background};
  opacity: 0.9;
`;

const FormContainer = styled(View)`
  padding: ${theme.spacing.m}px;
`;

const InputGroup = styled(View)`
  margin-bottom: ${theme.spacing.m}px;
`;

const Label = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.s}px;
`;

const ResultCard = styled(Card)`
  background-color: ${theme.colors.primary};
  margin-top: ${theme.spacing.m}px;
`;

const ResultRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${theme.spacing.s}px 0;
`;

const ResultLabel = styled(Text)`
  font-size: 16px;
  color: ${theme.colors.background};
`;

const ResultValue = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.background};
`;

const TotalRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding-top: ${theme.spacing.m}px;
  border-top-width: 1px;
  border-top-color: rgba(255, 255, 255, 0.3);
  margin-top: ${theme.spacing.s}px;
`;

const TotalLabel = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.background};
`;

const TotalValue = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.success};
`;

interface CostResult {
  fuelCost: number;
  tollCost: number;
  total: number;
}

export default function CostsScreen() {
  const [distance, setDistance] = useState('');
  const [consumption, setConsumption] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [tollCost, setTollCost] = useState('');
  const [result, setResult] = useState<CostResult | null>(null);

  const calculateCosts = () => {
    const distanceNum = parseFloat(distance.replace(',', '.'));
    const consumptionNum = parseFloat(consumption.replace(',', '.'));
    const fuelPriceNum = parseFloat(fuelPrice.replace(',', '.'));
    const tollCostNum = parseFloat(tollCost.replace(',', '.')) || 0;

    if (!distanceNum || !consumptionNum || !fuelPriceNum) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (consumptionNum <= 0) {
      Alert.alert('Atenção', 'O consumo deve ser maior que zero');
      return;
    }

    // Cálculo: (distância / consumo) × preço do combustível
    const fuelCost = (distanceNum / consumptionNum) * fuelPriceNum;

    setResult({
      fuelCost,
      tollCost: tollCostNum,
      total: fuelCost + tollCostNum,
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>Calcular Custos</HeaderTitle>
        <HeaderSubtitle>
          Descubra quanto você vai gastar na sua viagem
        </HeaderSubtitle>
      </Header>

      <FormContainer>
        <InputGroup>
          <Label>Distância (km) *</Label>
          <Input
            placeholder="Ex: 450"
            value={distance}
            onChangeText={setDistance}
            keyboardType="decimal-pad"
          />
        </InputGroup>

        <InputGroup>
          <Label>Consumo do Veículo (km/L) *</Label>
          <Input
            placeholder="Ex: 12.5"
            value={consumption}
            onChangeText={setConsumption}
            keyboardType="decimal-pad"
          />
        </InputGroup>

        <InputGroup>
          <Label>Preço do Combustível (R$/L) *</Label>
          <Input
            placeholder="Ex: 5.89"
            value={fuelPrice}
            onChangeText={setFuelPrice}
            keyboardType="decimal-pad"
          />
        </InputGroup>

        <InputGroup>
          <Label>Custo de Pedágios (R$)</Label>
          <Input
            placeholder="Ex: 45.00 (opcional)"
            value={tollCost}
            onChangeText={setTollCost}
            keyboardType="decimal-pad"
          />
        </InputGroup>

        <Button title="Calcular" onPress={calculateCosts} />

        {result && (
          <ResultCard>
            <ResultRow>
              <ResultLabel>Combustível:</ResultLabel>
              <ResultValue>{formatCurrency(result.fuelCost)}</ResultValue>
            </ResultRow>

            <ResultRow>
              <ResultLabel>Pedágios:</ResultLabel>
              <ResultValue>{formatCurrency(result.tollCost)}</ResultValue>
            </ResultRow>

            <TotalRow>
              <TotalLabel>Total:</TotalLabel>
              <TotalValue>{formatCurrency(result.total)}</TotalValue>
            </TotalRow>
          </ResultCard>
        )}
      </FormContainer>
    </Container>
  );
}
