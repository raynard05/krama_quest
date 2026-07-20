import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';

interface DieProps {
  value: number;
  isRolling: boolean;
  onRoll: () => void;
  disabled: boolean;
  color?: string;
}

export default function Die({ value, isRolling, onRoll, disabled, color = '#FF007F' }: DieProps) {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRolling) {
      // Trigger a rolling loop animation
      Animated.parallel([
        // Shaking animation sequence
        Animated.loop(
          Animated.sequence([
            Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -3, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 3, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
          ]),
          { iterations: -1 }
        ),
        // Continuous rotation
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // Shrink slightly when rolling
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Stop animations and bounce back with a "pop" effect
      shakeAnim.stopAnimation();
      rotateAnim.stopAnimation();
      
      // Reset values
      shakeAnim.setValue(0);
      rotateAnim.setValue(0);

      // Bounce-pop effect
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.15,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.0,
          friction: 4,
          tension: 30,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isRolling]);

  // Interpolate rotation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getDots = (num: number) => {
    switch (num) {
      case 1:
        return [{ row: 1, col: 1 }];
      case 2:
        return [{ row: 0, col: 0 }, { row: 2, col: 2 }];
      case 3:
        return [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }];
      case 4:
        return [
          { row: 0, col: 0 }, { row: 0, col: 2 },
          { row: 2, col: 0 }, { row: 2, col: 2 }
        ];
      case 5:
        return [
          { row: 0, col: 0 }, { row: 0, col: 2 },
          { row: 1, col: 1 },
          { row: 2, col: 0 }, { row: 2, col: 2 }
        ];
      case 6:
        return [
          { row: 0, col: 0 }, { row: 0, col: 2 },
          { row: 1, col: 0 }, { row: 1, col: 2 },
          { row: 2, col: 0 }, { row: 2, col: 2 }
        ];
      default:
        return [];
    }
  };

  const dots = getDots(value);

  // Position multipliers for absolute layouts on a 3x3 grid inside the die
  const getDotStyle = (row: number, col: number) => {
    const lefts = ['15%', '42.5%', '70%'] as const;
    const tops = ['15%', '42.5%', '70%'] as const;
    return {
      left: lefts[col],
      top: tops[row],
    };
  };

  return (
    <View style={styles.outerContainer}>
      <Animated.View
        style={[
          styles.dieContainer,
          {
            borderColor: color,
            shadowColor: color,
            transform: [
              { translateX: shakeAnim },
              { rotate: spin },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <SoundTouchableOpacity
          onPress={onRoll}
          disabled={disabled || isRolling}
          activeOpacity={0.8}
          style={styles.touchable}
        >
          {dots.map((dot, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                getDotStyle(dot.row, dot.col),
                { backgroundColor: color, shadowColor: color },
              ]}
            />
          ))}
        </SoundTouchableOpacity>
      </Animated.View>
      <Text style={[styles.rollText, { color: color }]}>
        {isRolling ? 'Kocok...' : 'Sentuh Dadu'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  dieContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#1E1E2F',
    borderWidth: 3,
    borderRadius: 18,
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  touchable: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  rollText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
