import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../../../core/theme';
import { Button, Input, Card } from '../../../../core/components';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Header = styled(View)`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.l}px;
  padding-top: 60px;
  padding-bottom: 40px;
  border-bottom-left-radius: ${theme.radius.xl}px;
  border-bottom-right-radius: ${theme.radius.xl}px;
  
  shadow-color: ${theme.shadows.medium.shadowColor};
  shadow-offset: ${theme.shadows.medium.shadowOffset.width}px ${theme.shadows.medium.shadowOffset.height}px;
  shadow-opacity: ${theme.shadows.medium.shadowOpacity};
  shadow-radius: ${theme.shadows.medium.shadowRadius}px;
  elevation: ${theme.shadows.medium.elevation};
`;

const HeaderTitle = styled(Text)`
  font-size: ${theme.typography.sizes.xl}px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.surface};
  margin-bottom: ${theme.spacing.xs}px;
`;

const HeaderSubtitle = styled(Text)`
  font-size: ${theme.typography.sizes.s}px;
  color: ${theme.colors.surface};
  opacity: 0.9;
`;

const ContentContainer = styled(View)`
  padding: ${theme.spacing.l}px;
  margin-top: -10px;
`;

const InputGroup = styled(View)`
  margin-bottom: ${theme.spacing.m}px;
`;

const ResultCard = styled(Card)`
  background-color: ${theme.colors.primaryDark};
  margin-top: ${theme.spacing.l}px;
  border: none;
`;

const ResultRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${theme.spacing.s}px 0;
  align-items: center;
`;

const ResultLabel = styled(Text)`
  font-size: ${theme.typography.sizes.m}px;
  color: ${theme.colors.surface};
  opacity: 0.9;
`;

const ResultValue = styled(Text)`
  font-size: ${theme.typography.sizes.l}px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.surface};
`;

const TotalRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding-top: ${theme.spacing.m}px;
  border-top-width: 1px;
  border-top-color: rgba(255, 255, 255, 0.2);
  margin-top: ${theme.spacing.s}px;
  align-items: center;
`;

const TotalLabel = styled(Text)`
  font-size: ${theme.typography.sizes.l}px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.surface};
`;

const TotalValue = styled(Text)`
  font-size: ${theme.typography.sizes.xxl}px;
  font-weight: ${theme.typography.weights.extraBold};
  color: ${theme.colors.success};
  text-shadow: 0px 1px 2px rgba(0,0,0,0.2);
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
    <Container showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Header>
        <HeaderTitle>Calcular Custos</HeaderTitle>
        <HeaderSubtitle>
          Descubra quanto você vai gastar na sua viagem
        </HeaderSubtitle>
      </Header>

      <ContentContainer>
        <Card>
          <InputGroup>
            <Input
              label="Distância (km) *"
              placeholder="Ex: 450"
              value={distance}
              onChangeText={setDistance}
              keyboardType="decimal-pad"
            />
          </InputGroup>

          <InputGroup>
            <Input
              label="Consumo do Veículo (km/L) *"
              placeholder="Ex: 12.5"
              value={consumption}
              onChangeText={setConsumption}
              keyboardType="decimal-pad"
            />
          </InputGroup>

          <InputGroup>
            <Input
              label="Preço do Combustível (R$/L) *"
              placeholder="Ex: 5.89"
              value={fuelPrice}
              onChangeText={setFuelPrice}
              keyboardType="decimal-pad"
            />
          </InputGroup>

          <InputGroup>
            <Input
              label="Custo de Pedágios (R$)"
              placeholder="Ex: 45.00 (opcional)"
              value={tollCost}
              onChangeText={setTollCost}
              keyboardType="decimal-pad"
            />
          </InputGroup>

          <Button title="Calcular Custos" onPress={calculateCosts} />
        </Card>

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
      </ContentContainer>
    </Container>
  );
}
