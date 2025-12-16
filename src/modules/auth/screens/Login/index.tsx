import React from 'react';
import { View, Text, Image, StatusBar, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { Button } from '../../../../core/components';
import { SCREENS } from '../../../../core/constants/screens';

const Container = styled(View)`
  flex: 1;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.l}px;
  justify-content: space-between;
`;

const Content = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Illustration = styled(Image)`
  width: 160px;
  height: 160px;
  margin-bottom: ${theme.spacing.xl}px;
`;

const Title = styled(Text)`
  font-size: 28px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.m}px;
`;

const Description = styled(Text)`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  line-height: 24px;
  margin-bottom: ${theme.spacing.xl}px;
  padding: 0 ${theme.spacing.m}px;
`;

const ButtonsContainer = styled(View)`
  width: 100%;
  gap: ${theme.spacing.m}px;
  margin-bottom: ${theme.spacing.xl}px;
`;

const SkipButton = styled(Text)`
  color: ${theme.colors.textSecondary};
  font-size: 16px;
  text-align: center;
  padding: ${theme.spacing.s}px;
  font-weight: ${theme.typography.weights.medium};
`;

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const handleGoogleLogin = () => {
    Alert.alert(
      "Conectando...",
      "Simulando login com Google.",
      [
        { text: "OK", onPress: () => navigation.replace(SCREENS.HOME) }
      ]
    );
  };

  const handleSkip = () => {
    navigation.replace(SCREENS.HOME);
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <Content>
        <Illustration
          source={require('../../../../../assets/logo.png')}
          resizeMode="contain"
          style={{ tintColor: theme.colors.primary }}
        />

        <Title>Crie sua conta</Title>
        <Description>
          Salve seu histórico de viagens, preferências e rotas favoritas conectando sua conta.
        </Description>

        <ButtonsContainer>
          <Button
            title="Conectar com Google"
            onPress={handleGoogleLogin}
            leftIcon={<FontAwesome5 name="google" size={20} color="#FFF" />}
          />

          <Button
            title="Conectar com Email"
            variant="outline"
            onPress={() => Alert.alert("Em breve", "Login por email em desenvolvimento")}
            leftIcon={<MaterialIcons name="email" size={22} color={theme.colors.primary} />}
          />
        </ButtonsContainer>

        <SkipButton onPress={handleSkip}>
          Continuar como convidado
        </SkipButton>
      </Content>
    </Container>
  );
}
