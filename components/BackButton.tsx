import React from 'react';
import { TouchableOpacity, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function BackButton({ onPress, style }: BackButtonProps) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={require('../assets/dashboard_assets/back.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 75,
    height: 75,
  }
});
