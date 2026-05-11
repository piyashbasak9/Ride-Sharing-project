import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Animated } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { SHADOWS } from '../constants/shadows';
import { TYPOGRAPHY } from '../constants/typography';
import Card from '../components/Card';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Hero Card */}
        <Card variant="elevated" shadow="xlarge" style={styles.heroCard}>
          <Text style={[styles.appTitle, TYPOGRAPHY.h1]}>🛺 RideShare</Text>
          <Text style={[styles.subtitle, TYPOGRAPHY.bodySmall]}>
            Dhaka • Share your ride, share the cost
          </Text>
          <Text style={[styles.tagline, TYPOGRAPHY.caption]}>
            Connect with nearby riders instantly
          </Text>
        </Card>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h3]}>✨ How it Works</Text>
          
          <Card variant="accent" shadow="light" padding={false}>
            <View style={styles.stepCard}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, TYPOGRAPHY.bodySmallBold]}>Create a Token</Text>
                <Text style={[styles.stepDescription, TYPOGRAPHY.caption]}>
                  Create a token for your route and passenger pickup.
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="accent" shadow="light" padding={false}>
            <View style={styles.stepCard}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, TYPOGRAPHY.bodySmallBold]}>Share & Refresh</Text>
                <Text style={[styles.stepDescription, TYPOGRAPHY.caption]}>
                  Share location securely and refresh when needed.
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="accent" shadow="light" padding={false}>
            <View style={styles.stepCard}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, TYPOGRAPHY.bodySmallBold]}>Connect & Complete</Text>
                <Text style={[styles.stepDescription, TYPOGRAPHY.caption]}>
                  Connect with nearby riders and complete the trip.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Key Features Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h3]}>🎯 Key Features</Text>
          
          <View style={styles.featureGrid}>
            <Card variant="elevated" shadow="medium" style={styles.featureCard}>
              <Text style={styles.featureEmoji}>📍</Text>
              <Text style={[styles.featureText, TYPOGRAPHY.bodySmallBold]}>
                Nearby Match Alerts
              </Text>
              <Text style={[styles.featureDescription, TYPOGRAPHY.caption]}>
                Get instant notifications for nearby riders
              </Text>
            </Card>

            <Card variant="elevated" shadow="medium" style={styles.featureCard}>
              <Text style={styles.featureEmoji}>✏️</Text>
              <Text style={[styles.featureText, TYPOGRAPHY.bodySmallBold]}>
                Edit Ride Tokens
              </Text>
              <Text style={[styles.featureDescription, TYPOGRAPHY.caption]}>
                Update your location and details anytime
              </Text>
            </Card>
          </View>

          <View style={styles.featureGrid}>
            <Card variant="elevated" shadow="medium" style={styles.featureCard}>
              <Text style={styles.featureEmoji}>🛡️</Text>
              <Text style={[styles.featureText, TYPOGRAPHY.bodySmallBold]}>
                Safe Connections
              </Text>
              <Text style={[styles.featureDescription, TYPOGRAPHY.caption]}>
                Verified profiles and secure info sharing
              </Text>
            </Card>

            <Card variant="elevated" shadow="medium" style={styles.featureCard}>
              <Text style={styles.featureEmoji}>👤</Text>
              <Text style={[styles.featureText, TYPOGRAPHY.bodySmallBold]}>
                Profile Control
              </Text>
              <Text style={[styles.featureDescription, TYPOGRAPHY.caption]}>
                Complete control over your profile
              </Text>
            </Card>
          </View>
        </View>

        {/* Tips Card */}
        <Card variant="warning" shadow="large" style={styles.tipCard}>
          <Text style={[styles.tipEmoji]}>💡</Text>
          <Text style={[styles.tipTitle, TYPOGRAPHY.h4]}>Pro Tip</Text>
          <Text style={[styles.tipText, TYPOGRAPHY.bodySmall]}>
            Your token becomes editable after 2 minutes. Refresh only updates time and location when needed.
          </Text>
        </Card>

        {/* Safety Tips Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h3]}>🔒 Safety Tips</Text>
          
          <Card variant="success" shadow="light" padding={false} style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>✓</Text>
              <Text style={[styles.tipItemText, TYPOGRAPHY.bodySmall]}>
                Always verify driver profiles and ratings
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>✓</Text>
              <Text style={[styles.tipItemText, TYPOGRAPHY.bodySmall]}>
                Share your trip details with a trusted contact
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>✓</Text>
              <Text style={[styles.tipItemText, TYPOGRAPHY.bodySmall]}>
                Trust your instincts and cancel if unsure
              </Text>
            </View>
          </Card>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  heroCard: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xxxl,
    marginBottom: SPACING.xxl,
    alignItems: 'center',
  },
  appTitle: {
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  tagline: {
    color: COLORS.primaryLight,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  stepCard: {
    flexDirection: 'row',
    padding: SPACING.lg,
    alignItems: 'flex-start',
  },
  stepNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  stepNumber: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  stepDescription: {
    color: COLORS.gray600,
  },
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  featureEmoji: {
    fontSize: 36,
    marginBottom: SPACING.md,
  },
  featureText: {
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    color: COLORS.gray500,
    textAlign: 'center',
  },
  tipCard: {
    marginBottom: SPACING.xxl,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  tipEmoji: {
    fontSize: 32,
    marginBottom: SPACING.md,
  },
  tipTitle: {
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  tipText: {
    color: COLORS.text,
    textAlign: 'center',
  },
  tipsContainer: {
    paddingVertical: SPACING.md,
  },
  tipItem: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'flex-start',
  },
  tipBullet: {
    color: COLORS.success,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: SPACING.lg,
    marginTop: 2,
  },
  tipItemText: {
    flex: 1,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray100,
    marginHorizontal: SPACING.lg,
  },
});