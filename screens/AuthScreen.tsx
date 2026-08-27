import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors, ZambiaCities } from '../lib/theme';
import { storeUser } from '../lib/store';
import { User } from '../lib/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AuthScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+260');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lusaka');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!isLogin && !name.trim()) return 'Please enter your name';
    if (!phone.trim() || phone.length < 10) return 'Please enter a valid phone number';
    if (!email.trim() || !email.includes('@')) return 'Please enter a valid email';
    return null;
  };

  const handleSubmit = () => {
    const error = validate();
    if (error) {
      Alert.alert('Error', error);
      return;
    }

    if (!isLogin) {
      navigation.navigate('OTP', { phone, email, name });
    } else {
      // Simulate login
      setLoading(true);
      setTimeout(async () => {
        const user: User = {
          id: 'user_' + Date.now(),
          name: name || 'User',
          phone,
          email,
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          city,
          isVerified: true,
          isSeller: true,
          memberSince: '2024-01-01',
          totalListings: 0,
          savedListings: [],
        };
        await storeUser(user);
        setLoading(false);
        navigation.navigate('MainTabs');
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="gift" size={48} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>GiftZambia</Text>
          <Text style={styles.headerSubtitle}>
            {isLogin ? 'Welcome back! Sign in to continue' : 'Join the marketplace for Zambia'}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.form}
        >
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Register</Text>
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Chileshe Banda"
                value={name}
                onChangeText={setName}
              />
            </>
          )}

          <Text style={styles.label}>Phone Number *</Text>
          <View style={styles.phoneInput}>
            <View style={styles.phonePrefix}>
              <Ionicons name="flag" size={16} color={Colors.primary} />
              <Text style={styles.phonePrefixText}>+260</Text>
            </View>
            <TextInput
              style={styles.phoneInputField}
              placeholder="97 123 4567"
              value={phone.replace('+260', '')}
              onChangeText={(text) => setPhone('+260' + text.replace(/[^0-9]/g, ''))}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="you@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {!isLogin && (
            <>
              <Text style={styles.label}>City / Town</Text>
              <TouchableOpacity style={styles.selectButton} onPress={() => setShowCityPicker(true)}>
                <Text style={styles.selectText}>{city}</Text>
                <Ionicons name="chevron-down" size={18} color={Colors.textLight} />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Continue with OTP'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
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
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#90EE90',
    marginTop: 6,
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.divider,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 12,
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
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.primary + '10',
    gap: 6,
  },
  phonePrefixText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  phoneInputField: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
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
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 24,
    alignItems: 'center',
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
