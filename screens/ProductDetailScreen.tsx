import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../lib/theme';
import { getListingById } from '../lib/data';
import { saveListing, unsaveListing, isListingSaved } from '../lib/store';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'ProductDetail'>;

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { listingId } = route.params;
  const listing = getListingById(listingId);

  const [saved, setSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!listing) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={Colors.error} />
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (saved) {
      await unsaveListing(listing.id);
    } else {
      await saveListing(listing.id);
    }
    setSaved(!saved);
  };

  const handleCall = () => {
    Alert.alert('Call Seller', `Call ${listing.seller.name} at ${listing.seller.phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL(`tel:${listing.seller.phone}`) },
    ]);
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in your listing "${listing.title}" on GiftZambia. Is it still available?`;
    const url = `https://wa.me/${listing.seller.whatsappNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open WhatsApp. Please try calling instead.');
    });
  };

  const handleMessage = () => {
    navigation.navigate('Chat', { conversationId: 'new' });
  };

  const timeAgo = () => {
    const date = new Date(listing.createdAt);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={24} color={saved ? '#FF6B6B' : '#fff'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: listing.images[selectedImage] }}
          style={styles.mainImage}
          contentFit="cover"
          transition={300}
        />

        {listing.images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailContainer}
          >
            {listing.images.map((img, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.thumbnail, selectedImage === index && styles.thumbnailActive]}
                onPress={() => setSelectedImage(index)}
              >
                <Image source={{ uri: img }} style={styles.thumbnailImage} contentFit="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{listing.title}</Text>
          </View>

          <Text style={styles.price}>
            {listing.currency} {listing.price.toLocaleString()}
            {listing.negotiable && <Text style={styles.negotiable}> (Negotiable)</Text>}
          </Text>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: Colors.primary + '15' }]}>
              <Text style={[styles.badgeText, { color: Colors.primary }]}>{listing.subcategory}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: Colors.accent + '15' }]}>
              <Text style={[styles.badgeText, { color: Colors.accent }]}>{listing.condition}</Text>
            </View>
            {listing.isFeatured && (
              <View style={[styles.badge, { backgroundColor: '#FFF8E1' }]}>
                <Ionicons name="star" size={12} color="#F57C00" />
                <Text style={[styles.badgeText, { color: '#F57C00', marginLeft: 4 }]}>Featured</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Item Details</Text>
            <View style={styles.detailsGrid}>
              <DetailRow icon="calendar" label="Posted" value={timeAgo()} />
              <DetailRow icon="location" label="Location" value={listing.location} />
              <DetailRow icon="pricetag" label="Category" value={listing.subcategory} />
              <DetailRow icon="eye" label="Views" value={`${listing.views} views`} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <View style={styles.sellerCard}>
              <Image
                source={{ uri: listing.seller.avatar }}
                style={styles.sellerAvatar}
                contentFit="cover"
              />
              <View style={styles.sellerInfo}>
                <View style={styles.sellerNameRow}>
                  <Text style={styles.sellerName}>{listing.seller.name}</Text>
                  {listing.seller.verified && (
                    <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
                  )}
                </View>
                <View style={styles.sellerRating}>
                  <Ionicons name="star" size={12} color={Colors.accent} />
                  <Text style={styles.ratingText}>{listing.seller.rating}</Text>
                  <Text style={styles.sellerMeta}>
                    • {listing.seller.totalListings} listings • Member since {listing.seller.memberSince.split('-')[0]}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={22} color="#fff" />
          <Text style={styles.whatsappButtonText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Ionicons name="call" size={22} color="#fff" />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
          <Ionicons name="chatbubble" size={22} color={Colors.primary} />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={18} color={Colors.primary} />
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: width,
    height: width * 0.75,
  },
  thumbnailContainer: {
    padding: 12,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: Colors.primary,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 28,
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 10,
  },
  negotiable: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  detailsGrid: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTextContainer: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 1,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sellerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  sellerInfo: {
    marginLeft: 14,
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  sellerMeta: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 20,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 8,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whatsapp,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  whatsappButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.call,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  messageButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
  },
});
