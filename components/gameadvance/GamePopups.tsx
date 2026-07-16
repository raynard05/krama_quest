import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ImageBackground, Animated } from 'react-native';
import { Player, Soal } from '../../types';
import styles from './GamePopupsStyle';
import { checkAnswerCorrectness } from '../../constants';

const QUESTION_POPUP_IMG = require('../../assets/pop_up/question_popup1.png');
const CORRECT_POPUP_IMG = require('../../assets/pop_up/correct_popup.png');
const WRONG_POPUP_IMG = require('../../assets/pop_up/wrong_popup.png');
const TIMEOUT_POPUP_IMG = require('../../assets/pop_up/timeout_popup.png');

interface GamePopupsProps {
  // Question Modal
  showQuestionModal: boolean;
  activeQuestion: Soal | null;
  typedAnswer: string;
  setTypedAnswer: (text: string) => void;
  hasCheckedAnswer: boolean;
  setHasCheckedAnswer: (checked: boolean) => void;
  isAnswerCorrect: boolean | null;
  setIsAnswerCorrect: (correct: boolean | null) => void;
  questionTimeLeft: number;
  currentPlayer: Player;
  handleAnswerSubmit: (answer: string, question: Soal) => void;

  // Spectator Notice
  showSpectatorPopup: boolean;
  setShowSpectatorPopup: (show: boolean) => void;
  spectatorPlayerName: string;
  transitionTurn: () => void;

  // Game Finished
  gameFinished: boolean;
  endReason: 'normal' | 'timeout';
  players: Player[];
  onBack: () => void;
}

