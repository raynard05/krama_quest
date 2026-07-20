import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  ImageBackground,
  Easing,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

interface CustomLoadingScreenProps {
  onFinish: () => void;
}

export default function CustomLoadingScreen({ onFinish }: CustomLoadingScreenProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Fade in the loading content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // 2. Loop rotation animation for the snake loader
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 3. Keep loading for 0.5 seconds, then transition
    const timer = setTimeout(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish, rotateAnim, fadeAnim]);

  // Interpolate rotation angle
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/splash_screen/bg_splashs.webp')}
        style={styles.background}
        resizeMode="cover"
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Rotating Snake Logo */}
          <Animated.Image
            source={require('../../assets/loading_screen/loading.png')}
            style={[
              styles.loaderImage,
              {
                transform: [{ rotate: spin }],
              },
            ]}
            resizeMode="contain"
          />

          {/* Game Title Text */}
          <Text style={styles.title}>Krama Quest</Text>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
    backgroundColor: '#E6F4FE',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loaderImage: {
    width: width * 0.32,
    height: width * 0.32,
    maxWidth: 140,
    maxHeight: 140,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#2b72b8',
    textAlign: 'center',
    letterSpacing: 0.5,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.05)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      default: {},
    }),
  },
});
