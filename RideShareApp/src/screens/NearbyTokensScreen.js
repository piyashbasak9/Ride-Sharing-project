import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator, StyleSheet, TextInput, RefreshControl } from 'react-native';
import * as Location from 'expo-location';
import api from '../services/api';
import Button from '../components/Button';
import { COLORS } from '../constants/colors';

export default function NearbyTokensScreen({ route }) {
  const [tokens, setTokens] = useState([]);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchNearby = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Location permission denied');
      const loc = await Location.getCurrentPositionAsync({});
      const res = await api.get(`/token/nearby/?lat=${loc.coords.latitude}&lng=${loc.coords.longitude}`);
      setTokens(res.data);
      setFilteredTokens(res.data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (route.params?.tokens) {
      setTokens(route.params.tokens);
      setFilteredTokens(route.params.tokens);
    } else {
      fetchNearby();
    }
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredTokens(tokens);
    } else {
      const filtered = tokens.filter(token =>
        token.title.toLowerCase().includes(searchText.toLowerCase()) ||
        token.vehicle_type.toLowerCase().includes(searchText.toLowerCase()) ||
        token.additional_info.toLowerCase().includes(searchText.toLowerCase()) ||
        token.user.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredTokens(filtered);
    }
  }, [searchText, tokens]);

  const sendRequest = async (tokenId) => {
    try {
      await api.post('/requests/send/', { token_id: tokenId });
      Alert.alert('Request sent!', 'The user will see your request.');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.user.name}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text>🚲 {item.vehicle_type.toUpperCase()}</Text>
      <Text style={styles.bio} numberOfLines={2}>{item.additional_info}</Text>
      <Button title="Send Request" onPress={() => sendRequest(item.id)} type="secondary" />
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ flex:1 }} />;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tokens by title, vehicle, info, or name..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={COLORS.gray}
        />
      </View>
      <FlatList
        data={filteredTokens}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchNearby(); }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>{tokens.length === 0 ? 'No nearby tokens found within 200m and last 15 minutes.' : searchText ? `No tokens found matching "${searchText}"` : 'No tokens found'}</Text>
            <Text style={{ marginTop: 8, color: COLORS.gray }}>{tokens.length === 0 ? 'Create a token first to appear here!' : 'Try a different search term'}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: { padding: 16, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  searchInput: { backgroundColor: COLORS.white, borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  name: { fontSize: 18, fontWeight: 'bold' },
  title: { fontSize: 15, color: COLORS.primary, marginVertical: 2 },
  bio: { color: COLORS.gray, marginVertical: 6 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});