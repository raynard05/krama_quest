import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert
} from 'react-native';
import { ArrowLeft, ChevronRight, Edit2 } from 'lucide-react-native';
import type { UserAccount } from '../../services/AuthService';
import { ProfileStyles as styles } from '../../styles/profile/ProfileStyles';
import { getAvatarSource } from './ProfileAvatars';

interface ProfileScreenProps {
  currentUser: (UserAccount & { avatarId?: string }) | null;
  onBack: () => void;
  onNavigateToHistory: () => void;
  onEditAvatar: () => void;
}

export default function ProfileScreen({
  currentUser,
  onBack,
  onNavigateToHistory,
  onEditAvatar
}: ProfileScreenProps) {
  
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
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <ArrowLeft color="#FFFFFF" size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
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

          {/* Stats Cards Row */}
          <View style={styles.statsRow}>
            {/* Stat 1: Materi */}
            <View style={styles.statCard}>
              <Image
                source={require('../../assets/dashboard_assets/materi.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Materi{"\n"}Rampung</Text>
            </View>

            {/* Stat 2: Latihan */}
            <View style={styles.statCard}>
              <Image
                source={require('../../assets/profile/clipboard-list-svgrepo-com 1.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Latihan{"\n"}Rampung</Text>
            </View>

            {/* Stat 3: Skor Rata-rata */}
            <View style={styles.statCard}>
              <Image
                source={require('../../assets/profile/star-svgrepo-com 1.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Skor{"\n"}Rata-rata</Text>
            </View>
          </View>

          {/* List Options */}
          <View style={styles.listContainer}>
            {/* Option 1: Riwayat Sinau */}
            <TouchableOpacity
              style={styles.listItem}
              onPress={onNavigateToHistory}
              activeOpacity={0.7}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <Image
                    source={require('../../assets/profile/history-svgrepo-com 1.png')}
                    style={styles.listIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.listItemText}>Riwayat Sinau</Text>
              </View>
              <ChevronRight color="#FFFFFF" size={20} />
            </TouchableOpacity>

            {/* Option 2: Pengaturan */}
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => handleInfoPress('Pengaturan', 'Fitur pengaturan badhe dipunbuka enggal!')}
              activeOpacity={0.7}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <Image
                    source={require('../../assets/profile/history-svgrepo-com 1.png')}
                    style={styles.listIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.listItemText}>Pengaturan</Text>
              </View>
              <ChevronRight color="#FFFFFF" size={20} />
            </TouchableOpacity>

            {/* Option 3: Bab Aplikasi */}
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => handleInfoPress('Bab Aplikasi', 'Krama Quest v1.0.0\n\nAplikasi pasinaon Basa Jawi Krama kangge tingkat SD/MI.')}
              activeOpacity={0.7}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>
                  <Image
                    source={require('../../assets/profile/history-svgrepo-com 1.png')}
                    style={styles.listIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.listItemText}>Bab Aplikasi</Text>
              </View>
              <ChevronRight color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
