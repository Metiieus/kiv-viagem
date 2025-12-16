import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../../../core/theme';
import { Card } from '../../../../core/components';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #F8F8F8;
`;

const Header = styled(View)`
  background-color: ${theme.colors.success};
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

const ContentContainer = styled(View)`
  padding: ${theme.spacing.m}px;
`;

const SectionTitle = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.m}px;
`;

const CarCard = styled(Card)``;

const CarHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.s}px;
`;

const CarName = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const CarCategory = styled(Text)`
  font-size: 12px;
  color: ${theme.colors.background};
  background-color: ${theme.colors.success};
  padding: 4px 8px;
  border-radius: 4px;
  overflow: hidden;
`;

const CarInfo = styled(Text)`
  font-size: 14px;
  color: #666666;
  margin-bottom: 4px;
`;

const PriceRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.s}px;
  padding-top: ${theme.spacing.s}px;
  border-top-width: 1px;
  border-top-color: #E0E0E0;
`;

const PriceLabel = styled(Text)`
  font-size: 14px;
  color: #666666;
`;

const PriceValue = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

const RecommendationBadge = styled(View)`
  background-color: ${theme.colors.warning};
  padding: ${theme.spacing.s}px ${theme.spacing.m}px;
  border-radius: ${theme.radius.s}px;
  margin-bottom: ${theme.spacing.m}px;
`;

const RecommendationText = styled(Text)`
  color: ${theme.colors.background};
  font-weight: bold;
  text-align: center;
`;

const mockCars = [
  {
    id: '1',
    name: 'Fiat Argo',
    category: 'Econômico',
    consumption: '14 km/L',
    passengers: 5,
    transmission: 'Manual',
    pricePerDay: 120,
    recommended: true,
  },
  {
    id: '2',
    name: 'Chevrolet Onix',
    category: 'Econômico',
    consumption: '13.5 km/L',
    passengers: 5,
    transmission: 'Automático',
    pricePerDay: 150,
  },
  {
    id: '3',
    name: 'Jeep Compass',
    category: 'SUV',
    consumption: '10 km/L',
    passengers: 5,
    transmission: 'Automático',
    pricePerDay: 280,
  },
  {
    id: '4',
    name: 'Toyota Corolla',
    category: 'Sedan',
    consumption: '12 km/L',
    passengers: 5,
    transmission: 'Automático',
    pricePerDay: 220,
  },
];

export default function RentScreen() {
  return (
    <Container>
      <Header>
        <HeaderTitle>Aluguel de Carros</HeaderTitle>
        <HeaderSubtitle>
          Encontre o carro ideal para sua viagem
        </HeaderSubtitle>
      </Header>

      <ContentContainer>
        <SectionTitle>Carros Disponíveis</SectionTitle>

        {mockCars.map((car) => (
          <CarCard key={car.id}>
            {car.recommended && (
              <RecommendationBadge>
                <RecommendationText>⭐ Recomendado para você</RecommendationText>
              </RecommendationBadge>
            )}

            <CarHeader>
              <CarName>{car.name}</CarName>
              <CarCategory>{car.category}</CarCategory>
            </CarHeader>

            <CarInfo>🚗 Consumo: {car.consumption}</CarInfo>
            <CarInfo>👥 Passageiros: {car.passengers}</CarInfo>
            <CarInfo>⚙️ Transmissão: {car.transmission}</CarInfo>

            <PriceRow>
              <PriceLabel>Diária a partir de:</PriceLabel>
              <PriceValue>
                {car.pricePerDay.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </PriceValue>
            </PriceRow>
          </CarCard>
        ))}

        <Card>
          <Text style={{ fontSize: 14, color: '#666666', textAlign: 'center' }}>
            💡 Dica: Carros econômicos são ideais para viagens longas em estradas
            pavimentadas. SUVs são melhores para terrenos irregulares.
          </Text>
        </Card>
      </ContentContainer>
    </Container>
  );
}
