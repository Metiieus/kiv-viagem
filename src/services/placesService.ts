import { GOOGLE_API_KEY } from '@env';
import axios from 'axios';

// Places API (New) Endpoint
const BASE_URL = 'https://places.googleapis.com/v1/places:searchNearby';

export interface PlaceResult {
    place_id: string;
    name: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    rating?: number;
    vicinity: string; // mapped from formattedAddress
    types: string[];
    user_ratings_total?: number;
    opening_hours?: {
        open_now: boolean;
    };
}

export const searchNearbyPlaces = async (
    latitude: number,
    longitude: number,
    type: 'gas_station' | 'restaurant' | 'hospital' | 'lodging',
    radius: number = 2000 // 2km radius default
): Promise<PlaceResult[]> => {
    if (!GOOGLE_API_KEY) {
        console.error('Google API Key not configured');
        return [];
    }

    try {
        // Map simplified types to New API Included Types
        const includedTypes = [type];

        const body = {
            includedTypes: includedTypes,
            maxResultCount: 10, // Limit to save quota
            locationRestriction: {
                circle: {
                    center: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    radius: radius
                }
            }
        };

        const headers = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_API_KEY,
            // Request specific fields to save data/cost
            'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.rating,places.userRatingCount,places.formattedAddress,places.types,places.regularOpeningHours'
        };

        const response = await axios.post(BASE_URL, body, { headers });

        if (response.data && response.data.places) {
            // Map New API response to Legacy Interface
            return response.data.places.map((place: any) => ({
                place_id: place.id,
                name: place.displayName?.text || 'Local Desconhecido',
                geometry: {
                    location: {
                        lat: place.location.latitude,
                        lng: place.location.longitude
                    }
                },
                rating: place.rating,
                vicinity: place.formattedAddress || '',
                types: place.types || [],
                user_ratings_total: place.userRatingCount,
                opening_hours: {
                    open_now: place.regularOpeningHours?.openNow || false
                }
            }));
        } else {
            return [];
        }
    } catch (error: any) {
        // Enhanced Error Logging
        if (error.response) {
            console.error('Google Places API Error:', error.response.status, error.response.data);
        } else {
            console.error('Error fetching places:', error.message);
        }
        return [];
    }
};
