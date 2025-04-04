import React from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {DailyForecast} from '../types/weather';

const ForecastList: React.FC = () => {
  const forecast = useSelector((state: RootState) => state.weather.forecast);

  const renderItem = ({item}: {item: DailyForecast}) => {
    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

    return (
      <View style={styles.forecastItem}>
        <Text style={styles.date}>
          {new Date(item.dt * 1000).toLocaleDateString()}
        </Text>
        <Image source={{uri: iconUrl}} style={styles.icon} />
        <Text style={styles.temp}>
          {Math.round(item.temp.min)}° / {Math.round(item.temp.max)}°
        </Text>
        <Text style={styles.description}>{item.weather[0].description}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={forecast}
      renderItem={renderItem}
      keyExtractor={item => item.dt.toString()}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    marginTop: 16,
  },
  forecastItem: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 14,
    marginVertical: 4,
  },
  description: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default ForecastList;
