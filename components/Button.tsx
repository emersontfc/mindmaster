import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({ 
  onPress, 
  title, 
  variant = 'primary', 
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const { spacing, fontSize, moderateScale } = useResponsive();

  const getBackgroundColor = () => {
    if (disabled) return '#ccc';
    switch (variant) {
      case 'primary':
        return '#007AFF';
      case 'secondary':
        return '#ffffff';
      case 'danger':
        return '#FF3B30';
      default:
        return '#007AFF';
    }
  };

  const getTextColor = () => {
    if (disabled) return '#666';
    switch (variant) {
      case 'secondary':
        return '#007AFF';
      default:
        return '#ffffff';
    }
  };

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: getBackgroundColor(),
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      width: fullWidth ? '100%' : 'auto',
      height: moderateScale(48),
    },
    variant === 'secondary' && styles.secondaryButton,
    disabled && styles.disabledButton,
  ];

  const textStyles = [
    styles.text,
    {
      color: getTextColor(),
      fontSize: fontSize.md,
    },
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
}); 