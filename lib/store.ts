import AsyncStorage from '@react-native-async-storage/async-storage';
import { Listing, User, Conversation } from './types';

const KEYS = {
  USER: 'giftzambia_user',
  LISTINGS: 'giftzambia_listings',
  MY_LISTINGS: 'giftzambia_my_listings',
  CONVERSATIONS: 'giftzambia_conversations',
  SAVED: 'giftzambia_saved',
  ONBOARDED: 'giftzambia_onboarded',
  AUTH_TOKEN: 'giftzambia_auth_token',
  CART: 'giftzambia_cart',
};

export const storeUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  await AsyncStorage.setItem(KEYS.AUTH_TOKEN, 'mock_token_' + Date.now());
};

export const getUser = async (): Promise<User | null> => {
  const data = await AsyncStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const clearUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEYS.USER);
  await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  return !!token;
};

export const storeMyListings = async (listings: Listing[]): Promise<void> => {
  await AsyncStorage.setItem(KEYS.MY_LISTINGS, JSON.stringify(listings));
};

export const getMyListings = async (): Promise<Listing[]> => {
  const data = await AsyncStorage.getItem(KEYS.MY_LISTINGS);
  return data ? JSON.parse(data) : [];
};

export const addMyListing = async (listing: Listing): Promise<void> => {
  const existing = await getMyListings();
  await storeMyListings([listing, ...existing]);
};

export const updateMyListing = async (listing: Listing): Promise<void> => {
  const existing = await getMyListings();
  const updated = existing.map((l) => (l.id === listing.id ? listing : l));
  await storeMyListings(updated);
};

export const deleteMyListing = async (listingId: string): Promise<void> => {
  const existing = await getMyListings();
  const filtered = existing.filter((l) => l.id !== listingId);
  await storeMyListings(filtered);
};

export const storeConversations = async (conversations: Conversation[]): Promise<void> => {
  await AsyncStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
};

export const getConversations = async (): Promise<Conversation[]> => {
  const data = await AsyncStorage.getItem(KEYS.CONVERSATIONS);
  return data ? JSON.parse(data) : [];
};

export const saveListing = async (listingId: string): Promise<void> => {
  const saved = await getSavedListings();
  if (!saved.includes(listingId)) {
    await AsyncStorage.setItem(KEYS.SAVED, JSON.stringify([...saved, listingId]));
  }
};

export const unsaveListing = async (listingId: string): Promise<void> => {
  const saved = await getSavedListings();
  await AsyncStorage.setItem(KEYS.SAVED, JSON.stringify(saved.filter((id) => id !== listingId)));
};

export const getSavedListings = async (): Promise<string[]> => {
  const data = await AsyncStorage.getItem(KEYS.SAVED);
  return data ? JSON.parse(data) : [];
};

export const isListingSaved = async (listingId: string): Promise<boolean> => {
  const saved = await getSavedListings();
  return saved.includes(listingId);
};
