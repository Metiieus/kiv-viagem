import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, Keyboard } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../../core/theme';
import { Card, Input, Button } from '../../../../core/components';
import { useVehicleStore, Vehicle } from '../../stores/useVehicleStore';

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
`;

const SearchContainer = styled(View)`
  margin-top: ${theme.spacing.m}px;
  margin-bottom: ${theme.spacing.l}px;
`;

const SearchLabel = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const ResultList = styled(View)`
  margin-top: 8px;
`;

const ResultItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.surface};
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const ResultInfo = styled(View)`
  margin-left: 12px;
  flex: 1;
`;

const ResultName = styled(Text)`
  font-weight: bold;
  font-size: 16px;
  color: ${theme.colors.text};
`;

const ResultSpec = styled(Text)`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
`;

const ConfigCard = styled(Card)`
  margin-top: ${theme.spacing.l}px;
`;

const CurrentVehicleCard = styled(View)`
  background-color: ${theme.colors.primary}15; /* 15% opacity primary */
  padding: 20px;
  border-radius: 16px;
  align-items: center;
  margin-bottom: 24px;
  border-width: 1px;
  border-color: ${theme.colors.primary}30;
`;

const CurrentTitle = styled(Text)`
  font-size: 14px;
  color: ${theme.colors.primary};
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;

const CurrentName = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 4px;
`;

const CurrentDetail = styled(Text)`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
`;

export default function GarageScreen() {
  const navigation = useNavigation();
  const { selectedVehicle, selectVehicle, fuelPrice, setFuelPrice, searchVehicles } = useVehicleStore();
  const [priceInput, setPriceInput] = useState(fuelPrice.toString());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = searchVehicles(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSelect = (vehicle: Vehicle) => {
    selectVehicle(vehicle);
    setSearchQuery('');
    Keyboard.dismiss();
    Alert.alert('Veículo Atualizado', `Agora usando ${vehicle.name}.`);
  };

  const handleSavePrice = () => {
    const price = parseFloat(priceInput.replace(',', '.'));
    if (!isNaN(price)) {
      setFuelPrice(price);
      Alert.alert('Preço Atualizado', 'O preço do combustível foi salvo.');
    } else {
      Alert.alert('Erro', 'Digite um valor válido.');
    }
  };

  return (
    <Container showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Header>
        <HeaderTitle>Minha Garagem</HeaderTitle>
        <HeaderSubtitle>
          Encontre seu veículo na nossa base de dados
        </HeaderSubtitle>
      </Header>

      <ContentContainer>

        {selectedVehicle ? (
          <CurrentVehicleCard>
            <CurrentTitle>Veículo Atual</CurrentTitle>
            <MaterialIcons
              name={selectedVehicle.type === 'moto' ? 'two-wheeler' : 'directions-car'}
              size={48}
              color={theme.colors.primary}
              style={{ marginBottom: 8 }}
            />
            <CurrentName>{selectedVehicle.name}</CurrentName>
            <CurrentDetail>Consumo Médio: {selectedVehicle.avgConsumption} km/L</CurrentDetail>
          </CurrentVehicleCard>
        ) : (
          <CurrentVehicleCard>
            <CurrentTitle>Nenhum Veículo</CurrentTitle>
            <Text>Use a busca abaixo para cadastrar.</Text>
          </CurrentVehicleCard>
        )}

        <SearchContainer>
          <SearchLabel>Buscar Modelo</SearchLabel>
          <Input
            placeholder="Ex: Onix, Corolla, CG 160..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            label=""
          />

          {searchResults.length > 0 && (
            <ResultList>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 8 }}>
                Resultados encontrados:
              </Text>
              {searchResults.map(vehicle => (
                <ResultItem key={vehicle.id} onPress={() => handleSelect(vehicle)}>
                  <MaterialIcons
                    name={vehicle.type === 'moto' ? 'two-wheeler' : 'directions-car'}
                    size={24}
                    color={theme.colors.primary}
                  />
                  <ResultInfo>
                    <ResultName>{vehicle.name}</ResultName>
                    <ResultSpec>Consumo: {vehicle.avgConsumption} km/L</ResultSpec>
                  </ResultInfo>
                  <MaterialIcons name="add-circle-outline" size={24} color={theme.colors.success} />
                </ResultItem>
              ))}
            </ResultList>
          )}

          {searchQuery.length > 2 && searchResults.length === 0 && (
            <Text style={{ marginTop: 10, textAlign: 'center', color: theme.colors.textSecondary }}>
              Nenhum veículo encontrado com este nome.
            </Text>
          )}
        </SearchContainer>

        <ConfigCard>
          <Text style={{ fontWeight: 'bold', marginBottom: 8, color: theme.colors.text }}>
            Preço do Combustível (R$)
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="0.00"
                value={priceInput}
                onChangeText={setPriceInput}
                keyboardType="decimal-pad"
                label=""
              />
            </View>
            <View style={{ width: 100, marginBottom: 15 }}>
              <Button title="Salvar" onPress={handleSavePrice} />
            </View>
          </View>
        </ConfigCard>

      </ContentContainer>
    </Container>
  );
}
