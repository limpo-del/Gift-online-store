import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors, ZambiaCities, CategoryColors } from '../lib/theme';
import { categories } from '../lib/data';
import { addMyListing } from '../lib/store';
import { Listing } from '../lib/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type CategoryId = 'fashion' | 'gadgets' | 'farming' | 'food';

export default function SellScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<CategoryId>('fashion');
  const [subcategory, setSubcategory] = useState('');
  const [condition, setCondition] = useState<'new' | 'used' | 'refurbished'>('new');
  const [city, setCity] = useState('Lusaka');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showSubcategoryPicker, setShowSubcategoryPicker] = useState(false);
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const selectedCategoryData = categories.find((c) => c.id === category);
  const conditions: ('new' | 'used' | 'refurbished')[] = ['new', 'used', 'refurbished'];

  const validate = () => {
    if (!title.trim()) return 'Please enter a title';
    if (!description.trim()) return 'Please enter a description';
    if (!price.trim() || isNaN(Number(price))) return 'Please enter a valid price';
    if (!subcategory) return 'Please select a subcategory';
    if (!location.trim()) return 'Please enter a location/neighborhood';
    if (!phone.trim()) return 'Please enter your contact phone';
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Missing Info', error);
      return;
    }

    const newListing: Listing = {
      id: 'my_' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      currency: 'ZMW',
      category,
      subcategory,
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
      seller: {
        id: 'user',
        name: 'You',
        phone: phone.trim(),
        email: 'user@email.com',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        rating: 5.0,
        verified: true,
        memberSince: '2024-01-01',
        totalListings: 1,
        whatsappNumber: phone.trim().replace(/[^0-9]/g, ''),
      },
      location: `${location}, ${city}`,
      city,
      createdAt: new Date().toISOString(),
      isFeatured: false,
      isPromoted: false,
      views: 0,
      status: 'active',
      condition,
      negotiable,
    };

    await addMyListing(newListing);
    Alert.alert('Success!', 'Your item has been listed successfully!', [
      { text: 'Add Another', style: 'cancel' },
      { text: 'View My Listings', onPress: () => navigation.navigate('MyListings') },
    ]);
    setTitle('');
    setDescription('');
    setPrice('');
    setLocation('');
    setPhone('');
  };

  const renderPicker = (
    visible: boolean,
    setVisible: (v: boolean) => void,
    title: string,
    items: { label: string; value: string; color?: string }[],
    selected: string,
    onSelect: (value: string) => void
  ) => {
    if (!visible) return null;
    return (
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>{title}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.pickerList}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.pickerItem,
                  selected === item.value && styles.pickerItemSelected,
                ]}
                onPress={() => { onSelect(item.value); setVisible(false); }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    selected === item.value && styles.pickerItemTextSelected,
                    item.color && { color: item.color },
                  ]}
                >
                  {item.label}
                </Text>
                {selected === item.value && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sell an Item</Text>
          <Text style={styles.headerSubtitle}>Reach thousands of buyers across Zambia</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContainer}
        >
          <Text style={styles.label}>What are you selling? *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., iPhone 14 Pro, Broiler Chickens, etc."
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>

          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowCategoryPicker(true)}
          >
            <View style={styles.selectLeft}>
              <Ionicons
                name={selectedCategoryData?.icon as any || 'apps'}
                size={20}
                color={CategoryColors[category] || Colors.primary}
              />
              <Text style={styles.selectText}>{selectedCategoryData?.name || 'Select Category'}</Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <Text style={styles.label}>Subcategory *</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowSubcategoryPicker(true)}
          >
            <Text style={styles.selectText}>{subcategory || 'Select Subcategory'}</Text>
            <Ionicons name="chevron-down" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <Text style={styles.label}>Condition *</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowConditionPicker(true)}
          >
            <Text style={[styles.selectText, { textTransform: 'capitalize' }]}>
              {condition || 'Select Condition'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your item in detail - brand, condition, features, etc."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Price (ZMW) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 500"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[styles.checkbox, negotiable && styles.checkboxChecked]}
              onPress={() => setNegotiable(!negotiable)}
            >
              {negotiable && <Ionicons name="checkmark" size={14} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Price is negotiable</Text>
          </View>

          <Text style={styles.label}>Location / Neighborhood *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Kabulonga, Mandevu, CBD"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>City / Town *</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowCityPicker(true)}
          >
            <Text style={styles.selectText}>{city}</Text>
            <Ionicons name="chevron-down" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <Text style={styles.label}>Contact Phone *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., +260 97 123 4567"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.tipText}>
            <Ionicons name="information-circle" size={14} color={Colors.accent} />{' '}
            Your phone number will be visible to buyers. Buyers can also message you through the app.
          </Text>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Ionicons name="add-circle" size={22} color="#fff" />
            <Text style={styles.submitButtonText}>Post Listing</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By posting, you agree to our Terms of Service and Community Guidelines
          </Text>

          <View style={{ height: 40 }} />
        </ScrollView>

        {renderPicker(
          showCategoryPicker,
          setShowCategoryPicker,
          'Select Category',
          categories.map((c) => ({ label: c.name, value: c.id, color: c.color })),
          category,
          (val) => {
            setCategory(val as CategoryId);
            setSubcategory('');
          }
        )}

        {renderPicker(
          showSubcategoryPicker,
          setShowSubcategoryPicker,
          'Select Subcategory',
          selectedCategoryData?.subcategories.map((s) => ({ label: s, value: s })) || [],
          subcategory,
          setSubcategory
        )}

        {renderPicker(
          showConditionPicker,
          setShowConditionPicker,
          'Select Condition',
          conditions.map((c) => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c })),
          condition,
          (val) => setCondition(val as any)
        )}

        {renderPicker(
          showCityPicker,
          setShowCityPicker,
          'Select City',
          ZambiaCities.map((c) => ({ label: c, value: c })),
          city,
          setCity
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
  formContainer: {
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
  charCount: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'right',
    marginTop: 4,
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
  selectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectText: {
    fontSize: 15,
    color: Colors.text,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 10,
  },
  tipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 16,
    backgroundColor: Colors.accent + '10',
    padding: 12,
    borderRadius: 10,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 24,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
  // Picker overlay
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
