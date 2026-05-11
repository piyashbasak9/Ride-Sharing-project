import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import api from '../services/api';
import Button from '../components/Button';
import { COLORS } from '../constants/colors';

export default function RequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests/incoming/');
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAccept = async (id) => {
    try {
      await api.post(`/requests/accept/${id}/`);
      fetchRequests();
      Alert.alert('Accepted!', 'You can now see their contact info in Connections.');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error);
    }
  };

  const handleReject = async (id) => {
    await api.delete(`/requests/reject/${id}/`);
    fetchRequests();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.from_user.name}</Text>
      <Text style={styles.bio}>{item.from_user.bio || 'No bio'}</Text>
      <Text style={styles.tokenInfo}>Request for: {item.to_token.title}</Text>
      <View style={styles.row}>
        <Button title="Accept" onPress={() => handleAccept(item.id)} style={{ flex: 1, marginRight: 8 }} />
        <Button title="Reject" onPress={() => handleReject(item.id)} type="secondary" style={{ flex: 1, marginLeft: 8 }} />
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ flex:1 }} />;

  return (
    <FlatList
      data={requests}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchRequests} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text>No incoming ride requests.</Text>
          <Text style={{ marginTop: 8, color: COLORS.gray }}>When someone requests your token, it will appear here.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 'bold' },
  bio: { color: COLORS.gray, marginVertical: 4 },
  tokenInfo: { fontSize: 12, color: COLORS.primary, marginBottom: 12 },
  row: { flexDirection: 'row', marginTop: 8 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});