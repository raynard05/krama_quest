import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface CustomSplashScreenProps {
  onFinish: () => void;
  fontsLoaded: boolean;
}

export default function CustomSplashScreen({ onFinish, fontsLoaded }: CustomSplashScreenProps) {
  // Animated values
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // 1. Icon entrance animation (spring zoom + rotation spin)
    Animated.parallel([
      Animated.spring(iconScale, {
        toValue: 1,
        tension: 20,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(iconRotate, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Schedule text animation and exit transition
    let textTimeout: any;
    let finishTimeout: any;

    if (fontsLoaded) {
      // Trigger text animation
      textTimeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(textTranslateY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      }, 600);

      // Trigger exit fade-out transition after 3 seconds
      finishTimeout = setTimeout(() => {
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, 3000);
    }

    return () => {
      clearTimeout(textTimeout);
      clearTimeout(finishTimeout);
    };
  }, [fontsLoaded]);

  // Interpolate rotation (2 full spins: 720 degrees)
  const spin = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <ImageBackground
        source={require('../assets/splash_screen/bg_splashs.webp')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          {/* Animated Logo Icon */}
          <Animated.Image
            source={require('../assets/splash_screen/icon.webp')}
            style={[
              styles.icon,
              {
                transform: [
                  { scale: iconScale },
                  { rotate: spin },
                ],
              },
            ]}
            resizeMode="contain"
          />

          {/* Animated Game Title Text */}
          {fontsLoaded && (
            <Animated.Text
              style={[
                styles.title,
                {
                  opacity: textOpacity,
                  transform: [{ translateY: textTranslateY }],
                },
              ]}
            >
              Krama Quest
            </Animated.Text>
          )}
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
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
  icon: {
    width: width * 0.45,
    height: width * 0.45,
    maxWidth: 200,
    maxHeight: 200,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 34,
    color: '#2b72b8',
    textAlign: 'center',
    marginTop: 20,
    letterSpacing: 0.5,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
