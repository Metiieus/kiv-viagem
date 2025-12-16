import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { GOOGLE_API_KEY } from '@env';
import { theme } from '../../../../core/theme';
import { Button, Input, Card } from '../../../../core/components';

const Container = styled(View)`
  flex: 1;
  background-color: #F8F8F8;
`;

const FormContainer = styled(View)`
  padding: ${theme.spacing.m}px;
  background-color: ${theme.colors.background};
`;

const InputGroup = styled(View)`
  margin-bottom: ${theme.spacing.m}px;
`;

const Label = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.s}px;
`;

const MapContainer = styled(View)`
  height: 300px;
  margin: ${theme.spacing.m}px;
  border-radius: ${theme.radius.m}px;
  overflow: hidden;
`;

const InfoContainer = styled(View)`
  padding: 0 ${theme.spacing.m}px;
`;

const InfoRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${theme.spacing.m}px;
`;

const InfoLabel = styled(Text)`
  font-size: 14px;
  color: #666666;
`;

const InfoValue = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

interface RouteData {
  distance: string;
  duration: string;
  coordinates: Array<{ latitude: number; longitude: number }>;
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
}

export default function RouteScreen() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>(null);

  const calculateRoute = async () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha origem e destino');
      return;
    }

    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
      Alert.alert(
        'Configuração Necessária',
        'Por favor, configure sua chave da Google API no arquivo .env'
      );
      return;
    }

    setLoading(true);

    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        origin
      )}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_API_KEY}`;

      const response = await axios.get(url);

      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const leg = route.legs[0];

        // Decodificar a polyline
        const points = polyline.decode(route.overview_polyline.points);
        const coordinates = points.map((point: number[]) => ({
          latitude: point[0],
          longitude: point[1],
        }));

        setRouteData({
          distance: leg.distance.text,
          duration: leg.duration.text,
          coordinates,
          origin: {
            latitude: leg.start_location.lat,
            longitude: leg.start_location.lng,
          },
          destination: {
            latitude: leg.end_location.lat,
            longitude: leg.end_location.lng,
          },
        });
      } else {
        Alert.alert('Erro', 'Não foi possível calcular a rota. Verifique os endereços.');
      }
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao calcular a rota. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ScrollView>
        <FormContainer>
          <InputGroup>
            <Label>Origem</Label>
            <Input
              placeholder="Ex: São Paulo, SP"
              value={origin}
              onChangeText={setOrigin}
            />
          </InputGroup>

          <InputGroup>
            <Label>Destino</Label>
            <Input
              placeholder="Ex: Rio de Janeiro, RJ"
              value={destination}
              onChangeText={setDestination}
            />
          </InputGroup>

          <Button
            title="Calcular Rota"
            onPress={calculateRoute}
            loading={loading}
          />
        </FormContainer>

        {routeData && (
          <>
            <MapContainer>
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: routeData.origin.latitude,
                  longitude: routeData.origin.longitude,
                  latitudeDelta: 2,
                  longitudeDelta: 2,
                }}
              >
                <Marker
                  coordinate={routeData.origin}
                  title="Origem"
                  pinColor={theme.colors.success}
                />
                <Marker
                  coordinate={routeData.destination}
                  title="Destino"
                  pinColor={theme.colors.warning}
                />
                <Polyline
                  coordinates={routeData.coordinates}
                  strokeWidth={4}
                  strokeColor={theme.colors.primary}
                />
              </MapView>
            </MapContainer>

            <InfoContainer>
              <Card>
                <InfoRow>
                  <InfoLabel>Distância:</InfoLabel>
                  <InfoValue>{routeData.distance}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Tempo Estimado:</InfoLabel>
                  <InfoValue>{routeData.duration}</InfoValue>
                </InfoRow>
              </Card>
            </InfoContainer>
          </>
        )}
      </ScrollView>
    </Container>
  );
}
