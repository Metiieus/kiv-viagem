import React, { useEffect } from 'react';
import { View, Text, Image, StatusBar, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

import { theme } from '../../../../core/theme';
import { Button } from '../../../../core/components';
import { SCREENS } from '../../../../core/constants/screens';
import { useAuthStore } from '../../stores/useAuthStore';

// WebBrowser shim for Auth Session
WebBrowser.maybeCompleteAuthSession();

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
  const { setUser, setLoading, isLoading, isAuthenticated } = useAuthStore();

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Client ID provided by user
    clientId: '986813775916-nmad6b9trfmit8ead904jlqlucrpa5r9.apps.googleusercontent.com',
    iosClientId: '986813775916-nmad6b9trfmit8ead904jlqlucrpa5r9.apps.googleusercontent.com',
    androidClientId: '986813775916-nmad6b9trfmit8ead904jlqlucrpa5r9.apps.googleusercontent.com',
    webClientId: '986813775916-nmad6b9trfmit8ead904jlqlucrpa5r9.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({
      scheme: 'kiv-viagem',
      path: 'auth',
      useProxy: true,
    }),
  });

  useEffect(() => {
    if (request) {
      console.log('🔗 SEU REDIRECT URI:', request.redirectUri);
    }
  }, [request]);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace(SCREENS.HOME);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        getUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  const getUserInfo = async (token: string) => {
    setLoading(true);
    try {
      const resp = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await resp.json();

      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.picture,
      });
    } catch (error) {
      console.error('Failed to fetch user data', error);
      Alert.alert('Erro', 'Falha ao obter dados do usuário Google.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    promptAsync();
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
            title={isLoading ? "Conectando..." : "Conectar com Google"}
            onPress={handleGoogleLogin}
            disabled={!request || isLoading}
            leftIcon={isLoading ? <ActivityIndicator color="#FFF" /> : <FontAwesome5 name="google" size={20} color="#FFF" />}
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
