import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, X, BookOpen, Target, Award, User, ChevronRight } from 'lucide-react-native';
import type { UserAccount } from '../services/AuthService';

const { width } = Dimensions.get('window');

interface DashboardMenuProps {
  currentUser: UserAccount | null;
  onSelectDolanan: () => void;
  onLogout: () => void;
}

interface MenuCardProps {
  title: string;
  imageSource: any;
  onPress: () => void;
}

function MenuCard({ title, imageSource, onPress }: MenuCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const rotateVal = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // Start rotation to 30 degrees and scale down concurrently
    Animated.parallel([
      Animated.timing(rotateVal, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 0.92,
        useNativeDriver: true,
        speed: 30,
        bounciness: 2,
      }),
    ]).start(() => {
      // Small delay for user to visually process rotation tilt
      setTimeout(() => {
        // Reset scale and rotation back to default state
        Animated.parallel([
          Animated.timing(rotateVal, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 30,
            bounciness: 2,
          }),
        ]).start();

        // Trigger original navigation handler
        onPress();
      }, 100);
    });
  };

  const rotate = rotateVal.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '30deg'],
  });

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={styles.menuCard}
      >
        <Animated.Image
          source={imageSource}
          style={[styles.cardImage, { transform: [{ rotate }] }]}
          resizeMode="contain"
        />
        <Text style={styles.cardTitle}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function DashboardMenu({ currentUser, onSelectDolanan, onLogout }: DashboardMenuProps) {
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [materiModalVisible, setMateriModalVisible] = useState(false);
  const [cptpModalVisible, setCptpModalVisible] = useState(false);
  const [evalModalVisible, setEvalModalVisible] = useState(false);

  // Avatar rotation animation values
  const avatarRotateVal = useRef(new Animated.Value(0)).current;

  const handleAvatarPress = () => {
    Animated.timing(avatarRotateVal, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setProfileModalVisible(true);
      // Reset rotation back to 0
      Animated.timing(avatarRotateVal, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const avatarRotate = avatarRotateVal.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '30deg'],
  });

  // Extract first name for greeting
  const displayName = currentUser?.nama_lengkap
    ? currentUser.nama_lengkap.split(' ')[0]
    : (currentUser?.username || 'User');

  // Animated cards helper removed and replaced with standalone MenuCard component

  return (
    <SafeAreaView style={styles.container}>
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
                source={require('../assets/dashboard_assets/usericon2.png')}
                style={[styles.avatarImage, { transform: [{ rotate: avatarRotate }] }]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Mascot Banner (Stacked Comic Card Effect) */}
        <View style={styles.bannerContainer}>
          {/* Shadow Layers */}


          {/* Main Comic Card */}
          <View style={styles.bannerMain}>
            <Image
              source={require('../assets/dashboard_assets/greeting2.png')}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Grid of Menu Cards */}
        <View style={styles.gridContainer}>
          <MenuCard title="Materi" imageSource={require('../assets/dashboard_assets/materi.png')} onPress={() => setMateriModalVisible(true)} />
          <MenuCard title="Dolanan" imageSource={require('../assets/dashboard_assets/dolanan.webp')} onPress={onSelectDolanan} />
          <MenuCard title="CP & TP" imageSource={require('../assets/dashboard_assets/cp.png')} onPress={() => setCptpModalVisible(true)} />
          <MenuCard title="Evaluasi" imageSource={require('../assets/dashboard_assets/evaluasi.png')} onPress={() => setEvalModalVisible(true)} />
        </View>

      </ScrollView>

      {/* ── PROFILE MODAL ──────────────────────────────────────────────────────── */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Profil Panjenengan</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)} style={styles.closeButton}>
                <X color="#1C1C1E" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileDetailsCard}>
              <Image
                source={require('../assets/dashboard_assets/usericon2.png')}
                style={styles.largeAvatar}
              />
              <Text style={styles.profileName}>{currentUser?.nama_lengkap || 'Wafi'}</Text>
              <Text style={styles.profileUsername}>@{currentUser?.username || 'wafi'}</Text>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Kelas</Text>
                <Text style={styles.infoValue}>{currentUser?.kelas || '5-A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nomor Absen</Text>
                <Text style={styles.infoValue}>{currentUser?.nomor_absen || '12'}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                setProfileModalVisible(false);
                onLogout();
              }}
            >
              <LogOut color="#FFF" size={20} style={{ marginRight: 8 }} />
              <Text style={styles.logoutText}>Metu saka Akun</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── MATERI MODAL ───────────────────────────────────────────────────────── */}
      <Modal
        visible={materiModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMateriModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.largeModalContent]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <BookOpen color="#45B6E8" size={24} style={{ marginRight: 8 }} />
                <Text style={styles.modalHeaderText}>Unggah-Ungguh Basa</Text>
              </View>
              <TouchableOpacity onPress={() => setMateriModalVisible(false)} style={styles.closeButton}>
                <X color="#1C1C1E" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              <Text style={styles.materiIntro}>
                Unggah-ungguh basa inggih menika pranatan tindak-tanduk antawisipun tiyang setunggal dhumateng tiyang sanes ngginakaken basa Jawi ingkang leres lan trep.
              </Text>

              {/* Ngoko Lugu */}
              <View style={[styles.materiCard, { borderLeftColor: '#45B6E8' }]}>
                <Text style={styles.materiTitle}>1. Ngoko Lugu</Text>
                <Text style={styles.materiDesc}>
                  Digunakake kanggo kanca sing wis akrab (padha umure) utawa wong tuwa marang wong enom. Tembung-tembunge ngoko kabeh.
                </Text>
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleLabel}>Tuladha:</Text>
                  <Text style={styles.exampleText}>"Kowe arep lunga menyang ngendi, Ton?"</Text>
                </View>
              </View>

              {/* Ngoko Alus */}
              <View style={[styles.materiCard, { borderLeftColor: '#BD00FF' }]}>
                <Text style={styles.materiTitle}>2. Ngoko Alus</Text>
                <Text style={styles.materiDesc}>
                  Digunakake kanggo kanca akrab nanging kepengin ngajeni (umpamane marang sedulur utawa kanca sing pangkate luwih dhuwur). Tembunge ngoko campuran krama alus.
                </Text>
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleLabel}>Tuladha:</Text>
                  <Text style={styles.exampleText}>"Panjenengan arep tindak menyang ngendi, Mas?"</Text>
                </View>
              </View>

              {/* Krama Lugu */}
              <View style={[styles.materiCard, { borderLeftColor: '#FF9F43' }]}>
                <Text style={styles.materiTitle}>3. Krama Lugu</Text>
                <Text style={styles.materiDesc}>
                  Digunakake marang wong sing kudu diajeni nanging wis rada akrab, utawa kahanan resmi. Tembung-tembunge krama lugu (ora nganggo krama alus/tindak/dhahar).
                </Text>
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleLabel}>Tuladha:</Text>
                  <Text style={styles.exampleText}>"Sampeyan bade kesah dhateng pundi, Kang?"</Text>
                </View>
              </View>

              {/* Krama Alus */}
              <View style={[styles.materiCard, { borderLeftColor: '#10AC84' }]}>
                <Text style={styles.materiTitle}>4. Krama Alus</Text>
                <Text style={styles.materiDesc}>
                  Digunakake kanggo ngajeni wong sing luwih tuwa utawa luwih dhuwur derajate (murid marang guru, anak marang wong tuwa). Tembung-tembunge krama alus kabeh.
                </Text>
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleLabel}>Tuladha:</Text>
                  <Text style={styles.exampleText}>"Panjenengan bade tindak dhateng pundi, Pak?"</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── CP & TP MODAL ──────────────────────────────────────────────────────── */}
      <Modal
        visible={cptpModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCptpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.largeModalContent]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Target color="#FF3366" size={24} style={{ marginRight: 8 }} />
                <Text style={styles.modalHeaderText}>CP & TP Pasinaon</Text>
              </View>
              <TouchableOpacity onPress={() => setCptpModalVisible(false)} style={styles.closeButton}>
                <X color="#1C1C1E" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              <View style={styles.cptpSection}>
                <Text style={styles.cptpHeader}>Capaian Pembelajaran (CP)</Text>
                <View style={styles.cptpCard}>
                  <Text style={styles.cptpText}>
                    Peserta didik mampu memahami ragam bahasa Jawa miturut unggah-ungguh basa (Ngoko Lugu, Ngoko Alus, Krama Lugu, lan Krama Alus) serta menggunakannya secara lisan maupun tertulis untuk berkomunikasi secara sopan santun dalam kehidupan keluarga maupun masyarakat sekolah.
                  </Text>
                </View>
              </View>

              <View style={styles.cptpSection}>
                <Text style={styles.cptpHeader}>Tujuan Pembelajaran (TP)</Text>

                <View style={styles.tpRow}>
                  <View style={styles.tpNumber}><Text style={styles.tpNumText}>1</Text></View>
                  <Text style={styles.tpText}>Mengidentifikasi perbedaan ciri kebahasaan ragam Ngoko Lugu, Ngoko Alus, Krama Lugu, dan Krama Alus.</Text>
                </View>

                <View style={styles.tpRow}>
                  <View style={styles.tpNumber}><Text style={styles.tpNumText}>2</Text></View>
                  <Text style={styles.tpText}>Menganalisis penggunaan ragam bahasa Jawa berdasarkan tingkatan usia, status sosial, dan tingkat keakraban pembicara.</Text>
                </View>

                <View style={styles.tpRow}>
                  <View style={styles.tpNumber}><Text style={styles.tpNumText}>3</Text></View>
                  <Text style={styles.tpText}>Menerapkan kosakata krama alus dalam percakapan sehari-hari bersama guru dan orang tua melalui simulasi dolanan Ular Tangga.</Text>
                </View>

                <View style={styles.tpRow}>
                  <View style={styles.tpNumber}><Text style={styles.tpNumText}>4</Text></View>
                  <Text style={styles.tpText}>Mengevaluasi pemahaman pribadi terkait sopan santun berbahasa melalui soal uji kompetensi krama.</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── EVALUASI MODAL ─────────────────────────────────────────────────────── */}
      <Modal
        visible={evalModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEvalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.largeModalContent]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Award color="#FFC107" size={24} style={{ marginRight: 8 }} />
                <Text style={styles.modalHeaderText}>Hasil Evaluasi</Text>
              </View>
              <TouchableOpacity onPress={() => setEvalModalVisible(false)} style={styles.closeButton}>
                <X color="#1C1C1E" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>

              {/* Progress Summary */}
              <View style={styles.statsPanel}>
                <View style={styles.statBox}>
                  <Text style={styles.statNum}>85%</Text>
                  <Text style={styles.statLabel}>Progres</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNum}>92</Text>
                  <Text style={styles.statLabel}>Nilai Rata2</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNum}>4/5</Text>
                  <Text style={styles.statLabel}>Kuis</Text>
                </View>
              </View>

              <Text style={styles.cptpHeader}>Riwayat Uji Kompetensi</Text>

              {/* Quiz Items */}
              <View style={styles.quizList}>
                <View style={styles.quizItem}>
                  <View style={styles.quizInfo}>
                    <Text style={styles.quizTitle}>Kuis 1: Ngoko Lugu</Text>
                    <Text style={styles.quizDate}>Selesai: 14 Juni 2026</Text>
                  </View>
                  <View style={[styles.scoreBadge, styles.scoreGreen]}>
                    <Text style={styles.scoreText}>100</Text>
                  </View>
                </View>

                <View style={styles.quizItem}>
                  <View style={styles.quizInfo}>
                    <Text style={styles.quizTitle}>Kuis 2: Ngoko Alus</Text>
                    <Text style={styles.quizDate}>Selesai: 15 Juni 2026</Text>
                  </View>
                  <View style={[styles.scoreBadge, styles.scoreGreen]}>
                    <Text style={styles.scoreText}>90</Text>
                  </View>
                </View>

                <View style={styles.quizItem}>
                  <View style={styles.quizInfo}>
                    <Text style={styles.quizTitle}>Kuis 3: Krama Lugu</Text>
                    <Text style={styles.quizDate}>Selesai: 16 Juni 2026</Text>
                  </View>
                  <View style={[styles.scoreBadge, styles.scoreYellow]}>
                    <Text style={styles.scoreText}>80</Text>
                  </View>
                </View>

                <View style={styles.quizItem}>
                  <View style={styles.quizInfo}>
                    <Text style={styles.quizTitle}>Kuis 4: Krama Alus</Text>
                    <Text style={styles.quizDate}>Selesai: Hari ini</Text>
                  </View>
                  <View style={[styles.scoreBadge, styles.scoreGreen]}>
                    <Text style={styles.scoreText}>95</Text>
                  </View>
                </View>

                <View style={styles.quizItem}>
                  <View style={styles.quizInfo}>
                    <Text style={styles.quizTitle}>Ujian Akhir Semester Jawi</Text>
                    <Text style={[styles.quizDate, { color: '#FF3366', fontWeight: 'bold' }]}>Belum Dikerjakan</Text>
                  </View>
                  <TouchableOpacity style={styles.quizStartBtn}>
                    <Text style={styles.quizStartBtnText}>Mulai</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5ECF4', // Light blue-grey background matching screenshot
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 16,

  },
  headerLeft: {
    flex: 1,

  },
  greetingText: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'Poppins-Medium',
  },
  userNameText: {
    fontSize: 28,
    color: '#000000',
    fontFamily: 'Poppins-Bold',
    marginTop: -2,
  },
  avatarButton: {
    marginLeft: 15,
    borderColor: "#2dc9d7ff",
    borderWidth: 20,
    borderRadius: 30,
    borderStartStartRadius: 60,
  },
  avatarRing: {
    width: 60,
    height: 60,
    backgroundColor: "#ceeaedff",
    borderRadius: 20,
    borderStartStartRadius: 50,
    padding: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',


  },
  bannerContainer: {
    width: '100%',
    height: 210,
    position: 'relative',
    marginBottom: 24,
  },
  bannerShadow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bannerShadowBlack: {

    top: 8,
    left: 8,
  },
  bannerShadowBlue: {

    top: 8,
    left: -8,
  },
  bannerMain: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',


    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  cardWrapper: {
    width: '47%',
    marginBottom: 16,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,

    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1C1C1E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    aspectRatio: 1.0,
  },
  cardImage: {
    width: 85,
    height: 85,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'stretch',
  },
  largeModalContent: {
    width: '95%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingBottom: 12,
  },
  modalHeaderText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1C1C1E',
  },
  closeButton: {
    padding: 4,
  },
  profileDetailsCard: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  largeAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#45B6E8',
  },
  profileName: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#1C1C1E',
  },
  profileUsername: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Poppins-Medium',
  },
  infoValue: {
    fontSize: 15,
    color: '#1C1C1E',
    fontFamily: 'Poppins-SemiBold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 14,
  },
  logoutText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
  modalScroll: {
    paddingBottom: 16,
  },
  materiIntro: {
    fontSize: 14,
    color: '#48484A',
    fontFamily: 'Poppins-Medium',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  materiCard: {
    backgroundColor: '#F8F9FA',
    borderLeftWidth: 5,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  materiTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  materiDesc: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#48484A',
    lineHeight: 18,
    marginBottom: 10,
  },
  exampleBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  exampleLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  exampleText: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#1C1C1E',
    fontStyle: 'italic',
  },
  cptpSection: {
    marginBottom: 20,
  },
  cptpHeader: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  cptpCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  cptpText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#3A3A3C',
    lineHeight: 22,
  },
  tpRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  tpNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tpNumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  tpText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#1C1C1E',
    lineHeight: 18,
  },
  statsPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  statNum: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#8E8E93',
    marginTop: 2,
  },
  quizList: {
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    padding: 10,
  },
  quizItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  quizInfo: {
    flex: 1,
    paddingRight: 10,
  },
  quizTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#1C1C1E',
  },
  quizDate: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#8E8E93',
    marginTop: 2,
  },
  scoreBadge: {
    width: 44,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreGreen: {
    backgroundColor: '#E3FCEF',
  },
  scoreYellow: {
    backgroundColor: '#FFF9DB',
  },
  scoreText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#1C1C1E',
  },
  quizStartBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quizStartBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
  }
});
