import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Animated, Easing } from 'react-native';

// Animated TouchableOpacity untuk bisa animate backgroundColor
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
import { getAvatarSource } from '../profile/ProfileAvatars';
import { getBatikSource } from '../profile/ProfileAvatars';
import { vw, rs, scaleFont, vh } from '../../utils/responsive';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';
import { SoundManager } from '../../utils/SoundManager';

interface DaduProps {
  value: number;
  onRoll: () => void;
  disabled?: boolean;
  avatarId?: string;
  batikId?: string;
  userName?: string;
  colorIndex?: number;
}

export default function Dadu({ value, onRoll, disabled = false, avatarId, userName, batikId, colorIndex = 0 }: DaduProps) {
  const [timeLeft, setTimeLeft] = useState(10);

  // ─── Shine sweep (original 3 lines) ──────────────────────────────────────
  const shinePosition = useRef(new Animated.Value(-410)).current;

  // ─── Card breathe pulse ───────────────────────────────────────────────────
  const cardPulse = useRef(new Animated.Value(1)).current;



  // ─── Border glow pulse ────────────────────────────────────────────────────
  const borderGlow = useRef(new Animated.Value(0.35)).current;

  // ─── Sparkle stars ───────────────────────────────────────────────────────
  const spark1 = useRef(new Animated.Value(0)).current;
  const spark2 = useRef(new Animated.Value(0)).current;
  const spark3 = useRef(new Animated.Value(0)).current;
  const spark4 = useRef(new Animated.Value(0)).current;

  // ─── Background color cycling (kuning→ungu→merah→hijau→pink) ──────────────────
  // PENTING: useNativeDriver: false karena ini animasi warna
  const colorAnim = useRef(new Animated.Value(0)).current;

  // ─── GIF snake animations (original) ─────────────────────────────────────
  const gifRotateAnim1 = useRef(new Animated.Value(0)).current;
  const gifRotateAnim2 = useRef(new Animated.Value(0)).current;
  const gifY1 = useRef(new Animated.Value(0)).current;
  const gifX1 = useRef(new Animated.Value(0)).current;
  const gifY2 = useRef(new Animated.Value(0)).current;

  // ─── Batik swing (original) ───────────────────────────────────────────────
  const batikSwingAnim1 = useRef(new Animated.Value(0)).current;
  const batikSwingAnim2 = useRef(new Animated.Value(0)).current;
  const batikAnimStarted = useRef(false);

  // Lock ref to prevent double-tap bugs
  const isLockedRef = useRef(false);

  useEffect(() => {
    if (!disabled) {
      isLockedRef.current = false;
    }
  }, [disabled]);

  const handleRollAction = () => {
    if (isLockedRef.current || disabled) return;
    isLockedRef.current = true;
    SoundManager.playDiceSound();
    onRoll();
  };

  useEffect(() => {
    if (disabled || isLockedRef.current) return;

    if (timeLeft <= 0) {
      setTimeLeft(10);
      handleRollAction();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, disabled]);

  useEffect(() => {
    // Original shine loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(shinePosition, {
          toValue: 440,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shinePosition, {
          toValue: -440,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(700),
      ])
    ).start();

    // Card breathe pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(cardPulse, {
          toValue: 1.04,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(cardPulse, {
          toValue: 1.0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Single diagonal glimmer — sweeps slowly every ~3.5s


    // Border glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderGlow, {
          toValue: 0.85,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(borderGlow, {
          toValue: 0.3,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Sparkle star 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(spark1, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(spark1, { toValue: 0, duration: 650, useNativeDriver: true }),
        Animated.delay(500),
      ])
    ).start();

    // Sparkle star 2 (offset)
    Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(spark2, { toValue: 1, duration: 550, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(spark2, { toValue: 0, duration: 550, useNativeDriver: true }),
        Animated.delay(700),
      ])
    ).start();

    // Sparkle star 3
    Animated.loop(
      Animated.sequence([
        Animated.delay(900),
        Animated.timing(spark3, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(spark3, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.delay(800),
      ])
    ).start();

    // Sparkle star 4
    Animated.loop(
      Animated.sequence([
        Animated.delay(1300),
        Animated.timing(spark4, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(spark4, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.delay(600),
      ])
    ).start();

    // Update color based on colorIndex prop
    Animated.timing(colorAnim, {
      toValue: colorIndex % 6,
      duration: 800,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

  }, [colorIndex]);

  // ─── handleTap: snake + batik animations only (onRoll handled by button) ──
  const handleTap = () => {
    // GIF 1: rotate +70deg lalu gerak ke bawah
    gifRotateAnim1.setValue(0);
    gifY1.setValue(0);
    gifX1.setValue(0);
    Animated.sequence([
      Animated.timing(gifRotateAnim1, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(gifY1, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]).start();

    // GIF 2: rotate -70deg
    gifRotateAnim2.setValue(0);
    Animated.timing(gifRotateAnim2, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();

    // Batik swing loop (sekali saja)
    if (!batikAnimStarted.current) {
      batikAnimStarted.current = true;

      Animated.loop(
        Animated.sequence([
          Animated.timing(batikSwingAnim1, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(batikSwingAnim1, { toValue: -1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(batikSwingAnim2, { toValue: -1, duration: 1000, useNativeDriver: true }),
          Animated.timing(batikSwingAnim2, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  };

  // ─── Interpolations (original) ────────────────────────────────────────────
  const gifSpin1 = gifRotateAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '70deg'],
  });

  const gifSpin2 = gifRotateAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-70.9deg'],
  });

  const gifY1anim = gifY1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const gifX1anim = gifX1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const batikTranslate1 = batikSwingAnim1.interpolate({
    inputRange: [-1, 1],
    outputRange: [-12, 12],
  });

  const batikTranslate2 = batikSwingAnim2.interpolate({
    inputRange: [-1, 1],
    outputRange: [-12, 12],
  });

  // ─── Render dots (original) ───────────────────────────────────────────────
  const renderDots = () => {
    const dotPatterns: Record<number, string[]> = {
      1: ['center'],
      2: ['topLeft', 'bottomRight'],
      3: ['topLeft', 'center', 'bottomRight'],
      4: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
      5: ['topLeft', 'topRight', 'center', 'bottomLeft', 'bottomRight'],

    };

    const pattern = dotPatterns[value] || [];

    return (
      <View style={styles.dotsContainer}>
        {/* Top Row */}
        <View style={styles.dotRow}>
          <View style={[styles.dot, pattern.includes('topLeft') && styles.dotVisible]} />
          <View style={[styles.dot, pattern.includes('topCenter') && styles.dotVisible]} />
          <View style={[styles.dot, pattern.includes('topRight') && styles.dotVisible]} />
        </View>
        {/* Middle Row */}
        <View style={styles.dotRow}>
          <View style={[styles.dot, pattern.includes('middleLeft') && styles.dotVisible]} />
          <View style={[styles.dot, pattern.includes('center') && styles.dotVisible]} />
          <View style={[styles.dot, pattern.includes('middleRight') && styles.dotVisible]} />
        </View>
        {/* Bottom Row */}
        <View style={styles.dotRow}>
          <View style={[styles.dot, pattern.includes('bottomLeft') && styles.dotVisible]} />
          <View style={[styles.dot, pattern.includes('bottomCenter') && styles.dotVisible]} />
          <View style={[styles.dot, pattern.includes('bottomRight') && styles.dotVisible]} />
        </View>
      </View>
    );
  };

  // ─── Color interpolations ──────────────────────────────────────────────────
  // urutan: kuning → ungu → merah → hijau muda → pink → (kembali ke kuning)
  const COLORS = ['#D4A200', '#7C3AED', '#DC2626', '#16A34A', '#DB2777', '#D4A200'];
  const cardBg = colorAnim.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5],
    outputRange: COLORS,
  });
  // Warna border sedikit lebih gelap
  const BORDER_COLORS = ['#9A7200', '#4C1D95', '#991B1B', '#065F46', '#9D174D', '#9A7200'];
  const outerBorderColor = colorAnim.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5],
    outputRange: BORDER_COLORS,
  });

  // ─── SparkStar helper component ───────────────────────────────────────────
  const SparkStar = ({ anim, style }: { anim: Animated.Value; style: object }) => {
    const scale = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.5, 0] });
    const opacity = anim.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 1, 1, 0] });
    return (
      <Animated.Text
        style={[
          styles.sparkStar,
          { opacity, transform: [{ scale }] },
          style,
        ]}
      >
        ✶
      </Animated.Text>
    );
  };

  return (
    <Animated.View
      style={[styles.outerDarkBlueLayer, { transform: [{ scale: cardPulse }] }]}
      onTouchStart={handleTap}
    >
      {/* Animated border glow ring — warna mengikuti tema */}
      <Animated.View pointerEvents="none" style={[styles.borderGlowRing, { opacity: borderGlow, borderColor: outerBorderColor }]} />

      <View style={styles.shineContainer}>
        {/* Animated background color wrapper */}
        <AnimatedTouchable
          style={[styles.daduContainer, { backgroundColor: cardBg }, disabled && styles.daduDisabled]}
          onPress={handleRollAction}
          disabled={disabled || isLockedRef.current}
          activeOpacity={1}
        >
          {/* Avatar Profile */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarRing}>
              <Image
                source={getAvatarSource(avatarId)}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Batik decorations */}
          <Animated.Image
            source={getBatikSource(batikId)}
            style={[styles.batikBackground]}
            resizeMode="cover"
          />
          <Animated.Image
            source={getBatikSource(batikId)}
            style={[styles.batikBackground2]}
            resizeMode="cover"
          />

          {/* User Name */}
          {userName && (
            <Text style={styles.userNameText} numberOfLines={1}>
              Giliran Kamu
            </Text>
          )}

          {/* Snake GIF — background warna mengikuti kartu */}
          <View>
            <Animated.Image
              source={require('../../assets/dolanan_assets/snake_motion2.gif')}
              style={[styles.snakegifcontainer, { backgroundColor: cardBg, transform: [{ rotate: gifSpin1 }] }]}
              resizeMode="contain"
            />
          </View>

          {/* Multi-layer Border: White → Black → Dice (original, no bounce) */}
          <View style={styles.whiteBorderLayer}>
            <View style={styles.blackBorderLayer}>
              <View style={styles.daduFace}>
                {renderDots()}
              </View>
            </View>
          </View>

          {/* Angka Dadu */}
          <Text style={styles.diceNumber}>{value}</Text>

          <Text style={styles.rollText}>
            {disabled ? 'Ditengga...' : `Ngocok dadu (${timeLeft} Detik)`}
          </Text>

          {/* Sparkle stars — pointerEvents none agar tidak ganggu roll */}
          <SparkStar anim={spark1} style={styles.sparkPos1} />
          <SparkStar anim={spark2} style={styles.sparkPos2} />
          <SparkStar anim={spark3} style={styles.sparkPos3} />
          <SparkStar anim={spark4} style={styles.sparkPos4} />
        </AnimatedTouchable>

        {/* Animated Shine Overlay — 3 Vertical Lines (original) */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.shineOverlay,
            { transform: [{ translateY: shinePosition }] },
          ]}
        >
          <View style={styles.shineLine} />
          <View style={[styles.shineLine, { top: 200 }]} />
          <View style={[styles.shineLine, { top: 400 }]} />
        </Animated.View>

        {/* Single diagonal glimmer sweep */}

      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Outer layer: Dark Blue border
  outerDarkBlueLayer: {
    width: 315,
    borderWidth: 0,
    borderColor: '#1a5a8f',
    borderRadius: 60,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.05 }],
  },
  borderGlowRing: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 65,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 4,
    borderColor: '#5ecfff',
    shadowColor: '#5ecfff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
    zIndex: 10,
  },
  shineContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 50,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 0,
    backgroundColor: '#ffffffff',
    width: '100%',
  },
  daduContainer: {
    backgroundColor: '#2976BF',
    height: 440,
    width: 300,
    borderWidth: 15,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    pointerEvents: 'none',
  },
  shineLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.41)',
    shadowColor: '#f4f4f46f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    borderWidth: 3.5,
    borderColor: '#ffffff32',
    borderRadius: 30,
    transform: [{ rotate: '15deg' }, { scale: 1.2 }],
  },
  glimmerOverlay: {
    position: 'absolute',
    top: -60,
    bottom: -60,
    left: -40,
    width: 70,
    zIndex: 6,
    pointerEvents: 'none',
  },
  glimmerGradient: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.22)',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    borderRadius: 40,
  },
  daduDisabled: {
    opacity: 1,
  },
  avatarContainer: {
    zIndex: 2,
    position: 'absolute',
    marginBottom: 8,
    marginTop: -290,
    right: 9,
  },
  avatarRing: {
    zIndex: 2,
    width: 90,
    height: 90,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userNameText: {
    position: 'absolute',
    zIndex: 2,
    fontSize: 19,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginTop: -150,
    paddingHorizontal: 10,
  },
  // White border layer around dice
  whiteBorderLayer: {
    padding: 6,
    borderRadius: 18,
  },
  // Black border layer around dice
  blackBorderLayer: {
    padding: 3,
    borderRadius: 15,
  },
  daduFace: {
    marginTop: 30,
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 1,
  },
  dotsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
  dotVisible: {
    backgroundColor: '#1F2937',
    borderRadius: 50,
  },
  rollText: {
    paddingTop: 5,
    fontSize: 19,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  diceNumber: {
    position: 'absolute',
    zIndex: 2,
    fontSize: 90,
    color: '#FFFFFF',
    fontFamily: 'SquadaOne',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 4,
    bottom: 10,
    right: 30,
  },
  snakegifcontainer: {
    zIndex: 2,
    width: 75,
    height: 75,
    marginTop: -110,
    left: -80,
    backgroundColor: '#2976BF',
    borderRadius: 30,
    transform: [{ rotate: '0deg' }],
  },
  batikBackground: {
    position: 'absolute',
    zIndex: 2,
    width: 150,
    height: 33.5,
    borderRadius: 2,
    borderWidth: 3.5,
    borderColor: '#ffff',
    bottom: 10,
    left: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  batikBackground2: {
    position: 'absolute',
    zIndex: 2,
    width: 150,
    height: 33.5,
    borderRadius: 2,
    borderWidth: 3.5,
    borderColor: '#ffff',
    bottom: 50,
    left: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  sparkStar: {
    position: 'absolute',
    zIndex: 9,
    fontSize: 20,
    color: '#FFE566',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    pointerEvents: 'none',
  },
  sparkPos1: { top: 28, left: 18 },
  sparkPos2: { top: 55, right: 16 },
  sparkPos3: { bottom: 85, left: 28 },
  sparkPos4: { top: 145, left: 58 },
});
