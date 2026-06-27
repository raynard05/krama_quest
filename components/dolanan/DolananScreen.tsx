import React from 'react';
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

interface DolananScreenProps {
  onBack: () => void;
}

export default function DolananScreen({ onBack }: DolananScreenProps) {
  const handlePemantikStart = () => {
    console.log('Pemantik started');
    // Add navigation or modal logic here
  };

  const handleDolananStart = () => {
    console.log('Dolanan started');
    // Add navigation or modal logic here
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
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <ArrowLeft color="#FFFFFF" size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Dolanan</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Main content body with Single Card */}
          <View style={styles.contentBody}>
            <DolananCard 
              onPemantikStart={handlePemantikStart}
              onDolananStart={handleDolananStart}
            />
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
