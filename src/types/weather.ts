export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather: WeatherCondition[];
}

export interface DailyTemperature {
  min: number;
  max: number;
}

export interface DailyForecast {
  dt: number;
  temp: DailyTemperature;
  weather: WeatherCondition[];
}

export interface Location extends Coordinates {
  id: string;
  name: string;
}

export interface WeatherResponse {
  current: CurrentWeather;
  daily: DailyForecast[];
}

export interface WeatherError {
  code: string;
  message: string;
}
