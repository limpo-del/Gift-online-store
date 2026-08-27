import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors, ZambiaCities } from '../lib/theme';
import { getMyListings, updateMyListing } from '../lib/store';
import { Listing } from '../lib/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'EditListing'>;

export default function EditListingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { listingId } = route.params;

  const [listing, setListing] = useState<Listing | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [showCityPicker, setShowCityPicker] = useState(false);

  useEffect(() => {
    loadListing();
  }, []);

  const loadListing = async () => {
    const listings = await getMyListings();
    const found = listings.find((l) => l.id === listingId);
    if (found) {
      setListing(found);
      setTitle(found.title);
      setDescription(found.description);
      setPrice(found.price.toString());
      setCity(found.city);
      setLocation(found.location.split(',')[0] || '');
      setPhone(found.seller.phone);
    }
  };

  const handleSave = async () => {
    if (!listing) return;
    if (!title.trim() || !description.trim() || !price.trim() || !location.trim() || !phone.trim()) {
      Alert.alert('Missing Info', 'Please fill in all required fields');
      return;
    }

    const updated: Listing = {
      ...listing,
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      city,
      location: `${location.trim()}, ${city}`,
      seller: {
        ...listing.seller,
        phone: phone.trim(),
      },
    };

    await updateMyListing(updated);
    Alert.alert('Success', 'Listing updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  if (!listing) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={Colors.error} />
        <Text style={styles.errorText}>Listing not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Listing</Text>
          <Text style={styles.headerSubtitle}>Update your item details</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} maxLength={100} />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Price (ZMW) *</Text>
          <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

          <Text style={styles.label}>Location / Neighborhood *</Text>
          <TextInput style={styles.input} value={location} onChangeText={setLocation} />

          <Text style={styles.label}>City / Town *</Text>
          <TouchableOpacity style={styles.selectButton} onPress={() => setShowCityPicker(true)}>
            <Text style={styles.selectText}>{city}</Text>
            <Ionicons name="chevron-down" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <Text style={styles.label}>Contact Phone *</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>

        {showCityPicker && (
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select City</Text>
                <TouchableOpacity onPress={() => setShowCityPicker(false)}>
                  <Ionicons name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.pickerList}>
                {ZambiaCities.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.pickerItem, city === c && styles.pickerItemSelected]}
                    onPress={() => { setCity(c); setShowCityPicker(false); }}
                  >
                    <Text style={[styles.pickerItemText, city === c && styles.pickerItemTextSelected]}>{c}</Text>
                    {city === c && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
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
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    lineHeight: 22,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectText: {
    fontSize: 15,
    color: Colors.text,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 24,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
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
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  pickerContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  pickerList: {
    padding: 8,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
  },
  pickerItemSelected: {
    backgroundColor: Colors.primary + '10',
  },
  pickerItemText: {
    fontSize: 15,
    color: Colors.text,
  },
  pickerItemTextSelected: {
    fontWeight: '700',
    color: Colors.primary,
  },
});
