import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import api from '../services/api';
import { COLORS } from '../constants/colors';

export default function ConnectionsScreen() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchConnections(); }, []);

  const fetchConnections = async () => {
    try {
      const res = await api.get('/connections/');
      setConnections(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showFullInfo = (conn) => {
    Alert.alert(
      `${conn.other_user.name}`,
      `📧 Email: ${conn.other_user.email}\n📞 Phone: ${conn.other_user.phone_number}\n📍 Address: ${conn.other_user.address}\n🪪 NID: ${conn.other_user.nid_card_picture || 'Not provided'}\n🚲 Token: ${conn.token_info.title} (${conn.token_info.vehicle_type})`
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => showFullInfo(item)} style={styles.card}>
      <Text style={styles.name}>{item.other_user.name}</Text>
      <Text style={styles.date}>Connected on {new Date(item.created_at).toDateString()}</Text>
      <Text style={styles.token}>Ride: {item.token_info?.title}</Text>
      <Text style={styles.tap}>🔍 Tap to see contact & NID</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" style={{ flex:1 }} />;

  return (
    <FlatList
      data={connections}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchConnections(); }} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text>No connections yet.</Text>
          <Text style={{ marginTop: 8, textAlign: 'center' }}>When you accept a ride request, the user will appear here with full contact info.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 'bold' },
  date: { color: COLORS.gray, marginTop: 4 },
  token: { marginTop: 8, color: COLORS.primary },
  tap: { marginTop: 8, fontSize: 12, color: COLORS.secondary, textAlign: 'right' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});