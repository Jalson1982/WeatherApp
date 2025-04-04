import React, {useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator, Text, Button} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {RootState, AppDispatch} from '../store/store';
import {fetchWeatherData} from '../store/weatherSlice';
import {SearchButton} from '../components/SearchButton';
import {WeatherCard} from '../components/WeatherCard';
import ForecastList from '../components/ForecastList';
import {useGeolocation} from '../hooks/useGeolocation';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({navigation}: HomeScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {currentWeather, loading, error} = useSelector(
    (state: RootState) => state.weather,
  );
  const {location, error: locationError, getCurrentLocation} = useGeolocation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <SearchButton />,
    });
  }, [navigation]);

  useEffect(() => {
    if (location) {
      dispatch(fetchWeatherData(location));
    }
  }, [location, dispatch]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!currentWeather && (
        <Button title="Use Current Location" onPress={getCurrentLocation} />
      )}
      {locationError && <Text style={styles.error}>{locationError}</Text>}
      {currentWeather ? (
        <>
          <WeatherCard weather={currentWeather} />
          <ForecastList />
        </>
      ) : (
        <Text style={styles.noData}>Search for a location to see weather</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
