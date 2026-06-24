import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from 'react-native';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { HistoryStyles as styles } from '../../styles/profile/HistoryStyles';

interface HistoryScreenProps {
  onBack: () => void;
}

interface HistoryItem {
  id: string;
  title: string;
  date: string;
  status: string;
  mascot: any;
}

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: '1',
    title: 'Materi Unggah-Unggah',
    date: '17 Jun 2026, 09:30 WIB',
    status: 'Rampung',
    mascot: require('../../assets/dashboard_assets/greeting.webp'),
  },
  {
    id: '2',
    title: 'Materi Basa Krama Alus',
    date: '15 Jun 2026, 14:15 WIB',
    status: 'Rampung',
    mascot: require('../../assets/dashboard_assets/greeting.webp'),
  },
];

export default function HistoryScreen({ onBack }: HistoryScreenProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/splash_screen/bg_splashs.webp')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <ArrowLeft color="#FFFFFF" size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Riwayat Sinau</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Cards List */}
          {MOCK_HISTORY.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={item.mascot} style={styles.mascotImage} resizeMode="contain" />
              <View style={styles.cardContent}>
                <Text style={styles.materialTitle}>{item.title}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusText}>
                    Status: <Text style={{ color: '#16A34A' }}>{item.status}</Text>
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.chevronButton} activeOpacity={0.6}>
                <ChevronRight color="#64748B" size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
