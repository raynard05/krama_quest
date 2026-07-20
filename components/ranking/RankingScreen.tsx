import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { UserAccount } from '../../services/AuthService';
import { RankingService, RankEntry } from '../../services/RankingService';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface RankingScreenProps {
  currentUser: (UserAccount & { avatarId?: string; avatarBgId?: string }) | null;
  onBackToHome: () => void;
}

const getAvatarSource = (avatarId: string) => {
  switch (avatarId) {
    case '1': return require('../../assets/profile-pic/1.webp');
    case '2': return require('../../assets/profile-pic/2.webp');
    case '3': return require('../../assets/profile-pic/3.webp');
    case '4': return require('../../assets/profile-pic/4.webp');
    case '5': return require('../../assets/profile-pic/5.webp');
    case '6': return require('../../assets/profile-pic/6.webp');
    case '7': return require('../../assets/profile-pic/7.webp');
    case '8': return require('../../assets/profile-pic/8.webp');
    case '9': return require('../../assets/profile-pic/9.webp');
    case '10': return require('../../assets/profile-pic/10.webp');
    case '11': return require('../../assets/profile-pic/11.webp');
    case '12': return require('../../assets/profile-pic/12.webp');
    case '13': return require('../../assets/profile-pic/13.webp');
    case '14': return require('../../assets/profile-pic/14.webp');
    case '15': return require('../../assets/profile-pic/15.webp');
    case '16': return require('../../assets/profile-pic/16.webp');
    case '17': return require('../../assets/profile-pic/17.webp');
    case '18': return require('../../assets/profile-pic/18.webp');
    case '19': return require('../../assets/profile-pic/19.webp');
    case '20': return require('../../assets/profile-pic/20.webp');
    case '21': return require('../../assets/profile-pic/21.webp');
    default: return require('../../assets/profile-pic/1.webp');
  }
};

export default function RankingScreen({ currentUser, onBackToHome }: RankingScreenProps) {
  const [loading, setLoading] = useState(true);
  const [rankedUsers, setRankedUsers] = useState<RankEntry[]>([]);
  const [latestUserRank, setLatestUserRank] = useState<RankEntry | null>(null);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start Trophy Animation
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 6000, // Slightly faster rotation
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          startRotation();
        }
      });
    };
    startRotation();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 20,
      useNativeDriver: true,
      delay: 500,
    }).start();

    // Fetch Data
    const loadRanking = async () => {
      if (currentUser?.kelas) {
        const ranks = await RankingService.getTopRanksByClass(currentUser.kelas);
        setRankedUsers(ranks);
      }
      if (currentUser?.id) {
        const latest = await RankingService.getLatestUserRank(currentUser.id);
        setLatestUserRank(latest);
      }
      setLoading(false);
    };

    loadRanking();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Calculate ranks
  const top3 = rankedUsers.slice(0, 3);
  let currentUserRankIndex = -1;

  if (currentUser) {
    currentUserRankIndex = rankedUsers.findIndex(r => r.user_account_id === currentUser.id);
  }

  const renderRankItem = (entry: RankEntry, rankNumber: number | string, isCurrentUser: boolean = false, isSmall: boolean = false) => {
    return (
      <View key={entry.user_account_id + (isSmall ? '_small' : '')} style={[styles.rankItem, isCurrentUser && styles.currentUserItem, isSmall && styles.smallRankItem]}>
        <View style={styles.rankLeft}>
          <Image
            source={getAvatarSource(entry.avatarId || '1')}
            style={[styles.avatar, isSmall && styles.smallAvatar]}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, isSmall && styles.smallUserName]} numberOfLines={1}>{entry.nama_user}</Text>
            <Text style={[styles.userScore, isSmall && styles.smallUserScore]}>Skor: {entry.poin}</Text>
          </View>
        </View>
        <Text style={[styles.rankNumber, isSmall && styles.smallRankNumber, { color: rankNumber === 1 ? '#FFD700' : rankNumber === 2 ? '#C0C0C0' : rankNumber === 3 ? '#CD7F32' : '#999' }]}>
          {rankNumber}
        </Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/splash_screen/bg_splashs.webp')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.raysContainer}>
        <Animated.View style={[styles.raysRotator, { transform: [{ rotate: spin }] }]}>
          {[...Array(8)].map((_, i) => (
            <View key={i} style={[styles.rayTriangle, {
              transform: [
                { rotate: `${i * 45}deg` },
                { translateY: -250 }
              ]
            }]} />
          ))}
        </Animated.View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Hebat!</Text>

        <Animated.View style={[styles.trophyContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Image
            source={require('../../assets/rangking/piala.png')}
            style={styles.trophy}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 50 }} />
          ) : (
            <>
              {top3.map((entry, index) => renderRankItem(entry, index + 1, entry.user_account_id === currentUser?.id))}

              {/* Tampilkan baris baru (skor terbaru) user sendiri jika tidak masuk top 3, dan agak kecilkan */}
              {latestUserRank && currentUserRankIndex > 2 && (
                <>
                  <View style={styles.divider} />
                  {renderRankItem(latestUserRank, currentUserRankIndex + 1, true, true)}
                </>
              )}
            </>
          )}
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={onBackToHome}>
          <Text style={styles.backBtnText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom City Asset */}
      <Image
        source={require('../../assets/dolanan_assets/jembatan.webp')}
        style={styles.bottomCity}
        resizeMode="cover"
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  raysContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    overflow: 'visible',
    opacity: 0.6,
    zIndex: 0,
  },
  raysRotator: {
    width: 600,
    height: 600,
    position: 'absolute',
    top: -70, // Diubah agar lebih ke bawah (mendekati 0)
    justifyContent: 'center',
    alignItems: 'center',
  },
  rayTriangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderTopWidth: 500,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(255, 255, 255, 0.96)',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 42,
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginTop: 20,
  },
  trophyContainer: {
    width: width * 0.6,
    height: width * 0.6,
    maxHeight: 250,
    marginVertical: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophy: {
    width: '100%',
    height: '100%',
  },
  listContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  currentUserItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#784B23',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#333',
  },
  userScore: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666',
  },
  rankNumber: {
    fontFamily: 'SquadaOne',
    fontSize: 48,
    marginLeft: 10,
  },
  divider: {
    height: 2,
    backgroundColor: '#dddddd3c',
    marginVertical: 10,
    borderStyle: 'dashed',
  },
  smallRankItem: {
    paddingVertical: 4,
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    marginRight: 10,
  },
  smallUserName: {
    fontSize: 14,
  },
  smallUserScore: {
    fontSize: 12,
  },
  smallRankNumber: {
    fontSize: 32,
    marginLeft: 8,
  },
  backBtn: {
    marginTop: 'auto',
    marginBottom: 80, // Space for bottom city
    backgroundColor: '#4A6FA5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  backBtnText: {
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    fontSize: 16,
  },
  bottomCity: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 300, // Adjust as needed
    zIndex: 1,
  }
});
