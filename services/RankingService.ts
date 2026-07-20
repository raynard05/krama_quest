import { supabase } from './AuthService';
import { ProfileService } from './ProfileService';

export interface RankEntry {
  id?: number;
  user_account_id: number;
  nama_user: string;
  kelas: string;
  poin: number;
  created_at?: string;
  avatarId?: string; // Digunakan untuk UI
}

export const RankingService = {
  /**
   * Menyimpan skor permainan terbaru ke tabel rank.
   * Selalu membuat baris (row) baru setiap kali fungsi ini dipanggil (sesuai request).
   */
  async saveRank(userId: number, namaUser: string, kelas: string, poin: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rank')
        .insert({
          user_account_id: userId,
          nama_user: namaUser,
          kelas: kelas,
          poin: poin,
          created_at: new Date()
        });

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('[RankingService] Failed to save rank:', err);
      return false;
    }
  },

  /**
   * Mengambil peringkat berdasarkan kelas.
   * Menghitung nilai tertinggi (max poin) dari setiap user_account_id, 
   * lalu mengurutkannya untuk mendapatkan Top 3.
   * Juga mengambil profile_pic_num untuk avatar.
   */
  async getTopRanksByClass(kelas: string): Promise<RankEntry[]> {
    try {
      // 1. Ambil semua skor di kelas ini
      const { data, error } = await supabase
        .from('rank')
        .select('*')
        .eq('kelas', kelas);

      if (error) throw error;
      if (!data || data.length === 0) return [];

      // 2. Kelompokkan berdasarkan user_account_id dan ambil skor tertinggi
      const userMaxScores = new Map<number, RankEntry>();
      
      data.forEach((row: RankEntry) => {
        const existing = userMaxScores.get(row.user_account_id);
        if (!existing || row.poin > existing.poin) {
          userMaxScores.set(row.user_account_id, row);
        }
      });

      // 3. Urutkan berdasarkan skor terbesar
      let sortedRanks = Array.from(userMaxScores.values()).sort((a, b) => {
        if (b.poin !== a.poin) {
          return b.poin - a.poin;
        }
        return (a.id || 0) - (b.id || 0); // Tie breaker
      });

      // 4. Ambil profile picture (avatarId) untuk semua user yang masuk di ranking
      const { data: profileData, error: profileError } = await supabase
        .from('profile_pic')
        .select('user_account_id, profile_pic_num');

      if (!profileError && profileData) {
        const profileMap = new Map<number, string>();
        profileData.forEach(p => {
          profileMap.set(p.user_account_id, String(p.profile_pic_num || 1));
        });

        // Tempelkan avatarId ke data ranking
        sortedRanks = sortedRanks.map(rank => ({
          ...rank,
          avatarId: profileMap.get(rank.user_account_id) || '1'
        }));
      }

      return sortedRanks;
    } catch (err) {
      console.warn('[RankingService] Failed to get top ranks:', err);
      return [];
    }
  },

  /**
   * Mengambil hasil skor terbaru dari user yang baru saja bermain.
   */
  async getLatestUserRank(userId: number): Promise<(RankEntry & { playCount?: number }) | null> {
    try {
      // Get the latest row
      const { data, error } = await supabase
        .from('rank')
        .select('*')
        .eq('user_account_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error || !data) return null;

      // Get the total play count
      const { count } = await supabase
        .from('rank')
        .select('*', { count: 'exact', head: true })
        .eq('user_account_id', userId);

      const { data: profile } = await supabase
        .from('profile_pic')
        .select('profile_pic_num')
        .eq('user_account_id', userId)
        .single();

      return {
        ...data,
        avatarId: String(profile?.profile_pic_num || 1),
        playCount: count || 1
      };
    } catch (err) {
      console.warn('[RankingService] Failed to get latest rank:', err);
      return null;
    }
  }
};
