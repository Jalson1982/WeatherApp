import {WEATHER_API} from '../config/constants';
import {ENV} from '../config/env';
import {
  Location,
  WeatherResponse,
  CurrentWeather,
  DailyForecast,
} from '../types/weather';

interface WeatherApiErrorResponse {
  cod: string;
  message: string;
}

class WeatherApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public response?: WeatherApiErrorResponse,
  ) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
}

interface DailyData {
  temps: number[];
  feels_like: number[];
  humidity: number[];
  wind_speed: number[];
  weather: ForecastItem['weather'];
  dt: number;
}

/**
 * Fetches current weather and forecast data for a location
 */
export const fetchWeather = async (
  location: Location,
): Promise<WeatherResponse> => {
  try {
    const currentUrl =
      `${WEATHER_API.BASE_URL}/weather?` +
      `lat=${location.lat}&lon=${location.lon}` +
      `&units=${WEATHER_API.UNITS}` +
      `&appid=${ENV.WEATHER_API_KEY}`;

    const forecastUrl =
      `${WEATHER_API.BASE_URL}/forecast?` +
      `lat=${location.lat}&lon=${location.lon}` +
      `&units=${WEATHER_API.UNITS}` +
      `&appid=${ENV.WEATHER_API_KEY}`;

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl).catch(() => {
        throw new WeatherApiError('NETWORK_ERROR', 'Network request failed');
      }),
      fetch(forecastUrl).catch(() => {
        throw new WeatherApiError('NETWORK_ERROR', 'Network request failed');
      }),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      const errorResponse = !currentResponse.ok ? currentResponse : forecastResponse;
      const errorData: WeatherApiErrorResponse = await errorResponse.json()
        .catch(() => ({ cod: errorResponse.status.toString(), message: 'Unknown error' }));

      throw new WeatherApiError(
        errorData.cod,
        errorData.message || 'Failed to fetch weather data',
        errorData,
      );
    }

    const [currentData, forecastData] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json(),
    ]);

    // Transform the data to match our app's structure
    const current: CurrentWeather = {
      temp: currentData.main.temp,
      feels_like: currentData.main.feels_like,
      humidity: currentData.main.humidity,
      wind_speed: currentData.wind.speed,
      weather: currentData.weather,
    };

    const forecastMap = new Map<string, DailyData>();

    (forecastData.list as ForecastItem[]).forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();

      if (!forecastMap.has(date)) {
        forecastMap.set(date, {
          temps: [],
          feels_like: [],
          humidity: [],
          wind_speed: [],
          weather: item.weather,
          dt: item.dt,
        });
      }

      const dayData = forecastMap.get(date)!;
      dayData.temps.push(item.main.temp);
      dayData.feels_like.push(item.main.feels_like);
      dayData.humidity.push(item.main.humidity);
      dayData.wind_speed.push(item.wind.speed);
    });

    const daily: DailyForecast[] = Array.from(forecastMap.values())
      .map(day => {
        const avgTemp = day.temps.reduce((a, b) => a + b) / day.temps.length;
        return {
          temp: {
            day: avgTemp,
            min: Math.min(...day.temps),
            max: Math.max(...day.temps),
            night: day.temps[day.temps.length - 1],
            eve: day.temps[Math.floor(day.temps.length * 0.75)],
            morn: day.temps[0],
          },
          feels_like:
            day.feels_like.reduce((a, b) => a + b) / day.feels_like.length,
          humidity: day.humidity.reduce((a, b) => a + b) / day.humidity.length,
          wind_speed:
            day.wind_speed.reduce((a, b) => a + b) / day.wind_speed.length,
          weather: day.weather,
          dt: day.dt,
        };
      })
      .slice(0, 5);

    return {current, daily};
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    throw new WeatherApiError(
      'UNKNOWN',
      error instanceof Error ? error.message : 'An unexpected error occurred',
    );
  }
};

/**
 * Searches for locations by query string
 * @param query Search query
 * @returns Promise with array of locations
 * @throws WeatherApiError
 */
export const searchLocations = async (query: string): Promise<Location[]> => {
  try {
    const url =
      `${WEATHER_API.GEO_URL}/direct?` +
      `q=${encodeURIComponent(query)}` +
      `&limit=${WEATHER_API.LOCATION_LIMIT}` +
      `&appid=${ENV.WEATHER_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new WeatherApiError(
        response.status.toString(),
        errorData.message || 'Location search failed',
      );
    }

    const data = await response.json();
    return data.map((item: any) => ({
      id: `${item.lat}-${item.lon}`,
      name: `${item.name}, ${item.country}`,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    throw new WeatherApiError('UNKNOWN', 'An unexpected error occurred');
  }
};
