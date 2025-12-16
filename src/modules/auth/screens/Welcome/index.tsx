import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { SCREENS } from '../../../../core/constants/screens';

const { width } = Dimensions.get('window');

const Container = styled(View)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Slide = styled(View)`
  width: ${width}px;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl}px;
`;

const IconContainer = styled(View)`
  width: 140px;
  height: 140px;
  background-color: ${theme.colors.primary}15; /* 15% opacity */
  border-radius: 70px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.xl}px;
`;

const Title = styled(Text)`
  font-size: 28px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.m}px;
  padding: 0 ${theme.spacing.l}px;
`;

const Description = styled(Text)`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  line-height: 24px;
  padding: 0 ${theme.spacing.l}px;
  max-width: 80%;
`;

const Footer = styled(View)`
  padding: ${theme.spacing.xl}px;
  justify-content: space-between;
  align-items: center;
  height: 150px;
`;

const Pagination = styled(View)`
  flex-direction: row;
  height: 20px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.l}px;
`;

const Dot = styled(View) <{ active: boolean }>`
  width: ${({ active }) => (active ? '24px' : '8px')};
  height: 8px;
  background-color: ${({ active }) => (active ? theme.colors.primary : theme.colors.border)};
  border-radius: 4px;
  margin: 0 4px;
`;

const ButtonContainer = styled(View)`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const NextButton = styled(TouchableOpacity)`
  background-color: ${theme.colors.primary};
  padding: 16px 32px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 5;
`;

const NextButtonText = styled(Text)`
  color: #FFF;
  font-weight: 600;
  font-size: 16px;
  margin-right: 8px;
`;

const SkipButton = styled(TouchableOpacity)`
  padding: 16px;
`;

const SkipButtonText = styled(Text)`
  color: ${theme.colors.textSecondary};
  font-size: 16px;
  font-weight: 500;
`;

interface SlideItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const slides: SlideItem[] = [
  {
    id: '1',
    title: 'Viaje com Inteligência',
    description: 'Calculadora precisa de custos, pedágios e combustível para sua jornada.',
    icon: <MaterialIcons name="timeline" size={64} color={theme.colors.primary} />,
  },
  {
    id: '2',
    title: 'Navegação em Tempo Real',
    description: 'Acompanhe sua velocidade e posição com nosso Modo Viagem exclusivo.',
    icon: <FontAwesome5 name="compass" size={56} color={theme.colors.primary} />,
  },
  {
    id: '3',
    title: 'Tudo em um só lugar',
    description: 'Aluguel de carros, planejamento e gestão financeira da sua trip.',
    icon: <MaterialIcons name="dashboard" size={64} color={theme.colors.primary} />,
  },
];

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate(SCREENS.LOGIN);
    }
  };

  const handleSkip = () => {
    navigation.navigate(SCREENS.LOGIN);
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => (
          <Slide>
            <IconContainer>
              {item.icon}
            </IconContainer>
            <Title>{item.title}</Title>
            <Description>{item.description}</Description>
          </Slide>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef}
      />

      <Footer>
        <Pagination>
          {slides.map((_, index) => (
            <Dot key={index} active={index === currentIndex} />
          ))}
        </Pagination>

        <ButtonContainer>
          <SkipButton onPress={handleSkip}>
            <SkipButtonText>Pular</SkipButtonText>
          </SkipButton>

          <NextButton onPress={handleNext}>
            <NextButtonText>
              {currentIndex === slides.length - 1 ? 'Começar' : 'Próximo'}
            </NextButtonText>
            <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
          </NextButton>
        </ButtonContainer>
      </Footer>
    </Container>
  );
}
