import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { TYPOGRAPHY } from '../constants/typography';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill both fields');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) Alert.alert('Login Failed', result.error);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={[styles.logo, TYPOGRAPHY.h1]}>🛺</Text>
          <Text style={[styles.title, TYPOGRAPHY.h2]}>RideShare</Text>
          <Text style={[styles.subtitle, TYPOGRAPHY.body]}>Dhaka • Share your ride, share the cost</Text>
        </View>

        {/* Form Card */}
        <Card variant="elevated" shadow="medium" style={styles.formCard}>
          <Text style={[styles.formTitle, TYPOGRAPHY.h4]}>Welcome Back</Text>
          <Text style={[styles.formSubtitle, TYPOGRAPHY.bodySmall]}>
            Sign in to your account to continue
          </Text>

          <Input
            label="Email Address"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
            leftIcon={
              <Text style={styles.inputIcon}>✉️</Text>
            }
          />

          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            leftIcon={
              <Text style={styles.inputIcon}>🔒</Text>
            }
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={!email || !password}
            fullWidth
            style={styles.loginButton}
            icon={<Text style={styles.buttonIcon}>→</Text>}
          />
        </Card>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={[styles.dividerText, TYPOGRAPHY.bodySmall]}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, TYPOGRAPHY.bodySmall]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
            <Text style={[styles.signupLink, TYPOGRAPHY.bodySmallBold]}>Create one</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <Card variant="accent" shadow="light" style={styles.infoCard}>
          <Text style={[styles.infoIcon]}>ℹ️</Text>
          <Text style={[styles.infoText, TYPOGRAPHY.caption]}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logo: {
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.gray600,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: SPACING.xl,
  },
  formTitle: {
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  formSubtitle: {
    color: COLORS.gray500,
    marginBottom: SPACING.lg,
  },
  inputIcon: {
    fontSize: 18,
  },
  eyeIcon: {
    fontSize: 18,
  },
  loginButton: {
    marginTop: SPACING.lg,
  },
  buttonIcon: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray200,
  },
  dividerText: {
    color: COLORS.gray500,
    marginHorizontal: SPACING.md,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xxl,
  },
  signupText: {
    color: COLORS.gray600,
  },
  signupLink: {
    color: COLORS.primary,
  },
  infoCard: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: SPACING.sm,
  },
  infoText: {
    color: COLORS.gray700,
    textAlign: 'center',
  },
});