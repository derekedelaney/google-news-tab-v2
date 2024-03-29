import { GridPoints, Weather } from '../models';
import { getLatLong } from './LocationService';

export async function loadCurrentWeather() {
    const weatherGovBase = `https://api.weather.gov`;
    try {
        const [lat, long]: [number, number] = await getLatLong();
        const url = new URL(
            `points/${lat.toFixed(4)},${long.toFixed(4)}`,
            weatherGovBase
        );
        const gridPointResponse: Response = await fetch(url.href);
        const gridPoints: GridPoints = await gridPointResponse.json();
        const weatherResponse: Response = await fetch(
            gridPoints?.properties?.forecast
        );
        const weather: Weather = await weatherResponse.json();
        return weather;
    } catch (e: any) {
        throw new Error(e);
    }
}
