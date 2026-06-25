import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Animated,
  StyleSheet
} from 'react-native';
import { ArrowLeft, Edit2 } from 'lucide-react-native';
import Svg, { Circle, LinearGradient, Stop, Defs } from 'react-native-svg';
import { AvatarPickerStyles as styles } from '../../styles/profile/AvatarPickerStyles';
import { PROFILE_AVATARS, getAvatarSource, AvatarItem } from './ProfileAvatars';

interface AvatarPickerScreenProps {
  initialAvatarId: string | undefined;
  onBack: () => void;
  onSave: (avatarId: string) => void;
}

// Optimized & Animated Grid Item component
const AvatarGridItem = React.memo(({
  item,
  isSelected,
  onPress
}: {
  item: AvatarItem;
  isSelected: boolean;
  onPress: (id: string) => void;
}) => {
  // Animation values inside the selectable item
  const scaleAnim = useRef(new Animated.Value(isSelected ? 1.0 : 0.9)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animationLoop: Animated.CompositeAnimation | null = null;

    if (isSelected) {
      // Loop slow rotation for the colorful ring
      animationLoop = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        })
      );
      animationLoop.start();

      // Trigger spring scale-up pop
      scaleAnim.setValue(0.7);
      Animated.spring(scaleAnim, {
        toValue: 1.0,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }).start();
    } else {
      // Return to smaller idle state
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }).start();
      spinAnim.setValue(0);
    }

    return () => {
      if (animationLoop) {
        animationLoop.stop();
      }
    };
  }, [isSelected]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      style={styles.gridItemWrapper}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.gridItemCircle,
        isSelected && styles.gridItemCircleSelected,
        // Override border when selected so Svg ring serves as border
        isSelected && { borderWidth: 0 }
      ]}>

        {/* Rotating Rainbow SVG Ring when selected */}
        {isSelected && (
          <Animated.View style={[
            StyleSheet.absoluteFill,
            { transform: [{ rotate: spin }] }
          ]}>
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
              <Defs>
                <LinearGradient id="rainbowGrid" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#00F2FE" />
                  <Stop offset="25%" stopColor="#4FACFE" />
                  <Stop offset="50%" stopColor="#F355DA" />
                  <Stop offset="75%" stopColor="#FF0844" />
                  <Stop offset="100%" stopColor="#00F2FE" />
                </LinearGradient>
              </Defs>
              <Circle
                cx="50"
                cy="50"
                r="46.5"
                fill="transparent"
                stroke="url(#rainbowGrid)"
                strokeWidth="6"
              />
            </Svg>
          </Animated.View>
        )}

        <Animated.Image
          source={item.source}
          style={[
            styles.gridImage,
            { transform: [{ scale: scaleAnim }] }
          ]}
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
            <Text style={styles.headerTitle}>Pilih Avatar</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Large Preview Circle - Clean Static Preview */}
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

