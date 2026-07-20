import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Player, PlayerType } from '../../types';
import { MODERN_COLORS, AVATAR_ICONS } from '../../constants';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';

interface LobbyProps {
  onStartGame: (players: Player[]) => void;
}

export default function Lobby({ onStartGame }: LobbyProps) {
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(2);

  // Set up state for maximum 4 players with default names/colors/icons
  const [names, setNames] = useState<string[]>(['Pemain 1', 'Pemain 2', 'Komputer 1', 'Komputer 2']);
  const [types, setTypes] = useState<PlayerType[]>(['human', 'computer', 'computer', 'computer']);
  const [colors, setColors] = useState<string[]>([
    MODERN_COLORS[0].value, // Neon Blue
    MODERN_COLORS[1].value, // Neon Purple
    MODERN_COLORS[2].value, // Neon Green
    MODERN_COLORS[3].value, // Neon Coral
  ]);
  const [icons, setIcons] = useState<string[]>([
    AVATAR_ICONS[0], // Robot
    AVATAR_ICONS[1], // Alien
    AVATAR_ICONS[2], // Ghost
    AVATAR_ICONS[3], // Fox
  ]);

  const [activeTab, setActiveTab] = useState<number>(0); // Active player card tab for mobile spacing

  const handleNameChange = (text: string, index: number) => {
    const updated = [...names];
    updated[index] = text;
    setNames(updated);
  };

  const handleTypeChange = (type: PlayerType, index: number) => {
    const updatedTypes = [...types];
    updatedTypes[index] = type;

    // Automatically rename if they switch to Computer and name was default
    const updatedNames = [...names];
    if (type === 'computer' && updatedNames[index] === `Pemain ${index + 1}`) {
      updatedNames[index] = `Komputer ${index + 1}`;
    } else if (type === 'human' && updatedNames[index] === `Komputer ${index + 1}`) {
      updatedNames[index] = `Pemain ${index + 1}`;
    }

    setTypes(updatedTypes);
    setNames(updatedNames);
  };

  const handleColorChange = (colorValue: string, index: number) => {
    const updated = [...colors];
    updated[index] = colorValue;
    setColors(updated);
  };

  const handleIconChange = (icon: string, index: number) => {
    const updated = [...icons];
    updated[index] = icon;
    setIcons(updated);
  };

  const handleStart = () => {
    // Compile players array
    const players: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      players.push({
        id: i + 1,
        name: names[i].trim() || `Player ${i + 1}`,
        color: colors[i],
        icon: icons[i],
        position: 0, // starts at cell 0 (before cell 1)
        type: types[i],
        isWinner: false
      });
    }
    onStartGame(players);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>ULAR TANGGA</Text>
        <Text style={styles.subtitle}>Edisi Modern (50 Kotak) TESTTT</Text>

        {/* Player Count Select */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Jumlah Pemain</Text>
          <View style={styles.buttonGroup}>
            {([2, 3, 4] as const).map((count) => (
              <SoundTouchableOpacity
                key={count}
                style={[
                  styles.countButton,
                  playerCount === count && styles.countButtonActive,
                ]}
                onPress={() => {
                  setPlayerCount(count);
                  if (activeTab >= count) {
                    setActiveTab(count - 1);
                  }
                }}
              >
                <Text
                  style={[
                    styles.countButtonText,
                    playerCount === count && styles.countButtonTextActive,
                  ]}
                >
                  {count} Pemain
                </Text>
              </SoundTouchableOpacity>
            ))}
          </View>
        </View>

        {/* Player configuration tab selector */}
        <View style={styles.tabContainer}>
          {Array.from({ length: playerCount }).map((_, idx) => (
            <SoundTouchableOpacity
              key={idx}
              style={[
                styles.tabButton,
                { borderBottomColor: colors[idx] },
                activeTab === idx && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(idx)}
            >
              <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>
                {icons[idx]} P{idx + 1}
              </Text>
            </SoundTouchableOpacity>
          ))}
        </View>

        {/* Active Player Edit Card */}
        <View style={[styles.card, { borderColor: colors[activeTab] }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.playerTitle, { color: colors[activeTab] }]}>
              Pengaturan Pemain {activeTab + 1}
            </Text>

            {/* Player Type toggle */}
            <View style={styles.typeToggle}>
              <SoundTouchableOpacity
                style={[
                  styles.toggleButton,
                  types[activeTab] === 'human' && styles.toggleButtonActive,
                ]}
                onPress={() => handleTypeChange('human', activeTab)}
              >
                <Text style={styles.toggleText}>Pemain</Text>
              </SoundTouchableOpacity>
              <SoundTouchableOpacity
                style={[
                  styles.toggleButton,
                  types[activeTab] === 'computer' && styles.toggleButtonActive,
                ]}
                onPress={() => handleTypeChange('computer', activeTab)}
              >
                <Text style={styles.toggleText}>Komputer</Text>
              </SoundTouchableOpacity>
            </View>
          </View>

          {/* Name Input */}
          <Text style={styles.inputLabel}>Nama Pemain</Text>
          <TextInput
            style={styles.textInput}
            value={names[activeTab]}
            onChangeText={(text) => handleNameChange(text, activeTab)}
            maxLength={14}
            placeholderTextColor="#8F8F9F"
          />

          {/* Color Selector */}
          <Text style={styles.inputLabel}>Pilih Tema Warna</Text>
          <View style={styles.colorRow}>
            {MODERN_COLORS.map((c) => {
              const isSelected = colors[activeTab] === c.value;
              const isUsedByOther = colors.slice(0, playerCount).some((usedCol, idx) => usedCol === c.value && idx !== activeTab);
              return (
                <SoundTouchableOpacity
                  key={c.value}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: c.value },
                    isSelected && [styles.colorCircleSelected, { borderColor: '#FFF' }],
                    isUsedByOther && styles.colorCircleUsed,
                  ]}
                  onPress={() => handleColorChange(c.value, activeTab)}
                  disabled={isUsedByOther}
                >
                  {isUsedByOther && <Text style={styles.usedIndicator}>×</Text>}
                </SoundTouchableOpacity>
              );
            })}
          </View>

          {/* Avatar Icon Selector */}
          <Text style={styles.inputLabel}>Pilih Avatar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarScroll}>
            {AVATAR_ICONS.map((icon) => {
              const isSelected = icons[activeTab] === icon;
              const isUsedByOther = icons.slice(0, playerCount).some((usedIcon, idx) => usedIcon === icon && idx !== activeTab);
              return (
                <SoundTouchableOpacity
                  key={icon}
                  style={[
                    styles.avatarItem,
                    isSelected && styles.avatarItemSelected,
                    isUsedByOther && styles.avatarItemUsed,
                  ]}
                  onPress={() => handleIconChange(icon, activeTab)}
                  disabled={isUsedByOther}
                >
                  <Text style={[styles.avatarIconText, isUsedByOther && styles.avatarUsedText]}>
                    {icon}
                  </Text>
                </SoundTouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Start Game Action */}
        <SoundTouchableOpacity
          style={[styles.startButton, { shadowColor: colors[0] }]}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>MULAI GAME</Text>
        </SoundTouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A12',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 242, 254, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#00F2FE',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: 'rgba(30, 30, 50, 0.45)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 14,
    color: '#8F8F9F',
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  countButtonActive: {
    backgroundColor: '#00F2FE',
    borderColor: '#00F2FE',
  },
  countButtonText: {
    color: '#A0A0B0',
    fontWeight: 'bold',
  },
  countButtonTextActive: {
    color: '#0A0A12',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  tabText: {
    color: '#6F6F7F',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 12,
    color: '#8F8F9F',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 12,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 2.5,
  },
  colorCircleUsed: {
    opacity: 0.2,
  },
  usedIndicator: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatarScroll: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  avatarItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  avatarItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: '#FFFFFF',
  },
  avatarItemUsed: {
    opacity: 0.15,
  },
  avatarIconText: {
    fontSize: 22,
  },
  avatarUsedText: {
    textDecorationLine: 'line-through',
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  startButtonText: {
    color: '#0A0A12',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
  },
});
