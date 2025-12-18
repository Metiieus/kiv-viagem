import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Dimensions, Image } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { SCREENS } from '../../../../core/constants/screens';
import { useAuthStore } from '../../../auth/stores/useAuthStore';

const { width } = Dimensions.get('window');

// Styled Components
const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const HeaderGradient = styled(LinearGradient).attrs({
  colors: ['#0D9488', '#14B8A6', '#2DD4BF'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  padding: 60px 24px 40px 24px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
`;

const HeaderTop = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const GreetingContainer = styled(View)`
  flex: 1;
`;

const GreetingText = styled(Text)`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
`;

const UserName = styled(Text)`
  font-size: 24px;
  color: #FFFFFF;
  font-weight: 700;
  margin-top: 4px;
`;

const AvatarButton = styled(TouchableOpacity)`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const LogoContainer = styled(View)`
  align-items: center;
  margin-bottom: 16px;
`;

const LogoImage = styled(Image)`
  width: 120px;
  height: 108px;
`;

const Tagline = styled(Text)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
  margin-top: 8px;
  font-weight: 500;
`;

const ContentContainer = styled(View)`
  padding: 24px;
  margin-top: -20px;
`;

const SectionTitle = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 16px;
`;

const FeaturesGrid = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const FeatureCard = styled(TouchableOpacity)`
  width: ${(width - 64) / 2}px;
  background-color: ${theme.colors.surface};
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 16px;
  align-items: center;
  ${theme.shadows.medium};
  border: 1px solid ${theme.colors.border};
`;

const IconContainer = styled(View)<{ bgColor: string }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: ${props => props.bgColor};
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const FeatureTitle = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 4px;
`;

const FeatureDescription = styled(Text)`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  line-height: 16px;
`;

const QuickActionCard = styled(TouchableOpacity)`
  background: linear-gradient(135deg, #0D9488 0%, #14B8A6 100%);
  padding: 24px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  ${theme.shadows.large};
`;

const QuickActionContent = styled(View)`
  flex: 1;
`;

const QuickActionTitle = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 4px;
`;

const QuickActionSubtitle = styled(Text)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
`;

const QuickActionIconContainer = styled(View)`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
`;

const InfoCard = styled(View)`
  background-color: ${theme.colors.surface};
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 24px;
  ${theme.shadows.small};
  border: 1px solid ${theme.colors.border};
`;

const InfoTitle = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 12px;
`;

const InfoText = styled(Text)`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  line-height: 20px;
`;

export default function Home() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const [greeting, setGreeting] = useState('Olá');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  const features = [
    {
      icon: 'map',
      iconType: 'MaterialIcons',
      title: 'Calcular Rota',
      description: 'Planeje sua viagem com rotas otimizadas',
      screen: SCREENS.ROUTE,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    {
      icon: 'attach-money',
      iconType: 'MaterialIcons',
      title: 'Calcular Custos',
      description: 'Estime gastos com combustível e pedágios',
      screen: SCREENS.COSTS,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
    {
      icon: 'car-sport',
      iconType: 'Ionicons',
      title: 'Aluguel',
      description: 'Encontre o carro ideal para sua viagem',
      screen: SCREENS.RENT,
      color: '#EF4444',
      bgColor: '#FEE2E2',
    },
    {
      icon: 'garage',
      iconType: 'MaterialIcons',
      title: 'Minha Garagem',
      description: 'Gerencie seus veículos',
      screen: SCREENS.GARAGE,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
    },
  ];

  const renderIcon = (iconType: string, iconName: string, color: string) => {
    const iconProps = { name: iconName as any, size: 28, color };
    
    switch (iconType) {
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />;
      case 'Ionicons':
        return <Ionicons {...iconProps} />;
      case 'FontAwesome5':
        return <FontAwesome5 {...iconProps} />;
      default:
        return <MaterialIcons {...iconProps} />;
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0D9488" />
      <Container showsVerticalScrollIndicator={false}>
        <HeaderGradient>
          <HeaderTop>
            <GreetingContainer>
              <GreetingText>{greeting} 👋</GreetingText>
              <UserName>{user?.name || 'Viajante'}</UserName>
            </GreetingContainer>
            <AvatarButton onPress={() => navigation.navigate('Profile' as never)}>
              <MaterialIcons name="person" size={28} color="#FFFFFF" />
            </AvatarButton>
          </HeaderTop>

          <LogoContainer>
            <LogoImage 
              source={require('../../../../../assets/logo.png')} 
              resizeMode="contain"
            />
            <Tagline>✨ A viagem perfeita começa aqui</Tagline>
          </LogoContainer>
        </HeaderGradient>

        <ContentContainer>
          {/* Quick Action - Modo Viagem */}
          <LinearGradient
            colors={['#0D9488', '#14B8A6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 24,
              borderRadius: 20,
              marginBottom: 24,
              shadowColor: '#0D9488',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREENS.TRAVEL_MODE as never)}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
                    Modo Viagem
                  </Text>
                  <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.9)' }}>
                    Navegação em tempo real durante a viagem
                  </Text>
                </View>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <MaterialIcons name="navigation" size={28} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          </LinearGradient>

          <SectionTitle>Funcionalidades</SectionTitle>

          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                onPress={() => navigation.navigate(feature.screen as never)}
                activeOpacity={0.7}
              >
                <IconContainer bgColor={feature.bgColor}>
                  {renderIcon(feature.iconType, feature.icon, feature.color)}
                </IconContainer>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>

          <SectionTitle>Sobre o KIViagem</SectionTitle>
          <InfoCard>
            <InfoTitle>Seu copiloto inteligente 🚗</InfoTitle>
            <InfoText>
              O KIViagem é seu companheiro perfeito para qualquer viagem. Planeje rotas, 
              calcule custos, encontre paradas úteis e navegue com segurança. Tudo em um único aplicativo.
            </InfoText>
          </InfoCard>
        </ContentContainer>
      </Container>
    </>
  );
}
