import {GeolocationOptions} from '../types/geolocation';

export const WEATHER_API = {
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  GEO_URL: 'https://api.openweathermap.org/geo/1.0',
  ICON_URL: 'https://openweathermap.org/img/wn',
  UNITS: 'metric',
  EXCLUDE: 'minutely,hourly',
  LOCATION_LIMIT: 5,
  RECENT_SEARCHES_LIMIT: 5,
  CACHE_DURATION: 1000 * 60 * 15, // 15 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const GEOLOCATION: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000,
} as const;

export const DEBOUNCE_DELAY = 300;

export const APP_CONSTANTS = {
  MIN_SEARCH_LENGTH: 2,
  MAX_RECENT_SEARCHES: 5,
  REFRESH_INTERVAL: 1000 * 60 * 30, // 30 minutes
} as const;
