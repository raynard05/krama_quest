import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType, Animated } from 'react-native';

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
  const shimmerAnim = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    if (score > prevScoreRef.current) {
      shimmerAnim.setValue(-200);
      Animated.timing(shimmerAnim, {
        toValue: 200,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
    prevScoreRef.current = score;
  }, [score]);

  return (
    <View style={[styles.container, isTopPlayer ? styles.topStyle : styles.bottomStyle]}>
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
    </View>
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
    minWidth: 180,
    position: 'relative',
  },
  shimmerBar: {
    position: 'absolute',
    top: -60,
    bottom: -60,
    width: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
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
  }
});
