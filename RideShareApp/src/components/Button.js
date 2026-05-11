import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { SHADOWS } from '../constants/shadows';
import { TYPOGRAPHY } from '../constants/typography';

export default function Button({
  title,
  onPress,
  loading,
  disabled,
  type = 'primary',
  variant = 'solid',
  size = 'md',
  style,
  icon,
  fullWidth,
}) {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.gray100;
    switch (type) {
      case 'primary':
        return variant === 'solid' ? COLORS.primary : 'transparent';
      case 'danger':
        return variant === 'solid' ? COLORS.danger : 'transparent';
      case 'success':
        return variant === 'solid' ? COLORS.success : 'transparent';
      case 'secondary':
        return variant === 'solid' ? COLORS.secondary : 'transparent';
      default:
        return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.gray400;
    if (variant === 'solid') return COLORS.white;
    switch (type) {
      case 'primary':
        return COLORS.primary;
      case 'danger':
        return COLORS.danger;
      case 'success':
        return COLORS.success;
      case 'secondary':
        return COLORS.secondary;
      default:
        return COLORS.primary;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
      if (disabled) return COLORS.gray200;
      switch (type) {
        case 'primary':
          return COLORS.primary;
        case 'danger':
          return COLORS.danger;
        case 'success':
          return COLORS.success;
        case 'secondary':
          return COLORS.secondary;
        default:
          return COLORS.primary;
      }
    }
    return 'transparent';
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 10, paddingHorizontal: SPACING.md };
      case 'lg':
        return { paddingVertical: 18, paddingHorizontal: SPACING.xl };
      default:
        return { paddingVertical: 14, paddingHorizontal: SPACING.lg };
    }
  };

  const fontSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          ...getPadding(),
          width: fullWidth ? '100%' : 'auto',
        },
        !disabled && styles.shadow,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        {loading ? (
          <ActivityIndicator color={getTextColor()} size={size === 'sm' ? 'small' : 'large'} />
        ) : (
          <Text style={[styles.text, { color: getTextColor(), fontSize }]}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.sm,
  },
  shadow: {
    ...SHADOWS.light,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  icon: {
    marginRight: SPACING.sm,
  },
});