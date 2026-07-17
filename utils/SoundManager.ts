import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';

const STORAGE_KEY = '@backsound_enabled';
let soundInstance: AudioPlayer | null = null;
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
