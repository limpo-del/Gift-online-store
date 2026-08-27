import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../lib/theme';

const { width } = Dimensions.get('window');

interface AdBannerProps {
  variant?: 'large' | 'small' | 'inline';
  title?: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function AdBanner({ variant = 'large', title, subtitle, onPress }: AdBannerProps) {
  const adTitle = title || 'Boost Your Sales!';
  const adSubtitle = subtitle || 'Feature your listing & get seen by thousands of buyers';

  if (variant === 'inline') {
    return (
      <TouchableOpacity style={styles.inlineBanner} onPress={onPress} activeOpacity={0.85}>
        <Ionicons name="megaphone" size={18} color={Colors.accent} />
        <Text style={styles.inlineText} numberOfLines={1}>{adTitle}</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
      </TouchableOpacity>
    );
  }

  if (variant === 'small') {
    return (
      <TouchableOpacity style={styles.smallBanner} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.smallIconContainer}>
          <Ionicons name="trending-up" size={24} color={Colors.accent} />
        </View>
        <View style={styles.smallTextContainer}>
          <Text style={styles.smallTitle}>{adTitle}</Text>
          <Text style={styles.smallSubtitle} numberOfLines={1}>{adSubtitle}</Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color={Colors.accent} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.largeBanner} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.largeLeft}>
        <Ionicons name="rocket" size={32} color={Colors.accent} />
      </View>
      <View style={styles.largeTextContainer}>
        <Text style={styles.largeTitle}>{adTitle}</Text>
        <Text style={styles.largeSubtitle} numberOfLines={2}>{adSubtitle}</Text>
      </View>
      <View style={styles.largeButton}>
        <Text style={styles.largeButtonText}>Learn More</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  largeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  largeLeft: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  largeTextContainer: {
    flex: 1,
  },
  largeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  largeSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  largeButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  largeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  smallBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  smallIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  smallTextContainer: {
    flex: 1,
  },
  smallTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  smallSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  inlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  inlineText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
});
