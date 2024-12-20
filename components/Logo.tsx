import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

interface LogoProps {
  showSubtitle?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function Logo({ showSubtitle = true, size = 'medium' }: LogoProps) {
  const { fontSize, moderateScale, layout } = useResponsive();

  const getLogoSize = () => {
    const baseSize = layout.isSmallDevice ? 0.8 : 1;
    switch (size) {
      case 'small':
        return moderateScale(80 * baseSize);
      case 'large':
        return moderateScale(160 * baseSize);
      default:
        return moderateScale(120 * baseSize);
    }
  };

  const logoSize = getLogoSize();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={[
          styles.logo,
          { 
            width: logoSize,
            height: logoSize,
          }
        ]}
        resizeMode="contain"
      />
      {showSubtitle && (
        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            { fontSize: fontSize.xl }
          ]}>
            MindMaster
          </Text>
          <Text style={[
            styles.subtitle,
            { fontSize: fontSize.sm }
          ]}>
            Organize suas ideias
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    marginBottom: 16,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
}); 