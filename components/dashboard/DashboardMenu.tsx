import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop, Path, Line, ClipPath, G, Image as SvgImage, Pattern } from 'react-native-svg';
import type { UserAccount } from '../../services/AuthService';
import styles from '../../styles/dashboard/DashboardStyles';
import DashboardMenuCard from './DashboardMenuCard';
import DashboardProfileModal from './DashboardProfileModal';
import DashboardCarousel from './DashboardCarousel';
import DashboardEnsiklopediaCard from './DashboardEnsiklopediaCard';
import { getAvatarSource, getBatikSource } from '../profile/ProfileAvatars';

interface DashboardMenuProps {
  currentUser: (UserAccount & { avatarId?: string; avatarBgId?: string }) | null;
  onSelectDolanan: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onSelectMateri: () => void;
  onSelectCpTp: () => void;
}

const ICONS = ['🦐', '🏆', '🐍', '📝', '🥇', '📖'];

export default function DashboardMenu({ currentUser, onSelectDolanan, onLogout, onOpenProfile, onSelectMateri, onSelectCpTp }: DashboardMenuProps) {
  const insets = useSafeAreaInsets();
  const [iconIndex, setIconIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Avatar rotation animation value (interactive hover/press)
  const avatarRotateVal = useRef(new Animated.Value(0)).current;

  // Spin animation value for the colorful ring (auto animation)
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animationLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3500,
        useNativeDriver: true,
      })
    );
    animationLoop.start();
    return () => animationLoop.stop();
  }, [spinAnim]);

  // Icon swap animation loop (scale down, swap, spring up)
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIconIndex((prev) => (prev + 1) % ICONS.length);

        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }).start();
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [scaleAnim]);

  const handleAvatarPress = () => {
    onOpenProfile();
  };

  const avatarRotate = avatarRotateVal.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '30deg'],
  });

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Use username for greeting and limit to 12 characters
  const rawDisplayName = currentUser?.username || 'User';
  const displayName = rawDisplayName.substring(0, 12);

  return (
    <View style={{ flex: 1, backgroundColor: '#0E101D' }}>
      <ImageBackground
        source={require('../../assets/splash_screen/bg_splashs.webp')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >

            {/* Header Row */}
            <View style={styles.header}>
              {/* Custom Gaming Split Background */}
              <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderBottomLeftRadius: 0, borderBottomRightRadius: 90, borderTopEndRadius: 90 }]}>
                <Svg width="100%" height="100%" viewBox="0 0 400 170" preserveAspectRatio="none">
                  <Defs>
                    <ClipPath id="leftClip">
                      <Path d="M 0,0 L 360,0 L 208,255 L 0,204 Z" />
                    </ClipPath>
                    <ClipPath id="rightClip">
                      <Path d="M 272,0 L 400,0 L 400,170 L 208,238 Z" />
                    </ClipPath>

                  </Defs>

                  {/* Left Background Area */}
                  <Path d="M 0,0 L 360,0 L 208,289 L 0,204 Z" fill="#55CDF4" />

                  {/* Left Side White Abstract Tech Abstractions */}
                  <G clipPath="url(#leftClip)">
                    {/* Subtle Diagonal Lines parallel to neon separator line */}
                    <Line x1="60" y1="0" x2="8" y2="170" stroke="#BFD9FD" strokeWidth="1.5" opacity="0.8" />
                    <Line x1="120" y1="0" x2="68" y2="170" stroke="#BFD9FD" strokeWidth="3" opacity="0.8" />
                    <Line x1="180" y1="0" x2="128" y2="170" stroke="#BFD9FD" strokeWidth="3" opacity="0.8" />
                    <Line x1="240" y1="0" x2="188" y2="170" stroke="#BFD9FD" strokeWidth="3" opacity="0.8" />
                    <Line x1="300" y1="0" x2="248" y2="170" stroke="#BFD9FD" strokeWidth="3" opacity="0.8" />
                    {/* Concentric tech circle accents on the far left */}
                    <Circle cx="-20" cy="85" r="34" stroke="#BFD9FD" strokeWidth="3" fill="none" opacity="0.06" />
                    <Circle cx="-20" cy="85" r="59" stroke="#BFD9FD" strokeWidth="3" fill="none" opacity="0.6" />
                    <Circle cx="-20" cy="85" r="85" stroke="#BFD9FD" strokeWidth="3" fill="none" opacity="0.4" strokeDasharray="5 5" />
                    <Circle cx="-20" cy="85" r="110" stroke="#BFD9FD" strokeWidth="3" fill="none" opacity="0.4" />



                  </G>

                  {/* Right Side Batik — full image clipped to right shape, no tiling */}
                  <G clipPath="url(#rightClip)">
                    <SvgImage
                      href={getBatikSource(currentUser?.avatarBgId || '1')}
                      x="208"
                      y="0"
                      width="250"
                      height="180"
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </G>

                  {/* Slanted Neon Separator Line */}
                  <Line x1="272" y1="0" x2="224" y2="175" stroke="#FF0844" strokeWidth="3" />
                </Svg>
              </View>
              <View style={styles.headerLeft}>
                <Text style={styles.greetingText}>Sugeng Rawuh,</Text>
                <Text style={styles.userNameText}>{displayName}!</Text>
              </View>

              <TouchableOpacity
                style={styles.avatarButton}
                onPress={handleAvatarPress}
                activeOpacity={0.8}
              >
                <View style={[styles.avatarRing, { backgroundColor: 'transparent', padding: 0 }]}>
                  {/* Rotating Rainbow SVG Ring */}
                  <Animated.View style={[
                    StyleSheet.absoluteFill,
                    { transform: [{ rotate: spin }] }
                  ]}>
                    <Svg width="100%" height="100%" viewBox="0 0 100 100">
                      <Defs>
                        <LinearGradient id="rainbowDashboard" x1="0%" y1="0%" x2="100%" y2="100%">
                          <Stop offset="0%" stopColor="#00F2FE" />
                          <Stop offset="25%" stopColor="#4FACFE" />
                          <Stop offset="50%" stopColor="#F355DA" />
                          <Stop offset="75%" stopColor="#FF0844" />
                          <Stop offset="100%" stopColor="#00F2FE" />
                        </LinearGradient>
                      </Defs>
                      <Circle
                        cx="50"
                        cy="50"
                        r="46.5"
                        fill="transparent"
                        stroke="url(#rainbowDashboard)"
                        strokeWidth="5"
                      />
                    </Svg>
                  </Animated.View>

                  {/* Inner White Base & Image */}
                  <View style={{
                    position: 'absolute',
                    top: 5,
                    left: 5,
                    right: 5,
                    bottom: 5,
                    borderRadius: 999,
                    backgroundColor: '#BFD9FD',
                    padding: 3,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Animated.Image
                      source={getAvatarSource(currentUser?.avatarId)}
                      style={[styles.avatarImage, { transform: [{ rotate: avatarRotate }] }]}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Animated Achievement Badge! */}
                  <Animated.View style={[
                    styles.badgeContainer,
                    { transform: [{ scale: scaleAnim }] }
                  ]}>
                    <Text style={styles.badgeText}>{ICONS[iconIndex]}</Text>
                  </Animated.View>
                </View>
              </TouchableOpacity>
            </View>



            <DashboardCarousel 
              onSelectDolanan={onSelectDolanan}
              onOpenProfile={onOpenProfile}
              onSelectMateri={onSelectMateri}
            />

            {/* Grid of Menu Cards */}
            <View style={styles.gridContainer}>
              <DashboardMenuCard
                type="materi"
                title="Materi"
                imageSource={require('../../assets/dashboard_assets/materi.png')}
                onPress={onSelectMateri}
              />
              <DashboardMenuCard
                type="dolanan"
                title="Dolanan"
                imageSource={require('../../assets/splash_screen/icon.webp')}
                onPress={onSelectDolanan}
              />
              <DashboardMenuCard
                type="cptp"
                title="CP & TP"
                imageSource={require('../../assets/dashboard_assets/cp.png')}
                onPress={onSelectCpTp}
              />
              <DashboardMenuCard
                type="evaluasi"
                title="Evaluasi"
                imageSource={require('../../assets/dashboard_assets/evaluasi.png')}
                onPress={() => {
                  // Temporarily disabled navigation
                }}
              />
            </View>

            {/* Ensiklopedia Button Below Grid */}
            <DashboardEnsiklopediaCard onPress={() => console.log('Ensiklopedia clicked')} />

          </ScrollView>
        </View>
      </ImageBackground>

      {/* Profile Modal: Kept in tree but not visible since visibility is set to false */}
      <DashboardProfileModal
        visible={false}
        onClose={() => { }}
        currentUser={currentUser}
        onLogout={() => { }}
      />

    </View>
  );
}
