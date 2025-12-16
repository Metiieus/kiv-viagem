import React from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { Card } from '../../../../core/components';

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
  
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  elevation: 5;
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

const SectionTitle = styled(Text)`
  font-size: ${theme.typography.sizes.l}px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.m}px;
  margin-left: ${theme.spacing.xs}px;
`;

const CarCard = styled(Card)``;

const CarHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.s}px;
`;

const CarName = styled(Text)`
  font-size: ${theme.typography.sizes.l}px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text};
`;

const CarCategory = styled(Text)`
  font-size: ${theme.typography.sizes.xs}px;
  color: ${theme.colors.surface};
  background-color: ${theme.colors.secondary};
  padding: 4px 8px;
  border-radius: ${theme.radius.s}px;
  overflow: hidden;
  font-weight: ${theme.typography.weights.medium};
`;

const CarInfoRow = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const CarInfoText = styled(Text)`
  font-size: ${theme.typography.sizes.s}px;
  color: ${theme.colors.textSecondary};
  margin-left: 8px;
`;

const PriceRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.m}px;
  padding-top: ${theme.spacing.m}px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
`;

const PriceLabel = styled(Text)`
  font-size: ${theme.typography.sizes.s}px;
  color: ${theme.colors.textSecondary};
`;

const PriceValue = styled(Text)`
  font-size: ${theme.typography.sizes.l}px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary};
`;

const RecommendationBadge = styled(View)`
  background-color: ${theme.colors.warning};
  padding: ${theme.spacing.xs}px ${theme.spacing.m}px;
  border-radius: ${theme.radius.s}px;
  margin-bottom: ${theme.spacing.m}px;
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
`;

const RecommendationText = styled(Text)`
  color: #FFF;
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.xs}px;
  margin-left: 6px;
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
    <Container showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
                <MaterialIcons name="star" size={14} color="#FFF" />
                <RecommendationText>Recomendado para você</RecommendationText>
              </RecommendationBadge>
            )}

            <CarHeader>
              <CarName>{car.name}</CarName>
              <CarCategory>{car.category}</CarCategory>
            </CarHeader>

            <CarInfoRow>
              <FontAwesome5 name="gas-pump" size={14} color={theme.colors.textSecondary} style={{ width: 18 }} />
              <CarInfoText>Consumo: {car.consumption}</CarInfoText>
            </CarInfoRow>

            <CarInfoRow>
              <FontAwesome5 name="users" size={14} color={theme.colors.textSecondary} style={{ width: 18 }} />
              <CarInfoText>Passageiros: {car.passengers}</CarInfoText>
            </CarInfoRow>

            <CarInfoRow>
              <MaterialIcons name="settings" size={16} color={theme.colors.textSecondary} style={{ width: 18 }} />
              <CarInfoText>Transmissão: {car.transmission}</CarInfoText>
            </CarInfoRow>

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

        <Card variant="flat">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="lightbulb" size={20} color={theme.colors.warning} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 13, color: theme.colors.textSecondary, fontStyle: 'italic', flex: 1 }}>
              Dica: Carros econômicos são ideais para viagens longas em estradas
              pavimentadas.
            </Text>
          </View>
        </Card>
      </ContentContainer>
    </Container>
  );
}
