import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import styles from '../../styles/cptp/CpTpStyles';
import { rs, scaleFont } from '../../utils/responsive';

interface CpTpScreenProps {
  onBack: () => void;
}

type TabType = 'cp' | 'atp';

interface ElementData {
  id: string;
  title: string;
  cpDescription: string;
  tps: string[];
  indicator: string;
}

const ELEMENT_DATA: ElementData[] = [
  {
    id: 'menyimak',
    title: 'Elemen: Menyimak Krama Alus',
    cpDescription: 'Peserta didik mampu menganalisis dan mengevaluasi informasi berupa gagasan, pikiran, perasaan, pandangan, arahan, atau pesan yang akurat dari berbagai tipe teks berbahasa Jawa ragam Krama Alus (seperti pacelathon/percakapan, cerita rakyat, atau pidato) yang disimak secara audio maupun visual.',
    tps: [
      'TP 1: Peserta didik dapat mengidentifikasi dan mencatat kosakata baru ragam Krama Alus dari percakapan sehari-hari yang didengar.',
      'TP 2: Peserta didik dapat membedakan secara tepat penggunaan ragam Ngoko, Krama Lugu, dan Krama Alus berdasarkan konteks sosial (siapa yang berbicara dan dengan siapa berbicara).',
      'TP 3: Peserta didik mampu menyimpulkan pesan moral atau instruksi dari teks narasi Sidoarjo berbahasa Krama Alus dengan tepat.',
      'TP 4: Peserta didik dapat merespons dan menjawab pertanyaan (kuis/evaluasi) terkait detail informasi dari teks yang disimak dengan tingkat akurasi minimal 75%.'
    ],
    indicator: 'Indikator Keberhasilan dalam Game: Pemain mampu menjawab soal evaluasi biasa (3 Poin) dan soal HOTS (8 Poin) yang berkaitan dengan terjemahan dan penerapan Krama Alus pada saat bidak berhenti di kotak kuis.'
  },
  {
    id: 'membaca',
    title: 'Elemen: Membaca & Memirsa Krama Alus',
    cpDescription: 'Peserta didik mampu membaca, memahami, dan menginterpretasikan informasi dari berbagai teks sastra (seperti geguritan, cerita pendek, cerita rakyat Sidoarjo) dan teks nonsastra berbahasa Jawa ragam Krama Alus secara mandiri.',
    tps: [
      'TP 1: Peserta didik dapat membaca teks berbahasa Krama Alus dengan pelafalan lan intonasi yang tepat.',
      'TP 2: Peserta didik dapat menganalisis watak tokoh, latar belakang, dan amanat dari cerita rakyat Sidoarjo berbahasa Krama Alus.',
      'TP 3: Peserta didik mampu menterjemahkan kalimat sederhana dari ragam Ngoko ke Krama Alus dengan tata bahasa yang benar.'
    ],
    indicator: 'Indikator Keberhasilan dalam Game: Pemain mampu memahami petunjuk jalan dan teks misi khusus yang muncul di petak papan permainan dengan tingkat akurasi tinggi.'
  },
  {
    id: 'berbicara',
    title: 'Elemen: Berbicara & Mempresentasikan',
    cpDescription: 'Peserta didik mampu menyampaikan gagasan, pikiran, pandangan, arahan, atau pesan dengan santun menggunakan basa Jawa ragam Krama Alus secara lisan untuk berbagai tujuan sosial.',
    tps: [
      'TP 1: Peserta didik dapat melakukan pacelathon (percakapan) sederhana dengan guru menggunakan Krama Alus secara santun.',
      'TP 2: Peserta didik mampu memperagakan tata krama (subasita) yang selaras dengan basa Krama Alus saat berbicara dengan orang tua.'
    ],
    indicator: 'Indikator Keberhasilan dalam Game: Pemain mampu menyelesaikan misi interaktif dialog krama inggil dengan skor kelulusan minimal 80%.'
  }
];

export default function CpTpScreen({ onBack }: CpTpScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('cp');
  const [expandedElement, setExpandedElement] = useState<string | null>('menyimak');

  const toggleExpand = (id: string) => {
    if (expandedElement === id) {
      setExpandedElement(null);
    } else {
      setExpandedElement(id);
    }
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
          
          {/* Custom Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <ArrowLeft color="#FFFFFF" size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Capaian Pembelajaran{"\n"}& ATP</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Main content body */}
          <View style={styles.contentBody}>

            {/* Segmented Control Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'cp' && styles.tabButtonActive]}
                onPress={() => setActiveTab('cp')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'cp' && styles.tabTextActive]}>
                  Capaian{"\n"}Pembelajaran
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'atp' && styles.tabButtonActive]}
                onPress={() => setActiveTab('atp')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'atp' && styles.tabTextActive]}>
                  Alur Tujuan{"\n"}(ATP)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Dropdown Selector (Fase D) */}
            <TouchableOpacity style={styles.dropdownButton} activeOpacity={0.85}>
              <Text style={styles.dropdownText}>Fase D (Umum)</Text>
              <ChevronDown color="#64748B" size={20} />
            </TouchableOpacity>

            {/* Accordion List for Elements */}
            {ELEMENT_DATA.map((element) => {
              const isExpanded = expandedElement === element.id;

              return (
                <View key={element.id} style={styles.card}>
                  <TouchableOpacity
                    style={[styles.cardHeader, isExpanded && styles.cardHeaderActive]}
                    onPress={() => toggleExpand(element.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cardTitle}>{element.title}</Text>
                    {isExpanded ? (
                      <ChevronUp color="#1E6FE3" size={22} />
                    ) : (
                      <ChevronDown color="#64748B" size={22} />
                    )}
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.cardContent}>
                      {activeTab === 'cp' ? (
                        // Capaian Pembelajaran Tab Content
                        <Text style={styles.paragraph}>
                          {element.cpDescription}
                        </Text>
                      ) : (
                        // Alur Tujuan (ATP) Tab Content
                        <>
                          <Text style={styles.paragraph}>
                            {element.cpDescription}
                          </Text>
                          
                          <Text style={styles.subHeading}>Alur Tujuan Pembelajaran (ATP)</Text>
                          {element.tps.map((tp, idx) => (
                            <View key={idx} style={styles.bulletItem}>
                              <Text style={styles.bulletChar}>•</Text>
                              <Text style={styles.bulletText}>{tp}</Text>
                            </View>
                          ))}

                          <Text style={[styles.paragraph, { marginTop: 10, fontFamily: 'Poppins-Medium', fontSize: scaleFont(rs(10.5, 11, 11)) }]}>
                            {element.indicator}
                          </Text>
                        </>
                      )}
                    </View>
                  )}
                </View>
              );
            })}

          </View>

          {/* Bottom Section: Lapindo Monument Illustration */}
          <View style={styles.bottomSection}>
            <Image
              source={require('../../assets/materi_assets/lapindo.webp')}
              style={styles.cityImg}
              resizeMode="cover"
            />
          </View>

        </ScrollView>
      </ImageBackground>
    </View>
  );
}
