import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Image, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { TYPOGRAPHY } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', phone_number: '', password: '', address: '', bio: '' });
  const [profilePic, setProfilePic] = useState(null);
  const [nidPic, setNidPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const pickImage = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) setter(result.assets[0]);
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.phone_number || !form.password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (profilePic) {
      formData.append('profile_picture', {
        uri: profilePic.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    }
    if (nidPic) {
      formData.append('nid_card_picture', {
        uri: nidPic.uri,
        name: 'nid.jpg',
        type: 'image/jpeg',
      });
    }
    const result = await register(formData);
    setLoading(false);
    if (result.success) {
      Alert.alert('Success', 'Registration successful. Please verify your email.');
      navigation.navigate('Login');
    } else {
      Alert.alert('Registration Failed', JSON.stringify(result.error));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={[styles.title, TYPOGRAPHY.h2]}>Create Account</Text>
          <Text style={[styles.subtitle, TYPOGRAPHY.bodySmall]}>
            Join RideShare to start sharing rides
          </Text>
        </View>

        {/* Form Card */}
        <Card variant="elevated" shadow="medium">
          <Text style={[styles.sectionLabel, TYPOGRAPHY.h4]}>Personal Information</Text>
          
          <Input
            label="Full Name *"
            placeholder="John Doe"
            value={form.name}
            onChangeText={text => setForm({ ...form, name: text })}
            leftIcon={<Text style={styles.inputIcon}>👤</Text>}
            editable={!loading}
          />
          
          <Input
            label="Email *"
            placeholder="email@example.com"
            value={form.email}
            onChangeText={text => setForm({ ...form, email: text })}
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
            editable={!loading}
          />
          
          <Input
            label="Phone Number *"
            placeholder="+8801XXXXXXXXX"
            value={form.phone_number}
            onChangeText={text => setForm({ ...form, phone_number: text })}
            keyboardType="phone-pad"
            leftIcon={<Text style={styles.inputIcon}>📱</Text>}
            editable={!loading}
          />
          
          <Input
            label="Password *"
            secureTextEntry
            placeholder="••••••••"
            value={form.password}
            onChangeText={text => setForm({ ...form, password: text })}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            editable={!loading}
          />
          
          <Input
            label="Address"
            placeholder="Your address"
            value={form.address}
            onChangeText={text => setForm({ ...form, address: text })}
            leftIcon={<Text style={styles.inputIcon}>📍</Text>}
            editable={!loading}
          />
          
          <Input
            label="Bio (optional)"
            placeholder="Tell about yourself"
            multiline
            value={form.bio}
            onChangeText={text => setForm({ ...form, bio: text })}
            leftIcon={<Text style={styles.inputIcon}>✍️</Text>}
            editable={!loading}
          />
        </Card>

        {/* Documents Section */}
        <Card variant="elevated" shadow="medium">
          <Text style={[styles.sectionLabel, TYPOGRAPHY.h4]}>Documents</Text>
          
          {/* Profile Picture */}
          <View style={styles.documentSection}>
            <View style={styles.documentHeader}>
              <Text style={[styles.documentLabel, TYPOGRAPHY.bodySmallBold]}>Profile Picture</Text>
              {profilePic && <Text style={styles.checkmark}>✓</Text>}
            </View>
            {profilePic ? (
              <Image source={{ uri: profilePic.uri }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>📸</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => pickImage(setProfilePic)}
              disabled={loading}
              style={[styles.uploadBtn, loading && styles.uploadBtnDisabled]}
              activeOpacity={0.7}
            >
              <Text style={[styles.uploadBtnText, TYPOGRAPHY.bodySmallBold]}>
                {profilePic ? 'Change Photo' : 'Upload Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* NID Picture */}
          <View style={styles.documentSection}>
            <View style={styles.documentHeader}>
              <Text style={[styles.documentLabel, TYPOGRAPHY.bodySmallBold]}>NID Card Picture</Text>
              {nidPic && <Text style={styles.checkmark}>✓</Text>}
            </View>
            {nidPic ? (
              <Image source={{ uri: nidPic.uri }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>🆔</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => pickImage(setNidPic)}
              disabled={loading}
              style={[styles.uploadBtn, loading && styles.uploadBtnDisabled]}
              activeOpacity={0.7}
            >
              <Text style={[styles.uploadBtnText, TYPOGRAPHY.bodySmallBold]}>
                {nidPic ? 'Change NID' : 'Upload NID'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Info Card */}
        <Card variant="accent" shadow="light">
          <Text style={[styles.infoIcon]}>ℹ️</Text>
          <Text style={[styles.infoText, TYPOGRAPHY.caption]}>
            All fields marked with * are required. We use your documents for verification purposes only.
          </Text>
        </Card>

        {/* Register Button */}
        <Button
          title="Create Account"
          onPress={handleRegister}
          loading={loading}
          disabled={!form.name || !form.email || !form.phone_number || !form.password}
          fullWidth
          size="lg"
          style={styles.registerButton}
          icon={<Text style={styles.buttonIcon}>→</Text>}
        />

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, TYPOGRAPHY.bodySmall]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading} activeOpacity={0.7}>
            <Text style={[styles.loginLink, TYPOGRAPHY.bodySmallBold]}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  headerSection: {
    marginBottom: SPACING.xxl,
  },
  title: {
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.gray600,
  },
  sectionLabel: {
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  inputIcon: {
    fontSize: 18,
  },
  documentSection: {
    marginBottom: SPACING.lg,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  documentLabel: {
    color: COLORS.text,
  },
  checkmark: {
    color: COLORS.success,
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePlaceholder: {
    height: 140,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 40,
  },
  previewImage: {
    height: 140,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.gray100,
  },
  uploadBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  uploadBtnDisabled: {
    opacity: 0.5,
  },
  uploadBtnText: {
    color: COLORS.white,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray100,
    marginVertical: SPACING.lg,
  },
  infoIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  infoText: {
    color: COLORS.gray700,
    textAlign: 'center',
  },
  registerButton: {
    marginBottom: SPACING.lg,
  },
  buttonIcon: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xxl,
  },
  loginText: {
    color: COLORS.gray600,
  },
  loginLink: {
    color: COLORS.primary,
  },
});