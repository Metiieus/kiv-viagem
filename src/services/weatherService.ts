import axios from 'axios';
import { OPEN_WEATHER_API_KEY } from '@env';

// Metric: Celsius, Imperial: Fahrenheit
const UNITS = 'metric';
const LANG = 'pt_br';

// Fallback if env var is missing
const API_KEY = OPEN_WEATHER_API_KEY || 'YOUR_OPEN_WEATHER_API_KEY';

export interface WeatherResult {
    temp: number;
    condition: string; // 'Rain', 'Clear', 'Clouds', etc.
    description: string;
    icon: string;
    isRaining: boolean;
}

export const getWeather = async (lat: number, lon: number): Promise<WeatherResult | null> => {
    if (API_KEY === 'YOUR_OPEN_WEATHER_API_KEY') {
        console.warn('WeatherService: No API Key provided, returning Mock Data');
        return {
            temp: 24,
            condition: 'Rain',
            description: 'Chuva leve',
            icon: '10d',
            isRaining: true
        };
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${UNITS}&lang=${LANG}&appid=${OPEN_WEATHER_API_KEY}`;
        const response = await axios.get(url);
        const data = response.data;

        const weather = data.weather[0];
        const isRaining = weather.main === 'Rain' || weather.main === 'Drizzle' || weather.main === 'Thunderstorm';

        return {
            temp: data.main.temp,
            condition: weather.main,
            description: weather.description,
            icon: weather.icon,
            isRaining
        };
    } catch (error) {
        console.error('WeatherService Error:', error);
        return null;
    }
};
