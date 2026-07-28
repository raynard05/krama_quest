import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import styles from './PlayerSidebarStyle';
import { Player } from '../../types';
import { getAvatarSource } from '../profile/ProfileAvatars';
import { vw } from '../../utils/responsive';
import { SoundManager } from '../../utils/SoundManager';

interface PlayerSidebarProps {
  players: Player[];
}

export default function PlayerSidebar({ players }: PlayerSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-vw(45))).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -vw(45),
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const toggleSidebar = () => {
    SoundManager.playButtonClick();
    setIsOpen(!isOpen);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
      {/* Sidebar Content */}
      <View style={styles.sidebarContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {players.map((player) => (
            <View key={player.id} style={styles.playerCard}>
              <View style={styles.avatarContainer}>
                <Image
                  source={getAvatarSource(player.avatarId)}
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName} numberOfLines={1}>
                  {player.name}
                </Text>
                <Text style={styles.playerScore}>
                  Skor: {player.score || 0}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Toggle Button */}
      <TouchableOpacity
        style={styles.toggleButton}
        activeOpacity={0.8}
        onPress={toggleSidebar}
      >
        <View style={styles.toggleIconRow}>
          <Image
            source={require('../../assets/evaluasi/pemain-eval.png')}
            style={styles.pemainIcon}
            resizeMode="contain"
          />
          {isOpen ? (
            <ChevronLeft color="white" size={24} />
          ) : (
            <ChevronRight color="white" size={24} />
          )}
        </View>
        <Text style={styles.toggleText}>Pemain</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
