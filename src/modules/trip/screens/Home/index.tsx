import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../../core/theme';
import { SCREENS } from '../../../../core/constants/screens';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #FAFAFA; /* Fundo levemente off-white */
`;

// O TRUQUE DO DESIGN MODERNO: Borda arredondada apenas embaixo
const Header = styled(View)`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.l}px;
  padding-top: 60px;
  padding-bottom: 50px;
  align-items: center;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 10px;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
  elevation: 5;
`;

const LogoImage = styled(Image)`
  width: 160px; /* Ajustei para ficar mais elegante */
  height: 160px;
  margin-bottom: ${theme.spacing.s}px;
`;

const Tagline = styled(Text)`
  font-size: 16px;
  color: ${theme.colors.background};
  opacity: 0.95;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const ContentContainer = styled(View)`
  padding: ${theme.spacing.l}px;
  margin-top: -10px; /* Sobrepõe levemente para integrar */
`;

const FeatureCard = styled(TouchableOpacity)`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.l}px;
  border-radius: 20px; /* Mais arredondado */
  margin-bottom: ${theme.spacing.m}px;
  flex-direction: row;
  align-items: center;
  
  /* Sombra moderna e difusa ("Soft UI") */
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.05;
  shadow-radius: 12px;
  elevation: 2;
  border: 1px solid #F0F0F0;
`;

const FeatureIconContainer = styled(View)`
  width: 50px;
  height: 50px;
  background-color: #F0F9F4; /* Um verde bem clarinho de fundo no ícone */
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.m}px;
`;

const FeatureIcon = styled(Text)`
  font-size: 24px;
`;

const FeatureContent = styled(View)`
  flex: 1;
`;

const FeatureTitle = styled(Text)`
  font-size: 17px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 2px;
`;

const FeatureDescription = styled(Text)`
  font-size: 13px;
  color: #888888;
  line-height: 18px;
`;

const SectionTitle = styled(Text)`
  font-size: 22px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.m}px;
  margin-top: ${theme.spacing.s}px;
`;

export default function Home() {
  const navigation = useNavigation<any>();

  const features = [
    {
      icon: '🗺️',
      title: 'Calcular Rota',
      description: 'Rotas inteligentes e visualização no mapa',
      screen: SCREENS.ROUTE,
    },
    {
      icon: '💰',
      title: 'Custos da Viagem',
      description: 'Previsão de gastos com combustível e pedágio',
      screen: SCREENS.COSTS,
    },
    {
      icon: '🚗',
      title: 'Alugar Veículo',
      description: 'Escolha o carro ideal para o trajeto',
      screen: SCREENS.RENT,
    },
    {
      icon: '🧭',
      title: 'Modo Viagem',
      description: 'Assistente de navegação em tempo real',
      screen: SCREENS.TRAVEL_MODE,
    },
  ];

  return (
    <Container showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Header>
        <LogoImage 
          source={require('../../../../../assets/logo.png')} 
          resizeMode="contain"
        />
        <Tagline>A viagem perfeita começa aqui</Tagline>
      </Header>

      <ContentContainer>
        <SectionTitle>O que vamos fazer hoje?</SectionTitle>

        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            onPress={() => navigation.navigate(feature.screen)}
            activeOpacity={0.7}
          >
            <FeatureIconContainer>
              <FeatureIcon>{feature.icon}</FeatureIcon>
            </FeatureIconContainer>
            <FeatureContent>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureContent>
          </FeatureCard>
        ))}
      </ContentContainer>
    </Container>
  );
}