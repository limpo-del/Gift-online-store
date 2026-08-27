import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Listing, Category } from '../lib/types';
import { Colors, CategoryColors } from '../lib/theme';
import { getListingsByCategory, categories } from '../lib/data';
import ListingCard from '../components/ListingCard';
import AdBanner from '../components/AdBanner';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'CategoryListings'>;

export default function CategoryListingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { categoryId, categoryName } = route.params;

  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const category = categories.find((c) => c.id === categoryId);
  const categoryColor = CategoryColors[categoryId as keyof typeof CategoryColors] || Colors.primary;

  useEffect(() => {
    const all = getListingsByCategory(categoryId);
    let filtered = all;

    if (selectedSubcategory !== 'All') {
      filtered = filtered.filter((l) => l.subcategory === selectedSubcategory);
    }
    if (selectedCondition !== 'All') {
      filtered = filtered.filter((l) => l.condition === selectedCondition);
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setListings(filtered);
  }, [categoryId, selectedSubcategory, selectedCondition, sortBy]);

  const subcategories = ['All', ...(category?.subcategories || [])];
  const conditions = ['All', 'new', 'used', 'refurbished'];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: categoryColor }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={16} color="#fff" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
          <View style={styles.sortContainer}>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'newest' && styles.sortActive]}
              onPress={() => setSortBy('newest')}
            >
              <Text style={[styles.sortText, sortBy === 'newest' && styles.sortTextActive]}>Newest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'price-low' && styles.sortActive]}
              onPress={() => setSortBy('price-low')}
            >
              <Text style={[styles.sortText, sortBy === 'price-low' && styles.sortTextActive]}>Price ↓</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'price-high' && styles.sortActive]}
              onPress={() => setSortBy('price-high')}
            >
              <Text style={[styles.sortText, sortBy === 'price-high' && styles.sortTextActive]}>Price ↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={listings}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <>
            {showFilters && (
              <View style={styles.filtersContainer}>
                <Text style={styles.filterLabel}>Subcategory</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {subcategories.map((sub) => (
                    <TouchableOpacity
                      key={sub}
                      style={[styles.filterChip, selectedSubcategory === sub && { backgroundColor: categoryColor }]}
                      onPress={() => setSelectedSubcategory(sub)}
                    >
                      <Text style={[styles.filterChipText, selectedSubcategory === sub && { color: '#fff' }]}>
                        {sub}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.filterLabel}>Condition</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {conditions.map((cond) => (
                    <TouchableOpacity
                      key={cond}
                      style={[styles.filterChip, selectedCondition === cond && { backgroundColor: categoryColor }]}
                      onPress={() => setSelectedCondition(cond)}
                    >
                      <Text style={[styles.filterChipText, selectedCondition === cond && { color: '#fff' }]}>
                        {cond === 'All' ? 'All' : cond.charAt(0).toUpperCase() + cond.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>{listings.length} items found</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Search', { query: '' })}>
                <Ionicons name="search" size={20} color={Colors.textLight} />
              </TouchableOpacity>
            </View>

            <AdBanner
              variant="small"
              title="Want more views?"
              subtitle="Feature your listing for only ZMW 50"
            />
          </>
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
            <Ionicons name="cube-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters or check back later</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  sortActive: {
    backgroundColor: '#fff',
  },
  sortText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  sortTextActive: {
    color: Colors.text,
  },
  filtersContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: Colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
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
  },
});
