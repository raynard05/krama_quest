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
import styles from '../../styles/dolanan/DolananStyles';
import DolananCard from './DolananCard';
import GameSetupCard from './GameSetupCard';

interface DolananScreenProps {
  onBack: () => void;
}

export default function DolananScreen({ onBack }: DolananScreenProps) {
  const [showGameSetup, setShowGameSetup] = useState(false);
  const [currentUserId] = useState(1); // TODO: Get from auth context/session
  const [availablePlayers] = useState([
    // TODO: Fetch from Supabase
    { id: 2, username: 'budi123', nama_lengkap: 'Budi Santoso' },
    { id: 3, username: 'siti_2024', nama_lengkap: 'Siti Aminah' },
    { id: 4, username: 'ahmad_99', nama_lengkap: 'Ahmad Fauzi' },
    { id: 5, username: 'rina_jkt', nama_lengkap: 'Rina Wijaya' },
  ]);

  const handlePemantikStart = () => {
    console.log('Pemantik started');
    // Add navigation or modal logic here
  };

  const handleDolananStart = () => {
    console.log('Dolanan started - Show game setup');
    setShowGameSetup(true);
  };

  const handleStartGame = (config: any) => {
    console.log('Starting game with config:', config);
    // TODO: Navigate to actual game screen or save config
    // For now, just log the configuration
  };

  const handleBackFromSetup = () => {
    setShowGameSetup(false);
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
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={showGameSetup ? handleBackFromSetup : onBack} 
              activeOpacity={0.7}
            >
              <ArrowLeft color="#FFFFFF" size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {showGameSetup ? 'Setup Game' : 'Dolanan'}
            </Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Main content body */}
          <View style={styles.contentBody}>
            {!showGameSetup ? (
              // Show DolananCard (Pemantik/Dolanan selection)
              <DolananCard 
                onPemantikStart={handlePemantikStart}
                onDolananStart={handleDolananStart}
              />
            ) : (
              // Show GameSetupCard (Lokal/Online, Player setup)
              <GameSetupCard
                currentUserId={currentUserId}
                availablePlayers={availablePlayers}
                onStartGame={handleStartGame}
              />
            )}
          </View>

          {/* Bottom Section: Jembatan Illustration */}
          <View style={styles.bottomSection}>
            <Image
              source={require('../../assets/dolanan_assets/jembatan.webp')}
              style={styles.cityImg}
              resizeMode="cover"
            />
          </View>

        </ScrollView>
      </ImageBackground>
    </View>
  );
}
