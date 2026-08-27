import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../lib/theme';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value?: string;
  autoFocus?: boolean;
}

export default function SearchBar({ placeholder = 'Search items, categories...', onSearch, value = '', autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState(value);

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={Colors.textLight} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoFocus={autoFocus}
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={() => { setQuery(''); onSearch(''); }}>
          <Ionicons name="close-circle" size={20} color={Colors.textLight} />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.filterButton} onPress={handleSubmit}>
        <Ionicons name="options-outline" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    marginLeft: 8,
    paddingVertical: 4,
  },
  filterButton: {
    marginLeft: 8,
    padding: 4,
  },
});
