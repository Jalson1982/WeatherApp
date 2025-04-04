import React from 'react';
import {View, Text, StyleSheet, Image, Animated} from 'react-native';
import {CurrentWeather} from '../types/weather';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {getWeatherIconUrl} from '../utils/weatherIcons';
import {useAnimation} from '../hooks';

interface WeatherCardProps {
  weather: CurrentWeather;
  onPress?: () => void;
}

export function WeatherCard({weather, onPress}: WeatherCardProps) {
  const fadeAnim = useAnimation();

  return (
    <Animated.View
      style={[styles.card, {opacity: fadeAnim}]}
      onTouchEnd={onPress}>
      <View style={styles.header}>
        <Text style={styles.temperature}>{Math.round(weather.temp)}°</Text>
        <Image
          source={{uri: getWeatherIconUrl(weather.weather[0].icon, true)}}
          style={styles.icon}
        />
      </View>
      <Text style={styles.description}>{weather.weather[0].description}</Text>
      <View style={styles.details}>
        <DetailItem
          label="Feels like"
          value={`${Math.round(weather.feels_like)}°`}
        />
        <DetailItem label="Humidity" value={`${weather.humidity}%`} />
        <DetailItem label="Wind" value={`${weather.wind_speed} m/s`} />
      </View>
    </Animated.View>
  );
}

const DetailItem: React.FC<{label: string; value: string}> = ({
  label,
  value,
}) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginVertical: spacing.md,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  icon: {
    width: 100,
    height: 100,
  },
  description: {
    fontSize: 20,
    color: colors.text.secondary,
    textTransform: 'capitalize',
    marginVertical: spacing.md,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
});
