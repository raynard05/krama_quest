import React, { useState, useEffect, useRef } from 'react';
import {

  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';

import styles from './GameScreenStyle';
import Board from './Board';
import Dadu from './Dadu';
import BackButton from '../BackButton';
import Score from './Score';
import Timeout from './Timeout';
import { Player } from '../../types';
import { SNAKES, LADDERS, ANIMATION_SPEED } from '../../constants';

const INITIAL_PLAYERS: Player[] = [
  { id: 1, name: 'Sabitul', color: '#E25C3D', icon: '1', position: 0, type: 'human' },
  { id: 2, name: 'Wafi', color: '#202124', icon: '2', position: 0, type: 'computer' }
];
interface GameScreenProps {
  currentUser: any;
  onBack: () => void;
}

export default function GameScreen({
  currentUser,
  onBack,
}: GameScreenProps) {
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [playerLastRolls, setPlayerLastRolls] = useState<number[]>([1, 1]);
  const [showDaduCard, setShowDaduCard] = useState(true);

  const daduAnimY = useRef(new Animated.Value(800)).current;
  const textAnimX = useRef(new Animated.Value(-400)).current;

  useEffect(() => {
    if (showDaduCard) {
      daduAnimY.setValue(800);
      textAnimX.setValue(-400);

      Animated.parallel([
        Animated.spring(daduAnimY, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(textAnimX, {
          toValue: 0,
          friction: 12, // High friction + low tension = slowmo dramatic slide
          tension: 15,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [showDaduCard]);

  const getDiceImage = (val: number) => {
    switch (val) {
      case 1: return require('../../assets/dolanan_assets/dadu1.png');
      case 2: return require('../../assets/dolanan_assets/dadu2.png');
      case 3: return require('../../assets/dolanan_assets/dadu3.png');
      case 4: return require('../../assets/dolanan_assets/dadu4.png');
      case 5: return require('../../assets/dolanan_assets/dadu5.png');
      default: return require('../../assets/dolanan_assets/dadu1.png');
    }
  };

  // Turn logic
  useEffect(() => {
    if (players[currentPlayerIndex].type === 'human') {
      setShowDaduCard(true);
    } else {
      setShowDaduCard(false);
      // Auto-roll for computer
      const timer = setTimeout(() => {
        handleRollDice();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayerIndex]);

  const handleRollDice = async () => {
    if (isRolling) return;

    setIsRolling(true);

    let rolls = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 5) + 1);
      rolls++;

      if (rolls >= 10) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 5) + 1; // 1-5 as original
        setDiceValue(finalValue);
        setIsRolling(false);
        handleDiceRollEnd(finalValue);
      }
    }, 100);
  };

  const handleDiceRollEnd = (roll: number) => {
    setPlayerLastRolls(prev => {
      const newRolls = [...prev];
      newRolls[currentPlayerIndex] = roll;
      return newRolls;
    });

    const cp = players[currentPlayerIndex];

    const movePlayer = async () => {
      let current = cp.position;
      let target = current + roll;
      if (target > 50) target = 50;

      // Move cell by cell
      for (let i = current + 1; i <= target; i++) {
        setPlayers(prev => prev.map((p, idx) => idx === currentPlayerIndex ? { ...p, position: i } : p));
        // Wait for the gaco to reach the cell before moving to the next
        await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED.STEP_DELAY_MS));
      }

      // Check for Snakes or Ladders
      let finalPos = target;
      let hasSnakeOrLadder = false;
      if (SNAKES[target]) {
        finalPos = SNAKES[target];
        hasSnakeOrLadder = true;
      } else if (LADDERS[target]) {
        finalPos = LADDERS[target];
        hasSnakeOrLadder = true;
      }

      if (hasSnakeOrLadder) {
        // Small dramatic pause before going up/down
        await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED.SNAKE_LADDER_DELAY_MS));
        setPlayers(prev => prev.map((p, idx) => idx === currentPlayerIndex ? { ...p, position: finalPos } : p));
        // Wait for the snake/ladder animation to complete
        await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED.SNAKE_LADDER_DELAY_MS + 100));
      }

      // Turn transition
      const nextTurn = (currentPlayerIndex + 1) % players.length;
      setCurrentPlayerIndex(nextTurn);
      setColorIndex(prev => prev + 1);
    };

    if (cp.type === 'human') {
      // Freeze 1.5s -> hide card -> wait 1s -> move gaco
      setTimeout(() => {
        setShowDaduCard(false);
        setTimeout(() => {
          movePlayer();
        }, 1000);
      }, 1500);
    } else {
      // Computer: Card is already hidden. Just wait 1s so user sees the corner dice change, then move
      setTimeout(() => {
        movePlayer();
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/splash_screen/bg_splashs.webp')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            {/* Custom Header with Back Button */}
            <View style={styles.header}>
              <View style={{ zIndex: 10 }}>
                <BackButton onPress={onBack} />
              </View>

              <View style={styles.headerCenterContainer}>
                <View style={{ width: 140, height: 45, justifyContent: 'center' }}>
                  <Image source={require('../../assets/title_board/dolanan.png')} style={{ width: 140, height: 45 }} resizeMode="contain" />
                  <View style={{ position: 'absolute', left: 150 }}>
                    <Timeout isEnabled={true} />
                  </View>
                </View>
              </View>

              <View style={{ zIndex: 10, width: 40 }} />
            </View>

            {/* Main content body */}
            <View style={styles.contentBody}>
              <View style={styles.boardWrapper}>
                {/* Top Player Score (Sabitul) */}
                <View style={styles.topScoreContainer}>
                  <Score
                    playerName="Sabitul"
                    score={0}
                    avatarSource={require('../../assets/profile-pic/1.webp')}
                    isTopPlayer={true}
                  />
                </View>

                {/* Top Player Dice (Absolute Top Right) */}
                <View style={styles.topDiceContainer}>
                  <Image source={getDiceImage(playerLastRolls[1])} style={styles.diceImage} resizeMode="contain" />
                </View>

                {/* Board Component */}
                <Board players={players} />

                {/* Center Dice Overlay with Dark Background */}
                {showDaduCard && (
                  <View style={{ position: 'absolute', top: -500, bottom: -500, left: -500, right: -500, alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
                    <Animated.View
                      style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        backgroundColor: 'black',
                        opacity: daduAnimY.interpolate({ inputRange: [0, 800], outputRange: [0.6, 0] })
                      }}
                    />

                    {/* Animated Text */}
                    <Animated.View style={{ transform: [{ translateX: textAnimX }], marginBottom: 15 }}>
                      <Text style={{
                        fontSize: 36,
                        fontWeight: '500',
                        color: '#FFF',
                        fontFamily: 'Poppins-Bold',
                        letterSpacing: 2,
                        textShadowColor: 'rgba(255, 69, 0, 0.8)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 15
                      }}>
                        GILIRAN KAMU
                      </Text>
                    </Animated.View>

                    <Animated.View style={{ transform: [{ scale: 0.85 }, { translateY: daduAnimY }], width: 315, height: 440, alignItems: 'center', justifyContent: 'center' }}>
                      <Dadu
                        value={diceValue}
                        onRoll={handleRollDice}
                        disabled={isRolling || players[currentPlayerIndex].type === 'computer'}
                        colorIndex={colorIndex}
                      />
                    </Animated.View>
                  </View>
                )}

                {/* Bottom Player Dice (Absolute Bottom Left) */}
                <View style={styles.bottomDiceContainer}>
                  <Image source={getDiceImage(playerLastRolls[0])} style={styles.diceImage} resizeMode="contain" />
                </View>

                {/* Bottom Player Score (Wafi) */}
                <View style={styles.bottomScoreContainer}>
                  <Score
                    playerName="Wafi"
                    score={0}
                    avatarSource={require('../../assets/profile-pic/2.webp')}
                    isTopPlayer={false}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Section: Jembatan Illustration */}
          <View style={styles.bottomSection}>
            <Image
              source={require('../../assets/dolanan_assets/jembatan.webp')}
              style={styles.cityImg}
              resizeMode="cover"
            />
          </View>

        </ScrollView>
      </ImageBackground>
    </View>
  );
}
