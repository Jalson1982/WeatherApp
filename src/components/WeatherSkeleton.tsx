import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {useAnimation} from '../hooks';

const WeatherSkeleton = () => {
  const pulseAnim = useAnimation(1000);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.7, 0.3],
  });

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.temperature, {opacity}]} />
      <Animated.View style={[styles.description, {opacity}]} />
      <View style={styles.details}>
        {[1, 2, 3].map(key => (
          <Animated.View key={key} style={[styles.detail, {opacity}]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginVertical: spacing.md,
  },
  temperature: {
    width: 120,
    height: 64,
    backgroundColor: colors.divider,
    borderRadius: 8,
  },
  description: {
    width: 150,
    height: 24,
    backgroundColor: colors.divider,
    borderRadius: 4,
    marginVertical: spacing.md,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  detail: {
    width: 80,
    height: 40,
    backgroundColor: colors.divider,
    borderRadius: 4,
  },
});

export default WeatherSkeleton;
