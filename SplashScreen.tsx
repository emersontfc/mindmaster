import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import Logo from '../components/Logo';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    // Inicia a animação do cérebro
    lottieRef.current?.play();

    // Após 1.5 segundos, faz o fade in do logo
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1500);

    // Após 3 segundos, navega para o Onboarding
    setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={lottieRef}
        source={require('../assets/animations/brain-animation.json')}
        style={styles.lottieAnimation}
        loop={false}
        speed={0.8}
      />
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Logo size="large" showSubtitle />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
}); 