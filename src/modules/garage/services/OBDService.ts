import { useTelemetryStore } from '../stores/useTelemetryStore';

class OBDService {
    private intervalId: NodeJS.Timeout | null = null;

    startSimulation() {
        const store = useTelemetryStore.getState();
        if (store.isSimulating) return;

        store.toggleSimulation(true);
        store.setConnectionStatus(true);

        // Initial base values
        let currentRpm = 800;
        let currentSpeed = 0;
        let currentTemp = 85;
        let currentLoad = 20;

        this.intervalId = setInterval(() => {
            // Simulate dynamic driving behavior

            // Random acceleration/deceleration factor
            const delta = Math.random() > 0.5 ? 1 : -1;

            // RPM fluctuation (Idle vs Driving)
            if (currentSpeed > 0) {
                currentRpm += (Math.random() * 200 * delta);
                if (currentRpm < 1500) currentRpm = 1500;
                if (currentRpm > 4500) currentRpm = 4500;
            } else {
                currentRpm = 800 + (Math.random() * 50); // Idle wobble
            }

            // Speed simulation (slowly changing)
            currentSpeed += (Math.random() * 5 * delta);
            if (currentSpeed < 0) currentSpeed = 0;
            if (currentSpeed > 120) currentSpeed = 120; // Max mock speed

            // Load follows acceleration
            currentLoad = delta > 0 ? 60 + Math.random() * 30 : 20 + Math.random() * 10;

            // Temp slowly rising then stable
            if (currentTemp < 90) currentTemp += 0.1;
            else currentTemp += (Math.random() * 0.4 - 0.2); // Fluctuate around 90

            useTelemetryStore.getState().setTelemetry({
                rpm: Math.floor(currentRpm),
                speed: Math.floor(currentSpeed),
                engineLoad: Math.floor(currentLoad),
                coolantTemp: Math.floor(currentTemp),
                voltage: 13.8 + (Math.random() * 0.4 - 0.2), // Alternator variation
            });

        }, 500); // Update every 500ms
    }

    stopSimulation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        const store = useTelemetryStore.getState();
        store.toggleSimulation(false);
        store.setConnectionStatus(false);
        store.setTelemetry({ rpm: 0, speed: 0 });
    }
}

export const obdService = new OBDService();
