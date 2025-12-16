import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import styled from 'styled-components/native';
import * as Location from 'expo-location';
import { theme } from '../../../../core/theme';
import { Card, Button } from '../../../../core/components';

const Container = styled(View)`
  flex: 1;
  background-color: #1A1A1A;
`;

const Header = styled(View)`
  background-color: ${theme.colors.primary};
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
  flex: 1;
  padding: ${theme.spacing.m}px;
  justify-content: center;
`;

const HUDCard = styled(Card)`
  background-color: #2A2A2A;
  border: 2px solid ${theme.colors.primary};
`;

const DataRow = styled(View)`
  margin-bottom: ${theme.spacing.l}px;
`;

const DataLabel = styled(Text)`
  font-size: 14px;
  color: #AAAAAA;
  margin-bottom: ${theme.spacing.s}px;
`;

const DataValue = styled(Text)`
  font-size: 36px;
  font-weight: bold;
  color: ${theme.colors.background};
`;

const DataUnit = styled(Text)`
  font-size: 18px;
  color: #AAAAAA;
  margin-left: ${theme.spacing.s}px;
`;

const StatusBadge = styled(View)<{ active: boolean }>`
  background-color: ${({ active }) => (active ? theme.colors.success : '#666666')};
  padding: ${theme.spacing.s}px ${theme.spacing.m}px;
  border-radius: ${theme.radius.s}px;
  align-self: flex-start;
  margin-bottom: ${theme.spacing.m}px;
`;

const StatusText = styled(Text)`
  color: ${theme.colors.background};
  font-weight: bold;
`;

const InfoText = styled(Text)`
  color: #AAAAAA;
  font-size: 14px;
  text-align: center;
  margin-top: ${theme.spacing.m}px;
`;

export default function TravelModeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'O Modo Viagem precisa de acesso à localização para funcionar.'
        );
        return;
      }
    })();
  }, []);

  const startTracking = async () => {
    setIsTracking(true);
    
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation(currentLocation);
      
      // Calcular velocidade (m/s para km/h)
      if (currentLocation.coords.speed) {
        setSpeed(Math.round(currentLocation.coords.speed * 3.6));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização');
      setIsTracking(false);
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    setLocation(null);
    setSpeed(0);
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>Modo Viagem</HeaderTitle>
        <HeaderSubtitle>
          Acompanhe sua viagem em tempo real
        </HeaderSubtitle>
      </Header>

      <ContentContainer>
        <HUDCard>
          <StatusBadge active={isTracking}>
            <StatusText>
              {isTracking ? '🟢 Rastreando' : '⚪ Inativo'}
            </StatusText>
          </StatusBadge>

          <DataRow>
            <DataLabel>Velocidade Atual</DataLabel>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <DataValue>{speed}</DataValue>
              <DataUnit>km/h</DataUnit>
            </View>
          </DataRow>

          {location && (
            <>
              <DataRow>
                <DataLabel>Latitude</DataLabel>
                <DataValue style={{ fontSize: 20 }}>
                  {location.coords.latitude.toFixed(6)}
                </DataValue>
              </DataRow>

              <DataRow>
                <DataLabel>Longitude</DataLabel>
                <DataValue style={{ fontSize: 20 }}>
                  {location.coords.longitude.toFixed(6)}
                </DataValue>
              </DataRow>
            </>
          )}

          {!isTracking ? (
            <Button title="Iniciar Rastreamento" onPress={startTracking} />
          ) : (
            <Button
              title="Parar Rastreamento"
              onPress={stopTracking}
              variant="secondary"
            />
          )}

          <InfoText>
            💡 O Modo Viagem rastreia sua posição em tempo real e exibe
            informações úteis durante a viagem.
          </InfoText>
        </HUDCard>
      </ContentContainer>
    </Container>
  );
}
