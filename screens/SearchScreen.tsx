import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Listing } from '../lib/types';
import { Colors } from '../lib/theme';
import { searchListings, mockListings } from '../lib/data';
import ListingCard from '../components/ListingCard';
import SearchBar from '../components/SearchBar';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'Search'>;

const recentSearches = ['iPhone', 'chicken', 'tomatoes', 'tractor', 'shoes', 'rice'];
const popularCategories = ['Phones', 'Livestock', 'Fresh Produce', 'Clothes', 'Electronics'];

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const initialQuery = route.params?.query || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Listing[]>([]);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      setHasSearched(true);
      const searchResults = searchListings(searchQuery);
      setResults(searchResults);
      Keyboard.dismiss();
    } else {
      setHasSearched(false);
      setResults([]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <SearchBar
            onSearch={handleSearch}
            value={query}
            autoFocus={true}
          />
        </View>
      </View>

      {!hasSearched ? (
        <View style={styles.suggestionsContainer}>
          <View style={styles.suggestionSection}>
            <Text style={styles.suggestionTitle}>Recent Searches</Text>
            <View style={styles.chipContainer}>
              {recentSearches.map((term) => (
                <TouchableOpacity
                  key={term}
                  style={styles.chip}
                  onPress={() => handleSearch(term)}
                >
                  <Ionicons name="time-outline" size={14} color={Colors.textLight} />
                  <Text style={styles.chipText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.suggestionSection}>
            <Text style={styles.suggestionTitle}>Popular Categories</Text>
            <View style={styles.chipContainer}>
              {popularCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, styles.popularChip]}
                  onPress={() => handleSearch(cat)}
                >
                  <Ionicons name="trending-up" size={14} color={Colors.primary} />
                  <Text style={[styles.chipText, styles.popularChipText]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.browseAll}>
            <Text style={styles.suggestionTitle}>Browse All Items</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => {
                setHasSearched(true);
                setResults(mockListings);
              }}
            >
              <Ionicons name="grid" size={20} color={Colors.primary} />
              <Text style={styles.browseButtonText}>View All {mockListings.length} Listings</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </Text>
              {results.length > 0 && (
                <TouchableOpacity onPress={() => { setHasSearched(false); setQuery(''); setResults([]); }}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              variant="horizontal"
              onPress={() => navigation.navigate('ProductDetail', { listingId: item.id })}
            />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search" size={64} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>Try searching with different keywords or browse categories</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsContainer: {
    padding: 16,
  },
  suggestionSection: {
    marginBottom: 24,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  popularChip: {
    borderColor: Colors.primary + '30',
    backgroundColor: Colors.primary + '08',
  },
  popularChipText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  browseAll: {
    marginTop: 8,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  browseButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
  },
  clearText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
