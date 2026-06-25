import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import styles from '../../styles/materi/MateriStyles';

interface MateriDetailScreenProps {
  nodeId: number;
  title: string;
  onBack: () => void;
}

export default function MateriDetailScreen({ nodeId, title, onBack }: MateriDetailScreenProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/splash_screen/bg_splashs.webp')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Custom Header with Back Button (returns to roadmap list) */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <ArrowLeft color="#FFFFFF" size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Materi {nodeId}</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Main content body - Detail Page for each topic */}
          <View style={styles.contentBody}>
            <View style={localStyles.contentCard}>
              <Text style={localStyles.materiTitle}>{title}</Text>
              <Text style={localStyles.materiIntro}>
                Sugeng rawuh ing pasinaon bab {title}. Ing kene sampeyan bakal sinau materi luwih jero lan jangkep.
              </Text>
              
              <View style={localStyles.placeholderBox}>
                <Text style={localStyles.placeholderText}>
                  [ Susun komponen pasinaon, wacan, utawa latihan materi ing kene ]
                </Text>
              </View>
            </View>
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

const localStyles = StyleSheet.create({
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
    marginTop: 10,
  },
  materiTitle: {
    color: '#FF9F0A',
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  materiIntro: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  placeholderBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 24,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});
