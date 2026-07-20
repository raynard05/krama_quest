/**
 * AuthService.ts
 * Handles login and register directly with Supabase Cloud
 * bypassing the local Express backend server.
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import * as Crypto from 'expo-crypto';

const SUPABASE_URL = 'https://jkszjoviywizcvdhwejz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_On_v0Dk0iH8532lOdoF2MQ_pe4BK9RO';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    detectSessionInUrl: false,
  },
});

export interface UserAccount {
  id: number;
  nama_lengkap: string;
  username: string;
  kelas: string;
  nomor_absen: number;
  created_at: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: UserAccount;
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export async function loginUser(username: string, kata_sandi: string): Promise<AuthResult> {
  try {
    if (!username || !kata_sandi) {
      return { success: false, message: 'Username lan kata sandi kedah diisi.' };
    }

    // Fetch user by username directly from Supabase user_account table
    const { data: user, error: fetchError } = await supabase
      .from('user_account')
      .select('id, nama_lengkap, username, kelas, nomor_absen, kata_sandi, created_at')
      .eq('username', username.trim())
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!user) {
      return { success: false, message: 'Asma pangguna boten kapanggih.' };
    }

    // Compare hashed password (supports both fast SHA256 and legacy bcrypt)
    let isMatch = false;
    if (user.kata_sandi.startsWith('$2a$') || user.kata_sandi.startsWith('$2b$') || user.kata_sandi.startsWith('$2y$')) {
      isMatch = await bcrypt.compare(kata_sandi, user.kata_sandi);
    } else {
      const salt = 'krama_quest_salt_';
      const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, salt + kata_sandi);
      isMatch = (hash === user.kata_sandi);
    }

    if (!isMatch) {
      return { success: false, message: 'Tembung sandi boten leres.' };
    }

    // Return user data without the hashed password
    const safeUser: UserAccount = {
      id: user.id,
      nama_lengkap: user.nama_lengkap,
      username: user.username,
      kelas: user.kelas,
      nomor_absen: user.nomor_absen,
      created_at: user.created_at,
    };

    return {
      success: true,
      message: 'Mlebet kasil.',
      user: safeUser,
    };
  } catch (err: any) {
    console.error('[AuthService] Login error:', err);
    return {
      success: false,
      message: `Login error: ${err.message || JSON.stringify(err)}`,
    };
  }
}

// ── REGISTER ──────────────────────────────────────────────────────────────────
export async function registerUser(payload: {
  nama_lengkap: string;
  username: string;
  kelas: string;
  nomor_absen: string;
  kata_sandi: string;
}): Promise<AuthResult> {
  try {
    const { nama_lengkap, username, kelas, nomor_absen, kata_sandi } = payload;

    if (!nama_lengkap || !username || !kelas || !nomor_absen || !kata_sandi) {
      return { success: false, message: 'Sedaya kolom kedah dipunisi.' };
    }

    // Check if username is already taken in the Supabase user_account table
    const { data: existing, error: checkError } = await supabase
      .from('user_account')
      .select('id')
      .eq('username', username.trim())
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      return { success: false, message: 'Asma pangguna sampun dipunginakaken.' };
    }

    // Hash the password natively using expo-crypto (Blazing fast!)
    const salt = 'krama_quest_salt_';
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      salt + kata_sandi
    );

    // Insert new user profile
    const { data: newUser, error: insertError } = await supabase
      .from('user_account')
      .insert([{
        nama_lengkap: nama_lengkap.trim(),
        username: username.trim(),
        kelas: kelas.trim(),
        nomor_absen: parseInt(nomor_absen, 10),
        kata_sandi: hashedPassword,
      }])
      .select('id, nama_lengkap, username, kelas, nomor_absen, created_at')
      .single();

    if (insertError) throw insertError;

    return {
      success: true,
      message: 'Akun kasil dipundamel.',
      user: newUser,
    };
  } catch (err: any) {
    console.error('[AuthService] Register error:', err);
    return {
      success: false,
      message: `Register error: ${err.message || JSON.stringify(err)}`,
    };
  }
}
