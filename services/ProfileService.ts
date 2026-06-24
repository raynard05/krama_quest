import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { supabase } from './AuthService';

const getBackendUrl = (): string => {
  // Replace this with your hosted production server URL (e.g. https://your-server.com)
  const PRODUCTION_SERVER_URL = 'http://192.168.1.30:3000'; 

  // If in production mode (released APK), use the hosted production server URL.
  if (!__DEV__) {
    return PRODUCTION_SERVER_URL;
  }

  // If in development mode (Expo Go), resolve the laptop's local IP dynamically.
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
  
  return PRODUCTION_SERVER_URL;
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
   * Times out after 2 seconds to prevent app lockups on unreachable servers,
   * falling back directly to Supabase client query.
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
      console.warn('[ProfileService] Server request failed, falling back to direct Supabase fetch:', err);
      
      // Direct client-side Supabase query fallback (fail-safe for standalone devices)
      try {
        const { data, error } = await supabase
          .from('profile_pic')
          .select('profile_pic_num')
          .eq('user_account_id', userId)
          .maybeSingle();

        if (error) throw error;
        return data ? String(data.profile_pic_num) : '1';
      } catch (dbErr) {
        console.warn('[ProfileService] Direct Supabase fetch failed:', dbErr);
        return '1';
      }
    }
  },

  /**
   * Updates the user's selected profile picture number.
   * Persists in Supabase and updates the Redis cache.
   * Times out after 2.5 seconds, falling back directly to Supabase client query.
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
      console.warn('[ProfileService] Server request failed, falling back to direct Supabase upsert:', err);
      
      // Direct client-side Supabase upsert fallback (fail-safe for standalone devices)
      try {
        const { error } = await supabase
          .from('profile_pic')
          .upsert({
            user_account_id: userId,
            profile_pic_num: parseInt(avatarId, 10),
            created_at: new Date()
          }, { onConflict: 'user_account_id' });

        if (error) throw error;
        return true;
      } catch (dbErr) {
        console.warn('[ProfileService] Direct Supabase upsert failed:', dbErr);
        return false;
      }
    }
  },
};
