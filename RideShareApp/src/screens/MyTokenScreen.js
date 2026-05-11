import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, RefreshControl } from 'react-native';
import Button from '../components/Button';
import CountdownTimer from '../components/CountdownTimer';
import EditTokenModal from '../components/EditTokenModal';
import { COLORS } from '../constants/colors';
import api from '../services/api';

export default function MyTokenScreen({ navigation }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchToken = async () => {
    try {
      const res = await api.get('/token/my/');
      setToken(res.data);
      const created = new Date(res.data.created_at);
      const now = new Date();
      setEditable((now - created) / 1000 >= 120);
    } catch (err) {
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchToken(); }, [refreshKey]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchToken();
    setRefreshing(false);
  };

  const handleDelete = () => {
    Alert.alert('Confirm', 'Delete this token?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: async () => {
          try {
            await api.delete('/token/my/');
            setToken(null);
            setEditable(false);
            Alert.alert('Deleted');
          } catch (err) {
            Alert.alert('Error', err.response?.data?.error || err.message || 'Delete failed');
          }
        }
      }
    ]);
  };

  const handleEdit = async (updatedFields) => {
    try {
      setEditable(false);
      await api.put('/token/edit/', updatedFields);
      Alert.alert('Success', 'Token updated! Countdown reset.');
      setRefreshKey(k => k+1);
      return true;
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || err.message || 'Update failed');
      return false;
    }
  };

  const handleRefresh = async () => {
    try {
      setEditable(false);
      await api.post('/token/refresh/');
      Alert.alert('Refreshed', 'Token time updated. Countdown reset.');
      setRefreshKey(k => k+1);
      return true;
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || err.message || 'Refresh failed');
      return false;
    }
  };

  if (loading) return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><Text>Loading...</Text></View>;
  if (!token) return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:20 }}>
      <Text style={{ textAlign:'center', marginBottom:20 }}>No active token. Create one from Home tab.</Text>
      <Button title="Go to Home" onPress={() => navigation?.navigate('Home')} />
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      <Text style={styles.title}>{token.title}</Text>
      <Text style={styles.vehicle}>🚲 {token.vehicle_type.toUpperCase()}</Text>
      <Text style={styles.info}>📝 {token.additional_info || 'No additional info'}</Text>
      <Text style={styles.date}>Created: {new Date(token.created_at).toLocaleString()}</Text>

      <CountdownTimer createdAt={token.created_at} onComplete={() => setEditable(true)} />

      <View style={styles.buttonGroup}>
        <Button title="Delete Token" onPress={handleDelete} disabled={!editable} type="danger" />
        <Button title="Edit Token" onPress={() => setModalVisible(true)} disabled={!editable} />
        <Button title="Refresh Token" onPress={handleRefresh} disabled={!editable} />
      </View>

      <EditTokenModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleEdit}
        initialTitle={token.title}
        initialVehicle={token.vehicle_type}
        initialInfo={token.additional_info}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  vehicle: { fontSize: 18, color: COLORS.gray, marginTop: 4 },
  info: { marginVertical: 8, fontSize: 16 },
  date: { fontSize: 12, color: COLORS.gray, marginBottom: 8 },
  buttonGroup: { marginTop: 20 },
});