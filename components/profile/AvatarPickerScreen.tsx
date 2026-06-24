import React, { useState, useCallback } from 'react';
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
import { PROFILE_AVATARS, getAvatarSource, AvatarItem } from './ProfileAvatars';

interface AvatarPickerScreenProps {
  initialAvatarId: string | undefined;
  onBack: () => void;
  onSave: (avatarId: string) => void;
}

// Optimized Grid Item component to prevent unnecessary re-renders of all 21 items
const AvatarGridItem = React.memo(({ 
  item, 
  isSelected, 
  onPress 
}: { 
  item: AvatarItem; 
  isSelected: boolean; 
  onPress: (id: string) => void; 
}) => {
  return (
    <TouchableOpacity
      style={styles.gridItemWrapper}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.gridItemCircle,
        isSelected && styles.gridItemCircleSelected
      ]}>
        <Image
          source={item.source}
          style={styles.gridImage}
          resizeMode="contain"
          fadeDuration={0}
          resizeMethod="resize"
        />
      </View>
    </TouchableOpacity>
  );
});

export default function AvatarPickerScreen({
  initialAvatarId,
  onBack,
  onSave
}: AvatarPickerScreenProps) {
  const [selectedId, setSelectedId] = useState<string>(initialAvatarId || '1');

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

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
                fadeDuration={0}
              />
            </View>
            <View style={styles.editBadge}>
              <Edit2 color="#1E6FE3" size={12} />
            </View>
          </View>

          {/* Grid Selector */}
          <View style={styles.gridContainer}>
            {PROFILE_AVATARS.map((avatar) => (
              <AvatarGridItem
                key={avatar.id}
                item={avatar}
                isSelected={selectedId === avatar.id}
                onPress={handleSelect}
              />
            ))}
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

