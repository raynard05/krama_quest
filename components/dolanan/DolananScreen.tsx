import React, { useState, useEffect } from 'react';
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
import { supabase } from '../../services/AuthService';

interface DolananScreenProps {
  currentUser: any;
  onBack: () => void;
}

export default function DolananScreen({ currentUser, onBack }: DolananScreenProps) {
  const [showGameSetup, setShowGameSetup] = useState(false);
  const currentUserId = currentUser?.id || 1;
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const { data, error } = await supabase
          .from('user_account')
          .select('id, username, nama_lengkap')
          .order('username', { ascending: true });
        if (error) throw error;
        if (data) {
          setAvailablePlayers(data);
        }
      } catch (err) {
        console.warn('Failed to fetch players from Supabase:', err);
      }
    }
    loadPlayers();
  }, []);

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
          <View style={{ flex: 1 }}>
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
