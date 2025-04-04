import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {HomeScreen} from '../screens/HomeScreen';
import {SearchScreen} from '../screens/SearchScreen';
import {WeatherDetailsScreen} from '../screens/WeatherDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Weather'}}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{title: 'Search Location'}}
        />
        <Stack.Screen
          name="WeatherDetails"
          component={WeatherDetailsScreen}
          options={{title: 'Weather Details'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
