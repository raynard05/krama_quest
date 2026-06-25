import React, { useRef, useEffect } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import type { UserAccount } from '../../services/AuthService';
import styles from '../../styles/dashboard/DashboardStyles';
import DashboardMenuCard from './DashboardMenuCard';
import DashboardProfileModal from './DashboardProfileModal';
import { getAvatarSource } from '../profile/ProfileAvatars';

interface DashboardMenuProps {
  currentUser: (UserAccount & { avatarId?: string }) | null;
  onSelectDolanan: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onSelectMateri: () => void;
}

export default function DashboardMenu({ currentUser, onSelectDolanan, onLogout, onOpenProfile, onSelectMateri }: DashboardMenuProps) {
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
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/splash_screen/bg_splashs.webp')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header Row */}
          <View style={styles.header}>
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
                  backgroundColor: '#FFFFFF',
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
              </View>
            </TouchableOpacity>
          </View>

          {/* Mascot Banner */}
          <View style={styles.bannerContainer}>
            <View style={styles.bannerMain}>
              <Image
                source={require('../../assets/dashboard_assets/greeting2.png')}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>
          </View>

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
              onPress={() => {
                // Temporarily disabled navigation
              }}
            />
            <DashboardMenuCard
              type="cptp"
              title="CP & TP"
              imageSource={require('../../assets/dashboard_assets/cp.png')}
              onPress={() => {
                // Temporarily disabled navigation
              }}
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

        </ScrollView>
      </ImageBackground>

      {/* Profile Modal: Kept in tree but not visible since visibility is set to false */}
      <DashboardProfileModal
        visible={false}
        onClose={() => { }}
        currentUser={currentUser}
        onLogout={() => { }}
      />

    </SafeAreaView>
  );
}
