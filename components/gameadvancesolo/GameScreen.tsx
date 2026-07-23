import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  Alert,
  BackHandler,
} from 'react-native';

import styles from './GameScreenStyle';
import Board from './Board';
import Dadu from './Dadu';
import BackButton from '../BackButton';
import Score from './Score';
import Timeout from './Timeout';
import GamePopups from './GamePopups';
import { Player, Soal } from '../../types';
import { SNAKES, LADDERS, ANIMATION_SPEED, isKotakSoal, SOAL_BANK, checkAnswerCorrectness } from '../../constants';
import { ProfileService } from '../../services/ProfileService';
import { getAvatarSource, getBatikSource } from '../profile/ProfileAvatars';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';
import { SoundManager } from '../../utils/SoundManager';

const INITIAL_PLAYERS: Player[] = [
  { id: 1, name: 'Sabitul', color: '#E25C3D', icon: '1', position: 0, type: 'human', score: 0, soalTerjawabCount: 0, answeredQuestionIds: [], activeQuestionId: null, status: 'playing' },
  { id: 2, name: 'Wafi', color: '#202124', icon: '2', position: 0, type: 'computer', score: 0, soalTerjawabCount: 0, answeredQuestionIds: [], activeQuestionId: null, status: 'playing' }
];

const BACKGROUND_IMAGES = [
  require('../../assets/dolanan_assets/lapindo.webp'),
  require('../../assets/dolanan_assets/jembatan.webp'),
  require('../../assets/dolanan_assets/temple.png'),
  require('../../assets/dolanan_assets/ship_bg.webp'),
];
interface GameScreenProps {
  currentUser: any;
  initialPlayers: Player[];
  onBack: () => void;
  onFinishGame?: (players: Player[]) => void;
  onGameEndInitiated?: () => void;
}

