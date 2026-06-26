import { supabase } from './AuthService';

// Client-side in-memory cache to reduce direct database queries
const avatarCache: Record<number, string> = {};
const avatarBgCache: Record<number, string> = {};

/**
 * ProfileService.ts
 * Manages fetching and updating user profile pictures directly with Supabase,
 * utilizing a client-side in-memory cache to avoid redundant database reads.
 */
export const ProfileService = {
  /**
   * Fetches the user's selected profile picture number from Supabase.
   * Hits the client-side memory cache first.
   */
  async fetchUserAvatar(userId: number): Promise<string> {
    try {
      // 1. Check local cache first
      if (avatarCache[userId]) {
        return avatarCache[userId];
      }

      // 2. Fetch directly from Supabase
      const { data, error } = await supabase
        .from('profile_pic')
        .select('profile_pic_num')
        .eq('user_account_id', userId)
        .maybeSingle();

      if (error) throw error;

      const avatarId = data ? String(data.profile_pic_num) : '1';
      
      // Save to cache
      avatarCache[userId] = avatarId;
      return avatarId;
    } catch (err) {
      console.warn('[ProfileService] Direct Supabase fetch failed, using default "1":', err);
      return '1';
    }
  },

  /**
   * Updates the user's selected profile picture number directly in Supabase.
   * Updates the local client-side memory cache immediately.
   */
  async updateUserAvatar(userId: number, avatarId: string): Promise<boolean> {
    try {
      // 1. Update cache immediately
      avatarCache[userId] = avatarId;

      // 2. Persist in Supabase directly
      const { error } = await supabase
        .from('profile_pic')
        .upsert({
          user_account_id: userId,
          profile_pic_num: parseInt(avatarId, 10),
          created_at: new Date()
        }, { onConflict: 'user_account_id' });

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('[ProfileService] Direct Supabase upsert failed:', err);
      return false;
    }
  },

  async fetchUserAvatarBg(userId: number): Promise<string> {
    if (avatarBgCache[userId]) {
      return avatarBgCache[userId];
    }
    return '1';
  },

  async updateUserAvatarBg(userId: number, avatarBgId: string): Promise<boolean> {
    avatarBgCache[userId] = avatarBgId;
    return true;
  },
};
