import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { theme } from '../../../../core/theme';
import { SCREENS } from '../../../../core/constants/screens';

// Custom Map Style to match the App Theme (Clean & Teal)
const mapCustomStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }] // Lighter background
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }] // Hide excessive icons
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#bdbdbd" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5f5f5" }] // Teal tint for parks
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#dadada" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#c9c9c9" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  }
];

const Container = styled(View)`
  flex: 1;
  background-color: #F0FDFA;
`;

const MapContainer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: flex-end;
  align-items: center;
`;

const Overlay = styled(View)`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.1); 
  justify-content: flex-end;
  padding-bottom: ${theme.spacing.xl}px;
`;

// Gradient fade for bottom overlay could be added here if needed
const BottomSheet = styled(View)`
  background-color: rgba(255, 255, 255, 0.9); /* More opaque for contrast */
  padding-top: 16px;
  padding-bottom: ${theme.spacing.xl}px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  width: 100%;
  
  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 10;
`;

const Header = styled(View)`
  position: absolute;
  top: 60px;
  left: ${theme.spacing.l}px;
  right: ${theme.spacing.l}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const GreetingContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.surface};
  padding: 8px 16px;
  border-radius: 12px;
  
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const GreetingText = styled(Text)`
  font-weight: 600;
  color: ${theme.colors.text};
  font-size: 14px;
  margin-left: 8px;
`;

const AvatarButton = styled(TouchableOpacity)`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: ${theme.colors.primary};
  align-items: center;
  justify-content: center;
  
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 4;
`;

const ActionGrid = styled(View)`
  flex-direction: row;
  flex-wrap: wrap; /* Allow wrapping if screen is very narrow */
  justify-content: space-around; /* Distribute evenly */
  padding: 0 16px;
  margin-bottom: 24px;
`;

// Uniform, smaller bubbles
const ActionBubble = styled(TouchableOpacity)`
  width: 90px;
  height: 90px;
  background-color: ${theme.colors.surface};
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  margin: 4px;
  
  shadow-color: #0F766E;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 4;
  
  border-width: 1px;
  border-color: rgba(0,0,0,0.05);
`;

const TravelModeButton = styled(TouchableOpacity)`
  background-color: ${theme.colors.primary};
  width: 90%;
  align-self: center;
  padding: 16px 20px; /* Slightly compacted */
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 12px;
  elevation: 8;
`;

const BubbleLabel = styled(Text)`
  font-weight: 600;
  color: ${theme.colors.text};
  font-size: 12px;
  text-align: center;
  margin-top: 6px;
`;

