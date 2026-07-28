import React, { useState } from 'react';
import { View, ImageBackground, Image, ScrollView, StyleSheet } from 'react-native';
import BackButton from '../BackButton';
import EvaluasiSetupCard from './EvaluasiSetupCard';
import styles from './EvaluasiOnlineScreenStyle';
import GameScreen from '../gameadvanceeval/GameScreen';

interface EvaluasiOnlineScreenProps {
  currentUser?: any;
  onBack: () => void;
}

export default function EvaluasiOnlineScreen({ currentUser, onBack }: EvaluasiOnlineScreenProps) {
  const [gameConfig, setGameConfig] = useState<any>(null);

  const handleStartGame = (config: any) => {
    console.log("Evaluasi Online Start Config:", config);
    setGameConfig(config);
  };

  if (gameConfig) {
    return (
      <GameScreen
        currentUser={currentUser}
        isHost={gameConfig.networkRole === 'host'}
        initialPlayers={gameConfig.playersList}
        onBack={() => setGameConfig(null)}
        onFinishGame={() => setGameConfig(null)}
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
        {/* Bottom City Illustration */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Image 
            source={require('../../assets/dolanan_assets/temple.png')} 
            style={styles.bottomCity} 
            resizeMode="cover" 
          />
        </View>

        {/* Scrollable Container */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Custom Header with Back Button */}
          <View style={styles.header}>
            <BackButton onPress={onBack} />
            <Image 
              source={require('../../assets/title_board/evaluasi.png')} 
              style={{ width: 160, height: 50 }} 
              resizeMode="contain" 
            />
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Main content body */}
          <View style={[styles.contentBody, { zIndex: 2, paddingBottom: 150 }]}>
            <EvaluasiSetupCard 
              currentUser={currentUser}
              onStartGame={handleStartGame}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
