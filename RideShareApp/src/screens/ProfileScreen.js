import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, Alert, TouchableOpacity, StyleSheet, Modal, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';
import { COLORS } from '../constants/colors';

export default function ProfileScreen() {
  const { userInfo, setUserInfo, logout } = useAuth();
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [phone, setPhone] = useState(userInfo?.phone_number || '');
  const [address, setAddress] = useState(userInfo?.address || '');
  const [bio, setBio] = useState(userInfo?.bio || '');
  const [profilePic, setProfilePic] = useState(userInfo?.profile_picture);
  const [nidPic, setNidPic] = useState(userInfo?.nid_card_picture);
  const [nidModalVisible, setNidModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setName(userInfo?.name || '');
    setEmail(userInfo?.email || '');
    setPhone(userInfo?.phone_number || '');
    setAddress(userInfo?.address || '');
    setBio(userInfo?.bio || '');
    setProfilePic(userInfo?.profile_picture);
    setNidPic(userInfo?.nid_card_picture);
  }, [userInfo]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile/');
      const updated = res.data;
      setUserInfo?.(updated);
      await AsyncStorage.setItem('user_info', JSON.stringify(updated));
    } catch (err) {
      Alert.alert('Error', 'Unable to refresh profile');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  const saveProfile = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone_number', phone);
    formData.append('address', address);
    formData.append('bio', bio);

    try {
      const res = await api.patch('/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = res.data;
      setUserInfo?.(updated);
      await AsyncStorage.setItem('user_info', JSON.stringify(updated));
      Alert.alert('Success', 'Profile updated');
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.detail || err.message || 'Could not update profile';
      Alert.alert('Error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (result.canceled) return;

    setLoading(true);
    const fileUri = result.assets[0].uri;
    const fileName = field === 'profile_picture' ? 'profile.jpg' : 'nid.jpg';
    const formData = new FormData();
    formData.append(field, {
      uri: fileUri,
      name: fileName,
      type: 'image/jpeg',
    });

    try {
      const res = await api.patch('/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = res.data;
      setUserInfo?.(updated);
      await AsyncStorage.setItem('user_info', JSON.stringify(updated));
      setProfilePic(updated.profile_picture);
      setNidPic(updated.nid_card_picture);
      Alert.alert('Success', field === 'profile_picture' ? 'Profile photo updated' : 'NID uploaded');
    } catch (err) {
      Alert.alert('Error', 'Could not upload image');
    } finally {
      setLoading(false);
    }
  };

  const changePhoto = async () => {
    await uploadFile('profile_picture');
  };

  const uploadNid = async () => {
    await uploadFile('nid_card_picture');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={changePhoto} disabled={loading}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>📷</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.name}>{name || 'Your Name'}</Text>
        <Text style={styles.email}>{email || 'Email'}</Text>
        <Text style={styles.phone}>{phone || 'Phone number'}</Text>

        <View style={styles.actionRow}>
          <Button title={nidPic ? 'Replace NID' : 'Upload NID'} onPress={uploadNid} loading={loading} style={{ flex: 1, marginRight: 8 }} />
          {nidPic ? <Button title="View NID" onPress={() => setNidModalVisible(true)} style={{ flex: 1, marginLeft: 8 }} /> : null}
        </View>
        {nidPic ? <Text style={{ marginTop: 8, color: COLORS.success }}>✓ NID uploaded</Text> : null}
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Edit Profile</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" />
        <TextInput style={[styles.input, styles.textArea]} value={address} onChangeText={setAddress} placeholder="Address" multiline />
        <TextInput style={[styles.input, styles.textArea]} value={bio} onChangeText={setBio} placeholder="Bio" multiline />
        <Button title="Save Profile" onPress={saveProfile} loading={loading} />
      </View>

      <Button title="Logout" onPress={logout} type="secondary" style={{ marginTop: 20 }} />

      <Modal visible={nidModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>NID Preview</Text>
            {nidPic ? (
              <Image source={{ uri: nidPic }} style={styles.nidImage} resizeMode="contain" />
            ) : (
              <Text>No NID available.</Text>
            )}
            <Button title="Close" onPress={() => setNidModalVisible(false)} style={{ marginTop: 16 }} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 12 },
  avatarPlaceholder: { backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 40 },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 16, color: COLORS.gray },
  phone: { fontSize: 16, color: COLORS.gray },
  formCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 12, padding: 12, marginBottom: 12, backgroundColor: COLORS.white },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  actionRow: { flexDirection: 'row', width: '100%', marginTop: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: COLORS.white, borderRadius: 16, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  nidImage: { width: '100%', height: 320, borderRadius: 12, backgroundColor: COLORS.lightGray },
  label: { fontWeight: 'bold' },
});