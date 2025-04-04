import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../types/navigation';
import {RootState, AppDispatch} from '../store/store';
import {fetchWeatherData} from '../store/weatherSlice';
import {WeatherCard} from '../components/WeatherCard';
import ForecastList from '../components/ForecastList';

type WeatherDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  'WeatherDetails'
>;

export function WeatherDetailsScreen({route}: WeatherDetailsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {currentWeather, recentSearches} = useSelector(
    (state: RootState) => state.weather,
  );
  const {locationId} = route.params;

  useEffect(() => {
    // Find the location from recent searches
    const location = recentSearches.find(loc => loc.id === locationId);
    if (location) {
      dispatch(fetchWeatherData(location));
    }
  }, [dispatch, locationId, recentSearches]);

  return (
    <View style={styles.container}>
      {currentWeather && <WeatherCard weather={currentWeather} />}
      <ForecastList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
