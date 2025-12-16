import { searchNearbyPlaces, PlaceResult } from '../services/placesService';
import { calcDistKm } from './geoUtils';

export type StopCategory = 'fuel' | 'food' | 'rest' | 'hospital' | 'tourism';

export interface RouteStop {
    id: string;
    name: string;
    category: StopCategory;
    distanceFromOriginKm: number;
    rating: number;
    tags: string[];
    coordinate: {
        latitude: number;
        longitude: number;
    };
    isOpen?: boolean;
}

interface vehicleConstraints {
    rangeKm: number;
    avgConsumption: number;
    currentFuel: number;
}

interface Coordinate {
    latitude: number;
    longitude: number;
}

export const getRecommendedStops = async (
    routeCoordinates: Coordinate[],
    totalDistanceKm: number,
    vehicle: vehicleConstraints
): Promise<RouteStop[]> => {

    const recommendations: RouteStop[] = [];
    const currentRange = vehicle.currentFuel * vehicle.avgConsumption;
    const safeRange = currentRange * 0.9;

    // We need to map distance accumulated to coordinates
    // This is computationally heavy for long routes with thousands of points.
    // Optimization: Sample every Nth point or walk through adding distance.

    let accumulatedDist = 0;
    let nextSocialStop = 200; // km
    let fuelScanStart = currentRange * 0.5; // Start looking for gas at 50% tank
    let fuelScanEnd = safeRange;

    let fuelStopFound = false;

    // Strategy: Identify "Search Points" then call API.
    // We don't want to call API too many times.

    const searchPoints: { km: number, type: 'gas_station' | 'restaurant', coord: Coordinate }[] = [];

    // Walk the path
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
        const p1 = routeCoordinates[i];
        const p2 = routeCoordinates[i + 1];
        const d = calcDistKm(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
        accumulatedDist += d;

        // Check for Social Stop (Food/Rest)
        if (accumulatedDist >= nextSocialStop) {
            searchPoints.push({ km: accumulatedDist, type: 'restaurant', coord: p1 });
            nextSocialStop += 200; // Schedule next
        }

        // Check for Fuel Stop (Critical Zone)
        if (!fuelStopFound && accumulatedDist >= fuelScanStart && accumulatedDist <= fuelScanEnd) {
            // We are in the fuel zone.
            // To avoid spamming, let's pick a point in the middle of this zone or one right now if we just entered.
            // Let's add a search point right now, and maybe mark fuelStopFound (optimistic)
            // Realistically we might need to search multiple times if first fails, but MVP:
            searchPoints.push({ km: accumulatedDist, type: 'gas_station', coord: p1 });
            fuelStopFound = true; // Assume we will find something here to avoid adding 100 search points
        }
    }

    if (searchPoints.length === 0 && totalDistanceKm > 50) {
        // Short trip but maybe worthy? Nah, only long trips for now.
    }

    // Execute Searches (Parallel)
    const promises = searchPoints.map(async (sp) => {
        const results = await searchNearbyPlaces(sp.coord.latitude, sp.coord.longitude, sp.type, 3000); // 3km radius

        // Process results
        if (results.length > 0) {
            // Pick best
            // Filter by rating if available?
            const best = results.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

            return {
                id: best.place_id,
                name: best.name,
                category: sp.type === 'gas_station' ? 'fuel' : 'food' as StopCategory,
                distanceFromOriginKm: Math.round(sp.km),
                rating: best.rating || 0,
                tags: best.opening_hours?.open_now ? ['Aberto Agora'] : [],
                coordinate: {
                    latitude: best.geometry.location.lat,
                    longitude: best.geometry.location.lng
                },
                isOpen: best.opening_hours?.open_now
            } as RouteStop;
        }
        return null;
    });

    const stops = await Promise.all(promises);
    return stops.filter((s): s is RouteStop => s !== null).sort((a, b) => a.distanceFromOriginKm - b.distanceFromOriginKm);
};
