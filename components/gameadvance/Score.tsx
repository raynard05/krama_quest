import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';

interface ScoreProps {
  playerName: string;
  score: number;
  avatarSource: ImageSourcePropType;
  isTopPlayer?: boolean; // Determines background color and style
}

export default function Score({ playerName, score, avatarSource, isTopPlayer = true }: ScoreProps) {
  return (
    <View style={[styles.container, isTopPlayer ? styles.topStyle : styles.bottomStyle]}>
      <View style={[styles.avatarContainer, isTopPlayer ? styles.avatarTopBg : styles.avatarBottomBg]}>
        <Image source={avatarSource} style={styles.avatar} resizeMode="contain" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.nameText, isTopPlayer ? styles.darkText : styles.lightText]}>{playerName}</Text>
        <Text style={[styles.scoreText, isTopPlayer ? styles.darkText : styles.lightText]}>Skor: {score}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 180,
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
  darkText: {
    color: '#000000',
  },
  lightText: {
    color: '#FFFFFF',
  }
});
