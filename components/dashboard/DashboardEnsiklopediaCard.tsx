import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Image, StyleSheet } from 'react-native';
import { rs, scaleFont } from '../../utils/responsive';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';

interface Props {
  onPress?: () => void;
}

export default function DashboardEnsiklopediaCard({ onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <SoundTouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.card}
      >
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/dashboard_assets/temple.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Ensiklopedia</Text>
      </SoundTouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 1,
    zIndex: 10,
  },
  card: {
    backgroundColor: '#000000',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 90,

  },
  imageContainer: {
    width: 100,
    height: 130,
    position: 'absolute',
    left: 20,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 20,
    transform: [{ translateY: -4 }],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: scaleFont(rs(18, 18, 18)),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginLeft: 80,
  },
});
