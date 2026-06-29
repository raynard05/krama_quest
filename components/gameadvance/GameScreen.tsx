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
import styles from './GameScreenStyle';
import Board from './Board';
import Dadu from './Dadu';

interface GameScreenProps {
  currentUser: any;
  onBack: () => void;
}

export default function GameScreen({
  currentUser,
  onBack,
}: GameScreenProps) {
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const handleRollDice = async () => {
    if (isRolling) return;

    setIsRolling(true);

    // Animate dice rolling
    let rolls = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;

      if (rolls >= 10) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
      }
    }, 100);
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
                onPress={onBack} 
                activeOpacity={0.7}
              >
                <ArrowLeft color="#FFFFFF" size={22} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Pemantik</Text>
              <View style={styles.headerPlaceholder} />
            </View>

            {/* Main content body */}
            <View style={styles.contentBody}>
              {/* Board Component */}
              <Board />
              
              {/* Dadu Component */}
              <Dadu 
                value={diceValue} 
                onRoll={handleRollDice}
                disabled={isRolling}
                avatarId={currentUser?.avatarId}
                batikId={currentUser?.avatarBgId}
                userName={currentUser?.username}
              />
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
