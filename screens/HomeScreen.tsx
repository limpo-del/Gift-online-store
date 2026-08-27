import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Listing, Category } from '../lib/types';
import { Colors, CategoryColors } from '../lib/theme';
import { categories, mockListings, getFeaturedListings } from '../lib/data';
import ListingCard from '../components/ListingCard';
import CategoryCard from '../components/CategoryCard';
import SearchBar from '../components/SearchBar';
import AdBanner from '../components/AdBanner';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [selectedCity, setSelectedCity] = useState('All Zambia');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setFeaturedListings(getFeaturedListings());
    setRecentListings(mockListings.slice(0, 6));
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadData();
      setRefreshing(false);
    }, 1000);
  };

  const handleSearch = (query: string) => {
    navigation.navigate('Search', { query });
  };

  const renderFeaturedItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={styles.featuredItem}
      onPress={() => navigation.navigate('ProductDetail', { listingId: item.id })}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={styles.featuredImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.featuredPrice}>
          {item.currency} {item.price.toLocaleString()}
        </Text>
      </View>
      {item.isFeatured && (
        <View style={styles.featuredBadge}>
          <Ionicons name="star" size={10} color="#FFD700" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerGreeting}>Good Morning!</Text>
            <Text style={styles.headerTitle}>GiftZambia</Text>
          </View>
          <TouchableOpacity
            style={styles.citySelector}
            onPress={() => {}}
          >
            <Ionicons name="location" size={16} color="#fff" />
            <Text style={styles.cityText}>{selectedCity}</Text>
            <Ionicons name="chevron-down" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <SearchBar onSearch={handleSearch} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      >
        {/* Categories Quick Access */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories' as any)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }: { item: Category }) => (
              <TouchableOpacity
                style={[styles.categoryChip, { backgroundColor: CategoryColors[item.id as keyof typeof CategoryColors] + '15' }]}
                onPress={() => navigation.navigate('CategoryListings', { categoryId: item.id, categoryName: item.name })}
                activeOpacity={0.85}
              >
                <View style={[styles.categoryIcon, { backgroundColor: CategoryColors[item.id as keyof typeof CategoryColors] + '25' }]}>
                  <Ionicons name={item.icon as any} size={20} color={CategoryColors[item.id as keyof typeof CategoryColors]} />
                </View>
                <Text style={styles.categoryChipText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}
          />
        </View>

        {/* Featured Listings Banner */}
        {featuredListings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Items</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredListings}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderFeaturedItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </View>
        )}

        {/* Ad Banner */}
        <AdBanner
          variant="large"
          title="Sell Faster, Sell More!"
          subtitle="Feature your listing for just ZMW 50 and reach thousands of buyers"
          onPress={() => navigation.navigate('MyListings')}
        />

        {/* Recent Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Just Listed</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {recentListings.map((listing) => (
              <View key={listing.id} style={styles.gridItem}>
                <ListingCard
                  listing={listing}
                  onPress={() => navigation.navigate('ProductDetail', { listingId: listing.id })}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Promotional Banner */}
        <View style={[styles.promoBanner, { marginHorizontal: 16, marginBottom: 24 }]}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoTitle}>Become a Verified Seller</Text>
            <Text style={styles.promoSubtitle}>Get a verified badge and build trust with buyers</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Get Verified</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="shield-checkmark" size={64} color={Colors.primaryLight} style={styles.promoIcon} />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerGreeting: {
    fontSize: 14,
    color: '#90EE90',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 2,
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 2,
  },
  searchContainer: {
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  categoryChip: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    marginRight: 10,
    minWidth: 80,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  featuredItem: {
    width: 200,
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
  },
  featuredImage: {
    width: 200,
    height: 240,
    borderRadius: 16,
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  featuredPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFF8E1',
    padding: 6,
    borderRadius: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 4,
  },
  promoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  promoLeft: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  promoButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  promoIcon: {
    opacity: 0.3,
  },
});
