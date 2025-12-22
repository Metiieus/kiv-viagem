import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StatusBar, TouchableOpacity, Keyboard, FlatList } from 'react-native';
import styled from 'styled-components/native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import polyline from '@mapbox/polyline';
import { GOOGLE_API_KEY } from '@env';
import { theme } from '../../../../core/theme';
import { Button, Input, Card } from '../../../../core/components';
import { estimateTolls } from '../../../../utils/tollCalculator';
import { getRecommendedStops, RouteStop } from '../../../../utils/stopRecommender';
import { useVehicleStore } from '../../../garage/stores/useVehicleStore';
import { calcDistKm } from '../../../../utils/geoUtils';
import { useTelemetryStore } from '../../garage/stores/useTelemetryStore';
import { obdService } from '../../garage/services/OBDService';
import { MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: #F9FAFB;
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
  durationValue: number; // seconds
  coordinates: Array<{ latitude: number; longitude: number }>;
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  steps: RouteStep[];
  // Pre-calculated costs for this specific route
  fuelCost: number;
  tollCost: number;
  totalCost: number;
  liters: number;
  summary: string; // e.g. "via Rod. dos Bandeirantes"
}

interface PlacePrediction {
  place_id: string;
  description: string;
}

export default function RouteScreen({ route }: any) {
  // Pre-fill State based on params
  const { cityMode } = route?.params || {};

  const [origin, setOrigin] = useState(cityMode ? 'Sua Localização' : '');
  const [destination, setDestination] = useState(route?.params?.initialDestination || '');
  const [loading, setLoading] = useState(false);

  // Multi-Route State
  const [routeOptions, setRouteOptions] = useState<RouteData[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  // Auto-focus logic
  useEffect(() => {
    if (route?.params?.focusDestination) {
      setActiveField('destination');
      // In a real scenario we might want to ref the input and call .focus(), 
      // but setting activeField shows predictions if text exists.
    }
  }, [route?.params]);

  // Autocomplete State
  const [originPredictions, setOriginPredictions] = useState<PlacePrediction[]>([]);
  const [destPredictions, setDestPredictions] = useState<PlacePrediction[]>([]);
  const [activeField, setActiveField] = useState<'origin' | 'destination' | null>(null);

  const { selectedVehicle, fuelPrice, setFuelPrice, addTripToOdometer } = useVehicleStore();
  const [isFuelModalVisible, setIsFuelModalVisible] = useState(false);
  const [tempFuelPrice, setTempFuelPrice] = useState(fuelPrice.toString());

  // Stop Recommendations
  const [recommendedStops, setRecommendedStops] = useState<RouteStop[]>([]);

  // Financial HUD State
  const [accumulatedDistance, setAccumulatedDistance] = useState(0); // in km
  const [accumulatedCost, setAccumulatedCost] = useState(0); // in R$

  // Geofencing State
  const [tollLocations, setTollLocations] = useState<{ latitude: number, longitude: number, passed: boolean }[]>([]);
  const [activeTollAlert, setActiveTollAlert] = useState<string | null>(null);

  const handleUpdateFuelPrice = () => {
    const price = parseFloat(tempFuelPrice.replace(',', '.'));
    if (!isNaN(price) && price > 0) {
      setFuelPrice(price);
      // If routes allow re-calculation without fetching API again, we should do it.
      // But currently costs are baked into routeOptions. 
      // Ideally we should recalculate costs when price changes.
      // For now, let's just update store and ask user to refresh or re-calculate.
      // Better: Re-run cost calc iterate over routeOptions
      const updatedOptions = routeOptions.map(opt => {
        const distKm = opt.distanceValue / 1000;
        const liters = distKm / (selectedVehicle?.avgConsumption || 10);
        const fCost = liters * price;
        const tCost = fCost + opt.tollCost;
        return { ...opt, fuelCost: parseFloat(fCost.toFixed(2)), totalCost: parseFloat(tCost.toFixed(2)) };
      });
      setRouteOptions(updatedOptions);
      setIsFuelModalVisible(false);
    }
  };


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
    let finalOrigin = origin;

    // If City Mode and Origin is user location, get coords
    if (cityMode && (origin === 'Sua Localização' || !origin)) {
      let loc;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error('Permission denied');
        loc = await Location.getCurrentPositionAsync({});
        finalOrigin = `${loc.coords.latitude},${loc.coords.longitude}`;
      } catch (e) {
        Alert.alert('Erro GPS', 'Não foi possível obter sua localização.');
        return;
      }
    } else if (!origin.trim() || !destination.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha origem e destino');
      return;
    }

    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
      Alert.alert('Simulação', 'Sem chave de API detectada, usando rota simulada.');
      mockRoute();
      return;
    }

    setLoading(true);
    setRouteOptions([]);

    try {
      // Request Alternatives!
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        finalOrigin
      )}&destination=${encodeURIComponent(destination)}&alternatives=true&key=${GOOGLE_API_KEY}&language=pt-BR`;

      const response = await axios.get(url);

      if (response.data.status === 'OK' && response.data.routes.length > 0) {

        const newOptions: RouteData[] = response.data.routes.map((route: any) => {
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

          // Cost Calculations
          const distanceKm = leg.distance.value / 1000;
          const avgConsumption = selectedVehicle?.avgConsumption || 10; // Default fallback
          const liters = distanceKm / avgConsumption;
          const fuelCost = liters * (fuelPrice || 5.50);
          const tollCost = estimateTolls(leg.distance.value); // Use utility
          const totalCost = fuelCost + tollCost;

          return {
            distance: leg.distance.text,
            distanceValue: leg.distance.value,
            duration: leg.duration.text,
            durationValue: leg.duration.value,
            coordinates,
            origin: {
              latitude: leg.start_location.lat,
              longitude: leg.start_location.lng,
            },
            destination: {
              latitude: leg.end_location.lat,
              longitude: leg.end_location.lng,
            },
            steps,
            fuelCost: parseFloat(fuelCost.toFixed(2)),
            tollCost: parseFloat(tollCost.toFixed(2)),
            totalCost: parseFloat(totalCost.toFixed(2)),
            liters: parseFloat(liters.toFixed(1)),
            summary: route.summary || leg.start_address // Google often gives summary
          };
        });

        setRouteOptions(newOptions);
        setSelectedRouteIndex(0);

        // Calculate Recommended Stops based on first route (or selected)
        // Assuming user selects first route initially.
        if (newOptions.length > 0 && selectedVehicle) {
          // Estimate range if not explicitly defined in vehicle interface
          const estimatedRange = selectedVehicle.avgConsumption * 50;

          // We need to pass the full coordinate path for analysis
          const routeCoordinates = newOptions[0].coordinates;

          // This is now async
          getRecommendedStops(
            routeCoordinates,
            newOptions[0].distanceValue / 1000,
            {
              rangeKm: estimatedRange,
              avgConsumption: selectedVehicle.avgConsumption,
              currentFuel: 30 // Mocking 30L start
            }
          ).then(stops => {
            setRecommendedStops(stops);
          }).catch(err => {
            console.error("Error calculating stops", err);
          });
        }

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
    // Mocking 2 routes for testing UI
    const mock1: RouteData = {
      distance: '408 km',
      distanceValue: 408000,
      duration: '5 horas 20 min',
      durationValue: 19200,
      coordinates: [
        { latitude: -23.5505, longitude: -46.6333 },
        { latitude: -25.4284, longitude: -49.2733 }
      ],
      origin: { latitude: -23.5505, longitude: -46.6333 },
      destination: { latitude: -25.4284, longitude: -49.2733 },
      steps: [],
      fuelCost: 200.50,
      tollCost: 50.00,
      totalCost: 250.50,
      liters: 40,
      summary: "via Rod. Régis Bittencourt"
    };

    const mock2: RouteData = {
      distance: '450 km',
      distanceValue: 450000,
      duration: '6 horas',
      durationValue: 21600,
      coordinates: [
        { latitude: -23.5505, longitude: -46.6333 },
        { latitude: -24.0, longitude: -47.0 },
        { latitude: -25.4284, longitude: -49.2733 }
      ],
      origin: { latitude: -23.5505, longitude: -46.6333 },
      destination: { latitude: -25.4284, longitude: -49.2733 },
      steps: [],
      fuelCost: 220.00,
      tollCost: 40.00,
      totalCost: 260.00,
      liters: 44,
      summary: "via Rota Alternativa"
    };

    setRouteOptions([mock1, mock2]);
    setLoading(false);
  }

  // Helper for UI
  const routeData = routeOptions[selectedRouteIndex];

  const startNavigation = async () => {
    if (!routeData) return;

    // Permission Check
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos do GPS para navegar.');
      return;
    }

    // Extract Toll Locations from steps
    const tolls: { latitude: number, longitude: number, passed: boolean }[] = [];
    if (routeData.steps) {
      routeData.steps.forEach((step: any) => {
        if (step.html_instructions.toLowerCase().includes('pedágio') ||
          step.html_instructions.toLowerCase().includes('toll')) {
          tolls.push({
            latitude: step.end_location.lat,
            longitude: step.end_location.lng,
            passed: false
          });
        }
      });
    }
    setTollLocations(tolls);

    setIsNavigating(true);
    setCurrentStepIndex(0);
    setAccumulatedDistance(0);
    setAccumulatedCost(0);

    mapRef.current?.animateCamera({
      center: routeData.origin,
      heading: 0,
      altitude: 1000,
      zoom: 18,
    }, { duration: 2000 });

    // Start Watching Location
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 5, // Update every 5 meters
      },
      (location) => {
        const { latitude, longitude, heading, speed } = location.coords;

        // Calculate Delta Distance for Financial HUD
        setUserLocation(prevLoc => {
          const newLocation = { latitude, longitude };
          if (prevLoc) {
            const delta = calcDistKm(prevLoc.latitude, prevLoc.longitude, latitude, longitude);
            // Filter GPS noise: only add if moderate movement (e.g. > 2 meters which is 0.002km, adjust as needed)
            // Actually 5 meters interval in watchPosition helps, but let's be sure.
            if (delta > 0.002) { // delta is in km
              setAccumulatedDistance(prev => {
                const newDist = prev + delta;

                // Update Cost
                if (selectedVehicle) {
                  const litersUsed = newDist / selectedVehicle.avgConsumption;
                  setAccumulatedCost(litersUsed * (fuelPrice || 5.50)); // Use fallback for fuelPrice
                }

                return newDist;
              });
            }
          }
          return newLocation;
        });

        setUserHeading(heading || 0);
        setUserSpeed(speed ? Math.round(speed * 3.6) : 0); // m/s to km/h

        // Camera Follow
        mapRef.current?.animateCamera({
          center: { latitude, longitude },
          heading: heading || 0,
          pitch: 50,
          zoom: 18,
        }, { duration: 500 });

        // Step Check logic
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

  const finishTrip = () => {
    // 1. Update Vehicle Odometer
    if (selectedVehicle && accumulatedDistance > 0.1) {
      addTripToOdometer(accumulatedDistance);
      Alert.alert(
        'Viagem Finalizada 🏁',
        `+${accumulatedDistance.toFixed(1)} km adicionados ao odômetro do ${selectedVehicle.name}.`
      );
    } else {
      Alert.alert('Viagem Encerrada', 'Distância muito curta para registro.');
    }

    // 2. Reset State
    setIsNavigating(false);
    setUserLocation(null);
    setAccumulatedDistance(0);
    setAccumulatedCost(0);
    setTollLocations([]);

    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
    locationSubscription.current = null;

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
          {activeTollAlert && (
            <View style={{ position: 'absolute', top: 100, alignSelf: 'center', backgroundColor: '#EF4444', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30, zIndex: 999, elevation: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 name="road" size={20} color="white" style={{ marginRight: 10 }} />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{activeTollAlert}</Text>
              </View>
            </View>
          )}

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
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }}>
              <InfoContainer>
                <TimeRemaining>{formatDuration(remainingDurationValue)}</TimeRemaining>
                <DistanceRemaining>{(remainingDistanceValue / 1000).toFixed(1)} km</DistanceRemaining>
              </InfoContainer>

              {/* Financial HUD Widget */}
              <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.success }}>
                <Text style={{ color: theme.colors.success, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>Gasto Atual</Text>
                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '900' }}>R$ {accumulatedCost.toFixed(2)}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>{accumulatedDistance.toFixed(1)} km rodados</Text>
              </View>

              <SpeedContainer>
                <SpeedText>{userSpeed}</SpeedText>
                <SpeedLabel>km/h</SpeedLabel>
              </SpeedContainer>
            </View>

            <StopButton onPress={stopNavigation} style={{ position: 'absolute', bottom: -70, alignSelf: 'center' }}>
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

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: theme.colors.text }}>
          {cityMode ? 'Para onde vamos?' : 'Planejar Rota'}
        </Text>

        {/* Origin Input (Hidden in City Mode) */}
        {!cityMode && (
          <View style={{ marginBottom: 16 }}>
            <Input
              label="Origem"
              placeholder="De onde vamos sair?"
              value={origin}
              onChangeText={(t) => handleInputChange(t, 'origin')}
              onFocus={() => setActiveField('origin')}
              onClear={() => clearInput('origin')}
            />

            {/* Origin Predictions */}
            {activeField === 'origin' && originPredictions.length > 0 && (
              <ScrollablePredictions nestedScrollEnabled={true}>
                {originPredictions.map((item) => (
                  <PredictionItem key={item.place_id} onPress={() => handleSelectPrediction(item, 'origin')}>
                    <MaterialIcons name="place" size={20} color="#666" style={{ marginRight: 10 }} />
                    <PredictionText>{item.description}</PredictionText>
                  </PredictionItem>
                ))}
              </ScrollablePredictions>
            )}
          </View>
        )}

        <View style={{ marginBottom: 24, zIndex: 1 }}>
          <Input
            label="Destino"
            placeholder="Para onde vamos?"
            value={destination}
            onChangeText={(t) => handleInputChange(t, 'destination')}
            onFocus={() => setActiveField('destination')}
            onClear={() => clearInput('destination')}
          />

          {/* Destination Predictions */}
          {activeField === 'destination' && destPredictions.length > 0 && (
            <ScrollablePredictions nestedScrollEnabled={true}>
              {destPredictions.map((item) => (
                <PredictionItem key={item.place_id} onPress={() => handleSelectPrediction(item, 'destination')}>
                  <MaterialIcons name="place" size={20} color="#666" style={{ marginRight: 10 }} />
                  <PredictionText>{item.description}</PredictionText>
                </PredictionItem>
              ))}
            </ScrollablePredictions>
          )}
        </View>

        <Button title={loading ? "Calculando..." : "Ver Rota"} onPress={calculateRoute} disabled={loading} />

        {routeOptions.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
              {routeOptions.length > 1 ? 'Rotas Encontradas' : 'Rota Encontrada'}
            </Text>

            {/* Route Carousel */}
            {routeOptions.length > 1 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                {routeOptions.map((opt, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedRouteIndex(index)}
                    activeOpacity={0.9}
                    style={{
                      width: 140,
                      height: 160,
                      padding: 12,
                      marginRight: 12,
                      borderRadius: 12,
                      backgroundColor: selectedRouteIndex === index ? theme.colors.primary : '#FFF',
                      borderWidth: 1,
                      borderColor: selectedRouteIndex === index ? theme.colors.primary : '#E5E7EB',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={{
                      color: selectedRouteIndex === index ? '#FFF' : '#333',
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginBottom: 4
                    }}>
                      {opt.duration}
                    </Text>
                    <Text style={{
                      color: selectedRouteIndex === index ? 'rgba(255,255,255,0.8)' : '#666',
                      fontSize: 12, marginBottom: 8
                    }}>
                      {opt.distance}
                    </Text>
                    <View style={{ height: 1, width: '100%', backgroundColor: selectedRouteIndex === index ? 'rgba(255,255,255,0.3)' : '#EEE', marginVertical: 8 }} />

                    <Text style={{
                      color: selectedRouteIndex === index ? '#FFF' : theme.colors.success,
                      fontSize: 16,
                      fontWeight: '900'
                    }}>
                      R$ {opt.totalCost.toFixed(2)}
                    </Text>

                    {/* Cost per Hour Metric */}
                    <Text style={{
                      fontSize: 10,
                      color: selectedRouteIndex === index ? 'rgba(255,255,255,0.7)' : '#999',
                      marginTop: 2
                    }}>
                      R$ {((opt.totalCost / opt.durationValue) * 3600).toFixed(0)}/h
                    </Text>

                    {opt.summary && (
                      <Text numberOfLines={1} style={{ fontSize: 10, color: selectedRouteIndex === index ? '#DDD' : '#999', marginTop: 4 }}>
                        {opt.summary}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Dashboard for SELECTED Route */}
            {routeData && (
              <View>
                {!cityMode && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <View>
                      <Text style={{ color: '#666' }}>Distância</Text>
                      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{routeData.distance}</Text>
                    </View>
                    <View>
                      <Text style={{ color: '#666' }}>Custo/Km</Text>
                      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        R$ {(routeData.totalCost / (routeData.distanceValue / 1000)).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}

                <DashboardCard>
                  <Row>
                    <View>
                      <Text style={{ color: theme.colors.textSecondary, marginBottom: 4 }}>Custo Total Estimado</Text>
                      <MoneyValue>R$ {routeData.totalCost.toFixed(2)}</MoneyValue>
                    </View>
                    <FontAwesome6 name="money-bill-wave" size={24} color={theme.colors.success} />
                  </Row>

                  <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 12 }} />

                  <StatGrid>
                    <StatItem>
                      <StatLabel>
                        Combustível
                        <TouchableOpacity onPress={() => setIsFuelModalVisible(true)} style={{ marginLeft: 4 }}>
                          <FontAwesome5 name="edit" size={12} color={theme.colors.primary} />
                        </TouchableOpacity>
                      </StatLabel>
                      <StatValue>R$ {routeData.fuelCost.toFixed(2)}</StatValue>
                      <Text style={{ fontSize: 10, color: '#999' }}>{routeData.liters} Litros</Text>
                    </StatItem>
                    <StatItem>
                      <StatLabel>Pedágios Estimados</StatLabel>
                      <StatValue>R$ {routeData.tollCost.toFixed(2)}</StatValue>
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

                <View style={{ marginTop: 20 }}>
                  <Button title="Iniciar Navegação" onPress={startNavigation} />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Simple Fuel Price Modal */}
        {isFuelModalVisible && (
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 999
          }}>
            <View style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 12, width: '80%' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Atualizar Preço do Combustível</Text>
              <Input
                placeholder="Ex: 5.59"
                keyboardType="numeric"
                value={tempFuelPrice}
                onChangeText={setTempFuelPrice}
                label="Preço por Litro (R$)"
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <TouchableOpacity onPress={() => setIsFuelModalVisible(false)} style={{ marginRight: 16, padding: 10 }}>
                  <Text style={{ color: '#666' }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUpdateFuelPrice} style={{ backgroundColor: theme.colors.primary, padding: 10, borderRadius: 8 }}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

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

      </ScrollView>

      {routeData && !cityMode ? (
        <View style={{ marginTop: 24, paddingBottom: 40, zIndex: 1, paddingHorizontal: 20 }}>

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

          {/* Alert Card */}
          <AlertBox>
            <Row>
              <AlertTitle>Atenção na Rodovia</AlertTitle>
              <FontAwesome5 name="exclamation-triangle" color="#991B1B" />
            </Row>
            <AlertText>Trecho com possibilidade de chuvas isoladas. Mantenha distância segura.</AlertText>
          </AlertBox>

          {/* Paradas Inteligentes */}
          <SectionTitle>Paradas Sugeridas (IA)</SectionTitle>
          <Text style={{ marginHorizontal: 20, marginBottom: 12, color: '#666', fontSize: 12 }}>
            Baseado na autonomia do {selectedVehicle?.name} e duração da viagem.
          </Text>

          <PoiScroll horizontal showsHorizontalScrollIndicator={false}>
            {recommendedStops.length > 0 ? (
              recommendedStops.map((stop) => (
                <PoiCard key={stop.id}>
                  <MaterialIcons
                    name={stop.category === 'fuel' ? 'local-gas-station' : stop.category === 'food' ? 'restaurant' : stop.category === 'hospital' ? 'local-hospital' : 'hotel'}
                    size={24}
                    color={stop.category === 'hospital' ? '#EF4444' : stop.category === 'fuel' ? theme.colors.primary : '#F59E0B'}
                  />
                  <Text style={{ fontWeight: 'bold', marginTop: 8 }} numberOfLines={1}>{stop.name}</Text>
                  <Text style={{ fontSize: 10, color: '#666' }}>km {stop.distanceFromOriginKm} • ⭐ {stop.rating}</Text>
                  {stop.tags.length > 0 && (
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                      <Text style={{ fontSize: 9, color: theme.colors.primary, backgroundColor: '#E0E7FF', paddingHorizontal: 4, borderRadius: 4 }}>
                        {stop.tags[0]}
                      </Text>
                    </View>
                  )}
                </PoiCard>
              ))
            ) : (
              <View style={{ padding: 20 }}>
                <Text style={{ color: '#999' }}>Nenhuma parada crítica identificada para este trajeto curto.</Text>
              </View>
            )}
          </PoiScroll>

        </View>
      ) : null}

    </Container >
  );
}
