import { create } from 'zustand';

export interface TelemetryData {
    rpm: number;
    speed: number; // km/h (OBD source)
    engineLoad: number; // %
    coolantTemp: number; // °C
    voltage: number; // V
    fuelLevel: number; // % (if available)
}

interface TelemetryState extends TelemetryData {
    isConnected: boolean;
    isSimulating: boolean;

    // Actions
    setTelemetry: (data: Partial<TelemetryData>) => void;
    setConnectionStatus: (status: boolean) => void;
    toggleSimulation: (active: boolean) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
    rpm: 0,
    speed: 0,
    engineLoad: 0,
    coolantTemp: 0,
    voltage: 0,
    fuelLevel: 0,
    isConnected: false,
    isSimulating: false,

    setTelemetry: (data) => set((state) => ({ ...state, ...data })),
    setConnectionStatus: (isConnected) => set({ isConnected }),
    toggleSimulation: (isSimulating) => set({ isSimulating }),
}));
