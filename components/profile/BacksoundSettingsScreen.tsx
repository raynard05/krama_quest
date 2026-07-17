import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet
} from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import { ProfileStyles as styles } from '../../styles/profile/ProfileStyles';
import BackButton from '../BackButton';
import { SoundManager } from '../../utils/SoundManager';

interface BacksoundSettingsScreenProps {
  onBack: () => void;
}

export default function BacksoundSettingsScreen({ onBack }: BacksoundSettingsScreenProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    SoundManager.getIsEnabled().then(setSoundEnabled);
  }, []);

  const handleToggleSound = async (enabled: boolean) => {
    setSoundEnabled(enabled);
    await SoundManager.setSoundEnabled(enabled);
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
            <Text style={localStyles.headerText}>PENGATURAN</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Settings Card */}
          <ImageBackground
            source={require('../../assets/texture/texture2.png')}
            style={styles.optionsCard}
            imageStyle={{ borderRadius: 23 }}
            resizeMode="cover"
          >
            <View style={localStyles.cardContent}>
              <Text style={localStyles.titleText}>Swantara (Backsound)</Text>
              <Text style={localStyles.subText}>Ngaktifake musik latar mburi nalika dolanan</Text>
              
              <View style={localStyles.toggleContainer}>
                {/* Active Muni (Sound On) Option */}
                <TouchableOpacity
                  style={[
                    localStyles.toggleButton,
                    soundEnabled ? localStyles.activeButton : localStyles.inactiveButton
                  ]}
                  onPress={() => handleToggleSound(true)}
                  activeOpacity={0.8}
                >
                  <Volume2 color={soundEnabled ? '#0A0A12' : '#FFFFFF'} size={24} />
                  <Text style={[
                    localStyles.buttonText,
                    { color: soundEnabled ? '#0A0A12' : '#FFFFFF' }
                  ]}>Muni</Text>
                </TouchableOpacity>

                {/* Active Mati (Sound Off) Option */}
                <TouchableOpacity
                  style={[
                    localStyles.toggleButton,
                    !soundEnabled ? localStyles.activeButtonMuted : localStyles.inactiveButton
                  ]}
                  onPress={() => handleToggleSound(false)}
                  activeOpacity={0.8}
                >
                  <VolumeX color="#FFFFFF" size={24} />
                  <Text style={[
                    localStyles.buttonText,
                    { color: '#FFFFFF' }
                  ]}>Mati</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const localStyles = StyleSheet.create({
  headerText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
  },
  titleText: {
    color: '#00F2FE',
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    color: '#E0EFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 8,
  },
  activeButton: {
    backgroundColor: '#00F2FE',
    borderColor: '#00F2FE',
  },
  activeButtonMuted: {
    backgroundColor: '#FF5E62',
    borderColor: '#FF5E62',
  },
  inactiveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
