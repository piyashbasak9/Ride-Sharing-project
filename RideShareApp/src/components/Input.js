import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { SHADOWS } from '../constants/shadows';
import { TYPOGRAPHY } from '../constants/typography';

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, TYPOGRAPHY.bodySmallBold]}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          multiline && { alignItems: 'flex-start', paddingTop: SPACING.md },
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
          ]}
          placeholderTextColor={COLORS.gray500}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            activeOpacity={0.6}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.error, TYPOGRAPHY.caption]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.light,
    transition: 'all 0.3s ease',
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    ...SHADOWS.medium,
  },
  inputWrapperError: {
    borderColor: COLORS.danger,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: 0,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '400',
  },
  inputMultiline: {
    paddingVertical: SPACING.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputWithLeftIcon: {
    marginLeft: SPACING.sm,
  },
  inputWithRightIcon: {
    marginRight: SPACING.sm,
  },
  leftIcon: {
    marginRight: SPACING.sm,
    justifyContent: 'center',
  },
  rightIcon: {
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: COLORS.danger,
    marginTop: SPACING.sm,
  },
});