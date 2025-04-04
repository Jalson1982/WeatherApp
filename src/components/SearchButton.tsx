import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';

interface SearchButtonProps {
  onPress?: () => void;
}

export function SearchButton({onPress}: SearchButtonProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('Search');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.searchButton}>Search</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchButton: {
    padding: 10,
    color: '#007AFF',
  },
});
