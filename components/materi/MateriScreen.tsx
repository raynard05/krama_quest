import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  
} from 'react-native';

import styles from '../../styles/materi/MateriStyles';
import MateriRoadmap from './MateriRoadmap';
import MateriDetailScreen from './MateriDetailScreen';
import BackButton from '../BackButton';
import { ProgressService } from '../../services/ProgressService';

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
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);

  useEffect(() => {
    loadVisitedNodes();
  }, []);

  const loadVisitedNodes = async () => {
    const visited = await ProgressService.getVisitedMateri();
    setVisitedNodes(visited);
  };

  const handleNodePress = async (id: number) => {
    await ProgressService.markMateriVisited(id);
    if (!visitedNodes.includes(id)) {
      setVisitedNodes([...visitedNodes, id]);
    }
    setSelectedNodeId(id);
  };

  if (selectedNodeId !== null) {
    return (
      <MateriDetailScreen
        nodeId={selectedNodeId}
        title={MATERI_TITLES[selectedNodeId] || 'Materi'}
        onBack={() => {
          setSelectedNodeId(null);
          loadVisitedNodes(); // refresh when coming back
        }}
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
            <BackButton onPress={onBack} />
            <Image source={require('../../assets/title_board/materi.png')} style={{ width: 140, height: 45 }} resizeMode="contain" />
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Main content body - User can arrange new components here */}
          <View style={styles.contentBody}>
            <MateriRoadmap
              visitedNodeIds={visitedNodes}
              onNodePress={handleNodePress}
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
