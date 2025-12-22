import axios from 'axios';
import { GOOGLE_API_KEY } from '@env';

const BASE_URL = 'https://roads.googleapis.com/v1';

export interface SnappedPoint {
    location: {
        latitude: number;
        longitude: number;
    };
    originalIndex: number;
    placeId: string;
}

export interface SpeedLimitResult {
    placeId: string;
    speedLimit: number; // in km/h
    units: 'KPH' | 'MPH';
}

/**
 * Google Roads API Service
 * Note: Requires 'Roads API' to be enabled in Google Cloud Console.
 * Pricing: This API is 'Pay-as-you-go'.
 */
class RoadsService {
    private apiKey: string;
    private lastSnapTime: number = 0;
    private lastSpeedLimitTime: number = 0;

    constructor() {
        this.apiKey = GOOGLE_API_KEY;
    }

    /**
     * Takes a sequence of GPS points and returns them snapped to the most likely road geometry.
     * Best for smoothing out a path history.
     */
    async snapToRoads(path: string): Promise<SnappedPoint[]> {
        if (!this.apiKey) return [];

        try {
            // path format: "lat,lng|lat,lng|..."
            const url = `${BASE_URL}/snapToRoads?path=${path}&interpolate=true&key=${this.apiKey}`;
            const response = await axios.get(url);

            if (response.data && response.data.snappedPoints) {
                return response.data.snappedPoints;
            }
            return [];
        } catch (error) {
            console.warn('RoadsService snapToRoads error:', error);
            return [];
        }
    }

    /**
     * Finds the nearest road segment for a single point.
     * Useful for correcting the current cursor position.
     */
    async getNearestRoad(lat: number, lng: number): Promise<SnappedPoint | null> {
        if (!this.apiKey) return null;

        // Rate limiting logic could go here to save costs
        // For now, we assume the caller handles throttling
        try {
            const points = `${lat},${lng}`;
            const url = `${BASE_URL}/nearestRoads?points=${points}&key=${this.apiKey}`;
            const response = await axios.get(url);

            if (response.data && response.data.snappedPoints && response.data.snappedPoints.length > 0) {
                return response.data.snappedPoints[0];
            }
            return null;
        } catch (error) {
            // 404 means no road found nearby (off-road)
            if (axios.isAxiosError(error) && error.response?.status !== 404) {
                console.warn('RoadsService getNearestRoad error:', error.message);
            }
            return null;
        }
    }

    /**
     * Gets the speed limit for a specific road segment (Place ID).
     * Usually you get the Place ID from snapToRoads or nearestRoads first.
     */
    async getSpeedLimit(placeId: string): Promise<number | null> {
        if (!this.apiKey) return null;

        try {
            const url = `${BASE_URL}/speedLimits?placeId=${placeId}&units=KPH&key=${this.apiKey}`;
            const response = await axios.get(url);

            if (response.data && response.data.speedLimits && response.data.speedLimits.length > 0) {
                return Math.round(response.data.speedLimits[0].speedLimit);
            }
            return null;
        } catch (error) {
            console.warn('RoadsService getSpeedLimit error:', error);
            return null;
        }
    }
}

export const roadsService = new RoadsService();
