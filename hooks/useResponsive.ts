import { useWindowDimensions, Platform, PixelRatio } from 'react-native';
import { useMemo } from 'react';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    // Device type detection
    const isSmallDevice = width < 375;
    const isMediumDevice = width >= 375 && width < 768;
    const isLargeDevice = width >= 768;
    const isTablet = width >= 768 || height >= 768;

    // Base scale calculations
    const scale = width / 375; // Base width for iPhone SE
    const fontScale = PixelRatio.getFontScale();

    // Scaling functions
    const moderateScale = (size: number, factor = 0.5) => {
      const newSize = size + (scale - 1) * factor;
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    };

    const responsiveFontSize = (size: number) => {
      const newSize = moderateScale(size);
      return Math.round(newSize / fontScale);
    };

    // Spacing system
    const spacing = {
      xxs: moderateScale(2),
      xs: moderateScale(4),
      sm: moderateScale(8),
      md: moderateScale(16),
      lg: moderateScale(24),
      xl: moderateScale(32),
      xxl: moderateScale(48),
    };

    // Font sizes
    const fontSize = {
      xs: responsiveFontSize(12),
      sm: responsiveFontSize(14),
      md: responsiveFontSize(16),
      lg: responsiveFontSize(20),
      xl: responsiveFontSize(24),
      xxl: responsiveFontSize(32),
      xxxl: responsiveFontSize(40),
    };

    // Layout information
    const layout = {
      width,
      height,
      isSmallDevice,
      isMediumDevice,
      isLargeDevice,
      isTablet,
      isIOS: Platform.OS === 'ios',
      isAndroid: Platform.OS === 'android',
      screenScale: PixelRatio.get(),
      fontScale,
    };

    // Common responsive values
    const hitSlop = {
      top: spacing.sm,
      bottom: spacing.sm,
      left: spacing.sm,
      right: spacing.sm,
    };

    const minTouchableSize = {
      width: 44,
      height: 44,
    };

    return {
      spacing,
      fontSize,
      layout,
      moderateScale,
      responsiveFontSize,
      hitSlop,
      minTouchableSize,
    };
  }, [width, height]);
} 