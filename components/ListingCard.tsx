import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Listing } from '../lib/types';
import { Colors, CategoryColors } from '../lib/theme';

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
  variant?: 'grid' | 'horizontal' | 'compact';
}

const { width } = Dimensions.get('window');

export default function ListingCard({ listing, onPress, variant = 'grid' }: ListingCardProps) {
  const [saved, setSaved] = useState(false);
  const timeAgo = getTimeAgo(listing.createdAt);

  const categoryColor = CategoryColors[listing.category] || Colors.primary;

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.85}>
        <Image
          source={{ uri: listing.images[0] }}
          style={styles.horizontalImage}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.horizontalContent}>
          <View style={styles.horizontalTop}>
            <Text style={styles.horizontalTitle} numberOfLines={2}>
              {listing.title}
            </Text>
            <TouchableOpacity onPress={() => setSaved(!saved)} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? Colors.error : Colors.textLight} />
            </TouchableOpacity>
          </View>
          <Text style={styles.horizontalPrice}>
            {listing.currency} {listing.price.toLocaleString()}
            {listing.negotiable && <Text style={styles.negotiable}> (Negotiable)</Text>}
          </Text>
          <View style={styles.horizontalMeta}>
            <Ionicons name="location-outline" size={12} color={Colors.textLight} />
            <Text style={styles.metaText} numberOfLines={1}>{listing.location}</Text>
            <Text style={styles.timeText}>{timeAgo}</Text>
          </View>
        </View>
        {listing.isFeatured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={10} color={Colors.featured} />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.85}>
        <Image
          source={{ uri: listing.images[0] }}
          style={styles.compactImage}
          contentFit="cover"
          transition={300}
        />
        <Text style={styles.compactTitle} numberOfLines={1}>{listing.title}</Text>
        <Text style={styles.compactPrice}>{listing.currency} {listing.price.toLocaleString()}</Text>
        {listing.isFeatured && (
          <View style={styles.compactFeaturedBadge}>
            <Ionicons name="star" size={8} color={Colors.featured} />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: listing.images[0] }}
          style={styles.gridImage}
          contentFit="cover"
          transition={300}
        />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => setSaved(!saved)}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={20}
            color={saved ? Colors.error : '#fff'}
          />
        </TouchableOpacity>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{listing.subcategory}</Text>
        </View>
      </View>
      <View style={styles.gridContent}>
        <Text style={styles.gridTitle} numberOfLines={2}>{listing.title}</Text>
        <Text style={styles.gridPrice}>
          {listing.currency} {listing.price.toLocaleString()}
        </Text>
        {listing.negotiable && (
          <Text style={styles.negotiableBadge}>Negotiable</Text>
        )}
        <View style={styles.gridMeta}>
          <Ionicons name="location-outline" size={12} color={Colors.textLight} />
          <Text style={styles.metaText} numberOfLines={1}>{listing.location}</Text>
        </View>
        <View style={styles.gridMeta}>
          <Ionicons name="time-outline" size={12} color={Colors.textLight} />
          <Text style={styles.timeText}>{timeAgo}</Text>
          <View style={styles.viewsRow}>
            <Ionicons name="eye-outline" size={12} color={Colors.textLight} />
            <Text style={styles.timeText}>{listing.views}</Text>
          </View>
        </View>
        {listing.isFeatured && (
          <View style={styles.gridFeaturedBadge}>
            <Ionicons name="star" size={10} color={Colors.featured} />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const styles = StyleSheet.create({
  gridCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    marginHorizontal: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  gridImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  gridContent: {
    padding: 12,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 6,
  },
  gridPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  negotiableBadge: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: '600',
    marginBottom: 6,
  },
  gridMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textLight,
    marginLeft: 4,
    flex: 1,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textLight,
    marginLeft: 8,
  },
  viewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  gridFeaturedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
  },
  featuredText: {
    fontSize: 10,
    color: '#F57C00',
    fontWeight: '700',
    marginLeft: 4,
  },
  // Horizontal
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  horizontalImage: {
    width: 120,
    height: 120,
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  horizontalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  horizontalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 20,
    flex: 1,
    marginRight: 8,
  },
  horizontalPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 4,
  },
  negotiable: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
  },
  horizontalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  // Compact
  compactCard: {
    width: width * 0.38,
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactImage: {
    width: '100%',
    height: 120,
  },
  compactTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  compactPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 4,
  },
  compactFeaturedBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    padding: 4,
    backgroundColor: '#FFF8E1',
    borderRadius: 6,
  },
});
