import { calculateCurvature, calculateSlope, calcDistKm } from '../utils/geoUtils';
import { Vehicle } from '../modules/garage/stores/useVehicleStore';

export interface HazardPoint {
    latitude: number;
    longitude: number;
    type: 'sharp_turn' | 'steep_descent' | 'high_speed_zone';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendedSpeed?: number;
}

export class RiskEngine {
    /**
     * Analyzes a route (array of coordinates) and returns potential hazard points
     * based on the vehicle's physics profile.
     */
    static analyzeRoute(
        coordinates: { latitude: number; longitude: number; altitude?: number }[],
        vehicle: Vehicle | null
    ): HazardPoint[] {
        const hazards: HazardPoint[] = [];
        if (!coordinates || coordinates.length < 3) return hazards;

        // Physics constants (Mocked/Simplified)
        // Heavier/Higher COG vehicles have lower tolerance for curves.
        let curveTolerance = 60; // Degrees of curvature allowed without warning

        if (vehicle?.specs) {
            if (vehicle.specs.centerOfGravity === 'high') curveTolerance -= 10;
            if (vehicle.specs.weight > 1500) curveTolerance -= 5;
            if (vehicle.specs.brakeType === 'drum') curveTolerance -= 5;
        }

        // Iterate through points (Step 3 to smooth out noise)
        for (let i = 0; i < coordinates.length - 3; i += 1) {
            const p1 = coordinates[i];
            const p2 = coordinates[i + 1];
            const p3 = coordinates[i + 2];

            // 1. Curvature Analysis
            const curvature = calculateCurvature(p1, p2, p3);

            // If curve is sharper than tolerance (e.g. > 45 degrees change in short distance)
            // Note: calculateCurvature returns bearing change.
            // Small distance + High Angle = Sharp Turn.
            // We need to check distance too, otherwise a U-turn 1km apart is detected.
            const distP1P3 = calcDistKm(p1.latitude, p1.longitude, p3.latitude, p3.longitude);

            // Only consider "tight" turns (less than 100m segment)
            if (distP1P3 < 0.1) {
                if (curvature > curveTolerance) {
                    let severity: HazardPoint['severity'] = 'medium';
                    if (curvature > curveTolerance + 30) severity = 'high';
                    if (curvature > curveTolerance + 60) severity = 'critical';

                    // Dedup: Don't add multiple hazards in same 100m radius
                    const lastHazard = hazards[hazards.length - 1];
                    if (!lastHazard || calcDistKm(lastHazard.latitude, lastHazard.longitude, p2.latitude, p2.longitude) > 0.1) {
                        hazards.push({
                            latitude: p2.latitude,
                            longitude: p2.longitude,
                            type: 'sharp_turn',
                            severity,
                            description: `Curva Fechada (${Math.round(curvature)}°)`,
                            recommendedSpeed: severity === 'critical' ? 30 : 50
                        });
                    }
                }
            }

            // 2. Slope Analysis (If altitude exists)
            // Pending real data, but structure is here.
            if (p1.altitude && p2.altitude) {
                const slope = calculateSlope(p1, p2);
                if (slope < -8) { // Steep descent (> 8%)
                    hazards.push({
                        latitude: p2.latitude,
                        longitude: p2.longitude,
                        type: 'steep_descent',
                        severity: slope < -12 ? 'high' : 'medium',
                        description: 'Declive Acentuado - Use Freio Motor'
                    });
                }
            }
        }

        return hazards;
    }
}
