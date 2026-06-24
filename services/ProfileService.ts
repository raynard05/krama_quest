import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBackendUrl = (): string => {
  // On Expo Go / Development
  let hostUri = Constants.expoConfig?.hostUri;
  
  if (!hostUri) {
    // Fallback search in manifest properties
    const manifest = (Constants as any).manifest || (Constants as any).manifest2;
    hostUri = manifest?.hostUri || manifest?.extra?.expoGoLaunchMetadata?.debuggerHost;
  }
  
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    // Check if it is a valid IPv4 address
    if (ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
      return `http://${ip}:3000`;
    }
  }
  
  // Default fallbacks for production build or emulator local debugging
  return Platform.select({
    android: 'http://10.0.2.2:3000',
    ios: 'http://localhost:3000',
    default: 'http://localhost:3000',
  }) as string;
};

const BACKEND_URL = getBackendUrl();

/**
 * ProfileService.ts
 * Manages fetching and updating user profile pictures via the backend server,
 * utilizing Supabase db storage and Redis caching.
 */
export const ProfileService = {
  /**
   * Fetches the user's selected profile picture number.
   * On cache HIT or Supabase fetch, returns the picture number as a string (e.g. "5").
   * Times out after 2 seconds to prevent app lockups on unreachable servers.
   */
  async fetchUserAvatar(userId: number): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout

    try {
      const response = await fetch(`${BACKEND_URL}/profile/avatar/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.profile_pic_num) {
        return String(result.profile_pic_num);
      }
      return '1'; // Default fallback
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('[ProfileService] Failed to fetch avatar, using default "1":', err);
      return '1';
    }
  },

  /**
   * Updates the user's selected profile picture number.
   * Persists in Supabase and updates the Redis cache.
   * Times out after 2.5 seconds to prevent interface freeze.
   */
  async updateUserAvatar(userId: number, avatarId: string): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5-second timeout

    try {
      const response = await fetch(`${BACKEND_URL}/profile/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          avatarNum: parseInt(avatarId, 10),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      return !!result.success;
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('[ProfileService] Failed to update avatar:', err);
      return false;
    }
  },
};

