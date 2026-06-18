/**
 * RegisterScreen.tsx
 * Halaman register — hanya berisi logika dan JSX.
 * Untuk mengubah tampilan, edit: styles/RegisterStyles.ts
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { registerUser } from '../services/AuthService';
import type { UserAccount } from '../services/AuthService';
import { Eye, EyeOff } from 'lucide-react-native';
import styles, { EYE_SIZE } from '../styles/RegisterStyles';

// ─── Props ───────────────────────────────────────────────────────────────────
interface RegisterScreenProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: (user: UserAccount) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function RegisterScreen({ onNavigateToLogin, onRegisterSuccess }: RegisterScreenProps) {
  // State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [kelas, setKelas] = useState('');
  const [noAbsen, setNoAbsen] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<'fullName' | 'username' | 'kelas' | 'noAbsen' | 'password' | null>(null);

  // Refs untuk pindah field via keyboard
  const usernameRef = useRef<TextInput>(null);
  const kelasRef = useRef<TextInput>(null);
  const absenRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // Button press animation
  const btnScale = useRef(new Animated.Value(1)).current;
  const animateBtn = (toValue: number) => {
    Animated.spring(btnScale, { toValue, useNativeDriver: true, speed: 20, bounciness: 4 }).start();
  };

  // ── Register handler ───────────────────────────────────────────────────────
  const handleRegister = async () => {
    setError('');
    if (!fullName.trim() || !username.trim() || !kelas.trim() || !noAbsen.trim() || !password.trim()) {
      setError('Sedaya kolom kedah dipunisi kanthi lengkap.');
      return;
    }
    if (password.length < 6) {
      setError('Tembung sandi minimal 6 karakter.');
      return;
    }
    setLoading(true);
    try {
      const result = await registerUser({
        nama_lengkap: fullName.trim(),
        username: username.trim(),
        kelas: kelas.trim(),
        nomor_absen: noAbsen.trim(),
        kata_sandi: password,
      });
      if (result.success && result.user) {
        onRegisterSuccess(result.user);
      } else {
        setError(result.message || 'Ndhaftar gagal. Cobi malih.');
      }
    } catch {
      setError('Boten saged nyambung dhateng server.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Card */}
        <View style={styles.card}>

          {/* Logo */}
          <View style={styles.logoRow}>
            <Image source={require('../assets/login_assets/krama_logo.png')} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Ndhaftar Akun</Text>
          <Text style={styles.subheading}>Jangkepi dhata ing andhap punika kagem miwiti dolanan.</Text>

          {/* Error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Field: Asma Jangkep */}
          <Text style={styles.label}>Asma Jangkep</Text>
          <View style={[styles.inputWrap, focusedField === 'fullName' && styles.inputWrapFocused]}>
            <TextInput
              style={styles.input}
              placeholder="Ketik asma jangkep…"
              placeholderTextColor="#A0A0B0"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => usernameRef.current?.focus()}
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Field: Asma Pangguna */}
          <Text style={styles.label}>Asma Pangguna</Text>
          <View style={[styles.inputWrap, focusedField === 'username' && styles.inputWrapFocused]}>
            <TextInput
              ref={usernameRef}
              style={styles.input}
              placeholder="Ketik asma pangguna…"
              placeholderTextColor="#A0A0B0"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => kelasRef.current?.focus()}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Field: Kelas */}
          <Text style={styles.label}>Kelas</Text>
          <View style={[styles.inputWrap, focusedField === 'kelas' && styles.inputWrapFocused]}>
            <TextInput
              ref={kelasRef}
              style={styles.input}
              placeholder="Tuladha: 7A"
              placeholderTextColor="#A0A0B0"
              value={kelas}
              onChangeText={setKelas}
              autoCapitalize="characters"
              returnKeyType="next"
              onSubmitEditing={() => absenRef.current?.focus()}
              onFocus={() => setFocusedField('kelas')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Field: No. Absen */}
          <Text style={styles.label}>No. Absen</Text>
          <View style={[styles.inputWrap, focusedField === 'noAbsen' && styles.inputWrapFocused]}>
            <TextInput
              ref={absenRef}
              style={styles.input}
              placeholder="Tuladha: 12"
              placeholderTextColor="#A0A0B0"
              value={noAbsen}
              onChangeText={setNoAbsen}
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              onFocus={() => setFocusedField('noAbsen')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Field: Tembung Sandi */}
          <Text style={styles.label}>Tembung Sandi</Text>
          <View style={[styles.inputWrap, focusedField === 'password' && styles.inputWrapFocused]}>
            <TextInput
              ref={passwordRef}
              style={[styles.input, { flex: 1 }]}
              placeholder="Min. 6 karakter…"
              placeholderTextColor="#A0A0B0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(v => !v)} style={styles.eyeBtn} activeOpacity={0.7}>
              {passwordVisible
                ? <EyeOff size={EYE_SIZE} color="#888899" strokeWidth={1.8} />
                : <Eye size={EYE_SIZE} color="#888899" strokeWidth={1.8} />}
            </TouchableOpacity>
          </View>

          {/* Tombol Ndhaftar */}
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleRegister}
              activeOpacity={0.88}
              onPressIn={() => animateBtn(0.96)}
              onPressOut={() => animateBtn(1)}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Ndhaftar</Text>}
            </TouchableOpacity>
          </Animated.View>

        </View>

        {/* Link Row (terpisah secara JSX/CSS agar posisinya independen) */}
        <View style={styles.linkRow}>
          <Text style={styles.linkText}>Sampun kagungan akun? </Text>
          <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.75}>
            <Text style={styles.linkAccent}>Mlebet</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Section: Hanya berisi ilustrasi kota di belakang */}
        <View style={styles.bottomSection}>
          <Image source={require('../assets/login_assets/city_bottom.webp')} style={styles.cityImg} resizeMode="cover" />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
