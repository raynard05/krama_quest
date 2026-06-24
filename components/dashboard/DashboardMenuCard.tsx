import React, { useRef } from 'react';
import {
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import styles from '../../styles/dashboard/DashboardMenuCardStyles';

interface MenuCardProps {
  title: string;
  imageSource: any;
  onPress: () => void;
  type: 'materi' | 'dolanan' | 'cptp' | 'evaluasi';
}

export default function DashboardMenuCard({ title, imageSource, onPress, type }: MenuCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const rotateVal = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // Start rotation to 30 degrees and scale down concurrently
    Animated.parallel([
      Animated.timing(rotateVal, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 0.92,
        useNativeDriver: true,
        speed: 30,
        bounciness: 2,
      }),
    ]).start(() => {
      // Small delay for user to visually process rotation tilt
      setTimeout(() => {
        // Reset scale and rotation back to default state
        Animated.parallel([
          Animated.timing(rotateVal, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 30,
            bounciness: 2,
          }),
        ]).start();

        // Trigger navigation handler
        onPress();
      }, 100);
    });
  };

  const rotate = rotateVal.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '30deg'],
  });

  const cardStyle = [
    styles.menuCard,
    type === 'materi' && styles.materiCardTheme,
    type === 'dolanan' && styles.dolananCardTheme,
    type === 'cptp' && styles.cptpCardTheme,
    type === 'evaluasi' && styles.evaluasiCardTheme,
  ];

  const titleStyle = [
    styles.cardTitle,
    type === 'materi' && styles.materiTextTheme,
    type === 'dolanan' && styles.dolananTextTheme,
    type === 'cptp' && styles.cptpTextTheme,
    type === 'evaluasi' && styles.evaluasiTextTheme,
  ];

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={cardStyle}
      >
        <Animated.Image
          source={imageSource}
          style={[styles.cardImage, { transform: [{ rotate }] }]}
          resizeMode="contain"
        />
        <Text style={titleStyle}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
