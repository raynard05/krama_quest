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
import styles from '../../styles/materi/MateriStyles';

interface MateriScreenProps {
  onBack: () => void;
}

export default function MateriScreen({ onBack }: MateriScreenProps) {
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
            <Text style={styles.headerTitle}>Materi Pasinaon</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Main content body - User can arrange new components here */}
          <View style={styles.contentBody}>
            {/* Components will be added here */}
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
