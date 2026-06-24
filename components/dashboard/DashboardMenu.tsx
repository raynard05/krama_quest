import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
}

export default function DashboardMenu({ currentUser, onSelectDolanan, onLogout, onOpenProfile }: DashboardMenuProps) {
  // Avatar rotation animation value
  const avatarRotateVal = useRef(new Animated.Value(0)).current;

  const handleAvatarPress = () => {
    onOpenProfile();
  };

  const avatarRotate = avatarRotateVal.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '30deg'],
  });

  // Extract first name for greeting
  const displayName = currentUser?.nama_lengkap
    ? currentUser.nama_lengkap.split(' ')[0]
    : (currentUser?.username || 'User');

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
              <View style={styles.avatarRing}>
                <Animated.Image
                  source={getAvatarSource(currentUser?.avatarId)}
                  style={[styles.avatarImage, { transform: [{ rotate: avatarRotate }] }]}
                  resizeMode="contain"
                />
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
              onPress={() => {
                // Temporarily disabled navigation
              }}
            />
            <DashboardMenuCard
              type="dolanan"
              title="Dolanan"
              imageSource={require('../../assets/dashboard_assets/dolanan.webp')}
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
        onClose={() => {}}
        currentUser={currentUser}
        onLogout={() => {}}
      />

    </SafeAreaView>
  );
}
