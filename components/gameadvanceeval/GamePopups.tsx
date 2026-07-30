import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ImageBackground, Animated, Image } from 'react-native';
import { Player, Soal } from '../../types';
import styles from './GamePopupsStyle';
import { checkAnswerCorrectness } from '../../constants';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';
import { SoundManager } from '../../utils/SoundManager';

const QUESTION_POPUP_IMG = require('../../assets/pop_up/question_popup1.png');
const CORRECT_POPUP_IMG = require('../../assets/pop_up/correct_popup.png');
const WRONG_POPUP_IMG = require('../../assets/pop_up/wrong_popup.png');
const TIMEOUT_POPUP_IMG = require('../../assets/pop_up/timeout_popup.png');
import { getAvatarSource } from '../profile/ProfileAvatars';

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
  isLocalTurn: boolean;
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
  localPlayerIndex: number;
  onBack: () => void;
  onFinishGame?: (players: Player[]) => void;

  // Exit Confirm
  showExitConfirm: boolean;
  setShowExitConfirm: (show: boolean) => void;
  onConfirmExit: () => void;
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
  isLocalTurn,
  handleAnswerSubmit,
  showSpectatorPopup,
  setShowSpectatorPopup,
  spectatorPlayerName,
  transitionTurn,
  gameFinished,
  endReason,
  players,
  localPlayerIndex,
  onBack,
  onFinishGame,
  showExitConfirm,
  setShowExitConfirm,
  onConfirmExit,
}: GamePopupsProps) {
  // Slide-in animation for result popup (correct/wrong/timeout)
  const slideAnim = useRef(new Animated.Value(-500)).current;
  const [redirectCountdown, setRedirectCountdown] = useState<number>(10);

  useEffect(() => {
    if (gameFinished) {
      setRedirectCountdown(10);
      const timer = setInterval(() => {
        setRedirectCountdown(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameFinished]);

  useEffect(() => {
    if (gameFinished && redirectCountdown === 0) {
      if (onFinishGame) {
        onFinishGame(players);
      } else {
        onBack();
      }
    }
  }, [gameFinished, redirectCountdown, onFinishGame, onBack, players]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
                {isLocalTurn && (
                  <View style={styles.popupTimerContainer}>
                    <Text style={styles.popupTimerText}>
                      ⏳ {String(Math.floor(questionTimeLeft / 60)).padStart(2, '0')}:{String(questionTimeLeft % 60).padStart(2, '0')}
                    </Text>
                  </View>
                )}

                {/* Info turn banner */}
                <Text style={{ color: '#fbff00ff', fontSize: 13, fontFamily: 'Poppins-Bold', marginBottom: 5 }}>
                  {!isLocalTurn
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
                    placeholder={!isLocalTurn ? `${currentPlayer.name} lagi ngetik...` : "Tulis wangsulanmu..."}
                    placeholderTextColor="#999999"
                    editable={isLocalTurn}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Kirim Jawaban Button overlay for Humans (invisible, matches the pre-drawn asset button) */}
                {isLocalTurn && (
                  <SoundTouchableOpacity
                    style={styles.invisibleSubmitButton}
                    onPress={() => {
                      const isCorrect = checkAnswerCorrectness(typedAnswer, activeQuestion.kunciJawaban, activeQuestion.minimal_jawab_benar);
                      setIsAnswerCorrect(isCorrect);
                      setHasCheckedAnswer(true);

                      if (isCorrect) {
                        SoundManager.playCorrectSound();
                      } else {
                        SoundManager.playWrongSound();
                      }

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
          <View style={styles.exitConfirmContainer}>
            <Text style={styles.exitConfirmTitle}>JATAH ENTEK!</Text>
            <Text style={styles.exitConfirmText}>
              {spectatorPlayerName === 'Sabitul'
                ? 'Jatah pitakonmu wis entek! Kowe dadi penonton saiki.'
                : `${spectatorPlayerName} wis entek jatahe lan dadi penonton saiki.`}
            </Text>
            <SoundTouchableOpacity
              style={[styles.exitConfirmBtn, styles.exitConfirmBtnConfirm, { width: '100%', marginTop: 10, flex: undefined }]}
              onPress={() => {
                setShowSpectatorPopup(false);
                setTimeout(() => {
                  transitionTurn();
                }, 100);
              }}
            >
              <Text style={styles.exitConfirmBtnConfirmText}>Ngerti / Lanjut</Text>
            </SoundTouchableOpacity>
          </View>
        </View>
      )}

      {/* Game Finished Summary Overlay (Javanese Win/Loss/Timeout) */}
      {gameFinished && (
        <View style={styles.modalOverlay}>
          <View style={styles.exitConfirmContainer}>
            <Text style={styles.exitConfirmTitle}>DOLANAN RAMPUNG!</Text>
            <Text style={styles.exitConfirmText}>
              {endReason === 'timeout'
                ? 'Wektu dolanan wis entek! (30 Menit)'
                : `Asil biji pungkasan siswa (${players.length} Pemain)`}
            </Text>

            {/* Results block */}
            <View style={{ width: '100%', marginBottom: 20 }}>
              {players.map((p, i) => (
                <View key={p.id} style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(120, 75, 35, 0.1)',
                  padding: 12,
                  borderRadius: 12,
                  marginVertical: 4,
                  borderWidth: 1,
                  borderColor: p.score && p.score >= 70 ? '#4CAF50' : 'rgba(120,75,35,0.2)'
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image 
                      source={getAvatarSource(p.avatarId)}
                      style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8, borderWidth: 1, borderColor: '#784B23' }}
                      resizeMode="cover"
                    />
                    <Text style={{ color: '#4E2C0E', fontSize: 15, fontWeight: 'bold' }}>
                      {p.name}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#E25C3D', fontSize: 16, fontWeight: 'bold' }}>
                      {p.score || 0} Biji
                    </Text>
                    <Text style={{ color: '#784B23', fontSize: 10 }}>
                      Pitakon: {p.soalTerjawabCount || 0}/25
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Winner text banner in Javanese */}
            <Text style={{ color: '#E25C3D', fontSize: 18, fontWeight: 'bold', fontFamily: 'Poppins-Bold', marginBottom: 15, textAlign: 'center' }}>
              {(() => {
                const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
                const topScore = sorted[0]?.score || 0;
                const isTie = sorted.length > 1 && sorted[0].score === sorted[1].score && topScore > 0;
                const myScore = players[localPlayerIndex]?.score || 0;
                if (isTie && myScore === topScore) return '🤝 Kowe Seri ing Peringkat 1!';
                if (isTie) return '🤝 Asile Seri!';
                if (myScore === topScore && topScore > 0) return '🎉 Kowe Menang!';
                return `🎉 ${sorted[0]?.name || 'Pemain'} Menang!`;
              })()}
            </Text>

            <View style={[styles.nextButton, { backgroundColor: '#784B23', width: '100%' }]}>
              <Text style={[styles.nextButtonText, { fontSize: 14 }]}>
                Dialihake menyang Rangking: {formatTime(redirectCountdown)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.exitConfirmContainer}>
            <Text style={styles.exitConfirmTitle}>Konfirmasi</Text>
            <Text style={styles.exitConfirmText}>
              Punapa panjenengan yakin badhe medal saking game? Sesi game badhe dipungkasi.
            </Text>
            <View style={styles.exitConfirmButtonRow}>
              <SoundTouchableOpacity
                style={[styles.exitConfirmBtn, styles.exitConfirmBtnCancel]}
                onPress={() => setShowExitConfirm(false)}
              >
                <Text style={styles.exitConfirmBtnCancelText}>Batal</Text>
              </SoundTouchableOpacity>
              <SoundTouchableOpacity
                style={[styles.exitConfirmBtn, styles.exitConfirmBtnConfirm]}
                onPress={onConfirmExit}
              >
                <Text style={styles.exitConfirmBtnConfirmText}>Inggih</Text>
              </SoundTouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
