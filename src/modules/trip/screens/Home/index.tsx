import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../../core/theme';
import { SCREENS } from '../../../../core/constants/screens';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #F8F8F8;
`;

const Header = styled(View)`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.l}px;
  padding-top: 60px;
  padding-bottom: 40px;
  align-items: center;
`;

const LogoImage = styled(Image)`
  width: 200px;
  height: 180px;
  margin-bottom: ${theme.spacing.m}px;
`;

const Tagline = styled(Text)`
  font-size: 16px;
  color: ${theme.colors.background};
  opacity: 0.9;
`;

const ContentContainer = styled(View)`
  padding: ${theme.spacing.m}px;
  margin-top: -20px;
`;

const FeatureCard = styled(TouchableOpacity)`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.l}px;
  border-radius: ${theme.radius.m}px;
  margin-bottom: ${theme.spacing.m}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  flex-direction: row;
  align-items: center;
`;

const FeatureIcon = styled(Text)`
  font-size: 40px;
  margin-right: ${theme.spacing.m}px;
`;

const FeatureContent = styled(View)`
  flex: 1;
`;

const FeatureTitle = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 4px;
`;

const FeatureDescription = styled(Text)`
  font-size: 14px;
  color: #666666;
`;

const SectionTitle = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.m}px;
  margin-top: ${theme.spacing.s}px;
`;

const InfoCard = styled(View)`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.m}px;
  border-radius: ${theme.radius.m}px;
  margin-bottom: ${theme.spacing.m}px;
`;

const InfoText = styled(Text)`
  font-size: 14px;
  color: #666666;
  line-height: 20px;
`;

export default function Home() {
  const navigation = useNavigation<any>();

  const features = [
    {
      icon: '🗺️',
      title: 'Calcular Rota',
      description: 'Planeje sua viagem com rotas otimizadas',
      screen: SCREENS.ROUTE,
    },
    {
      icon: '💰',
      title: 'Calcular Custos',
      description: 'Estime gastos com combustível e pedágios',
      screen: SCREENS.COSTS,
    },
    {
      icon: '🚗',
      title: 'Aluguel de Carros',
      description: 'Encontre o carro ideal para sua viagem',
      screen: SCREENS.RENT,
    },
    {
      icon: '🧭',
      title: 'Modo Viagem',
      description: 'Navegação em tempo real durante a viagem',
      screen: SCREENS.TRAVEL_MODE,
    },
  ];

  return (
    <Container>
      <Header>
        <LogoImage 
          source={require('../../../../../assets/logo.png')} 
          resizeMode="contain"
        />
        <Tagline>✨ A viagem perfeita começa aqui</Tagline>
      </Header>

      <ContentContainer>
        <SectionTitle>Funcionalidades</SectionTitle>

        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            onPress={() => navigation.navigate(feature.screen)}
            activeOpacity={0.7}
          >
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureContent>
          </FeatureCard>
        ))}

        <SectionTitle>Sobre o KIViagem</SectionTitle>
        <InfoCard>
          <InfoText>
            O KIViagem é seu copiloto inteligente na estrada. Planeje viagens,
            calcule custos, encontre paradas úteis e navegue com segurança.
            {'\n\n'}
            Combine as melhores funcionalidades de GPS, calculadora de custos e
            assistente de viagem em um único aplicativo.
          </InfoText>
        </InfoCard>
      </ContentContainer>
    </Container>
  );
}
