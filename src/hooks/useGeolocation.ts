import {useState, useCallback, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {Location} from '../types/weather';
import {GEOLOCATION} from '../config/constants';
import {
  GeolocationPosition,
  GeolocationError,
} from '../types/geolocation';

export const useGeolocation = (autoRequest = false) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          resolve,
          reject,
          GEOLOCATION,
        );
      });

      setLocation({
        id: 'current',
        name: 'Current Location',
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    } catch (err) {
      const geoError = err as GeolocationError;
      setError(
        geoError.code === 1
          ? 'Location permission denied. Please enable location services in your device settings.'
          : 'Failed to get location. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoRequest) {
      getCurrentLocation();
    }
  }, [autoRequest, getCurrentLocation]);

  return {location, error, loading, getCurrentLocation};
};
