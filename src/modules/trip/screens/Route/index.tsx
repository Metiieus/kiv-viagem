import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StatusBar, TouchableOpacity, Keyboard, FlatList } from 'react-native';
import styled from 'styled-components/native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import polyline from '@mapbox/polyline';
import { GOOGLE_API_KEY } from '@env';
import { theme } from '../../../../core/theme';
import { Button, Input, Card } from '../../../../core/components';
import { useVehicleStore } from '../../../garage/stores/useVehicleStore';
import { MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

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
  padding: ${theme.spacing.l}px;
  margin-top: -10px;
  z-index: 1; /* Ensure content is below predictions if needed, but predictions are usually modal/absolute */
`;

const MapContainer = styled(View)`
  height: 250px;
  border-radius: ${theme.radius.l}px;
  overflow: hidden;
  margin-bottom: ${theme.spacing.m}px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const Row = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SectionTitle = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-top: 16px;
  margin-bottom: 8px;
`;

const DashboardCard = styled(View)`
  background-color: ${theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const StatGrid = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const StatItem = styled(View)`
  width: 48%;
  margin-bottom: 16px;
`;

const StatLabel = styled(Text)`
  color: ${theme.colors.textSecondary};
  font-size: 12px;
`;

const StatValue = styled(Text)`
  color: ${theme.colors.text};
  font-weight: bold;
  font-size: 16px;
  margin-top: 2px;
`;

const MoneyValue = styled(Text)`
  color: ${theme.colors.success};
  font-weight: bold;
  font-size: 18px;
`;

const AlertBox = styled(View)`
  background-color: #FEF2F2;
  border-left-width: 4px;
  border-left-color: #EF4444;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const AlertTitle = styled(Text)`
  color: #991B1B;
  font-weight: bold;
  margin-bottom: 4px;
`;

const AlertText = styled(Text)`
  color: #B91C1C;
  font-size: 12px;
`;

const PoiScroll = styled(ScrollView)`
  margin-left: -${theme.spacing.l}px;
  margin-right: -${theme.spacing.l}px;
  padding-left: ${theme.spacing.l}px;
`;

const PoiCard = styled(View)`
  background-color: ${theme.colors.surface};
  width: 140px;
  padding: 12px;
  border-radius: 12px;
  margin-right: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  align-items: center;
`;

// Styles for Autocomplete Predictions
// Styles for Autocomplete Predictions (Fixed for Scroll/Display)
const PredictionsContainer = styled(View)`
  background-color: ${theme.colors.surface};
  border-width: 1px;
  border-color: ${theme.colors.border};
  border-radius: 8px;
  margin-top: 4px;
  max-height: 250px; /* Limit height */
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000; /* Higher z-index */
`;

const ScrollablePredictions = styled(ScrollView)`
  max-height: 100%;
`;

const PredictionItem = styled(TouchableOpacity)`
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  flex-direction: row;
  align-items: center;
`;

const PredictionText = styled(Text)`
  margin-left: 8px;
  color: ${theme.colors.text};
  font-size: 14px;
`;

const NavigationContainer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  justify-content: space-between;
`;

const NavHeader = styled(View)`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.m}px;
  padding-top: 60px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 6;
`;

const TurnIcon = styled(View)`
  width: 60px;
  height: 60px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const NavInstruction = styled(View)`
  flex: 1;
`;

const InstructionText = styled(Text)`
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const DistanceText = styled(Text)`
  color: white;
  opacity: 0.8;
  font-size: 16px;
`;

const NavFooter = styled(View)`
  background-color: white;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  elevation: 10;
`;

const SpeedContainer = styled(View)`
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border-width: 4px;
  border-color: ${theme.colors.border};
  background-color: #f8f9fa;
`;

const SpeedText = styled(Text)`
  font-size: 28px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const SpeedLabel = styled(Text)`
  font-size: 10px;
  color: ${theme.colors.textSecondary};
`;

const InfoContainer = styled(View)`
  align-items: center;
`;

const TimeRemaining = styled(Text)`
  font-size: 24px;
  color: ${theme.colors.success};
  font-weight: bold;
`;

const DistanceRemaining = styled(Text)`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
`;

const StopButton = styled(TouchableOpacity)`
  background-color: #EF4444;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
`;

interface RouteStep {
  html_instructions: string;
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  start_location: { lat: number; lng: number };
  end_location: { lat: number; lng: number };
  maneuver?: string; // e.g., 'turn-left', 'turn-right'
}

interface RouteData {
  distance: string;
  distanceValue: number; // meters
  duration: string;
  coordinates: Array<{ latitude: number; longitude: number }>;
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  steps: RouteStep[]; // Added for turn-by-turn
}

interface PlacePrediction {
  place_id: string;
  description: string;
}

export default function RouteScreen() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>(null);

  // Autocomplete State
  const [originPredictions, setOriginPredictions] = useState<PlacePrediction[]>([]);
  const [destPredictions, setDestPredictions] = useState<PlacePrediction[]>([]);
  const [activeField, setActiveField] = useState<'origin' | 'destination' | null>(null);

  const { selectedVehicle, fuelPrice } = useVehicleStore();


  // Debounce helper
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (text: string, field: 'origin' | 'destination') => {
    // Update Text Immediately
    if (field === 'origin') setOrigin(text);
    else setDestination(text);

    // Clear/Reset predictions immediately if empty
    if (text.length === 0) {
      if (field === 'origin') setOriginPredictions([]);
      else setDestPredictions([]);
      return;
    }

    // Debounce API Call
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchPredictions(text, field);
    }, 700); // 700ms delay for smoother typing
  };

  const clearInput = (field: 'origin' | 'destination') => {
    if (field === 'origin') {
      setOrigin('');
      setOriginPredictions([]);
    } else {
      setDestination('');
      setDestPredictions([]);
    }
  };

  const fetchPredictions = async (text: string, field: 'origin' | 'destination') => {
    if (text.length < 3) return;

    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
      // If no key, don't try to fetch to avoid errors, just act as normal input
      return;
    }

    try {
      // Documentation: https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
      const url = 'https://places.googleapis.com/v1/places:autocomplete';

      const response = await axios.post(
        url,
        {
          input: text,
          includedRegionCodes: ['BR'],
          // locationBias can be added here if needed
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_API_KEY,
          },
        }
      );

      // New API response structure: { suggestions: [ { placePrediction: { place: "places/ChI...", text: { text: "...", matches: [] } } } ] }
      if (response.data.suggestions) {
        const mappedPredictions = response.data.suggestions.map((item: any) => ({
          place_id: item.placePrediction.place, // In new API, place name is the resource id "places/ID" or placeId
          description: item.placePrediction.text.text,
        }));

        if (field === 'origin') setOriginPredictions(mappedPredictions);
        else setDestPredictions(mappedPredictions);
      } else {
        // Empty results or different structure
        if (field === 'origin') setOriginPredictions([]);
        else setDestPredictions([]);
      }

    } catch (error: any) {
      console.warn('Erro no autocomplete (New API):', error);
      if (error.response) {
        // The new API returns errors in a standard error format
        Alert.alert('Erro HTTP', `Status: ${error.response.status}`);
      } else {
        Alert.alert('Erro de Conexão', error.message);
      }
    }
  };

  const handleSelectPrediction = (prediction: PlacePrediction, field: 'origin' | 'destination') => {
    if (field === 'origin') {
      setOrigin(prediction.description);
      setOriginPredictions([]);
    } else {
      setDestination(prediction.description);
      setDestPredictions([]);
    }
    setActiveField(null);
    Keyboard.dismiss();
  };

  // Navigation State
  const [isNavigating, setIsNavigating] = useState(false);
  const mapRef = React.useRef<MapView>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userHeading, setUserHeading] = useState(0);
  const [userSpeed, setUserSpeed] = useState(0);
  const locationSubscription = React.useRef<Location.LocationSubscription | null>(null);

  const calculateRoute = async () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha origem e destino');
      return;
    }

    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
      Alert.alert('Simulação', 'Sem chave de API detectada, usando rota simulada.');
      mockRoute();
      return;
    }

    setLoading(true);
    setRouteData(null); // Clear previous route

    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        origin
      )}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_API_KEY}&language=pt-BR`;

      const response = await axios.get(url);

      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const leg = route.legs[0];

        const points = polyline.decode(route.overview_polyline.points);
        const coordinates = points.map((point: number[]) => ({
          latitude: point[0],
          longitude: point[1],
        }));

        const steps: RouteStep[] = leg.steps.map((step: any) => ({
          html_instructions: step.html_instructions,
          distance: step.distance,
          duration: step.duration,
          start_location: step.start_location,
          end_location: step.end_location,
          maneuver: step.maneuver
        }));

        setRouteData({
          distance: leg.distance.text,
          distanceValue: leg.distance.value,
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
          steps
        });
      } else {
        Alert.alert('Erro', 'Rota não encontrada. Tente endereços mais específicos.');
      }
    } catch (error) {
      console.error('Erro de API:', error);
      Alert.alert('Offline', 'Não foi possível conectar. Usando rota simulada.');
      mockRoute();
    } finally {
      setLoading(false);
    }
  };

  const mockRoute = () => {
    setRouteData({
      distance: '408 km',
      distanceValue: 408000,
      duration: '5 horas 20 min',
      coordinates: [
        { latitude: -23.5505, longitude: -46.6333 }, // SP
        { latitude: -25.4284, longitude: -49.2733 }  // Curitiba
      ],
      origin: { latitude: -23.5505, longitude: -46.6333 },
      destination: { latitude: -25.4284, longitude: -49.2733 },
      steps: [
        {
          html_instructions: "Siga em frente na <b>Rodovia dos Bandeirantes</b>",
          distance: { text: "20 km", value: 20000 },
          duration: { text: "20 min", value: 1200 },
          start_location: { lat: -23.5505, lng: -46.6333 },
          end_location: { lat: -23.6, lng: -46.7 }
        },
        {
          html_instructions: "Pegue a saída para <b>Curitiba</b>",
          distance: { text: "380 km", value: 380000 },
          duration: { text: "5 h", value: 18000 },
          start_location: { lat: -23.6, lng: -46.7 },
          end_location: { lat: -25.4284, lng: -49.2733 }
        }
      ]
    });
    setLoading(false);
  }

  const getTripDetails = () => {
    if (!routeData || !selectedVehicle) return null;

    const distanceKm = routeData.distanceValue / 1000;
    const litersNeeded = distanceKm / selectedVehicle.avgConsumption;
    const fuelCost = litersNeeded * fuelPrice;

    // Simulating Tolls (approx R$ 14,00 per 100km for demo)
    const tollCount = Math.floor(distanceKm / 100);
    const tollCost = tollCount * 14.50;

    const totalCost = fuelCost + tollCost;

    return {
      liters: litersNeeded.toFixed(1),
      fuelCost: fuelCost.toFixed(2),
      tollCount,
      tollCost: tollCost.toFixed(2),
      totalCost: totalCost.toFixed(2)
    };
  };

  const tripDetails = getTripDetails();

  const startNavigation = async () => {
    if (!routeData) return;

    // Permission Check
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos do GPS para navegar.');
      return;
    }

    setIsNavigating(true);
    setCurrentStepIndex(0);

    // Initial Camera Animation
    mapRef.current?.animateCamera({
      center: routeData.origin,
      pitch: 50,
      heading: 0,
      altitude: 1000,
      zoom: 18,
    }, { duration: 2000 });

    // Start Watching Location
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 10, // Update every 10 meters
      },
      (location) => {
        const { latitude, longitude, heading, speed } = location.coords;
        setUserLocation({ latitude, longitude });
        setUserHeading(heading || 0);
        setUserSpeed(speed ? Math.round(speed * 3.6) : 0); // convert m/s to km/h

        // Camera Follow
        mapRef.current?.animateCamera({
          center: { latitude, longitude },
          heading: heading || 0,
          pitch: 50,
          zoom: 18
        }, { duration: 500 });

        // Find Nearest Step / Update Instruction
        // Simple logic: if close to end_location of current step, advance.
        // In a real app, use turf.js or geometry library for point-on-line distance.
        if (routeData.steps && routeData.steps[currentStepIndex]) {
          const step = routeData.steps[currentStepIndex];
          const distToEnd = Math.sqrt(
            Math.pow(latitude - step.end_location.lat, 2) +
            Math.pow(longitude - step.end_location.lng, 2)
          );

          // Approx 0.0005 deg is roughly 50 meters
          if (distToEnd < 0.0005 && currentStepIndex < routeData.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
          }
        }
      }
    );
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setUserLocation(null);
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    // Reset Camera
    if (routeData) {
      mapRef.current?.animateToRegion({
        latitude: routeData.origin.latitude,
        longitude: routeData.origin.longitude,
        latitudeDelta: 4,
        longitudeDelta: 4,
      }, 1000);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    }
  }, []);


  if (isNavigating && routeData) {
    const currentStep = routeData.steps[currentStepIndex];
    const nextStep = routeData.steps[currentStepIndex + 1];

    // Calculate remaining distance and duration from current step onwards
    const remainingDistanceValue = routeData.steps
      .slice(currentStepIndex)
      .reduce((sum, step) => sum + step.distance.value, 0);
    const remainingDurationValue = routeData.steps
      .slice(currentStepIndex)
      .reduce((sum, step) => sum + step.duration.value, 0);

    const formatDuration = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    };

    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Map Full Screen */}
        <MapView
          ref={mapRef}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          // initialRegion not strictly needed if we animate on start, but good safety
          initialRegion={{
            latitude: routeData.origin.latitude,
            longitude: routeData.origin.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
          showsCompass={false}
        >
          <Polyline coordinates={routeData.coordinates} strokeWidth={5} strokeColor="#3B82F6" />

          {/* Car Marker (Custom UI for user location if showsUserLocation is boring) */}
          {/* We can rely on showsUserLocation which uses the blue dot, or custom marker if we want a car icon */}
          {userLocation && (
            <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }} rotation={userHeading} flat>
              <View style={{
                width: 40, height: 40, alignItems: 'center', justifyContent: 'center'
              }}>
                <FontAwesome5 name="car-alt" size={30} color={theme.colors.primary} />
              </View>
            </Marker>
          )}
        </MapView>

        <NavigationContainer pointerEvents="box-none">
          <NavHeader>
            <TurnIcon>
              <MaterialIcons
                name={currentStep.maneuver?.includes('left') ? 'turn-left' : currentStep.maneuver?.includes('right') ? 'turn-right' : 'arrow-upward'}
                size={36}
                color="white"
              />
            </TurnIcon>
            <NavInstruction>
              <InstructionText numberOfLines={2}>{currentStep.html_instructions.replace(/<[^>]*>/g, '')}</InstructionText>
              <DistanceText>{currentStep.distance.text}</DistanceText>
            </NavInstruction>
          </NavHeader>

          <NavFooter>
            <InfoContainer>
              <TimeRemaining>{formatDuration(remainingDurationValue)}</TimeRemaining>
              <DistanceRemaining>{(remainingDistanceValue / 1000).toFixed(1)} km</DistanceRemaining>
            </InfoContainer>

            <SpeedContainer>
              <SpeedText>{userSpeed}</SpeedText>
              <SpeedLabel>km/h</SpeedLabel>
            </SpeedContainer>

            <StopButton onPress={stopNavigation}>
              <MaterialIcons name="close" size={30} color="white" />
            </StopButton>
          </NavFooter>
        </NavigationContainer>
      </View>
    );
  }

  return (
    <Container showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Header>
        <HeaderTitle>Planejamento</HeaderTitle>
        <HeaderSubtitle>{origin && destination ? `${origin.split(',')[0]} ➔ ${destination.split(',')[0]}` : 'Defina seu trajeto'}</HeaderSubtitle>
      </Header>

      <ContentContainer>
        <Card style={{ zIndex: 100 }}>
          <View style={{ zIndex: 201 }}>
            <Input
              label="Origem"
              placeholder="Digite o endereço..."
              value={origin}
              onChangeText={(text) => handleInputChange(text, 'origin')}
              onFocus={() => setActiveField('origin')}
              onClear={() => clearInput('origin')}
            />
            {activeField === 'origin' && originPredictions.length > 0 && (
              <PredictionsContainer>
                {originPredictions.map((item) => (
                  <PredictionItem key={item.place_id} onPress={() => handleSelectPrediction(item, 'origin')}>
                    <MaterialIcons name="location-on" size={18} color={theme.colors.textSecondary} />
                    <PredictionText numberOfLines={1}>{item.description}</PredictionText>
                  </PredictionItem>
                ))}
              </PredictionsContainer>
            )}
          </View>

          <View style={{ height: theme.spacing.m }} />

          <View style={{ zIndex: 200 }}>
            <Input
              label="Destino"
              placeholder="Digite o endereço..."
              value={destination}
              onChangeText={(text) => handleInputChange(text, 'destination')}
              onFocus={() => setActiveField('destination')}
              onClear={() => clearInput('destination')}
            />
            {activeField === 'destination' && destPredictions.length > 0 && (
              <PredictionsContainer>
                {destPredictions.map((item) => (
                  <PredictionItem key={item.place_id} onPress={() => handleSelectPrediction(item, 'destination')}>
                    <MaterialIcons name="flag" size={18} color={theme.colors.textSecondary} />
                    <PredictionText numberOfLines={1}>{item.description}</PredictionText>
                  </PredictionItem>
                ))}
              </PredictionsContainer>
            )}
          </View>

          <View style={{ height: theme.spacing.l }} />
          <Button
            title={loading ? "Calculando..." : "Planejar Viagem"}
            onPress={calculateRoute}
            loading={loading}
          />
        </Card>

        {routeData && tripDetails ? (
          <View style={{ marginTop: 24, paddingBottom: 40, zIndex: 1 }}>

            <SectionTitle>Mapa do Trajeto</SectionTitle>
            <MapContainer>
              <MapView
                style={{ flex: 1 }}
                scrollEnabled={false} // Disable interaction to keep it as a preview
                initialRegion={{
                  latitude: routeData.origin.latitude,
                  longitude: routeData.origin.longitude,
                  latitudeDelta: 4,
                  longitudeDelta: 4,
                }}
                region={{
                  latitude: routeData.origin.latitude,
                  longitude: routeData.origin.longitude,
                  latitudeDelta: 4,
                  longitudeDelta: 4,
                }}
              >
                <Marker coordinate={routeData.origin} pinColor={theme.colors.success} />
                <Marker coordinate={routeData.destination} pinColor={theme.colors.warning} />
                <Polyline coordinates={routeData.coordinates} strokeWidth={4} strokeColor={theme.colors.primary} />
              </MapView>
            </MapContainer>

            <View style={{ marginBottom: 20 }}>
              <Button
                title="Iniciar Navegação (Simulação)"
                onPress={startNavigation}
              />
            </View>

            <SectionTitle>Raio-X da Viagem</SectionTitle>

            {/* Alert Card */}
            <AlertBox>
              <Row>
                <AlertTitle>Atenção na Rodovia</AlertTitle>
                <FontAwesome5 name="exclamation-triangle" color="#991B1B" />
              </Row>
              <AlertText>Trecho com possibilidade de chuvas isoladas. Mantenha distância segura.</AlertText>
            </AlertBox>

            {/* Financial Dashboard */}
            <DashboardCard>
              <Row>
                <View>
                  <Text style={{ color: theme.colors.textSecondary, marginBottom: 4 }}>Custo Total Estimado</Text>
                  <MoneyValue>R$ {tripDetails.totalCost}</MoneyValue>
                </View>
                <FontAwesome6 name="money-bill-wave" size={24} color={theme.colors.success} />
              </Row>

              <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 12 }} />

              <StatGrid>
                <StatItem>
                  <StatLabel>Combustível ({selectedVehicle?.name})</StatLabel>
                  <StatValue>R$ {tripDetails.fuelCost}</StatValue>
                  <Text style={{ fontSize: 10, color: '#999' }}>{tripDetails.liters} Litros</Text>
                </StatItem>
                <StatItem>
                  <StatLabel>Pedágios Estimados</StatLabel>
                  <StatValue>R$ {tripDetails.tollCost}</StatValue>
                  <Text style={{ fontSize: 10, color: '#999' }}>{tripDetails.tollCount} Praças</Text>
                </StatItem>
                <StatItem>
                  <StatLabel>Distância</StatLabel>
                  <StatValue>{routeData.distance}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Tempo</StatLabel>
                  <StatValue>{routeData.duration}</StatValue>
                </StatItem>
              </StatGrid>
            </DashboardCard>

            {/* Strategic Points */}
            <SectionTitle>Paradas Estratégicas</SectionTitle>
            <PoiScroll horizontal showsHorizontalScrollIndicator={false}>
              <PoiCard>
                <MaterialIcons name="local-gas-station" size={24} color={theme.colors.primary} />
                <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Posto Graal</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>km 120 (Seguro)</Text>
              </PoiCard>
              <PoiCard>
                <MaterialIcons name="restaurant" size={24} color="#F59E0B" />
                <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Madero Center</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>km 245 (Almoço)</Text>
              </PoiCard>
              <PoiCard>
                <MaterialIcons name="local-hospital" size={24} color="#EF4444" />
                <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Emergência</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>Base da CCR</Text>
              </PoiCard>
              <PoiCard>
                <MaterialIcons name="wc" size={24} color={theme.colors.text} />
                <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Parada Leve</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>km 300</Text>
              </PoiCard>
            </PoiScroll>

          </View>
        ) : (
          <View style={{ marginTop: 40, alignItems: 'center', opacity: 0.5 }}>
            <FontAwesome5 name="map-marked-alt" size={60} color={theme.colors.textSecondary} />
            <Text style={{ marginTop: 16, color: theme.colors.textSecondary }}>
              Digite origem e destino para ver o planejamento completo.
            </Text>
          </View>
        )}

      </ContentContainer>
    </Container>
  );
}
