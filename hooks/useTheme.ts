import { useColorScheme } from 'react-native';
import { useMemo } from 'react';

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
};

export type Theme = {
  colors: ThemeColors;
  isDark: boolean;
};

const lightColors: ThemeColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#666666',
  border: '#C6C6C8',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
};

const darkColors: ThemeColors = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  border: '#38383A',
  error: '#FF453A',
  success: '#32D74B',
  warning: '#FF9F0A',
};

export function useTheme() {
  const colorScheme = useColorScheme();
  
  return useMemo(() => {
    const isDark = colorScheme === 'dark';
    const colors = isDark ? darkColors : lightColors;

    return {
      colors,
      isDark,
    };
  }, [colorScheme]);
} 