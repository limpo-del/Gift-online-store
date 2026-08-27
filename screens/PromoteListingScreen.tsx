import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../lib/theme';
import { featuredPackages } from '../lib/data';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'PromoteListing'>;

export default function PromoteListingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { listingId } = route.params;
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handlePurchase = () => {
    if (!selectedPackage) {
      Alert.alert('Select Package', 'Please choose a promotion package to continue.');
      return;
    }
    const pkg = featuredPackages.find((p) => p.id === selectedPackage);
    Alert.alert(
      'Confirm Purchase',
      `Purchase ${pkg?.name} for ZMW ${pkg?.price}? (Demo - no actual payment)`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success!', 'Your listing has been promoted!', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Promote Your Listing</Text>
        <Text style={styles.headerSubtitle}>Get more views and sell faster</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Why Promote?</Text>
          <View style={styles.benefitRow}>
            <Ionicons name="trending-up" size={20} color={Colors.accent} />
            <Text style={styles.benefitText}>Up to 10x more views on your listing</Text>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons name="time" size={20} color={Colors.accent} />
            <Text style={styles.benefitText}>Sell your items 3x faster</Text>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons name="people" size={20} color={Colors.accent} />
            <Text style={styles.benefitText}>Reach thousands of buyers across Zambia</Text>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons name="star" size={20} color={Colors.accent} />
            <Text style={styles.benefitText}>Featured placement on homepage</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Choose a Package</Text>

        {featuredPackages.map((pkg) => (
          <TouchableOpacity
            key={pkg.id}
            style={[
              styles.packageCard,
              selectedPackage === pkg.id && styles.packageCardSelected,
              { borderColor: selectedPackage === pkg.id ? pkg.color : Colors.border },
            ]}
            onPress={() => setSelectedPackage(pkg.id)}
            activeOpacity={0.85}
          >
            <View style={styles.packageHeader}>
              <View style={[styles.packageIcon, { backgroundColor: pkg.color + '15' }]}>
                <Ionicons name="rocket" size={24} color={pkg.color} />
              </View>
              <View style={styles.packageInfo}>
                <Text style={styles.packageName}>{pkg.name}</Text>
                <Text style={styles.packageDuration}>{pkg.duration}</Text>
              </View>
              <Text style={[styles.packagePrice, { color: pkg.color }]}>
                ZMW {pkg.price}
              </Text>
            </View>
            <Text style={styles.packageDescription}>{pkg.description}</Text>
            <View style={styles.featuresList}>
              {pkg.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={16} color={pkg.color} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            {selectedPackage === pkg.id && (
              <View style={[styles.selectedBadge, { backgroundColor: pkg.color }]}>
                <Text style={styles.selectedBadgeText}>Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={20} color={Colors.secondary} />
          <Text style={styles.noteText}>
            This is a demo. In production, you would complete payment via mobile money (MTN/Airtel) or bank transfer.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.purchaseButton, !selectedPackage && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={!selectedPackage}
        >
          <Ionicons name="card" size={20} color="#fff" />
          <Text style={styles.purchaseButtonText}>
            {selectedPackage
              ? `Purchase for ZMW ${featuredPackages.find((p) => p.id === selectedPackage)?.price}`
              : 'Select a Package'}
          </Text>
        </TouchableOpacity>

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
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#90EE90',
    marginTop: 4,
  },
  benefitsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  packageCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  packageCardSelected: {
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  packageIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageInfo: {
    flex: 1,
    marginLeft: 12,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  packageDuration: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: '800',
  },
  packageDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  featuresList: {
    gap: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.secondary + '08',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  purchaseButtonDisabled: {
    backgroundColor: Colors.textLight,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
