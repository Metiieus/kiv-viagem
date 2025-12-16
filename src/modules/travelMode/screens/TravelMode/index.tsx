import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import * as Location from 'expo-location';
import { theme } from '../../../../core/theme';
import { Card, Button } from '../../../../core/components';

// Dark HUD Theme for Travel Mode
const HudColors = {
  background: '#0F172A', // Slate 900
  surface: '#1E293B',    // Slate 800
  text: '#F1F5F9',       // Slate 100
  textDim: '#94A3B8',    // Slate 400
};

const Container = styled(View)`
  flex: 1;
  background-color: ${HudColors.background};
`;

const Header = styled(View)`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.l}px;
  padding-top: 60px;
  padding-bottom: 30px;
  
  shadow-color: ${theme.shadows.medium.shadowColor};
  shadow-offset: ${theme.shadows.medium.shadowOffset.width}px ${theme.shadows.medium.shadowOffset.height}px;
  shadow-opacity: ${theme.shadows.medium.shadowOpacity};
  shadow-radius: ${theme.shadows.medium.shadowRadius}px;
  elevation: ${theme.shadows.medium.elevation};
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
  flex: 1;
  padding: ${theme.spacing.l}px;
  justify-content: center;
`;

const HUDCard = styled(View)`
  background-color: ${HudColors.surface};
  padding: ${theme.spacing.xl}px;
  border-radius: ${theme.radius.xl}px;
  border-width: 1px;
  border-color: ${theme.colors.primary};
  
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.3;
  shadow-radius: 20px;
  elevation: 10;
`;

const DataRow = styled(View)`
  margin-bottom: ${theme.spacing.xl}px;
  align-items: center;
`;

const DataLabel = styled(Text)`
  font-size: ${theme.typography.sizes.m}px;
  color: ${HudColors.textDim};
  margin-bottom: ${theme.spacing.s}px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DataValue = styled(Text)`
  font-size: 56px;
  font-weight: ${theme.typography.weights.extraBold};
  color: ${HudColors.text};
  text-shadow: 0px 0px 10px rgba(99, 102, 241, 0.5); /* Glowing effect */
`;

const DataUnit = styled(Text)`
  font-size: ${theme.typography.sizes.l}px;
  color: ${HudColors.textDim};
  margin-left: ${theme.spacing.xs}px;
`;

const StatusBadge = styled(View) <{ active: boolean }>`
  background-color: ${({ active }) => (active ? theme.colors.success : HudColors.surface)};
  padding: ${theme.spacing.s}px ${theme.spacing.l}px;
  border-radius: ${theme.radius.full}px;
  align-self: center;
  margin-bottom: ${theme.spacing.l}px;
  border-width: 1px;
  border-color: ${({ active }) => (active ? theme.colors.success : HudColors.textDim)};
`;

const StatusText = styled(Text) <{ active: boolean }>`
  color: ${({ active }) => (active ? theme.colors.surface : HudColors.textDim)};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.s}px;
`;

const InfoText = styled(Text)`
  color: ${HudColors.textDim};
  font-size: ${theme.typography.sizes.s}px;
  text-align: center;
  margin-top: ${theme.spacing.xl}px;
  line-height: 20px;
`;

const CoordsContainer = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: ${theme.spacing.l}px;
  width: 100%;
`;

const CoordsBox = styled(View)`
  align-items: center;
`;

export default function TravelModeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [speed, setSpeed] = useState(0);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

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

    // Cleanup on unmount
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const startTracking = async () => {
    setIsTracking(true);

    try {
      // Start watching position
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
          // Speed is in m/s, convert to km/h
          if (newLocation.coords.speed && newLocation.coords.speed > 0) {
            setSpeed(Math.round(newLocation.coords.speed * 3.6));
          } else {
            setSpeed(0);
          }
        }
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível iniciar o rastreamento GPS');
      setIsTracking(false);
    }
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    setIsTracking(false);
    setLocation(null);
    setSpeed(0);
  };

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Header>
        <HeaderTitle>Modo Viagem</HeaderTitle>
        <HeaderSubtitle>
          HUD em tempo real
        </HeaderSubtitle>
      </Header>

      <ContentContainer>
        <HUDCard>
          <StatusBadge active={isTracking}>
            <StatusText active={isTracking}>
              {isTracking ? 'GPS ATIVO' : 'AGUARDANDO GPS'}
            </StatusText>
          </StatusBadge>

          <DataRow>
            <DataLabel>Velocidade Real</DataLabel>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <DataValue>{speed}</DataValue>
              <DataUnit>km/h</DataUnit>
            </View>
          </DataRow>

          {location && (
            <CoordsContainer>
              <CoordsBox>
                <DataLabel style={{ fontSize: 12 }}>LAT</DataLabel>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{location.coords.latitude.toFixed(4)}</Text>
              </CoordsBox>
              <CoordsBox>
                <DataLabel style={{ fontSize: 12 }}>LONG</DataLabel>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{location.coords.longitude.toFixed(4)}</Text>
              </CoordsBox>
            </CoordsContainer>
          )}

          {!isTracking ? (
            <Button title="INICIAR RASTREAMENTO" onPress={startTracking} />
          ) : (
            <Button
              title="PARAR RASTREAMENTO"
              onPress={stopTracking}
              variant="danger"
            />
          )}

          <InfoText>
            Mantenha os olhos na estrada.
            O GPS está rastreando sua posição em tempo real.
          </InfoText>
        </HUDCard>
      </ContentContainer>
    </Container>
  );
}
