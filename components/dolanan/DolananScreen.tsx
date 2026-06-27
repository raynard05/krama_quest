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

import { ProfileService } from '../../services/ProfileService';

interface DolananScreenProps {
  currentUser: any;
  onBack: () => void;
  onStartLocalGame: (configuredPlayers: any[]) => void;
  onStartNetworkGame: (configuredPlayers: any[], role: 'host' | 'client', assignedId: number) => void;
}

export default function DolananScreen({
  currentUser,
  onBack,
  onStartLocalGame,
  onStartNetworkGame
}: DolananScreenProps) {
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

  const handleStartGame = async (config: any) => {
    console.log('Starting game with config:', config);
    if (config.mode === 'lokal') {
      const player1GacoId = String(config.player1Gaco + 1);
      
      try {
        // Save host selected gaco directly to database
        await ProfileService.updateUserGaco(currentUserId, player1GacoId);
      } catch (err) {
        console.warn('Failed to update host gaco on local game start:', err);
      }

      const opponentName = config.opponentType === 'komputer' 
        ? 'Komputer' 
        : (config.opponentPlayerId 
            ? (availablePlayers.find(p => p.id === config.opponentPlayerId)?.nama_lengkap || 'Pemain 2') 
            : 'Pemain 2');

      const localPlayers = [
        { 
          id: 1, 
          name: currentUser?.nama_lengkap || 'Pemain 1', 
          color: '#2976BF', 
          icon: String(currentUserId), // database userId
          position: 0, 
          type: 'human', 
          isWinner: false 
        },
        { 
          id: 2, 
          name: opponentName, 
          color: '#EF4444', 
          icon: String(config.opponentPlayerId || 0), // opponent userId, or '0' for computer
          position: 0, 
          type: config.opponentType === 'komputer' ? 'computer' : 'human', 
          isWinner: false 
        }
      ];
      onStartLocalGame(localPlayers);
    } else {
      // online mode
      const parsedPlayers = config.playersList.map((p: any) => ({
        id: p.id,
        name: p.name,
        color: p.color,
        icon: String(p.icon), // Contains opponent's database userId
        position: p.position || 0,
        type: p.type || 'human',
        isWinner: p.isWinner || false
      }));
      onStartNetworkGame(parsedPlayers, config.networkRole, config.localPlayerId);
    }
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
                  currentUserAvatarId={currentUser?.avatarId}
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