const MainActionText = styled(Text)`
  color: #FFF;
  font-size: 16px;
  font-weight: 700;
  margin-left: 10px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const GPSButton = styled(TouchableOpacity)`
  align-self: flex-end;
  margin-right: ${theme.spacing.l}px;
  margin-bottom: ${theme.spacing.m}px;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${theme.colors.surface};
  align-items: center;
  justify-content: center;
  
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 5;
`;

export default function Home() {
  // Navigation & Mode State
  const navigation = useNavigation<any>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  // New Modes
  const [isTravelMode, setIsTravelMode] = useState(false); // Default: City Mode
  const [isFreeDrive, setIsFreeDrive] = useState(false);

  // Mock Speed for Free Drive
  const [speed, setSpeed] = useState(0);

  const centerMapOnUser = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);

    if (mapRef.current && currentLocation) {
      // If Free Drive, 3D perspective
      if (isFreeDrive) {
        mapRef.current.animateCamera({
          center: currentLocation.coords,
          pitch: 50,
          heading: currentLocation.coords.heading || 0,
          zoom: 18,
          altitude: 500
        }, { duration: 1000 });
      } else {
        // Normal View
        mapRef.current.animateToRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }, 1000);
      }
    }
  };

  const toggleFreeDrive = () => {
    const newState = !isFreeDrive;
    setIsFreeDrive(newState);
    if (newState) {
      // Start Simulation
      centerMapOnUser();
      const interval = setInterval(() => {
        setSpeed(Math.floor(Math.random() * 30) + 40); // 40-70 km/h mock
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setSpeed(0);
      // Reset Camera
      centerMapOnUser();
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua localização para mostrar o mapa.');
        return;
      }

      centerMapOnUser();
    })();
  }, []);

  return (
    <Container>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <MapContainer>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          customMapStyle={mapCustomStyle}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          initialRegion={{
            latitude: -23.55052,
            longitude: -46.633309,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </MapContainer>

      {/* Free Drive HUD */}
      {isFreeDrive && (
        <View style={{ position: 'absolute', top: 60, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ backgroundColor: theme.colors.primary, padding: 10, borderRadius: 10, elevation: 5 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Modo Livre</Text>
            <Text style={{ color: 'white', fontSize: 10 }}>Monitorando Trânsito</Text>
          </View>

          <View style={{ alignItems: 'center', backgroundColor: 'white', width: 80, height: 80, borderRadius: 40, justifyContent: 'center', borderWidth: 4, borderColor: '#f0f0f0', elevation: 5 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333' }}>{speed}</Text>
            <Text style={{ fontSize: 10, color: '#666' }}>km/h</Text>
          </View>
        </View>
      )}

      {/* Main Overlay */}
      <Overlay pointerEvents="box-none">

        {/* Header with Mode Toggle */}
        {!isFreeDrive && (
          <Header>
            <GreetingContainer>
              <Feather name={isTravelMode ? "map" : "navigation"} size={16} color={theme.colors.primary} />
              <GreetingText>{isTravelMode ? "Modo Viagem" : "Modo Urbano"}</GreetingText>
            </GreetingContainer>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 4, borderRadius: 20, elevation: 3, marginLeft: 10 }}>
              <TouchableOpacity
                onPress={() => setIsTravelMode(false)}
                style={{
                  paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
                  backgroundColor: !isTravelMode ? theme.colors.primary : 'transparent'
                }}
              >
                <Text style={{ color: !isTravelMode ? 'white' : '#666', fontWeight: 'bold', fontSize: 12 }}>Cidade</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsTravelMode(true)}
                style={{
                  paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
                  backgroundColor: isTravelMode ? theme.colors.primary : 'transparent'
                }}
              >
                <Text style={{ color: isTravelMode ? 'white' : '#666', fontWeight: 'bold', fontSize: 12 }}>Viagem</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }} />

            <AvatarButton onPress={() => navigation.navigate(SCREENS.GARAGE)}>
              <FontAwesome5 name="car" size={20} color="#FFF" />
            </AvatarButton>
          </Header>
        )}

        {/* GPS Recenter */}
        <GPSButton onPress={centerMapOnUser} activeOpacity={0.8}>
          <MaterialIcons name="my-location" size={24} color={theme.colors.primary} />
        </GPSButton>

        {/* Bottom Sheet */}
        <BottomSheet>

          {isFreeDrive ? (
            // Free Drive Stop Button
            <View style={{ paddingHorizontal: 20 }}>
              <TravelModeButton onPress={toggleFreeDrive} style={{ backgroundColor: '#EF4444' }}>
                <MaterialIcons name="stop" size={24} color="#FFF" />
                <MainActionText>Parar Navegação</MainActionText>
              </TravelModeButton>
            </View>
          ) : isTravelMode ? (
            // TRAVEL MODE: Full Dashboard
            <>
              <Text style={{ marginLeft: 20, marginBottom: 10, color: theme.colors.textSecondary, fontWeight: 'bold' }}>Ferramentas de Viagem</Text>
              <ActionGrid>
                <ActionBubble onPress={() => navigation.navigate(SCREENS.ROUTE)}>
                  <MaterialIcons name="explore" size={32} color={theme.colors.primary} />
                  <BubbleLabel>Vai Viajar?</BubbleLabel>
                </ActionBubble>

                <ActionBubble onPress={() => navigation.navigate(SCREENS.COSTS)}>
                  <MaterialIcons name="attach-money" size={28} color={theme.colors.success} />
                  <BubbleLabel>Custos</BubbleLabel>
                </ActionBubble>

                <ActionBubble onPress={() => navigation.navigate(SCREENS.RENT)}>
                  <FontAwesome5 name="car" size={24} color={theme.colors.warning} />
                  <BubbleLabel>Alugar</BubbleLabel>
                </ActionBubble>
              </ActionGrid>
            </>
          ) : (
            // CITY MODE: Simple "Go" Button
            <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
              <Text style={{ marginBottom: 15, color: theme.colors.textSecondary, textAlign: 'center' }}>
                Dirigindo pela cidade? Ative o modo livre.
              </Text>
              <TravelModeButton onPress={toggleFreeDrive}>
                <MaterialIcons name="navigation" size={24} color="#FFF" />
                <MainActionText>Navegação Livre</MainActionText>
              </TravelModeButton>
            </View>
          )}

        </BottomSheet>
      </Overlay>
    </Container>
  );
}
