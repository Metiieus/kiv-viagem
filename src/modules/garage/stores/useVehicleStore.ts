import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MaintenanceLog {
    id: string;
    type: 'oil' | 'tires' | 'brakes' | 'review';
    date: string;
    kmAtService: number;
    cost: number;
    notes?: string;
    nextDueKm: number;
}

export interface Vehicle {
    id: string;
    name: string;
    type: 'car' | 'moto';
    avgConsumption: number; // km/L
    icon: string;

    // Garage 2.0
    plate?: string;
    currentOdometer: number;
    fuelLevel?: number; // 0-100
    maintenanceHistory: MaintenanceLog[];
    specs: {
        tankCapacity: number;
        oilChangeInterval: number;
        tireRotationInterval: number;
        // Physics for Risk Engine
        weight: number; // kg
        brakeType: 'abs' | 'disc' | 'drum';
        centerOfGravity: 'low' | 'medium' | 'high';
    };
}

// Complete Database Mock (Updated with Defaults)
export const VEHICLE_DATABASE: Vehicle[] = [
    // HATCHES
    { id: 'h1', name: 'Chevrolet Onix 1.0', type: 'car', avgConsumption: 13.5, icon: 'car', currentOdometer: 45000, maintenanceHistory: [], specs: { tankCapacity: 44, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 1034, brakeType: 'abs', centerOfGravity: 'low' } },
    { id: 'h2', name: 'Hyundai HB20 1.0', type: 'car', avgConsumption: 12.8, icon: 'car-side', currentOdometer: 32000, maintenanceHistory: [], specs: { tankCapacity: 50, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 993, brakeType: 'abs', centerOfGravity: 'low' } },
    { id: 'h3', name: 'Fiat Argo 1.0', type: 'car', avgConsumption: 13.0, icon: 'car-hatchback', currentOdometer: 15000, maintenanceHistory: [], specs: { tankCapacity: 48, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 1105, brakeType: 'abs', centerOfGravity: 'low' } },
    { id: 'h4', name: 'VW Polo Track', type: 'car', avgConsumption: 13.8, icon: 'car', currentOdometer: 5000, maintenanceHistory: [], specs: { tankCapacity: 52, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 1058, brakeType: 'abs', centerOfGravity: 'low' } },
    { id: 'h5', name: 'Renault Kwid', type: 'car', avgConsumption: 15.3, icon: 'car-side', currentOdometer: 60000, maintenanceHistory: [], specs: { tankCapacity: 38, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 779, brakeType: 'disc', centerOfGravity: 'medium' } }, // Kwid is tall and light

    // SEDANS
    { id: 's1', name: 'Chevrolet Onix Plus', type: 'car', avgConsumption: 14.3, icon: 'car', currentOdometer: 20000, maintenanceHistory: [], specs: { tankCapacity: 44, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 1074, brakeType: 'abs', centerOfGravity: 'low' } },
    { id: 's2', name: 'Toyota Corolla XEi', type: 'car', avgConsumption: 12.0, icon: 'car', currentOdometer: 85000, maintenanceHistory: [], specs: { tankCapacity: 50, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 1405, brakeType: 'abs', centerOfGravity: 'low' } },
    { id: 's3', name: 'Honda Civic Touring', type: 'car', avgConsumption: 11.5, icon: 'car-sport', currentOdometer: 90000, maintenanceHistory: [], specs: { tankCapacity: 47, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 1326, brakeType: 'abs', centerOfGravity: 'low' } },
    { id: 's4', name: 'Nissan Versa', type: 'car', avgConsumption: 12.6, icon: 'car', currentOdometer: 12000, maintenanceHistory: [], specs: { tankCapacity: 41, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 1139, brakeType: 'abs', centerOfGravity: 'low' } },

    // SUVS
    { id: 'u1', name: 'Jeep Compass Longitude', type: 'car', avgConsumption: 9.5, icon: 'rv-truck', currentOdometer: 40000, maintenanceHistory: [], specs: { tankCapacity: 60, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 1589, brakeType: 'abs', centerOfGravity: 'high' } },
    { id: 'u2', name: 'VW T-Cross 1.0', type: 'car', avgConsumption: 11.0, icon: 'rv-truck', currentOdometer: 25000, maintenanceHistory: [], specs: { tankCapacity: 52, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 1215, brakeType: 'abs', centerOfGravity: 'medium' } },
    { id: 'u3', name: 'Hyundai Creta 1.0', type: 'car', avgConsumption: 11.6, icon: 'rv-truck', currentOdometer: 10000, maintenanceHistory: [], specs: { tankCapacity: 50, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 1270, brakeType: 'abs', centerOfGravity: 'medium' } },
    { id: 'u4', name: 'Toyota Corolla Cross', type: 'car', avgConsumption: 11.8, icon: 'rv-truck', currentOdometer: 5000, maintenanceHistory: [], specs: { tankCapacity: 47, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 1420, brakeType: 'abs', centerOfGravity: 'high' } },
    { id: 'u5', name: 'Fiat Pulse', type: 'car', avgConsumption: 12.5, icon: 'rv-truck', currentOdometer: 8000, maintenanceHistory: [], specs: { tankCapacity: 47, oilChangeInterval: 10000, tireRotationInterval: 10000, weight: 1187, brakeType: 'abs', centerOfGravity: 'medium' } },

    // MOTOS
    { id: 'm1', name: 'Honda CG 160 Titan', type: 'moto', avgConsumption: 35.0, icon: 'motorcycle', currentOdometer: 15000, maintenanceHistory: [], specs: { tankCapacity: 16, oilChangeInterval: 3000, tireRotationInterval: 5000, weight: 117, brakeType: 'disc', centerOfGravity: 'medium' } },
    { id: 'm2', name: 'Honda Biz 125', type: 'moto', avgConsumption: 45.0, icon: 'motorcycle', currentOdometer: 5000, maintenanceHistory: [], specs: { tankCapacity: 5, oilChangeInterval: 3000, tireRotationInterval: 5000, weight: 100, brakeType: 'drum', centerOfGravity: 'low' } },
    { id: 'm3', name: 'Yamaha Fazer 250', type: 'moto', avgConsumption: 28.0, icon: 'motorcycle', currentOdometer: 20000, maintenanceHistory: [], specs: { tankCapacity: 14, oilChangeInterval: 5000, tireRotationInterval: 10000, weight: 149, brakeType: 'abs', centerOfGravity: 'medium' } },
    { id: 'm4', name: 'Yamaha MT-03', type: 'moto', avgConsumption: 21.0, icon: 'motorcycle', currentOdometer: 12000, maintenanceHistory: [], specs: { tankCapacity: 14, oilChangeInterval: 5000, tireRotationInterval: 10000, weight: 169, brakeType: 'abs', centerOfGravity: 'medium' } },
    { id: 'm5', name: 'Honda XRE 300', type: 'moto', avgConsumption: 25.5, icon: 'motorcycle', currentOdometer: 30000, maintenanceHistory: [], specs: { tankCapacity: 13, oilChangeInterval: 5000, tireRotationInterval: 10000, weight: 148, brakeType: 'abs', centerOfGravity: 'high' } }, // XRE is tall
];

interface VehicleState {
    selectedVehicle: Vehicle | null;
    fuelPrice: number;
    selectVehicle: (vehicle: Vehicle) => void;
    setFuelPrice: (price: number) => void;
    addTripToOdometer: (km: number) => void;
    searchVehicles: (query: string) => Vehicle[];
}

export const useVehicleStore = create<VehicleState>()(
    persist(
        (set, get) => ({
            selectedVehicle: null,
            fuelPrice: 5.89, // Default Fuel Price
            selectVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
            setFuelPrice: (price) => set({ fuelPrice: price }),
            addTripToOdometer: (km) => set((state) => {
                if (state.selectedVehicle) {
                    const updatedVehicle = {
                        ...state.selectedVehicle,
                        currentOdometer: state.selectedVehicle.currentOdometer + km
                    };
                    return { selectedVehicle: updatedVehicle };
                }
                return {};
            }),
            searchVehicles: (query) => {
                if (!query) return [];
                const lowerQuery = query.toLowerCase();
                return VEHICLE_DATABASE.filter(v =>
                    v.name.toLowerCase().includes(lowerQuery)
                );
            }
        }),
        {
            name: 'vehicle-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
