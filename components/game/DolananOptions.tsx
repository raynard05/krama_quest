import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  Modal,
  ScrollView,
  Image
} from 'react-native';
import { Gamepad2, X, Info, HelpCircle } from 'lucide-react-native';
import BackButton from '../BackButton';

const { width } = Dimensions.get('window');

interface DolananOptionsProps {
  onBack: () => void;
  onSelectGame: () => void;
}

export default function DolananOptions({ onBack, onSelectGame }: DolananOptionsProps) {
  const [activeTab, setActiveTab] = useState<'pemantik' | 'dolanan'>('pemantik');
  const [pemantikVisible, setPemantikVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.headerTitle}>Pilihan Dolanan</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Pilih salah siji menu ing ngisor iki kanggo miwiti pasinaon:
        </Text>

        {/* Tab Switch Selector */}
        <View style={styles.switchWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.switchTab,
              activeTab === 'pemantik' && styles.switchTabActivePemantik
            ]}
            onPress={() => setActiveTab('pemantik')}
          >
            <HelpCircle size={20} color={activeTab === 'pemantik' ? '#FFFFFF' : '#8E8E93'} style={styles.switchIcon} />
            <Text style={[styles.switchLabel, activeTab === 'pemantik' && styles.switchLabelActive]}>
              Pemantik
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.switchTab,
              activeTab === 'dolanan' && styles.switchTabActiveDolanan
            ]}
            onPress={() => setActiveTab('dolanan')}
          >
            <Gamepad2 size={20} color={activeTab === 'dolanan' ? '#FFFFFF' : '#8E8E93'} style={styles.switchIcon} />
            <Text style={[styles.switchLabel, activeTab === 'dolanan' && styles.switchLabelActive]}>
              Dolanan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Unified Responsive Main Card */}
        <View style={styles.cardWrapper}>
          <View style={[
            styles.mainCard,
            { backgroundColor: activeTab === 'pemantik' ? '#FF5E7E' : '#007AFF' }
          ]}>
            {activeTab === 'pemantik' ? (
              <View style={styles.cardContent}>
                <View style={styles.upperContent}>
                  <View style={styles.largeIconWrapper}>
                    <HelpCircle color="#FF5E7E" size={44} />
                  </View>
                  <Text style={styles.mainCardTitle}>Pemantik</Text>
                  <Text style={styles.mainCardDescription}>
                    Mangsuli pitakonan pemantik dhisik kanggo pambuka pasinaon unggah-ungguh basa Jawa.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.cardCTA}
                  onPress={() => setPemantikVisible(true)}
                  activeOpacity={0.88}
                >
                  <Text style={[styles.cardCTAText, { color: '#FF5E7E' }]}>Buka Pitakonan Pemantik</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.cardContent}>
                <View style={styles.upperContent}>
                  <View style={styles.largeIconWrapper}>
                    <Gamepad2 color="#007AFF" size={44} />
                  </View>
                  <Text style={styles.mainCardTitle}>Dolanan Ular Tangga</Text>
                  <Text style={styles.mainCardDescription}>
                    Ayo dolanan bareng kanca-kanca lan uji pemahaman basa Kramamu ing kene!
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.cardCTA}
                  onPress={onSelectGame}
                  activeOpacity={0.88}
                >
                  <Text style={[styles.cardCTAText, { color: '#007AFF' }]}>Mulai Main Ular Tangga</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ── PEMANTIK MODAL ──────────────────────────────────────────────────────── */}
      <Modal
        visible={pemantikVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPemantikVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.largeModalContent]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleGroup}>
                <HelpCircle color="#FF5E7E" size={24} style={styles.modalIcon} />
                <Text style={styles.modalHeaderText}>Pitakonan Pemantik</Text>
              </View>
              <TouchableOpacity onPress={() => setPemantikVisible(false)} style={styles.closeButton}>
                <X color="#1C1C1E" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              <Text style={styles.materiIntro}>
                Ayo coba wangsulana pitakonan-pitakonan pemantik ing ngisor iki dhisik kanggo pambuka pasinaon:
              </Text>

              {/* Reflection Questions List */}
              <View style={styles.reflectionSection}>
                <View style={styles.questionCard}>
                  <Text style={styles.questionNumber}>Pitakonan 1</Text>
                  <Text style={styles.questionText}>
                    Karo sapa wae kita kudu nggunakake basa krama alus?
                  </Text>
                </View>

                <View style={styles.questionCard}>
                  <Text style={styles.questionNumber}>Pitakonan 2</Text>
                  <Text style={styles.questionText}>
                    Apa bedane basa ngoko lugu lan basa krama lugu miturut carane nganggo?
                  </Text>
                </View>

                <View style={styles.questionCard}>
                  <Text style={styles.questionNumber}>Pitakonan 3</Text>
                  <Text style={styles.questionText}>
                    Kenapa kita kudu sinau lan nglestarekake unggah-ungguh basa Jawa?
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.startGameCTA}
                onPress={() => {
                  setPemantikVisible(false);
                  onSelectGame();
                }}
                activeOpacity={0.88}
              >
                <Gamepad2 color="#FFFFFF" size={20} style={styles.ctaIconOffset} />
                <Text style={styles.startGameCTAText}>Mulai Dolanan Ular Tangga</Text>
              </TouchableOpacity>
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
    backgroundColor: '#E5ECF4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  switchWrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  switchTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 24,
  },
  switchTabActivePemantik: {
    backgroundColor: '#FF5E7E',
  },
  switchTabActiveDolanan: {
    backgroundColor: '#007AFF',
  },
  switchIcon: {
    marginRight: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#8E8E93',
  },
  switchLabelActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  cardWrapper: {
    flex: 1,
    width: '100%',
    marginBottom: 10,
  },
  mainCard: {
    flex: 1,
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upperContent: {
    width: '100%',
    alignItems: 'center',
  },
  largeIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  mainCardTitle: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  mainCardDescription: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  cardCTA: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCTAText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  modalHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIcon: {
    marginRight: 8,
  },
  modalHeaderText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1C1C1E',
  },
  closeButton: {
    padding: 4,
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
  reflectionSection: {
    marginBottom: 24,
    gap: 12,
  },
  questionCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  questionNumber: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#FF5E7E',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  questionText: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#1C1C1E',
    lineHeight: 18,
  },
  startGameCTA: {
    backgroundColor: '#28A745',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#28A745',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  ctaIconOffset: {
    marginRight: 8,
  },
  startGameCTAText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
});
