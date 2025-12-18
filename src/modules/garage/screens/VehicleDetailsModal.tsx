import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../../../core/theme';
import { Vehicle, useVehicleStore } from '../stores/useVehicleStore';
import { Button } from '../../../core/components';

const ModalContainer = styled(View)`
  flex: 1;
  background-color: rgba(0,0,0,0.5);
  justify-content: flex-end;
`;

const Content = styled(View)`
  background-color: ${theme.colors.background};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  height: 90%;
  padding: 20px;
`;

const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const OdometerCard = styled(View)`
  background-color: ${theme.colors.surface};
  padding: 20px;
  border-radius: 16px;
  align-items: center;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const OdometerValue = styled(Text)`
  font-size: 32px;
  font-weight: 900;
  color: ${theme.colors.primary};
  letter-spacing: 2px;
`;

const SectionTitle = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-top: 20px;
  margin-bottom: 10px;
`;

const HealthBarContainer = styled(View)`
  margin-bottom: 12px;
`;

const HealthLabelRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const HealthLabel = styled(Text)`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
`;

const BarBackground = styled(View)`
  height: 8px;
  background-color: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
`;

interface BarFillProps {
    width: number;
    color: string;
}

const BarFill = styled(View) <BarFillProps>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${props => props.color};
`;

interface Props {
    visible: boolean;
    onClose: () => void;
    vehicle: Vehicle;
}

export const VehicleDetailsModal = ({ visible, onClose, vehicle }: Props) => {
    const { selectVehicle, selectedVehicle } = useVehicleStore();
    const isActive = selectedVehicle?.id === vehicle.id;

    // Calculate Health based on Odometer and Specs
    // Mock logic: assumes last maintenance was at 0km if empty history
    const getLastMaintenanceKm = (type: 'oil' | 'tires') => {
        const logs = vehicle.maintenanceHistory?.filter(l => l.type === type) || [];
        if (logs.length > 0) {
            return logs.sort((a, b) => b.kmAtService - a.kmAtService)[0].kmAtService;
        }
        return 0; // Default: factory
    };

    const getHealthColor = (percentage: number) => {
        if (percentage > 50) return theme.colors.success;
        if (percentage > 20) return theme.colors.warning;
        return theme.colors.error;
    };

    const specs = vehicle.specs || { oilChangeInterval: 10000, tireRotationInterval: 10000 };
    const odometer = vehicle.currentOdometer || 0;

    const lastOil = getLastMaintenanceKm('oil');
    const oilDist = odometer - lastOil;
    const oilLife = Math.max(0, 100 - (oilDist / specs.oilChangeInterval) * 100);

    const lastTires = getLastMaintenanceKm('tires');
    const tiresDist = odometer - lastTires;
    const tiresLife = Math.max(0, 100 - (tiresDist / specs.tireRotationInterval) * 100);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <ModalContainer>
                <Content>
                    <Header>
                        <View>
                            <Title>{vehicle.name}</Title>
                            <Text style={{ color: theme.colors.textSecondary }}>{vehicle.type === 'moto' ? 'Moto' : 'Carro'} • {vehicle.avgConsumption} km/L</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </Header>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <OdometerCard>
                            <Text style={{ textTransform: 'uppercase', fontSize: 10, color: theme.colors.textSecondary, marginBottom: 4 }}>Odômetro Atual</Text>
                            <OdometerValue>{(vehicle.currentOdometer || 0).toLocaleString()} km</OdometerValue>
                        </OdometerCard>

                        {!isActive && (
                            <Button
                                title="Definir como Veículo Atual"
                                onPress={() => {
                                    selectVehicle(vehicle);
                                    Alert.alert('Sucesso', 'Veículo ativado para viagens.');
                                    onClose();
                                }}
                            />
                        )}

                        {isActive && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
                                <Text style={{ marginLeft: 8, color: theme.colors.success, fontWeight: 'bold' }}>Veículo Ativo</Text>
                            </View>
                        )}

                        <SectionTitle>Saúde do Veículo</SectionTitle>

                        <HealthBarContainer>
                            <HealthLabelRow>
                                <HealthLabel>Óleo do Motor</HealthLabel>
                                <HealthLabel>{oilLife.toFixed(0)}% restante</HealthLabel>
                            </HealthLabelRow>
                            <BarBackground>
                                <BarFill width={oilLife} color={getHealthColor(oilLife)} />
                            </BarBackground>
                            <Text style={{ fontSize: 10, color: '#999', marginTop: 2 }}>Próxima troca em {(specs.oilChangeInterval - oilDist).toLocaleString()} km</Text>
                        </HealthBarContainer>

                        <HealthBarContainer>
                            <HealthLabelRow>
                                <HealthLabel>Rodízio de Pneus</HealthLabel>
                                <HealthLabel>{tiresLife.toFixed(0)}% restante</HealthLabel>
                            </HealthLabelRow>
                            <BarBackground>
                                <BarFill width={tiresLife} color={getHealthColor(tiresLife)} />
                            </BarBackground>
                            <Text style={{ fontSize: 10, color: '#999', marginTop: 2 }}>Próximo em {(specs.tireRotationInterval - tiresDist).toLocaleString()} km</Text>
                        </HealthBarContainer>

                        <SectionTitle>Histórico de Manutenção</SectionTitle>
                        {vehicle.maintenanceHistory && vehicle.maintenanceHistory.length > 0 ? (
                            vehicle.maintenanceHistory.map((log) => (
                                <View key={log.id} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{log.type.toUpperCase()} - {log.date}</Text>
                                    <Text style={{ color: '#666' }}>@{log.kmAtService} km - R$ {log.cost}</Text>
                                </View>
                            ))
                        ) : (
                            <View style={{ padding: 20, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
                                <Text style={{ color: '#999' }}>Nenhum registro encontrado.</Text>
                            </View>
                        )}

                        <View style={{ marginTop: 20 }}>
                            <Button
                                title="Registrar Nova Manutenção"
                                variant="outline"
                                onPress={() => Alert.alert('Em Breve', 'Funcionalidade de registro manual será implementada.')}
                            />
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </Content>
            </ModalContainer>
        </Modal>
    );
};