export default function GamePopups({
  showQuestionModal,
  activeQuestion,
  typedAnswer,
  setTypedAnswer,
  hasCheckedAnswer,
  setHasCheckedAnswer,
  isAnswerCorrect,
  setIsAnswerCorrect,
  questionTimeLeft,
  currentPlayer,
  handleAnswerSubmit,
  showSpectatorPopup,
  setShowSpectatorPopup,
  spectatorPlayerName,
  transitionTurn,
  gameFinished,
  endReason,
  players,
  onBack,
}: GamePopupsProps) {
  // Slide-in animation for result popup (correct/wrong/timeout)
  const slideAnim = useRef(new Animated.Value(-500)).current;

  useEffect(() => {
    if (hasCheckedAnswer) {
      slideAnim.setValue(-500);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 18,
        bounciness: 6,
      }).start();
    } else {
      slideAnim.setValue(-500);
    }
  }, [hasCheckedAnswer]);

  return (
    <>
      {/* Question Modal Dialog (With custom PNG asset backgrounds) */}
      {showQuestionModal && activeQuestion && (
        <View style={styles.modalOverlay}>
          <Animated.View style={[
            hasCheckedAnswer ? { transform: [{ translateX: slideAnim }] } : {}
          ]}>
          <ImageBackground
            source={
              !hasCheckedAnswer
                ? QUESTION_POPUP_IMG
                : typedAnswer === 'Wektune wis entek'
                  ? TIMEOUT_POPUP_IMG
                  : (isAnswerCorrect ? CORRECT_POPUP_IMG : WRONG_POPUP_IMG)
            }
            style={styles.popupBg}
            imageStyle={{ borderRadius: 24 }}
            resizeMode="contain"
          >
            {!hasCheckedAnswer && (
              <>
                <View style={[styles.modalHeader, { borderBottomColor: 'rgba(255,255,255,0.1)' }]}>
                  <View style={[
                    styles.levelBadge,
                    activeQuestion.tingkat === 'easy' ? styles.badgeEasy :
                      activeQuestion.tingkat === 'medium' ? styles.badgeMedium : styles.badgeHots
                  ]}>
                    <Text style={
                      activeQuestion.tingkat === 'easy' ? styles.badgeTextEasy :
                        activeQuestion.tingkat === 'medium' ? styles.badgeTextMedium : styles.badgeTextHots
                    }>
                      {activeQuestion.tingkat === 'easy' ? 'GAMPANG' :
                        activeQuestion.tingkat === 'medium' ? 'SEDENG' : 'HOTS'}
                    </Text>
                  </View>
                  <View style={styles.weightBadge}>
                    <Text style={styles.weightBadgeText}>Biji: {activeQuestion.bobot}</Text>
                  </View>
                </View>

                {/* 1-Minute Countdown Timer for Human Players */}
                {currentPlayer.type === 'human' && (
                  <View style={styles.popupTimerContainer}>
                    <Text style={styles.popupTimerText}>
                      ⏳ {String(Math.floor(questionTimeLeft / 60)).padStart(2, '0')}:{String(questionTimeLeft % 60).padStart(2, '0')}
                    </Text>
                  </View>
                )}

                {/* Info turn banner */}
                <Text style={{ color: '#fbff00ff', fontSize: 13, fontFamily: 'Poppins-Bold', marginBottom: 5 }}>
                  {currentPlayer.type === 'computer'
                    ? `Giliran ${currentPlayer.name} Mangsuli`
                    : `Wayahmu Mangsuli`}
                </Text>

                <View style={styles.questionContainer}>
                  <Text style={styles.questionText}>{activeQuestion.pertanyaan}</Text>
                </View>

                <View style={{ width: '100%', marginVertical: 5 }}>
                  <TextInput
                    style={styles.textInput}
                    value={typedAnswer}
                    onChangeText={setTypedAnswer}
                    placeholder={currentPlayer.type === 'computer' ? "Komputer lagi ngetik..." : "Tulis wangsulanmu..."}
                    placeholderTextColor="#999999"
                    editable={currentPlayer.type === 'human'}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Kirim Jawaban Button overlay for Humans (invisible, matches the pre-drawn asset button) */}
                {currentPlayer.type === 'human' && (
                  <TouchableOpacity
                    style={styles.invisibleSubmitButton}
                    onPress={() => {
                      const isCorrect = checkAnswerCorrectness(typedAnswer, activeQuestion.kunciJawaban);
                      setIsAnswerCorrect(isCorrect);
                      setHasCheckedAnswer(true);

                      // Auto-advance setelah pop up hasil tampil selama 2 detik
                      setTimeout(() => {
                        handleAnswerSubmit(typedAnswer, activeQuestion);
                      }, 2000);
                    }}
                  />
                )}
              </>
            )}

            {/* Feedback ditampilkan lewat aset CORRECT_POPUP_IMG / WRONG_POPUP_IMG */}
          </ImageBackground>
          </Animated.View>
        </View>
      )}

      {/* Spectator Notice Modal (Jatah 25 Soal Habis) */}
      {showSpectatorPopup && (
        <View style={styles.modalOverlay}>
          <ImageBackground source={WRONG_POPUP_IMG} style={styles.popupBg} imageStyle={{ borderRadius: 24 }}>
            <Text style={{ fontSize: 24, fontFamily: 'Poppins-Bold', color: '#FF5E62', marginBottom: 15, textAlign: 'center' }}>
              JATAH ENTEK!
            </Text>
            <Text style={{ fontSize: 15, color: '#FFF', textAlign: 'center', marginBottom: 25, fontFamily: 'Poppins-Medium', lineHeight: 22 }}>
              {spectatorPlayerName === 'Sabitul'
                ? 'Jatah pitakonmu wis entek! Kowe dadi penonton saiki.'
                : `${spectatorPlayerName} wis entek jatahe lan dadi penonton saiki.`}
            </Text>
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: '#FF5E62' }]}
              onPress={() => {
                setShowSpectatorPopup(false);
                setTimeout(() => {
                  transitionTurn();
                }, 100);
              }}
            >
              <Text style={styles.nextButtonText}>Ngerti / Lanjut</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      )}

      {/* Game Finished Summary Overlay (Javanese Win/Loss/Timeout) */}
      {gameFinished && (
        <View style={styles.modalOverlay}>
          <ImageBackground
            source={
              players[0].score! >= players[1].score!
                ? CORRECT_POPUP_IMG
                : WRONG_POPUP_IMG
            }
            style={styles.popupBg}
            imageStyle={{ borderRadius: 24 }}
          >
            <Text style={{ fontSize: 26, fontFamily: 'Poppins-Bold', color: '#FFF', marginBottom: 5, textAlign: 'center' }}>
              DOLANAN RAMPUNG!
            </Text>
            <Text style={{ fontSize: 13, color: '#E0EFFF', marginBottom: 15, textAlign: 'center', fontFamily: 'Poppins-Medium' }}>
              {endReason === 'timeout'
                ? 'Wektu dolanan wis entek! (30 Menit)'
                : 'Asil biji pungkasan siswa (1v1)'}
            </Text>

            {/* Results block */}
            <View style={{ width: '100%', marginBottom: 20 }}>
              {players.map((p, i) => (
                <View key={p.id} style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  padding: 12,
                  borderRadius: 12,
                  marginVertical: 4,
                  borderWidth: 1,
                  borderColor: p.score && p.score >= 70 ? '#39FF1450' : 'rgba(255,255,255,0.1)'
                }}>
                  <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold' }}>
                    {i === 0 ? '🙋' : '🤖'} {p.name}
                  </Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#00F2FE', fontSize: 16, fontWeight: 'bold' }}>
                      {p.score || 0} Biji
                    </Text>
                    <Text style={{ color: '#D0D0E0', fontSize: 10 }}>
                      Pitakon: {p.soalTerjawabCount || 0}/25
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Winner text banner in Javanese */}
            <Text style={{ color: '#39FF14', fontSize: 18, fontWeight: 'bold', fontFamily: 'Poppins-Bold', marginBottom: 15, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }}>
              {players[0].score === players[1].score
                ? '🤝 Asile Seri!'
                : (players[0].score! > players[1].score! ? '🎉 Kowe Menang!' : '😢 Kowe Kalah!')}
            </Text>

            <TouchableOpacity style={[styles.nextButton, { backgroundColor: '#BD00FF' }]} onPress={onBack}>
              <Text style={styles.nextButtonText}>Bali menyang Menu</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      )}
    </>
  );
}
