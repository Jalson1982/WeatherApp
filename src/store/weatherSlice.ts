import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CurrentWeather, DailyForecast, Location } from '../types/weather';
import { fetchWeather } from '../services/weatherApi';

interface WeatherState {
  currentWeather: CurrentWeather | null;
  forecast: DailyForecast[];
  recentSearches: Location[];
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  currentWeather: null,
  forecast: [],
  recentSearches: [],
  loading: false,
  error: null,
};

interface WeatherResponse {
  current: CurrentWeather;
  daily: DailyForecast[];
}

export const fetchWeatherData = createAsyncThunk<WeatherResponse, Location>(
  'weather/fetchWeatherData',
  async (location) => {
    const response = await fetchWeather(location);
    return response;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addRecentSearch: (state, action: PayloadAction<Location>) => {
      const exists = state.recentSearches.some(
        location => location.id === action.payload.id
      );
      if (!exists) {
        state.recentSearches = [action.payload, ...state.recentSearches.slice(0, 4)];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload.current;
        state.forecast = action.payload.daily;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      });
  },
});

export const { addRecentSearch } = weatherSlice.actions;
export default weatherSlice.reducer;
