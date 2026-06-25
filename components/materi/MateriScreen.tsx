import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import styles from '../../styles/materi/MateriStyles';
import MateriRoadmap from './MateriRoadmap';
import MateriDetailScreen from './MateriDetailScreen';

interface MateriScreenProps {
  onBack: () => void;
}

const MATERI_TITLES: Record<number, string> = {
  1: 'Materi Unggah-Unggah',
  2: 'Krama Inggil',
  3: 'Krama Madya',
  4: 'Basa Ngoko',
};

export default function MateriScreen({ onBack }: MateriScreenProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<number>(1); // Default active node is 1 (orange)

  if (selectedNodeId !== null) {
    return (
      <MateriDetailScreen
        nodeId={selectedNodeId}
        title={MATERI_TITLES[selectedNodeId] || 'Materi'}
        onBack={() => setSelectedNodeId(null)}
      />
    );
  }

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
            <Text style={styles.headerTitle}>Materi</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Main content body - User can arrange new components here */}
          <View style={styles.contentBody}>
            <MateriRoadmap
              activeNodeId={activeNodeId}
              onNodePress={(id) => {
                setActiveNodeId(id);
                setSelectedNodeId(id);
              }}
            />
          </View>

          {/* Bottom Section: Jayandaru Monument Illustration */}
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
