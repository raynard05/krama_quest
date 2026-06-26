/**
 * LoginScreen.tsx
 * Halaman login — hanya berisi logika dan JSX.
 * Untuk mengubah tampilan, edit: styles/LoginStyles.ts
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { loginUser } from '../../services/AuthService';
import type { UserAccount } from '../../services/AuthService';
import { Eye, EyeOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles, { EYE_SIZE } from '../../styles/auth/LoginStyles';

// ─── Props ───────────────────────────────────────────────────────────────────
interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function LoginScreen({ onNavigateToRegister, onLoginSuccess }: LoginScreenProps) {
  // State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);

  // Button press animation
  const btnScale = useRef(new Animated.Value(1)).current;
  const animateBtn = (toValue: number) => {
    Animated.spring(btnScale, { toValue, useNativeDriver: true, speed: 20, bounciness: 4 }).start();
  };

  // ── Login handler ──────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Asma pangguna lan tembung sandi kedah diisi.');
      return;
    }
    setLoading(true);
    try {
      const result = await loginUser(username.trim(), password);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message || 'Mlebet gagal. Cobi malih.');
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
      <ImageBackground
        source={require('../../assets/splash_screen/bg_splashs.webp')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Card */}
          <View style={styles.card}>

            {/* Logo */}
            <View style={styles.logoRow}>
              <Image source={require('../../assets/splash_screen/icon.webp')} style={styles.logoIcon} resizeMode="contain" />
              <Text style={styles.logoText}>Krama Quest</Text>
            </View>

            {/* Heading */}
            <Text style={styles.heading}>Login Krama Quest</Text>
            <Text style={styles.subheading}>Sadurunge diwiwiti, ayo ngisi iki sek ya.</Text>

            {/* Error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Field: Jeneng Pangguna */}
            <Text style={styles.label}>Jeneng Pangguna</Text>
            <View style={[styles.inputWrap, focusedField === 'username' && styles.inputWrapFocused]}>
              <TextInput
                style={styles.input}
                placeholder="Ketik jeneng pangguna…"
                placeholderTextColor="#A0A0B0"
                value={username}
                onChangeText={setUsername}
                maxLength={12}
                autoCapitalize="none"
                returnKeyType="next"
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* Field: Sandi */}
            <Text style={styles.label}>Sandi</Text>
            <View style={[styles.inputWrap, focusedField === 'password' && styles.inputWrapFocused]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Ketik sandi…"
                placeholderTextColor="#A0A0B0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(v => !v)} style={styles.eyeBtn} activeOpacity={0.7}>
                {passwordVisible
                  ? <EyeOff size={EYE_SIZE} color="#888899" strokeWidth={1.8} />
                  : <Eye size={EYE_SIZE} color="#888899" strokeWidth={1.8} />}
              </TouchableOpacity>
            </View>

            {/* Tombol Mlebu */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleLogin}
                activeOpacity={0.88}
                onPressIn={() => animateBtn(0.96)}
                onPressOut={() => animateBtn(1)}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Mlebu</Text>}
              </TouchableOpacity>
            </Animated.View>

          </View>

          {/* Link Row (terpisah secara JSX/CSS agar posisinya independen) */}
          <View style={styles.linkRow}>
            <Text style={styles.linkText}>durung nduweni akun? </Text>
            <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.75}>
              <Text style={styles.linkAccent}>Dhaftar</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Section: Hanya berisi ilustrasi kota di belakang */}
          <View style={styles.bottomSection}>
            <Image source={require('../../assets/login_assets/city_bottom2.webp')} style={styles.cityImg} resizeMode="cover" />
          </View>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  </KeyboardAvoidingView>
  );
}
