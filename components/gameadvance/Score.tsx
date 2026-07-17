import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType, Animated } from 'react-native';
import { rs } from '../../utils/responsive';

interface ScoreProps {
  playerName: string;
  score: number;
  avatarSource: ImageSourcePropType;
  isTopPlayer?: boolean; // Determines background color and style
  soalTerjawabCount?: number;
  status?: 'playing' | 'spectator';
}

export default function Score({
  playerName,
  score,
  avatarSource,
  isTopPlayer = true,
  soalTerjawabCount = 0,
  status = 'playing',
}: ScoreProps) {
  const prevScoreRef = useRef(score);
  const shimmerAnim = useRef(new Animated.Value(-300)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const trophyAnim = useRef(new Animated.Value(0)).current;
  const [showTrophies, setShowTrophies] = useState(false);

  useEffect(() => {
    if (score > prevScoreRef.current) {
      shimmerAnim.setValue(-300);
      trophyAnim.setValue(0);
      setShowTrophies(true);

      Animated.parallel([
        Animated.timing(shimmerAnim, {
          toValue: 400,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(trophyAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          })
        ])
      ]).start(() => {
        setShowTrophies(false);
      });
    }
    prevScoreRef.current = score;
  }, [score]);

  return (
    <Animated.View style={[styles.container, isTopPlayer ? styles.topStyle : styles.bottomStyle, { transform: [{ scale: scaleAnim }] }]}>
      {/* Animated shiny bar */}
      <Animated.View style={[
        styles.shimmerBar,
        {
          transform: [
            { translateX: shimmerAnim },
            { rotate: '30deg' }
          ]
        }
      ]} />

      <View style={[styles.avatarContainer, isTopPlayer ? styles.avatarTopBg : styles.avatarBottomBg]}>
        <Image source={avatarSource} style={styles.avatar} resizeMode="contain" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.nameText, isTopPlayer ? styles.darkText : styles.lightText]}>{playerName}</Text>
        <Text style={[styles.scoreText, isTopPlayer ? styles.darkText : styles.lightText]}>Skor: {score}</Text>
        <Text style={[styles.soalCountText, isTopPlayer ? styles.darkTextDim : styles.lightTextDim]}>
          {status === 'spectator' ? '👀 Penonton' : `📝 ${soalTerjawabCount}/25 Soal`}
        </Text>
      </View>

      {/* Floating Trophies */}
      {showTrophies && (
        <Animated.View style={[styles.trophyContainer, {
          opacity: trophyAnim.interpolate({
            inputRange: [0, 0.2, 0.8, 1],
            outputRange: [0, 1, 1, 0]
          }),
          transform: [{
            translateY: trophyAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, -20]
            })
          }]
        }]}>
          <Text style={styles.trophyText}>🏆</Text>
          <Text style={[styles.trophyText, { fontSize: 14, marginLeft: -5, marginTop: 5 }]}>🏆</Text>
          <Text style={[styles.trophyText, { fontSize: 18, marginLeft: 15 }]}>🏆</Text>
          <Text style={[styles.trophyText, { fontSize: 12, marginLeft: -10, marginTop: 10 }]}>🏆</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: rs(170, 180, 208),
    position: 'relative',
  },
  shimmerBar: {
    position: 'absolute',
    top: -60,
    bottom: -60,
    width: 45,
    backgroundColor: 'rgba(255, 235, 59, 0.95)',
    shadowColor: '#FFFF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
    zIndex: 5,
  },
  topStyle: {
    backgroundColor: '#FFFFFF',
  },
  bottomStyle: {
    backgroundColor: '#7FAEFF', // Light blue to match screenshot
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarTopBg: {
    backgroundColor: '#E25C3D', // Orange
  },
  avatarBottomBg: {
    backgroundColor: '#202124', // Dark
  },
  avatar: {
    width: '90%',
    height: '90%',
  },
  infoContainer: {
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    lineHeight: 18,
  },
  scoreText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    lineHeight: 16,
  },
  soalCountText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    lineHeight: 14,
    marginTop: 2,
  },
  darkText: {
    color: '#000000',
  },
  lightText: {
    color: '#FFFFFF',
  },
  darkTextDim: {
    color: '#666666',
  },
  lightTextDim: {
    color: '#E0EFFF',
  },
  trophyContainer: {
    position: 'absolute',
    right: 20,
    top: 5,
    flexDirection: 'row',
    zIndex: 10,
  },
  trophyText: {
    fontSize: 20,
  }
});
