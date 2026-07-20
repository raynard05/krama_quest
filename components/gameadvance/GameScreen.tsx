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
  onBack: () => void;
  onFinishGame?: (players: Player[]) => void;
}

export default function GameScreen({
  currentUser,
  onBack,
  onFinishGame,
}: GameScreenProps) {
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const isRollingRef = useRef<boolean>(false);

  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [playerLastRolls, setPlayerLastRolls] = useState<number[]>([1, 1]);
  const [showDaduCard, setShowDaduCard] = useState(true);

  // Question Engine States
  const [activeQuestion, setActiveQuestion] = useState<Soal | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState<boolean>(false);
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(60);

  const [showSpectatorPopup, setShowSpectatorPopup] = useState<boolean>(false);
  const [spectatorPlayerName, setSpectatorPlayerName] = useState<string>('');
  const [endReason, setEndReason] = useState<'normal' | 'timeout'>('normal');

  // 5-second countdown at the start of the game
  const [startCountdown, setStartCountdown] = useState<number | null>(5);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [showEnemyRollPopup, setShowEnemyRollPopup] = useState<boolean>(false);
  const [bgIndex, setBgIndex] = useState<number>(0);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 30000);
    return () => clearInterval(bgInterval);
  }, []);

  const handleBackPress = () => {
    if (gameFinished) {
      onBack();
      return true;
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

  const transitionTurn = (updatedPlayers?: Player[]) => {
    const currentList = updatedPlayers || players;

    // Check if game end conditions met
    const allFinished = currentList.every(p => p.status === 'spectator' || (p.soalTerjawabCount || 0) >= 25);
    if (allFinished) {
      setGameFinished(true);
      setShowDaduCard(false);
      return;
    }

    let nextTurn = (currentPlayerIndex + 1) % currentList.length;

    // Skip spectators
    if (currentList[nextTurn].status === 'spectator') {
      nextTurn = (nextTurn + 1) % currentList.length;
    }

    setCurrentPlayerIndex(nextTurn);
    setColorIndex(prev => prev + 1);
  };

  const handleAnswerSubmit = (userInput: string, question: Soal, isComputer: boolean = false) => {
    const isCorrect = checkAnswerCorrectness(userInput, question.kunciJawaban, question.minimal_jawab_benar);
    let triggeredSpectatorNotice = false;

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

          return {
            ...p,
            score: newScore,
            soalTerjawabCount: newCount,
            answeredQuestionIds: newAnswered,
            activeQuestionId: null,
            status: newStatus
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

      if (triggeredSpectatorNotice) {
        setShowSpectatorPopup(true);
      } else {
        setTimeout(() => {
          transitionTurn(newPlayers);
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

    if (currentPlayer.type === 'human') {
      setShowDaduCard(true);
      setShowEnemyRollPopup(false);
    } else {
      setShowDaduCard(false);
      setShowEnemyRollPopup(true);
      // Auto-roll for computer
      const timer = setTimeout(() => {
        handleRollDice();
      }, 1500);
      return () => clearTimeout(timer);
    }
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
        setPlayers(prev => prev.map((p, idx) => idx === currentPlayerIndex ? { ...p, position: i } : p));
        await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED.STEP_DELAY_MS));
      }

      // If we hit or exceeded 50, jump back to 1
      if (needLoopReset) {
        await new Promise(resolve => setTimeout(resolve, 600));
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
      transitionTurn();
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
      {/* DEBUG TEST BUTTONS - JANGAN LUPA DIHAPUS SAAT PRODUCTION */}
      <View style={{ position: 'absolute', top: 60, right: 10, zIndex: 9999, elevation: 10, gap: 10 }}>
        <TouchableOpacity 
          style={{ backgroundColor: '#E25C3D', padding: 8, borderRadius: 8, borderWidth: 2, borderColor: '#FFF' }}
          onPress={() => {
            setPlayers(prev => prev.map((p, idx) => idx === 0 ? { ...p, soalTerjawabCount: 25, status: 'spectator' } : p));
            setSpectatorPlayerName(players[0].name);
            setShowSpectatorPopup(true);
          }}
        >
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Test User Penonton</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ backgroundColor: '#784B23', padding: 8, borderRadius: 8, borderWidth: 2, borderColor: '#FFF' }}
          onPress={() => {
            setPlayers(prev => prev.map((p, idx) => idx === 1 ? { ...p, soalTerjawabCount: 25, status: 'spectator' } : p));
            setSpectatorPlayerName(players[1].name);
            setShowSpectatorPopup(true);
          }}
        >
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Test Lawan Penonton</Text>
        </TouchableOpacity>
      </View>

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
                    <Timeout isEnabled={!gameFinished} onTimeUp={() => { setEndReason('timeout'); setGameFinished(true); }} />
                  </View>
                </View>
              </View>

              <View style={{ zIndex: 10, width: 40 }} />
            </View>

            {/* Main content body */}
            <View style={styles.contentBody}>
              <View style={styles.boardWrapper}>
                {/* Top Player Score (Wafi - Index 1 = Lawan) */}
                <View style={styles.topScoreContainer}>
                  <Score
                    playerName={players[1].name}
                    score={players[1].score || 0}
                    avatarSource={require('../../assets/profile-pic/2.webp')}
                    isTopPlayer={true}
                    soalTerjawabCount={players[1].soalTerjawabCount || 0}
                    status={players[1].status}
                  />
                </View>

                {/* Top Player Dice = Lawan (Index 1) */}
                <View style={styles.topDiceContainer}>
                  <Image source={getDiceImage(playerLastRolls[1])} style={styles.diceImage} resizeMode="contain" />
                </View>

                {/* Board Component */}
                <Board players={players} />



                {/* Bottom Player Dice = Device Player (Index 0) */}
                <View style={styles.bottomDiceContainer}>
                  <Image source={getDiceImage(playerLastRolls[0])} style={styles.diceImage} resizeMode="contain" />
                </View>

                {/* Bottom Player Score (Sabitul - Index 0 = Device Player) */}
                <View style={styles.bottomScoreContainer}>
                  <Score
                    playerName={players[0].name}
                    score={players[0].score || 0}
                    avatarSource={require('../../assets/profile-pic/1.webp')}
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
        handleAnswerSubmit={handleAnswerSubmit}
        showSpectatorPopup={showSpectatorPopup}
        setShowSpectatorPopup={setShowSpectatorPopup}
        spectatorPlayerName={spectatorPlayerName}
        transitionTurn={transitionTurn}
        gameFinished={gameFinished}
        endReason={endReason}
        players={players}
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

      {/* Enemy Rolling Popup */}
      {showEnemyRollPopup && startCountdown === null && !gameFinished && (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <View style={{
            width: '85%',
            backgroundColor: '#FFECC0',
            borderRadius: 20,
            padding: 24,
            borderWidth: 4,
            borderColor: '#784B23',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 10,
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#784B23',
              fontFamily: 'Poppins-Bold',
              textAlign: 'center'
            }}>
              Nengga mungsuh ngocak dadu
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
