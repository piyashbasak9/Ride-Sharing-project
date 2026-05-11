import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, RefreshControl } from 'react-native';
import * as Location from 'expo-location';
import Input from '../components/Input';
import Button from '../components/Button';
import CountdownTimer from '../components/CountdownTimer';
import EditTokenModal from '../components/EditTokenModal';
import { COLORS } from '../constants/colors';
import api from '../services/api';

export default function TokenScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [customVehicle, setCustomVehicle] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);

  // For My Token section
  const [token, setToken] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);
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
      setTokenLoading(false);
    }
  };

  useEffect(() => { fetchToken(); }, [refreshKey]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchToken();
    setRefreshing(false);
  };

  const generateToken = async () => {
    if (!title) return Alert.alert('Error', 'Please enter a title');
    const finalVehicleType = customVehicle;
    if (!finalVehicleType) return Alert.alert('Error', 'Please enter vehicle type');

    setLoading(true);
    let location;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Location permission denied');
      location = await Location.getCurrentPositionAsync({});
    } catch (err) {
      Alert.alert('Location Error', err.message);
      setLoading(false);
      return;
    }
    try {
      const res = await api.post('/token/create/', {
        title,
        vehicle_type: finalVehicleType,
        additional_info: additionalInfo,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      Alert.alert('Success', 'Token created!');
      setTitle('');
      setCustomVehicle('');
      setAdditionalInfo('');
      setRefreshKey(k => k+1); // Refresh token section
      if (res.data.nearby_tokens?.length) {
        navigation.navigate('Nearby', { tokens: res.data.nearby_tokens });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create token';
      console.log('Token creation error:', err.response?.data || err.message);
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
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
      const res = await api.put('/token/edit/', updatedFields);
      Alert.alert('Success', 'Token updated! Countdown reset.');
      setRefreshKey(k => k+1);
      if (res.data.nearby_tokens?.length) {
        navigation.navigate('Nearby', { tokens: res.data.nearby_tokens });
      }
      return true;
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || err.message || 'Update failed');
      return false;
    }
  };

  const handleRefresh = async () => {
    try {
      setEditable(false);
      const res = await api.post('/token/refresh/');
      Alert.alert('Refreshed', 'Token time updated. Countdown reset.');
      setRefreshKey(k => k+1);
      if (res.data.nearby_tokens?.length) {
        navigation.navigate('Nearby', { tokens: res.data.nearby_tokens });
      }
      return true;
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || err.message || 'Refresh failed');
      return false;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Create Token Section - Only show if no token exists */}
      {!token && (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Create New Ride Token</Text>
          <Input label="Title of your ride" placeholder="e.g., (Mirpur to Gulshan)" value={title} onChangeText={setTitle} />
          <Input label="Enter Vehicle Type" placeholder="e.g., Rickshaw, CNG, Bike, Car" value={customVehicle} onChangeText={setCustomVehicle} />
          <Input label="Additional Info (optional)" placeholder="Add details about your ride..." multiline value={additionalInfo} onChangeText={setAdditionalInfo} />
          <Button title="Generate Token" onPress={generateToken} loading={loading} />
        </View>
      )}

      {/* My Token Section - Only show if token exists */}
      {tokenLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : token ? (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>My Current Token</Text>
          <Text style={styles.tokenTitle}>{token.title}</Text>
          <Text style={styles.tokenVehicle}>🚲 {token.vehicle_type.toUpperCase()}</Text>
          <Text style={styles.tokenInfo}>📝 {token.additional_info || 'No additional info'}</Text>
          <Text style={styles.tokenDate}>Created: {new Date(token.created_at).toLocaleString()}</Text>
          <CountdownTimer createdAt={token.created_at} onComplete={() => {
            setEditable(true);
            Alert.alert(
              'Token Expired',
              'Your token has expired. You can now edit or delete it.',
              [{ text: 'OK' }]
            );
          }} />
          <View style={styles.buttonGroup}>
            <Button title="Delete Token" onPress={handleDelete} disabled={!editable} type="danger" />
            <Button title="Edit Token" onPress={() => setModalVisible(true)} disabled={!editable} />
            <Button title="Refresh Token" onPress={handleRefresh} disabled={!editable} />
          </View>
        </View>
      ) : null}

      <EditTokenModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleEdit}
        initialTitle={token?.title || ''}
        initialVehicle={token?.vehicle_type || ''}
        initialInfo={token?.additional_info || ''}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  section: { marginBottom: 30 },
  sectionHeading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  tokenTitle: { fontSize: 28, fontWeight: 'bold' },
  tokenVehicle: { fontSize: 18, color: COLORS.gray, marginTop: 4 },
  tokenInfo: { marginVertical: 8, fontSize: 16 },
  tokenDate: { fontSize: 12, color: COLORS.gray, marginBottom: 8 },
  buttonGroup: { marginTop: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});