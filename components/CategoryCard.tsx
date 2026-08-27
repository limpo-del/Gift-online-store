import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../lib/types';
import { Colors } from '../lib/theme';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  variant?: 'large' | 'small';
}

export default function CategoryCard({ category, onPress, variant = 'large' }: CategoryCardProps) {
  if (variant === 'small') {
    return (
      <TouchableOpacity
        style={[styles.smallCard, { backgroundColor: category.color + '15' }]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={[styles.smallIconContainer, { backgroundColor: category.color + '25' }]}>
          <Ionicons name={category.icon as any} size={24} color={category.color} />
        </View>
        <Text style={styles.smallName}>{category.name}</Text>
        <Text style={styles.smallCount}>{category.itemCount} items</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.largeCard, { backgroundColor: category.color + '12' }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
        <Ionicons name={category.icon as any} size={28} color={category.color} />
      </View>
      <View style={styles.largeTextContainer}>
        <Text style={styles.largeName}>{category.name}</Text>
        <Text style={styles.largeCount}>{category.itemCount} items</Text>
      </View>
      <View style={[styles.arrowContainer, { backgroundColor: category.color + '20' }]}>
        <Ionicons name="chevron-forward" size={18} color={category.color} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  largeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  largeName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  largeCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCard: {
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
    width: 100,
  },
  smallIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  smallName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  smallCount: {
    fontSize: 11,
    color: Colors.textLight,
  },
});
