import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert
} from 'react-native';
import { ChevronRight, Edit2, History, Settings, Info } from 'lucide-react-native';
import type { UserAccount } from '../../services/AuthService';
import { ProfileStyles as styles } from '../../styles/profile/ProfileStyles';
import { getAvatarSource } from './ProfileAvatars';
import BackButton from '../BackButton';
import { ProgressService } from '../../services/ProgressService';

interface ProfileScreenProps {
  currentUser: (UserAccount & { avatarId?: string }) | null;
  onBack: () => void;
  onNavigateToHistory: () => void;
  onEditAvatar: () => void;
  onNavigateToSettings: () => void;
}

export default function ProfileScreen({
  currentUser,
  onBack,
  onNavigateToHistory,
  onEditAvatar,
  onNavigateToSettings,
}: ProfileScreenProps) {
  const [materiCount, setMateriCount] = useState(0);

  const loadMateriCount = useCallback(async () => {
    const visited = await ProgressService.getVisitedMateri();
    setMateriCount(visited.length);
  }, []);

  useEffect(() => {
    loadMateriCount();
  }, [loadMateriCount]);

  const displayName = currentUser?.nama_lengkap || 'Pemain Krama Quest';
  const schoolClass = currentUser?.kelas ? `Siswa Kelas ${currentUser.kelas}` : 'Siswa TK An Nur';

  const handleInfoPress = (title: string, msg: string) => {
    Alert.alert(title, msg, [{ text: 'Nggih' }]);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/splash_screen/bg_splashs.webp')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Custom Header */}
          <View style={styles.header}>
            <BackButton onPress={onBack} />
            <Image source={require('../../assets/title_board/profile.png')} style={{ width: 140, height: 45 }} resizeMode="contain" />
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Profile Details */}
          <View style={styles.profileInfoSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={onEditAvatar} activeOpacity={0.85}>
              <View style={styles.avatarRing}>
                <Image
                  source={getAvatarSource(currentUser?.avatarId)}
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.editBadge}>
                <Edit2 color="#1E6FE3" size={14} />
              </View>
            </TouchableOpacity>

            <Text style={styles.userNameText}>{displayName}</Text>
            <Text style={styles.userSubtitleText}>{schoolClass}</Text>
          </View>

          {/* Stats Card Unified */}
          <ImageBackground
            source={require('../../assets/texture/texture2.png')}
            style={styles.statsCardUnified}
            imageStyle={{ borderRadius: 24 }} // opacity set so it blends well as a texture
            resizeMode="cover"
          >
            {/* Stat 1: Materi */}
            <View style={styles.statCol}>
              <Image
                source={require('../../assets/dashboard_assets/materi.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <Text style={styles.statValue}>{materiCount}</Text>
              <Text style={styles.statLabel}>Materi Rampung</Text>
            </View>

            <View style={styles.statDivider} />

            {/* Stat 2: Latihan */}
            <View style={styles.statCol}>
              <Image
                source={require('../../assets/profile/clipboard_list.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Latihan Rampung</Text>
            </View>

            <View style={styles.statDivider} />

            {/* Stat 3: Skor Rata-rata */}
            <View style={styles.statCol}>
              <Image
                source={require('../../assets/profile/star.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Skor Rata-rata</Text>
            </View>
          </ImageBackground>

          {/* Options Card Unified */}
          <ImageBackground
            source={require('../../assets/texture/texture2.png')}
            style={styles.optionsCard}
            imageStyle={{ borderRadius: 23 }}
            resizeMode="cover"
          >
            {/* Option 1: Riwayat Sinau */}
            <TouchableOpacity
              style={styles.optionRow}
              onPress={onNavigateToHistory}
              activeOpacity={0.7}
            >
              <View style={styles.optionRowLeft}>
                <View style={styles.listIconWrapper}>
                  <History color="#00F2FE" size={18} />
                </View>
                <Text style={styles.optionRowText}>Riwayat Sinau</Text>
              </View>
              <ChevronRight color="rgba(255, 255, 255, 0.6)" size={20} />
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            {/* Option 2: Pengaturan */}
            <TouchableOpacity
              style={styles.optionRow}
              onPress={onNavigateToSettings}
              activeOpacity={0.7}
            >
              <View style={styles.optionRowLeft}>
                <View style={styles.listIconWrapper}>
                  <Settings color="#00F2FE" size={18} />
                </View>
                <Text style={styles.optionRowText}>Pengaturan</Text>
              </View>
              <ChevronRight color="rgba(255, 255, 255, 0.6)" size={20} />
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            {/* Option 3: Bab Aplikasi */}
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => handleInfoPress('Bab Aplikasi', 'Krama Quest v1.0.0\n\nAplikasi pasinaon Basa Jawi Krama kangge tingkat SD/MI.')}
              activeOpacity={0.7}
            >
              <View style={styles.optionRowLeft}>
                <View style={styles.listIconWrapper}>
                  <Info color="#00F2FE" size={18} />
                </View>
                <Text style={styles.optionRowText}>Bab Aplikasi</Text>
              </View>
              <ChevronRight color="rgba(255, 255, 255, 0.6)" size={20} />
            </TouchableOpacity>
          </ImageBackground>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
