import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { SHADOWS } from '../constants/shadows';

export default function Card({
  children,
  style,
  variant = 'elevated',
  padding = true,
  shadow = 'medium',
}) {
  const backgroundColor =
    variant === 'elevated' ? COLORS.white : 
    variant === 'accent' ? COLORS.primaryLight :
    variant === 'success' ? COLORS.successLight :
    variant === 'danger' ? COLORS.dangerLight :
    variant === 'warning' ? COLORS.warningLight :
    COLORS.white;

  const shadowStyle = shadow ? SHADOWS[shadow] : {};

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderRadius: RADIUS.lg,
          padding: padding ? SPACING.lg : 0,
          ...shadowStyle,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
});