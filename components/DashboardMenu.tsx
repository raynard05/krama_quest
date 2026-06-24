import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, X, BookOpen, Target, Award } from 'lucide-react-native';
import type { UserAccount } from '../services/AuthService';
import styles from '../styles/DashboardStyles';

interface DashboardMenuProps {
  currentUser: UserAccount | null;
  onSelectDolanan: () => void;
  onLogout: () => void;
}

interface MenuCardProps {
  title: string;
  imageSource: any;
  onPress: () => void;
  type: 'materi' | 'dolanan' | 'cptp' | 'evaluasi';
}

function MenuCard({ title, imageSource, onPress, type }: MenuCardProps) {
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

  const cardStyle = [
    styles.menuCard,
    type === 'materi' && styles.materiCardTheme,
    type === 'dolanan' && styles.dolananCardTheme,
    type === 'cptp' && styles.cptpCardTheme,
    type === 'evaluasi' && styles.evaluasiCardTheme,
  ];

  const titleStyle = [
    styles.cardTitle,
    type === 'materi' && styles.materiTextTheme,
    type === 'dolanan' && styles.dolananTextTheme,
    type === 'cptp' && styles.cptpTextTheme,
    type === 'evaluasi' && styles.evaluasiTextTheme,
  ];

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={cardStyle}
      >
        <Animated.Image
          source={imageSource}
          style={[styles.cardImage, { transform: [{ rotate }] }]}
          resizeMode="contain"
        />
        <Text style={titleStyle}>{title}</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/splash_screen/bg_splashs.webp')}
        style={styles.backgroundImage}
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
                source={require('../assets/dashboard_assets/usericon2.png')}
                style={[styles.avatarImage, { transform: [{ rotate: avatarRotate }] }]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Mascot Banner */}
        <View style={styles.bannerContainer}>
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
          <MenuCard type="materi" title="Materi" imageSource={require('../assets/dashboard_assets/materi.png')} onPress={() => setMateriModalVisible(true)} />
          <MenuCard type="dolanan" title="Dolanan" imageSource={require('../assets/dashboard_assets/dolanan.webp')} onPress={onSelectDolanan} />
          <MenuCard type="cptp" title="CP & TP" imageSource={require('../assets/dashboard_assets/cp.png')} onPress={() => setCptpModalVisible(true)} />
          <MenuCard type="evaluasi" title="Evaluasi" imageSource={require('../assets/dashboard_assets/evaluasi.png')} onPress={() => setEvalModalVisible(true)} />
        </View>

      </ScrollView>
      </ImageBackground>

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
