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
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import styles from '../../styles/cptp/CpTpStyles';
import { rs, scaleFont } from '../../utils/responsive';
import BackButton from '../BackButton';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';

interface CpTpScreenProps {
  onBack: () => void;
}

type TabType = 'cp' | 'tp';

const CP_DATA = [
  {
    id: 'menulis',
    title: 'Elemen: menulis',
    content: 'Peserta didik mampu menyampaikan ungkapan rasa simpati, empati, peduli, dan pendapat pro/kontra sesuai unggah-ungguh basa/tata krama dalam memberikan penghargaan secara tertulis dalam teks multimoda.',
  }
];

const TP_DATA = [
  {
    id: 'tp_placeholder',
    title: 'Tujuan Pembelajaran (TP)',
    tps: [
      '1. Setelah membaca materi dari aplikasi unggah-ungguh basa(C), peserta didik(A)secara bernalar kritis mampu memahami pengertian unggah-ungguh basa(B) dengan baik(D).C1',
      '2. Setelah menyimak materi unggah-ungguh basa dari aplikasi(C), peserta didik(A) secara bernalar kritis mampu mengerjakan pertanyaan dan pernyataan dari aplikasi(B) dengan benar(D).C4',
      '3. Setelah mengerjakan pernyataan dan pertanyaan dari aplikasi unggah-ungguh basa(C), peserta didik(A) secara bergotong royong mampu menciptakan dialog dengan unggah-ungguh basa pada soal evaluasi dari aplikasi(B) dengan benar(D). P5'
    ],

  }
];

export default function CpTpScreen({ onBack }: CpTpScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('cp');
  const [expandedElement, setExpandedElement] = useState<string | null>('menulis');

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
            <BackButton onPress={onBack} />
            <Image source={require('../../assets/title_board/cp1.png')} style={{ width: 160, height: 50 }} resizeMode="contain" />
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Main content body */}
          <View style={styles.contentBody}>

            {/* Segmented Control Tabs */}
            <View style={styles.tabsContainer}>
              <SoundTouchableOpacity
                style={[styles.tabButton, activeTab === 'cp' && styles.tabButtonActive]}
                onPress={() => setActiveTab('cp')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'cp' && styles.tabTextActive]}>
                  Capaian{"\n"}Pembelajaran
                </Text>
              </SoundTouchableOpacity>

              <SoundTouchableOpacity
                style={[styles.tabButton, activeTab === 'tp' && styles.tabButtonActive]}
                onPress={() => setActiveTab('tp')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'tp' && styles.tabTextActive]}>
                  Alur Tujuan{"\n"}(TP)
                </Text>
              </SoundTouchableOpacity>
            </View>



            {/* Accordion List for Elements */}
            {(activeTab === 'cp' ? CP_DATA : TP_DATA).map((element: any) => {
              const isExpanded = expandedElement === element.id;

              return (
                <View key={element.id} style={styles.card}>
                  <SoundTouchableOpacity
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
                  </SoundTouchableOpacity>

                  {isExpanded && (
                    <View style={styles.cardContent}>
                      {activeTab === 'cp' ? (
                        // Capaian Pembelajaran Tab Content
                        <Text style={styles.paragraph}>
                          {element.content}
                        </Text>
                      ) : (
                        // Alur Tujuan (TP) Tab Content
                        <>

                          {element.tps.map((tp: string, idx: number) => (
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


        </ScrollView>
      </ImageBackground>
    </View>
  );
}
