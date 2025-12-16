import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Vehicle {
    id: string;
    name: string;
    type: 'car' | 'moto';
    avgConsumption: number; // km/L
    icon: string;
}

// Complete Database Mock
export const VEHICLE_DATABASE: Vehicle[] = [
    // HATCHES
    { id: 'h1', name: 'Chevrolet Onix 1.0', type: 'car', avgConsumption: 13.5, icon: 'car' },
    { id: 'h2', name: 'Hyundai HB20 1.0', type: 'car', avgConsumption: 12.8, icon: 'car-side' },
    { id: 'h3', name: 'Fiat Argo 1.0', type: 'car', avgConsumption: 13.0, icon: 'car-hatchback' },
    { id: 'h4', name: 'VW Polo Track', type: 'car', avgConsumption: 13.8, icon: 'car' },
    { id: 'h5', name: 'Renault Kwid', type: 'car', avgConsumption: 15.3, icon: 'car-side' },

    // SEDANS
    { id: 's1', name: 'Chevrolet Onix Plus', type: 'car', avgConsumption: 14.3, icon: 'car' },
    { id: 's2', name: 'Toyota Corolla XEi', type: 'car', avgConsumption: 12.0, icon: 'car' },
    { id: 's3', name: 'Honda Civic Touring', type: 'car', avgConsumption: 11.5, icon: 'car-sport' },
    { id: 's4', name: 'Nissan Versa', type: 'car', avgConsumption: 12.6, icon: 'car' },

    // SUVS
    { id: 'u1', name: 'Jeep Compass Longitude', type: 'car', avgConsumption: 9.5, icon: 'rv-truck' },
    { id: 'u2', name: 'VW T-Cross 1.0', type: 'car', avgConsumption: 11.0, icon: 'rv-truck' },
    { id: 'u3', name: 'Hyundai Creta 1.0', type: 'car', avgConsumption: 11.6, icon: 'rv-truck' },
    { id: 'u4', name: 'Toyota Corolla Cross', type: 'car', avgConsumption: 11.8, icon: 'rv-truck' },
    { id: 'u5', name: 'Fiat Pulse', type: 'car', avgConsumption: 12.5, icon: 'rv-truck' },

    // MOTOS
    { id: 'm1', name: 'Honda CG 160 Titan', type: 'moto', avgConsumption: 35.0, icon: 'motorcycle' },
    { id: 'm2', name: 'Honda Biz 125', type: 'moto', avgConsumption: 45.0, icon: 'motorcycle' },
    { id: 'm3', name: 'Yamaha Fazer 250', type: 'moto', avgConsumption: 28.0, icon: 'motorcycle' },
    { id: 'm4', name: 'Yamaha MT-03', type: 'moto', avgConsumption: 21.0, icon: 'motorcycle' },
    { id: 'm5', name: 'Honda XRE 300', type: 'moto', avgConsumption: 25.5, icon: 'motorcycle' },
];

interface VehicleState {
    selectedVehicle: Vehicle | null;
    fuelPrice: number;
    selectVehicle: (vehicle: Vehicle) => void;
    setFuelPrice: (price: number) => void;
    searchVehicles: (query: string) => Vehicle[];
}

export const useVehicleStore = create<VehicleState>()(
    persist(
        (set, get) => ({
            selectedVehicle: null,
            fuelPrice: 5.89, // Default Fuel Price
            selectVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
            setFuelPrice: (price) => set({ fuelPrice: price }),
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
