import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { Input } from '../../../../core/components/Input';

const { width } = Dimensions.get('window');

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const HeaderGradient = styled(LinearGradient).attrs({
  colors: ['#F59E0B', '#FBBF24'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  padding: 60px 24px 32px 24px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
`;

const HeaderTop = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const BackButton = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const HeaderTitle = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  flex: 1;
`;

const HeaderSubtitle = styled(Text)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 4px;
`;

const ContentContainer = styled(View)`
  padding: 24px;
  margin-top: -20px;
`;

const Card = styled(View)`
  background-color: ${theme.colors.surface};
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 16px;
  ${theme.shadows.medium};
  border: 1px solid ${theme.colors.border};
`;

const SectionTitle = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
`;

const InputRow = styled(View)`
  margin-bottom: 16px;
`;

const InputLabel = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const CalculateButton = styled(TouchableOpacity)`
  background-color: ${theme.colors.primary};
  padding: 18px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  ${theme.shadows.large};
  margin-top: 8px;
`;

const ButtonText = styled(Text)`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 700;
  margin-left: 8px;
`;

const ResultCard = styled(View)`
  background: linear-gradient(135deg, #0D9488 0%, #14B8A6 100%);
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 16px;
  ${theme.shadows.large};
`;

const ResultTitle = styled(Text)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
`;

const ResultValue = styled(Text)`
  font-size: 36px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 16px;
`;

const ResultBreakdown = styled(View)`
  background-color: rgba(255, 255, 255, 0.15);
  padding: 16px;
  border-radius: 12px;
`;

const BreakdownRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const BreakdownLabel = styled(Text)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  flex: 1;
`;

const BreakdownValue = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
`;

const TipCard = styled(View)`
  background-color: #FEF3C7;
  padding: 16px;
  border-radius: 16px;
  flex-direction: row;
  align-items: flex-start;
`;

const TipIcon = styled(View)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #F59E0B;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const TipText = styled(Text)`
  flex: 1;
  font-size: 13px;
  color: #92400E;
  line-height: 18px;
`;

export default function Costs({ navigation }: any) {
  const [distance, setDistance] = useState('');
  const [consumption, setConsumption] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [tolls, setTolls] = useState('');
  const [result, setResult] = useState<{
    fuelCost: number;
    tollCost: number;
    total: number;
    liters: number;
  } | null>(null);

  const calculateCosts = () => {
    const dist = parseFloat(distance.replace(',', '.'));
    const cons = parseFloat(consumption.replace(',', '.'));
    const price = parseFloat(fuelPrice.replace(',', '.'));
    const tollCost = parseFloat(tolls.replace(',', '.')) || 0;

    if (isNaN(dist) || isNaN(cons) || isNaN(price) || dist <= 0 || cons <= 0 || price <= 0) {
      alert('Por favor, preencha todos os campos corretamente');
      return;
    }

    const liters = dist / cons;
    const fuelCost = liters * price;
    const total = fuelCost + tollCost;

    setResult({
      fuelCost,
      tollCost,
      total,
      liters,
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />
      <Container showsVerticalScrollIndicator={false}>
        <HeaderGradient>
          <HeaderTop>
            <BackButton onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </BackButton>
            <View style={{ flex: 1 }}>
              <HeaderTitle>Calcular Custos</HeaderTitle>
              <HeaderSubtitle>Estime os gastos da sua viagem</HeaderSubtitle>
            </View>
          </HeaderTop>
        </HeaderGradient>

        <ContentContainer>
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <FontAwesome5 name="gas-pump" size={20} color={theme.colors.primary} />
              <SectionTitle style={{ marginLeft: 8, marginBottom: 0 }}>
                Dados do Veículo
              </SectionTitle>
            </View>

            <InputRow>
              <InputLabel>Distância (km)</InputLabel>
              <Input
                placeholder="Ex: 450"
                value={distance}
                onChangeText={setDistance}
                keyboardType="numeric"
              />
            </InputRow>

            <InputRow>
              <InputLabel>Consumo médio (km/L)</InputLabel>
              <Input
                placeholder="Ex: 12"
                value={consumption}
                onChangeText={setConsumption}
                keyboardType="numeric"
              />
            </InputRow>

            <InputRow>
              <InputLabel>Preço do combustível (R$/L)</InputLabel>
              <Input
                placeholder="Ex: 5.89"
                value={fuelPrice}
                onChangeText={setFuelPrice}
                keyboardType="numeric"
              />
            </InputRow>

            <InputRow>
              <InputLabel>Pedágios (R$) - Opcional</InputLabel>
              <Input
                placeholder="Ex: 45"
                value={tolls}
                onChangeText={setTolls}
                keyboardType="numeric"
              />
            </InputRow>
          </Card>

          <CalculateButton onPress={calculateCosts} activeOpacity={0.8}>
            <MaterialIcons name="calculate" size={24} color="#FFFFFF" />
            <ButtonText>Calcular Custos</ButtonText>
          </CalculateButton>

          {result && (
            <>
              <LinearGradient
                colors={['#0D9488', '#14B8A6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 24,
                  borderRadius: 20,
                  marginTop: 24,
                  marginBottom: 16,
                  shadowColor: '#0D9488',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              >
                <ResultTitle>Custo Total da Viagem</ResultTitle>
                <ResultValue>{formatCurrency(result.total)}</ResultValue>

                <ResultBreakdown>
                  <BreakdownRow>
                    <BreakdownLabel>💧 Combustível ({result.liters.toFixed(1)}L)</BreakdownLabel>
                    <BreakdownValue>{formatCurrency(result.fuelCost)}</BreakdownValue>
                  </BreakdownRow>
                  <BreakdownRow style={{ marginBottom: 0 }}>
                    <BreakdownLabel>🛣️ Pedágios</BreakdownLabel>
                    <BreakdownValue>{formatCurrency(result.tollCost)}</BreakdownValue>
                  </BreakdownRow>
                </ResultBreakdown>
              </LinearGradient>

              <TipCard>
                <TipIcon>
                  <MaterialIcons name="lightbulb" size={18} color="#FFFFFF" />
                </TipIcon>
                <TipText>
                  Dica: Mantenha uma velocidade constante e evite acelerações bruscas para economizar combustível!
                </TipText>
              </TipCard>
            </>
          )}
        </ContentContainer>
      </Container>
    </>
  );
}
