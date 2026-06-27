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

      // 2. Fetch directly from Supabase (both fields to pre-populate caches)
      const { data, error } = await supabase
        .from('profile_pic')
        .select('profile_pic_num, bg_num')
        .eq('user_account_id', userId)
        .maybeSingle();

      if (error) throw error;

      const avatarId = data && data.profile_pic_num !== null && data.profile_pic_num !== undefined ? String(data.profile_pic_num) : '1';
      const bgId = data && data.bg_num !== null && data.bg_num !== undefined ? String(data.bg_num) : '1';
      
      // Save to caches
      avatarCache[userId] = avatarId;
      avatarBgCache[userId] = bgId;
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

      // Get background from cache or default to 1
      const bgId = avatarBgCache[userId] || '1';

      // 2. Persist in Supabase directly
      const { error } = await supabase
        .from('profile_pic')
        .upsert({
          user_account_id: userId,
          profile_pic_num: parseInt(avatarId, 10),
          bg_num: parseInt(bgId, 10),
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
    try {
      // 1. Check local cache first
      if (avatarBgCache[userId]) {
        return avatarBgCache[userId];
      }

      // 2. Fetch directly from Supabase (both fields to pre-populate caches)
      const { data, error } = await supabase
        .from('profile_pic')
        .select('profile_pic_num, bg_num')
        .eq('user_account_id', userId)
        .maybeSingle();

      if (error) throw error;

      const avatarId = data && data.profile_pic_num !== null && data.profile_pic_num !== undefined ? String(data.profile_pic_num) : '1';
      const bgId = data && data.bg_num !== null && data.bg_num !== undefined ? String(data.bg_num) : '1';
      
      // Save to caches
      avatarCache[userId] = avatarId;
      avatarBgCache[userId] = bgId;
      return bgId;
    } catch (err) {
      console.warn('[ProfileService] Direct Supabase fetch BG failed, using default "1":', err);
      return '1';
    }
  },

  async updateUserAvatarBg(userId: number, avatarBgId: string): Promise<boolean> {
    try {
      // 1. Update cache immediately
      avatarBgCache[userId] = avatarBgId;

      // Get avatar from cache or default to 1
      const avatarId = avatarCache[userId] || '1';

      // 2. Persist in Supabase directly
      const { error } = await supabase
        .from('profile_pic')
        .upsert({
          user_account_id: userId,
          profile_pic_num: parseInt(avatarId, 10),
          bg_num: parseInt(avatarBgId, 10),
          created_at: new Date()
        }, { onConflict: 'user_account_id' });

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('[ProfileService] Direct Supabase upsert BG failed:', err);
      return false;
    }
  },
};
