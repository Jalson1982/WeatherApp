import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {RootStackParamList} from '../navigation/types';
import {Location} from '../types/weather';
import {searchLocations} from '../services/weatherApi';
import {addRecentSearch} from '../store/weatherSlice';
import {useDebounce} from '../hooks';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {RootState} from '../store/store';
import {APP_CONSTANTS} from '../config/constants';

type SearchScreenProps = NativeStackScreenProps<RootStackParamList, 'Search'>;

export function SearchScreen({navigation}: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const debouncedQuery = useDebounce(query);
  const recentSearches = useSelector(
    (state: RootState) => state.weather.recentSearches,
  );

  useEffect(() => {
    async function performSearch() {
      if (debouncedQuery.length >= APP_CONSTANTS.MIN_SEARCH_LENGTH) {
        setLoading(true);
        setError(null);
        try {
          const results = await searchLocations(debouncedQuery);
          setLocations(results);
        } catch (err) {
          setError('Failed to search locations. Please try again.');
          setLocations([]);
        } finally {
          setLoading(false);
        }
      } else {
        setLocations([]);
      }
    }

    performSearch();
  }, [debouncedQuery]);

  const handleLocationSelect = (location: Location) => {
    dispatch(addRecentSearch(location));
    navigation.navigate('WeatherDetails', {locationId: location.id});
  };

  const displayData = query ? locations : recentSearches;

  const renderItem = ({item}: {item: Location}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleLocationSelect(item)}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => {
    if (!query && recentSearches.length > 0) {
      return <Text style={styles.header}>Recent Searches</Text>;
    }
    return null;
  };

  const renderEmpty = () => {
    if (loading || error || query.length < APP_CONSTANTS.MIN_SEARCH_LENGTH) {
      return null;
    }
    return <Text style={styles.noResults}>No locations found</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search for a city..."
          placeholderTextColor={colors.text.secondary}
          autoFocus
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={displayData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  input: {
    height: 44,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
  },
  item: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  itemText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  loadingContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  error: {
    color: colors.error,
    textAlign: 'center',
    padding: spacing.md,
  },
  noResults: {
    textAlign: 'center',
    color: colors.text.secondary,
    padding: spacing.xl,
    fontSize: 16,
  },
});
