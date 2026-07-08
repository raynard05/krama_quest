import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { HistoryStyles as styles } from '../../styles/profile/HistoryStyles';
import BackButton from '../BackButton';
import { ProgressService } from '../../services/ProgressService';

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

const MATERI_DATA: Record<number, { title: string, mascot: any }> = {
  1: { title: 'Materi Unggah-Unggah', mascot: require('../../assets/dashboard_assets/greeting.webp') },
  2: { title: 'Krama Inggil', mascot: require('../../assets/dashboard_assets/greeting.webp') },
  3: { title: 'Krama Madya', mascot: require('../../assets/dashboard_assets/greeting.webp') },
  4: { title: 'Basa Ngoko', mascot: require('../../assets/dashboard_assets/greeting.webp') },
};

export default function HistoryScreen({ onBack }: HistoryScreenProps) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const visitedIds = await ProgressService.getVisitedMateri();
    
    // Convert visited IDs into HistoryItem objects
    const items: HistoryItem[] = visitedIds.map(id => {
      const data = MATERI_DATA[id] || { title: `Materi ${id}`, mascot: require('../../assets/dashboard_assets/greeting.webp') };
      return {
        id: String(id),
        title: data.title,
        date: 'Sudah Dibaca', // You can enhance this to save real dates later in ProgressService
        status: 'Rampung',
        mascot: data.mascot,
      };
    });

    setHistoryItems(items.reverse()); // Show latest on top
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
          {/* Header */}
          <View style={styles.header}>
            <BackButton onPress={onBack} />
            <Image source={require('../../assets/title_board/riwayat_sinau.png')} style={{ width: 170, height: 55 }} resizeMode="contain" />
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Cards List */}
          {historyItems.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: '#FFFFFF', fontFamily: 'Poppins-Regular' }}>Belum ada materi yang dibaca.</Text>
            </View>
          ) : (
            historyItems.map((item) => (
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
            ))
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