export default function GameScreen({
  currentUser,
  initialPlayers,
  onBack,
  onFinishGame,
  onGameEndInitiated,
}: GameScreenProps) {
  const playerIndex = 0;
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const isRollingRef = useRef<boolean>(false);

  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [playerLastRolls, setPlayerLastRolls] = useState<number[]>([1]);
  const [showDaduCard, setShowDaduCard] = useState(true);

  // Question Engine States
  const [activeQuestion, setActiveQuestion] = useState<Soal | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState<boolean>(false);
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [globalTimeLeft, setGlobalTimeLeft] = useState(30 * 3);

  // 5-second countdown at the start of the game
  const [startCountdown, setStartCountdown] = useState<number | null>(5);

  // Global game timer (30 mins)
  useEffect(() => {
    if (gameFinished || startCountdown !== null) return;

    const timer = setInterval(() => {
      setGlobalTimeLeft(prev => {
        const nextTime = prev - 1;
        if (nextTime <= 0) {
          clearInterval(timer);
          setEndReason('timeout');
          setGameFinished(true);
          return 0;
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameFinished, startCountdown]);

  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(60);

  const [showSpectatorPopup, setShowSpectatorPopup] = useState<boolean>(false);
  const [spectatorPlayerName, setSpectatorPlayerName] = useState<string>('');
  const [endReason, setEndReason] = useState<'normal' | 'timeout'>('normal');

  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [showEnemyRollPopup, setShowEnemyRollPopup] = useState<boolean>(false);
  const [bgIndex, setBgIndex] = useState<number>(0);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 30000);

    // Fetch player profiles (avatars and batiks)
    const fetchProfiles = async () => {
      try {
        const updatedPlayers = await Promise.all(
          initialPlayers.map(async (p) => {
            if (p.type === 'human') {
              const userId = parseInt(p.icon, 10);
              if (!isNaN(userId)) {
                try {
                  const profile = await ProfileService.fetchUserFullProfile(userId);
                  return { ...p, avatarId: profile.avatarId, batikId: profile.bgId, gacoId: profile.gacoId };
                } catch (e) {
                  console.warn('Failed to fetch profile for', userId, e);
                  return p;
                }
              }
            }
            return p;
          })
        );
        setPlayers(updatedPlayers);
      } catch (err) {
        console.warn('Error fetching player profiles:', err);
      }
    };
    fetchProfiles();

    return () => {
      clearInterval(bgInterval);
    };
  }, []);

  useEffect(() => {
    if (gameFinished && onGameEndInitiated) {
      onGameEndInitiated();
    }
  }, [gameFinished, onGameEndInitiated]);

  const handleBackPress = () => {
    if (gameFinished) {
      return true; // block hardware back when game is finished
    }
    setShowExitConfirm(true);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [gameFinished, onBack]);

  useEffect(() => {
    if (startCountdown === null) return;
    if (startCountdown === 0) {
      const timer = setTimeout(() => {
        setStartCountdown(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setStartCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [startCountdown]);

  // Get next question preventing duplicate answers and cheating (simultaneous active question)
  const getNextQuestion = (playerIdx: number) => {
    const player = players[playerIdx];
    const opponent = players[(playerIdx + 1) % players.length];

    const answeredIds = player.answeredQuestionIds || [];
    const opponentActiveId = opponent.activeQuestionId;

    const availableQuestions = SOAL_BANK.filter(q => {
      const notAnswered = !answeredIds.includes(q.id);
      const notActiveForOpponent = q.id !== opponentActiveId;
      return notAnswered && notActiveForOpponent;
    });

    if (availableQuestions.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  };

  const handleAnswerSubmit = (userInput: string, question: Soal, isComputer: boolean = false) => {
    const isCorrect = checkAnswerCorrectness(userInput, question.kunciJawaban, question.minimal_jawab_benar);
    let triggeredSpectatorNotice = false;

    if (isCorrect && question.bobot > 0) {
      const v = question.bobot === 1 ? 1 : question.bobot === 3 ? 2 : question.bobot === 8 ? 3 : 0;
    }

    setPlayers(prev => {
      const newPlayers = prev.map((p, idx) => {
        if (idx === currentPlayerIndex) {
          const newScore = (p.score || 0) + (isCorrect ? question.bobot : 0);
          const newCount = (p.soalTerjawabCount || 0) + 1;
          const newAnswered = [...(p.answeredQuestionIds || []), question.id];
          const newStatus = newCount >= 25 ? 'spectator' : p.status;

          if (newCount >= 25 && p.type === 'human') {
            triggeredSpectatorNotice = true;
            setSpectatorPlayerName(p.name);
          }

          let finalPos = p.position;
          if (newStatus === 'spectator') {
            finalPos = 50;
          }

          return {
            ...p,
            score: newScore,
            soalTerjawabCount: newCount,
            answeredQuestionIds: newAnswered,
            activeQuestionId: null,
            status: newStatus,
            position: finalPos
          };
        }
        return p;
      });

      // Clear question states and close modal
      setActiveQuestion(null);
      setTypedAnswer('');
      setIsAnswerCorrect(null);
      setHasCheckedAnswer(false);
      setShowQuestionModal(false);

      const allFinished = newPlayers.every(p => p.status === 'spectator' || (p.soalTerjawabCount || 0) >= 25);

      const handleNextTurn = (playersState: Player[]) => {
        if (playersState.every(p => p.status === 'spectator' || (p.soalTerjawabCount || 0) >= 25)) {
          onFinishGame?.(playersState);
        } else {
          setShowDaduCard(true);
        }
      };

      if (allFinished) {
        // Jika semua pemain sudah habis jatahnya, langsung akhiri game tanpa popup penonton
        setTimeout(() => {
          handleNextTurn(newPlayers);
        }, 2500);
      } else if (triggeredSpectatorNotice) {
        setShowSpectatorPopup(true);
      } else {
        setTimeout(() => {
          handleNextTurn(newPlayers);
        }, 2500);
      }

      return newPlayers;
    });
  };

  const daduAnimY = useRef(new Animated.Value(800)).current;
  const textAnimX = useRef(new Animated.Value(-400)).current;

  // 1-minute question countdown timer
  useEffect(() => {
    if (!showQuestionModal || gameFinished || hasCheckedAnswer) return;

    // Diubah sementara menjadi 1 jam untuk keperluan styling
    setQuestionTimeLeft(60 * 60);

    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Question timeout: counts as incorrect answer
          setIsAnswerCorrect(false);
          setHasCheckedAnswer(true);
          setTypedAnswer("Wektune wis entek");
          SoundManager.playWrongSound();

          // Auto-advance setelah pop up timeout tampil selama 2 detik
          setTimeout(() => {
            handleAnswerSubmit("Wektune wis entek", activeQuestion!);
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showQuestionModal, hasCheckedAnswer, gameFinished, activeQuestion]);

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

  // Watch for game end explicitly when player state changes (from websocket)
  useEffect(() => {
    if (gameFinished || startCountdown !== null) return;
    const allFinished = players.every(p => p.status === 'spectator' || (p.soalTerjawabCount || 0) >= 25);
    if (allFinished) {
      setGameFinished(true);
      setShowDaduCard(false);
    }
  }, [players, gameFinished, startCountdown]);

  // Turn logic
  useEffect(() => {
    if (gameFinished || startCountdown !== null) return;

    // Check if both players have finished their 25 turns
    const allFinished = players.every(p => p.status === 'spectator' || (p.soalTerjawabCount || 0) >= 25);
    if (allFinished) {
      setGameFinished(true);
      setShowDaduCard(false);
      return;
    }

    const currentPlayer = players[currentPlayerIndex];

    // If current player is in spectator mode, skip immediately
    if (currentPlayer.status === 'spectator') {
      const nextTurn = (currentPlayerIndex + 1) % players.length;
      setCurrentPlayerIndex(nextTurn);
      return;
    }

    // Both players are playing locally, just show dadu card
    setShowDaduCard(true);
    setShowEnemyRollPopup(false);
  }, [currentPlayerIndex, gameFinished, startCountdown, colorIndex]);

  const handleRollDice = async () => {
    if (isRollingRef.current) return;

    isRollingRef.current = true;
    setIsRolling(true);

    let rolls = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 5) + 1);
      rolls++;

      if (rolls >= 10) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 5) + 1; // 1-5 as original
        setDiceValue(finalValue);
        isRollingRef.current = false;
        setIsRolling(false);
        handleDiceRollEnd(finalValue);
      }
    }, 100);
  };

  const handleDiceRollEnd = (roll: number) => {
    setShowEnemyRollPopup(false);
    setPlayerLastRolls(prev => {
      const newRolls = [...prev];
      newRolls[currentPlayerIndex] = roll;
      return newRolls;
    });

    const cp = players[currentPlayerIndex];

    const movePlayer = async () => {
      let current = cp.position;
      let target = current + roll;

      let finalTarget = target;
      let needLoopReset = false;

      if (target >= 50) {
        finalTarget = 50;
        needLoopReset = true;
      }

      // Move cell by cell to the target
      for (let i = current + 1; i <= finalTarget; i++) {
        SoundManager.playPawnMoveSound();
        setPlayers(prev => prev.map((p, idx) => idx === currentPlayerIndex ? { ...p, position: i } : p));
        await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED.STEP_DELAY_MS));
      }

      // If we hit or exceeded 50, jump back to 1
      if (needLoopReset) {
        await new Promise(resolve => setTimeout(resolve, 600));
        SoundManager.playPawnMoveSound();
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            const currentScore = p.score || 0;
            const newScore = Math.min(currentScore + 1, 100);
            return { ...p, position: 1, score: newScore };
          }
          return p;
        }));
        finalTarget = 1;
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      // Check for Snakes or Ladders (on final position, which is finalTarget)
      let finalPos = finalTarget;
      let hasSnakeOrLadder = false;
      if (SNAKES[finalTarget]) {
        finalPos = SNAKES[finalTarget];
        hasSnakeOrLadder = true;
      } else if (LADDERS[finalTarget]) {
        finalPos = LADDERS[finalTarget];
        hasSnakeOrLadder = true;
      }

      if (hasSnakeOrLadder) {
        await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED.SNAKE_LADDER_DELAY_MS));
        SoundManager.playPawnMoveSound();
        setPlayers(prev => prev.map((p, idx) => idx === currentPlayerIndex ? { ...p, position: finalPos } : p));
        await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED.SNAKE_LADDER_DELAY_MS + 100));
      }

      // Check if the landing tile has a question
      const hasQuestion = isKotakSoal(finalPos);
      const answeredCount = cp.soalTerjawabCount || 0;

      if (hasQuestion && answeredCount < 25) {
        const question = getNextQuestion(currentPlayerIndex);
        if (question) {
          // Delay 1.3 detik sebelum soal muncul
          await new Promise(resolve => setTimeout(resolve, 1300));

          // Lock active question
          setPlayers(prev => prev.map((p, idx) => idx === currentPlayerIndex ? { ...p, activeQuestionId: question.id } : p));
          setActiveQuestion(question);
          setTypedAnswer('');
          setIsAnswerCorrect(null);
          setHasCheckedAnswer(false);

          if (cp.type === 'human') {
            setShowQuestionModal(true);
          } else {
            setShowQuestionModal(false);
            // Simulate computer reading and answering silently
            setTimeout(() => {
              const isCorrect = Math.random() < 0.75; // 75% accuracy
              const possibleAnswers = question.kunciJawaban.split('/');
              const correctAns = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)].trim();

              const computerChoice = isCorrect
                ? correctAns
                : "mangan sego goreng/ luput/ salah tembung"; // simulated wrong answer

              handleAnswerSubmit(computerChoice, question, true);
            }, 2000);
          }
          return; // Pause turn transition until question is answered
        }
      }

      // If no question, continue next turn
      setShowDaduCard(true);
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
                <BackButton onPress={handleBackPress} />
              </View>

              <View style={styles.headerCenterContainer}>
                <View style={{ width: 140, height: 45, justifyContent: 'center' }}>
                  <Image source={require('../../assets/title_board/dolanan.png')} style={{ width: 140, height: 45 }} resizeMode="contain" />
                  <View style={{ position: 'absolute', left: 150 }}>
                    <Timeout isEnabled={!gameFinished} timeLeft={globalTimeLeft} />
                  </View>
                </View>
              </View>

              <View style={{ zIndex: 10, width: 40 }} />
            </View>

            {/* Main content body */}
            <View style={styles.contentBody}>
              <View style={styles.boardWrapper}>
                {/* Board Component */}
                <Board players={players} />



                {/* Bottom Player Dice = Pemain 1 */}
                <View style={styles.bottomDiceContainer}>
                  <Image source={getDiceImage(playerLastRolls[0])} style={styles.diceImage} resizeMode="contain" />
                </View>

                {/* Bottom Player Score (Pemain 1) */}
                <View style={styles.bottomScoreContainer}>
                  <Score
                    playerName={players[0].name}
                    score={players[0].score || 0}
                    avatarSource={getAvatarSource(players[0].avatarId)}
                    isTopPlayer={false}
                    soalTerjawabCount={players[0].soalTerjawabCount || 0}
                    status={players[0].status}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Section: Jembatan Illustration */}
          <View style={styles.bottomSection}>
            <Image
              source={BACKGROUND_IMAGES[bgIndex]}
              style={styles.cityImg}
              resizeMode="cover"
            />
          </View>

        </ScrollView>
      </ImageBackground>

      {/* Standalone Javanese Game Popups component */}
      <GamePopups
        showQuestionModal={showQuestionModal}
        activeQuestion={activeQuestion}
        typedAnswer={typedAnswer}
        setTypedAnswer={setTypedAnswer}
        hasCheckedAnswer={hasCheckedAnswer}
        setHasCheckedAnswer={setHasCheckedAnswer}
        isAnswerCorrect={isAnswerCorrect}
        setIsAnswerCorrect={setIsAnswerCorrect}
        questionTimeLeft={questionTimeLeft}
        currentPlayer={players[currentPlayerIndex]}
        isLocalTurn={true} // Selalu true karena kedua player main di device yang sama
        handleAnswerSubmit={handleAnswerSubmit}
        showSpectatorPopup={showSpectatorPopup}
        setShowSpectatorPopup={setShowSpectatorPopup}
        spectatorPlayerName={spectatorPlayerName}
        transitionTurn={() => setShowDaduCard(true)}
        gameFinished={gameFinished}
        endReason={endReason}
        players={players}
        localPlayerIndex={0}
        onBack={onBack}
        onFinishGame={onFinishGame}
        showExitConfirm={showExitConfirm}
        setShowExitConfirm={setShowExitConfirm}
        onConfirmExit={onBack}
      />

      {/* Center Dice Overlay with Dark Background (Fullscreen root level) */}
      {showDaduCard && startCountdown === null && players[currentPlayerIndex].type === 'human' && !showQuestionModal && !gameFinished && !showSpectatorPopup && (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', zIndex: 9998 }}>
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
              Wayahmu
            </Text>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: 0.85 }, { translateY: daduAnimY }], width: 315, height: 440, alignItems: 'center', justifyContent: 'center' }}>
            <Dadu
              value={diceValue}
              onRoll={handleRollDice}
              disabled={isRolling || (players[currentPlayerIndex]?.type as string) === 'computer'}
              colorIndex={colorIndex}
              avatarId={players[currentPlayerIndex].avatarId}
              batikId={players[currentPlayerIndex].batikId}
            />
          </Animated.View>
        </View>
      )}

      {/* 5-Second Javanese Start Countdown Overlay (Fullscreen root level) */}
      {startCountdown !== null && (
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <View style={{
            backgroundColor: '#FFECC0',
            borderColor: '#784B23',
            borderWidth: 4,
            borderRadius: 20,
            padding: 24,
            width: '85%',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 10,
          }}>
            <Text style={{
              fontSize: 22,
              fontFamily: 'Poppins-Bold',
              color: '#784B23',
              marginBottom: 10,
              textAlign: 'center',
            }}>
              Dolanan Bakal Dimulai...
            </Text>
            <Text style={{
              fontSize: 18,
              fontFamily: 'Poppins-Medium',
              color: '#4E2C0E',
              textAlign: 'center',
              marginVertical: 8,
            }}>
              {startCountdown === 5 ? 'Limo' :
                startCountdown === 4 ? 'Papat' :
                  startCountdown === 3 ? 'Telu' :
                    startCountdown === 2 ? 'Loro' :
                      startCountdown === 1 ? 'Siji' : 'Ayo Dolanan!'}
            </Text>
            <Text style={{
              fontSize: startCountdown === 0 ? 32 : 44,
              fontFamily: 'Poppins-Bold',
              color: '#E25C3D',
              textAlign: 'center',
            }}>
              {startCountdown > 0 ? startCountdown : '🎮'}
            </Text>
          </View>
        </View>
      )}

      {/* Turn Indicator Removed for Solo Mode */}

      {/* Force Back Button for Debugging */}
      <SoundTouchableOpacity
        disabled={true}
        style={{
          position: 'absolute',
          top: 40,
          left: 20,
          zIndex: 10000,
          backgroundColor: '#FF3366',
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: 'white',
          elevation: 5,
          opacity: 0,
        }}
        onPress={() => {
          console.log('[DEBUG] Force Back button pressed');
          onBack();
        }}
      >
        <Text style={{ color: 'white', fontFamily: 'Poppins-Bold', fontSize: 14 }}>
          BACK-FORCE
        </Text>
      </SoundTouchableOpacity>
    </View>
  );
}
