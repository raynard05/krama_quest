import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';

const STORAGE_KEY = '@backsound_enabled';
let soundInstance: AudioPlayer | null = null;
let buttonClickInstance: AudioPlayer | null = null;
let victoryInstance: AudioPlayer | null = null;
let diceInstance: AudioPlayer | null = null;
let correctInstance: AudioPlayer | null = null;
let wrongInstance: AudioPlayer | null = null;
let pawnInstance: AudioPlayer | null = null;
let isEnabled = true;

export const SoundManager = {
  async init() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      isEnabled = stored === null ? true : stored === 'true';

      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
      });

      // Preload sound effects
      buttonClickInstance = createAudioPlayer(require('../assets/audio/button_click.mp3'));
      buttonClickInstance.volume = 1.0;
      
      victoryInstance = createAudioPlayer(require('../assets/audio/victory.mp3'));
      victoryInstance.volume = 1.0;

      diceInstance = createAudioPlayer(require('../assets/audio/dice.mp3'));
      diceInstance.volume = 1.0;

      correctInstance = createAudioPlayer(require('../assets/audio/correct.mp3'));
      correctInstance.volume = 1.0;

      wrongInstance = createAudioPlayer(require('../assets/audio/wrong.mp3'));
      wrongInstance.volume = 1.0;

      pawnInstance = createAudioPlayer(require('../assets/audio/pawn.mp3'));
      pawnInstance.volume = 1.0;
    } catch (_) {}
  },

  async getIsEnabled(): Promise<boolean> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      isEnabled = stored === null ? true : stored === 'true';
    } catch (_) {}
    return isEnabled;
  },

  async setSoundEnabled(enabled: boolean) {
    try {
      isEnabled = enabled;
      await AsyncStorage.setItem(STORAGE_KEY, String(enabled));
      if (enabled) {
        await this.playBackgroundMusic();
      } else {
        await this.stopBackgroundMusic();
      }
    } catch (_) {}
  },

  playButtonClick() {
    if (!isEnabled || !buttonClickInstance) return;
    try {
      buttonClickInstance.seekTo(0);
      buttonClickInstance.play();
    } catch (_) {}
  },

  playVictorySound() {
    if (!isEnabled || !victoryInstance) return;
    try {
      victoryInstance.seekTo(0);
      victoryInstance.play();
    } catch (_) {}
  },

  playDiceSound() {
    if (!isEnabled || !diceInstance) return;
    try {
      diceInstance.seekTo(0);
      diceInstance.play();
    } catch (_) {}
  },

  playCorrectSound() {
    if (!isEnabled || !correctInstance) return;
    try {
      correctInstance.seekTo(0);
      correctInstance.play();
    } catch (_) {}
  },

  playWrongSound() {
    if (!isEnabled || !wrongInstance) return;
    try {
      wrongInstance.seekTo(0);
      wrongInstance.play();
    } catch (_) {}
  },

  playPawnMoveSound() {
    if (!isEnabled || !pawnInstance) return;
    try {
      pawnInstance.seekTo(0);
      pawnInstance.play();
    } catch (_) {}
  },

  async playBackgroundMusic() {
    if (!isEnabled) return;

    if (soundInstance) {
      if (!soundInstance.playing) {
        soundInstance.play();
      }
      return;
    }

    try {
      soundInstance = createAudioPlayer(require('../assets/audio/backsound.mp3'));
      soundInstance.loop = true;
      soundInstance.volume = 0.4;
      soundInstance.play();
    } catch (error) {
      console.warn('[SoundManager] playBackgroundMusic failed:', error);
    }
  },

  async stopBackgroundMusic() {
    if (soundInstance) {
      soundInstance.pause();
      soundInstance.release();
      soundInstance = null;
    }
  },

  async pauseBackgroundMusic() {
    if (soundInstance) {
      soundInstance.pause();
    }
  },
};
