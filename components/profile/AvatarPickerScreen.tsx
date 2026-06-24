import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from 'react-native';
import { ArrowLeft, Edit2 } from 'lucide-react-native';
import { AvatarPickerStyles as styles } from '../../styles/profile/AvatarPickerStyles';
import { PROFILE_AVATARS, getAvatarSource } from './ProfileAvatars';

interface AvatarPickerScreenProps {
  initialAvatarId: string | undefined;
  onBack: () => void;
  onSave: (avatarId: string) => void;
}

export default function AvatarPickerScreen({
  initialAvatarId,
  onBack,
  onSave
}: AvatarPickerScreenProps) {
  const [selectedId, setSelectedId] = useState<string>(initialAvatarId || '1');

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
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <ArrowLeft color="#FFFFFF" size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Large Preview Circle */}
          <View style={styles.previewSection}>
            <View style={styles.avatarRing}>
              <Image
                source={getAvatarSource(selectedId)}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.editBadge}>
              <Edit2 color="#1E6FE3" size={12} />
            </View>
          </View>

          {/* Grid Selector */}
          <View style={styles.gridContainer}>
            {PROFILE_AVATARS.map((avatar) => {
              const isSelected = selectedId === avatar.id;
              return (
                <TouchableOpacity
                  key={avatar.id}
                  style={styles.gridItemWrapper}
                  onPress={() => setSelectedId(avatar.id)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.gridItemCircle,
                    isSelected && styles.gridItemCircleSelected
                  ]}>
                    <Image
                      source={avatar.source}
                      style={styles.gridImage}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Selesai Button */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.selesaiButton}
            onPress={() => onSave(selectedId)}
            activeOpacity={0.8}
          >
            <Text style={styles.selesaiButtonText}>Selesai</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
