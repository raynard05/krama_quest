import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { ChevronLeft, ChevronRight, Users, Cpu } from 'lucide-react-native';
import { styles } from './GameSetupCardStyles';

export type ModeType = 'lokal' | 'online';
export type PlayerType = 'player1' | 'player2';
export type OpponentType = 'pemain' | 'komputer';
export type OnlineRoomType = 'buat' | 'gabung';

interface Gaco {
  id: number;
  name: string;
  image: any;
}

interface Player {
  id: number;
  username: string;
  nama_lengkap: string;
}

interface GameSetupCardProps {
  onStartGame?: (config: any) => void;
  currentUserId: number;
  availablePlayers?: Player[];
}

const GACOS: Gaco[] = [
  { id: 1, name: 'Gaco 1', image: require('../../assets/dolanan_assets/1.png') },
  { id: 2, name: 'Gaco 2', image: require('../../assets/dolanan_assets/2.png') },
  { id: 3, name: 'Gaco 3', image: require('../../assets/dolanan_assets/3.png') },
  { id: 4, name: 'Gaco 4', image: require('../../assets/dolanan_assets/4.png') },
  { id: 5, name: 'Gaco 5', image: require('../../assets/dolanan_assets/5.png') },
  { id: 6, name: 'Gaco 6', image: require('../../assets/dolanan_assets/6.png') },
  { id: 7, name: 'Gaco 7', image: require('../../assets/dolanan_assets/7.png') },
  { id: 8, name: 'Gaco 8', image: require('../../assets/dolanan_assets/8.png') },
];

export default function GameSetupCard({ 
  onStartGame,
  currentUserId,
  availablePlayers = []
}: GameSetupCardProps) {
  const [activeMode, setActiveMode] = useState<ModeType>('lokal');
  const [activePlayer, setActivePlayer] = useState<PlayerType>('player1');
  const [opponentType, setOpponentType] = useState<OpponentType>('pemain');
  const [onlineRoomType, setOnlineRoomType] = useState<OnlineRoomType>('buat');
  const [selectedPlayer1Gaco, setSelectedPlayer1Gaco] = useState<number>(0);
  const [selectedPlayer2Gaco, setSelectedPlayer2Gaco] = useState<number>(1);
  const [selectedOpponentPlayer, setSelectedOpponentPlayer] = useState<number | null>(null);
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);
  
  // Online room form states
  const [serverUrl, setServerUrl] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  
  // Confirmation states
  const [isPlayer1GacoConfirmed, setIsPlayer1GacoConfirmed] = useState(false);
  const [isPlayer2GacoConfirmed, setIsPlayer2GacoConfirmed] = useState(false);
  
  // Animation values for mode tabs
  const lokalScale = useRef(new Animated.Value(1)).current;
  const lokalTranslateY = useRef(new Animated.Value(0)).current;
  const onlineScale = useRef(new Animated.Value(1)).current;
  const onlineTranslateY = useRef(new Animated.Value(0)).current;
  
  // Animation values for player tabs
  const player1Scale = useRef(new Animated.Value(1)).current;
  const player2Scale = useRef(new Animated.Value(1)).current;
  
  // Animation for gaco carousel
  const gacoOpacity = useRef(new Animated.Value(1)).current;

  // Mode tab animation
  useEffect(() => {
    if (activeMode === 'lokal') {
      Animated.parallel([
        Animated.timing(lokalScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(onlineScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(lokalScale, {
          toValue:1 ,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(onlineScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeMode]);

  // Player tab animation
  useEffect(() => {
    if (activePlayer === 'player1') {
      Animated.parallel([
        Animated.timing(player1Scale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(player2Scale, {
          toValue: 0.92,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(player1Scale, {
          toValue: 0.92,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(player2Scale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activePlayer]);

  const handleModePress = (mode: ModeType) => {
    setActiveMode(mode);
  };

  const handlePlayerPress = (player: PlayerType) => {
    setActivePlayer(player);
  };

  const handleGacoPrev = (playerNum: 1 | 2) => {
    Animated.sequence([
      Animated.timing(gacoOpacity, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(gacoOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (playerNum === 1) {
      setSelectedPlayer1Gaco(prev => (prev - 1 + GACOS.length) % GACOS.length);
      setIsPlayer1GacoConfirmed(false);
    } else {
      setSelectedPlayer2Gaco(prev => (prev - 1 + GACOS.length) % GACOS.length);
      setIsPlayer2GacoConfirmed(false);
    }
  };

  const handleGacoNext = (playerNum: 1 | 2) => {
    Animated.sequence([
      Animated.timing(gacoOpacity, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(gacoOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (playerNum === 1) {
      setSelectedPlayer1Gaco(prev => (prev + 1) % GACOS.length);
      setIsPlayer1GacoConfirmed(false);
    } else {
      setSelectedPlayer2Gaco(prev => (prev + 1) % GACOS.length);
      setIsPlayer2GacoConfirmed(false);
    }
  };

  const handleConfirmGaco = (playerNum: 1 | 2) => {
    if (playerNum === 1) {
      setIsPlayer1GacoConfirmed(true);
    } else {
      setIsPlayer2GacoConfirmed(true);
    }
  };

  const handleCancelGaco = (playerNum: 1 | 2) => {
    if (playerNum === 1) {
      setIsPlayer1GacoConfirmed(false);
    } else {
      setIsPlayer2GacoConfirmed(false);
    }
  };

  const isGacoTaken = (gacoId: number, playerNum: 1 | 2) => {
    if (playerNum === 1) {
      // Player 1 checking: only consider taken if Player 2 has CONFIRMED
      return isPlayer2GacoConfirmed && gacoId === selectedPlayer2Gaco;
    } else {
      // Player 2 checking: only consider taken if Player 1 has CONFIRMED
      return isPlayer1GacoConfirmed && gacoId === selectedPlayer1Gaco;
    }
  };

  const handleStartGame = () => {
    if (onStartGame) {
      onStartGame({
        mode: activeMode,
        player1Gaco: selectedPlayer1Gaco,
        player2Gaco: selectedPlayer2Gaco,
        opponentType: activeMode === 'lokal' ? opponentType : 'online',
        opponentPlayerId: selectedOpponentPlayer,
      });
    }
  };

  const currentPlayerGaco = activePlayer === 'player1' ? selectedPlayer1Gaco : selectedPlayer2Gaco;
  const isCurrentGacoTaken = isGacoTaken(currentPlayerGaco, activePlayer === 'player1' ? 1 : 2);

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardContainer}>
        {/* Mode Tabs: Lokal / Online */}
        <View style={styles.tabContainer}>
          <Animated.View
            style={[
              styles.tabButtonWrapper,
              {
                transform: [
                  { scale: lokalScale },
                  { translateY: lokalTranslateY },
                ],
                zIndex: activeMode === 'lokal' ? 2 : 1,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.tabButton,
                styles.tabButtonLeft,
                styles.tabButtonLokal,
                activeMode !== 'lokal' && styles.tabInactiveLeft,
              ]}
              onPress={() => handleModePress('lokal')}
              activeOpacity={0.8}
            >
              <Text style={styles.tabTextLokal}>Offline</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.tabButtonWrapper,
              {
                transform: [
                  { scale: onlineScale },
                  { translateY: onlineTranslateY },
                ],
                zIndex: activeMode === 'online' ? 2 : 1,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.tabButton,
                styles.tabButtonRight,
                styles.tabButtonOnline,
                activeMode !== 'online' && styles.tabInactiveRight,
              ]}
              onPress={() => handleModePress('online')}
              activeOpacity={0.8}
            >
              <Text style={styles.tabTextOnline}>Online</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Content Section */}
        <View style={[
          styles.contentSection,
          { backgroundColor: activeMode === 'lokal' ? '#FFFFFF' : '#2976BF' }
        ]}>
          {/* Player Tabs: Player 1 / Player 2 - Only for Lokal Mode */}
          {activeMode === 'lokal' && (
            <View style={styles.playerTabContainer}>
              <Animated.View style={{ transform: [{ scale: player1Scale }] }}>
                <TouchableOpacity
                  style={[
                    styles.playerTab,
                    activePlayer === 'player1' && styles.playerTabActive,
                  ]}
                  onPress={() => handlePlayerPress('player1')}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.playerTabText,
                    activePlayer === 'player1' && styles.playerTabTextActive,
                  ]}>
                    Player 1
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: player2Scale }] }}>
                <TouchableOpacity
                  style={[
                    styles.playerTab,
                    activePlayer === 'player2' && styles.playerTabActive,
                  ]}
                  onPress={() => handlePlayerPress('player2')}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.playerTabText,
                    activePlayer === 'player2' && styles.playerTabTextActive,
                  ]}>
                    Player 2
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 0 }}>
            {/* Player 1 Content - Lokal Mode */}
            {activePlayer === 'player1' && activeMode === 'lokal' && (
              <View style={styles.playerContent}>
                <Text style={styles.sectionTitle}>
                  Pilih Gaco Kamu
                </Text>
                
                {/* Gaco Selector */}
                <View style={styles.gacoSelector}>
                  <TouchableOpacity 
                    style={[
                      styles.gacoArrow,
                      isPlayer1GacoConfirmed && styles.gacoArrowDisabled
                    ]}
                    onPress={() => handleGacoPrev(1)}
                    disabled={isPlayer1GacoConfirmed}
                  >
                    <ChevronLeft color="#1F2937" size={32} />
                  </TouchableOpacity>

                  <Animated.View style={[
                    styles.gacoDisplay,
                    { opacity: gacoOpacity },
                    isGacoTaken(selectedPlayer1Gaco, 1) && styles.gacoTaken
                  ]}>
                    <Image 
                      source={GACOS[selectedPlayer1Gaco].image} 
                      style={[
                        styles.gacoImage,
                        isGacoTaken(selectedPlayer1Gaco, 1) && styles.gacoImageTaken
                      ]}
                      resizeMode="contain"
                    />
                    <Text style={styles.gacoName}>
                      {GACOS[selectedPlayer1Gaco].name}
                    </Text>
                    {isGacoTaken(selectedPlayer1Gaco, 1) && (
                      <Text style={styles.gacoTakenText}>Sudah Dipakai Player 2</Text>
                    )}
                  </Animated.View>

                  <TouchableOpacity 
                    style={[
                      styles.gacoArrow,
                      isPlayer1GacoConfirmed && styles.gacoArrowDisabled
                    ]}
                    onPress={() => handleGacoNext(1)}
                    disabled={isPlayer1GacoConfirmed}
                  >
                    <ChevronRight color="#1F2937" size={32} />
                  </TouchableOpacity>
                </View>

                {/* Confirm/Cancel Buttons */}
                <View style={styles.gacoButtonContainer}>
                  {!isPlayer1GacoConfirmed ? (
                    <TouchableOpacity
                      style={[
                        styles.confirmButton,
                        isGacoTaken(selectedPlayer1Gaco, 1) && styles.confirmButtonDisabled
                      ]}
                      onPress={() => handleConfirmGaco(1)}
                      disabled={isGacoTaken(selectedPlayer1Gaco, 1)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.confirmButtonText}>
                        Pilih
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.gacoButtonRow}>
                      <View style={styles.confirmedButton}>
                        <Text style={styles.confirmedButtonText}>✓ Dipilih</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => handleCancelGaco(1)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.cancelButtonText}>Ganti</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Player 2 Content */}
            {activePlayer === 'player2' && activeMode === 'lokal' && (
              <View style={styles.playerContent}>
                {/* Opponent Type Selector */}
                <View style={styles.opponentTypeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.opponentTypeButton,
                      opponentType === 'pemain' && styles.opponentTypeButtonActive
                    ]}
                    onPress={() => setOpponentType('pemain')}
                    activeOpacity={0.8}
                  >
                    <Users color={opponentType === 'pemain' ? '#FFFFFF' : '#6B7280'} size={24} />
                    <Text style={[
                      styles.opponentTypeText,
                      opponentType === 'pemain' && styles.opponentTypeTextActive
                    ]}>
                      Pemain
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.opponentTypeButton,
                      opponentType === 'komputer' && styles.opponentTypeButtonActive
                    ]}
                    onPress={() => setOpponentType('komputer')}
                    activeOpacity={0.8}
                  >
                    <Cpu color={opponentType === 'komputer' ? '#FFFFFF' : '#6B7280'} size={24} />
                    <Text style={[
                      styles.opponentTypeText,
                      opponentType === 'komputer' && styles.opponentTypeTextActive
                    ]}>
                      Komputer
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Player Selection for "Pemain" */}
                {opponentType === 'pemain' && (
                  <View style={styles.playerSelectionSection}>
                    <Text style={styles.sectionTitle}>Pilih Pemain Lawan</Text>
                    
                    <TouchableOpacity
                      style={styles.combobox}
                      onPress={() => setShowPlayerDropdown(!showPlayerDropdown)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.comboboxText}>
                        {selectedOpponentPlayer 
                          ? availablePlayers.find(p => p.id === selectedOpponentPlayer)?.username || 'Pilih Pemain'
                          : 'Pilih Pemain'
                        }
                      </Text>
                      <ChevronRight color="#6B7280" size={20} />
                    </TouchableOpacity>

                    {showPlayerDropdown && (
                      <View style={styles.dropdown}>
                        <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                          {availablePlayers
                            .filter(p => p.id !== currentUserId)
                            .map(player => (
                              <TouchableOpacity
                                key={player.id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                  setSelectedOpponentPlayer(player.id);
                                  setShowPlayerDropdown(false);
                                }}
                                activeOpacity={0.7}
                              >
                                <Text style={styles.dropdownItemText}>{player.username}</Text>
                                <Text style={styles.dropdownItemSubtext}>{player.nama_lengkap}</Text>
                              </TouchableOpacity>
                            ))
                          }
                        </ScrollView>
                      </View>
                    )}
                  </View>
                )}

                {/* Gaco Selection for Player 2 */}
                <View style={styles.gacoSection}>
                  <Text style={styles.sectionTitle}>
                    Pilih Gaco {opponentType === 'komputer' ? 'Komputer' : 'Player 2'}
                  </Text>
                  
                  <View style={styles.gacoSelector}>
                    <TouchableOpacity 
                      style={[
                        styles.gacoArrow,
                        isPlayer2GacoConfirmed && styles.gacoArrowDisabled
                      ]}
                      onPress={() => handleGacoPrev(2)}
                      disabled={isPlayer2GacoConfirmed}
                    >
                      <ChevronLeft color="#1F2937" size={32} />
                    </TouchableOpacity>

                    <Animated.View style={[
                      styles.gacoDisplay,
                      { opacity: gacoOpacity },
                      isGacoTaken(selectedPlayer2Gaco, 2) && styles.gacoTaken
                    ]}>
                      <Image 
                        source={GACOS[selectedPlayer2Gaco].image} 
                        style={[
                          styles.gacoImage,
                          isGacoTaken(selectedPlayer2Gaco, 2) && styles.gacoImageTaken
                        ]}
                        resizeMode="contain"
                      />
                      <Text style={styles.gacoName}>{GACOS[selectedPlayer2Gaco].name}</Text>
                      {isGacoTaken(selectedPlayer2Gaco, 2) && (
                        <Text style={styles.gacoTakenText}>Sudah Dipakai</Text>
                      )}
                    </Animated.View>

                    <TouchableOpacity 
                      style={[
                        styles.gacoArrow,
                        isPlayer2GacoConfirmed && styles.gacoArrowDisabled
                      ]}
                      onPress={() => handleGacoNext(2)}
                      disabled={isPlayer2GacoConfirmed}
                    >
                      <ChevronRight color="#1F2937" size={32} />
                    </TouchableOpacity>
                  </View>

                  {/* Confirm/Cancel Buttons */}
                  <View style={styles.gacoButtonContainer}>
                    {!isPlayer2GacoConfirmed ? (
                      <TouchableOpacity
                        style={[
                          styles.confirmButton,
                          isGacoTaken(selectedPlayer2Gaco, 2) && styles.confirmButtonDisabled
                        ]}
                        onPress={() => handleConfirmGaco(2)}
                        disabled={isGacoTaken(selectedPlayer2Gaco, 2)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.confirmButtonText}>Pilih</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.gacoButtonRow}>
                        <View style={styles.confirmedButton}>
                          <Text style={styles.confirmedButtonText}>✓ Dipilih</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => handleCancelGaco(2)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.cancelButtonText}>Ganti</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* Online Mode - Room Selection and Gaco */}
            {activeMode === 'online' && (
              <View style={styles.onlineContentWrapper}>
                {/* Room Type Selector: Buat Room / Gabung Room */}
                <View style={styles.onlineRoomSection}>
                  <View style={styles.opponentTypeContainer}>
                    <TouchableOpacity
                      style={[
                        styles.opponentTypeButton,
                        styles.onlineRoomButton,
                        onlineRoomType === 'buat' && styles.onlineRoomButtonActive
                      ]}
                      onPress={() => setOnlineRoomType('buat')}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.opponentTypeText,
                        styles.textWhite,
                        onlineRoomType === 'buat' && styles.onlineRoomTextActive
                      ]}>
                        Buat Room
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.opponentTypeButton,
                        styles.onlineRoomButton,
                        onlineRoomType === 'gabung' && styles.onlineRoomButtonActive
                      ]}
                      onPress={() => setOnlineRoomType('gabung')}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.opponentTypeText,
                        styles.textWhite,
                        onlineRoomType === 'gabung' && styles.onlineRoomTextActive
                      ]}>
                        Gabung Room
                      </Text>
                    </TouchableOpacity>
                  </View>

                {/* Buat Room Form */}
                {onlineRoomType === 'buat' && (
                  <View style={styles.roomFormSection}>
                    {/* Gaco Selection for Buat Room */}
                    <View style={styles.playerContent}>
                      <Text style={[styles.sectionTitle, styles.textWhite]}>
                        Pilih Gaco Kamu
                      </Text>
                      
                      <View style={styles.gacoSelector}>
                        <TouchableOpacity 
                          style={[
                            styles.gacoArrow,
                            isPlayer1GacoConfirmed && styles.gacoArrowDisabled
                          ]}
                          onPress={() => handleGacoPrev(1)}
                          disabled={isPlayer1GacoConfirmed}
                        >
                          <ChevronLeft color="#FFFFFF" size={32} />
                        </TouchableOpacity>

                        <Animated.View style={[
                          styles.gacoDisplay,
                          { opacity: gacoOpacity }
                        ]}>
                          <Image 
                            source={GACOS[selectedPlayer1Gaco].image} 
                            style={styles.gacoImage}
                            resizeMode="contain"
                          />
                          <Text style={[styles.gacoName, styles.textWhite]}>
                            {GACOS[selectedPlayer1Gaco].name}
                          </Text>
                        </Animated.View>

                        <TouchableOpacity 
                          style={[
                            styles.gacoArrow,
                            isPlayer1GacoConfirmed && styles.gacoArrowDisabled
                          ]}
                          onPress={() => handleGacoNext(1)}
                          disabled={isPlayer1GacoConfirmed}
                        >
                          <ChevronRight color="#FFFFFF" size={32} />
                        </TouchableOpacity>
                      </View>

                      {/* Confirm/Cancel Buttons */}
                      <View style={styles.gacoButtonContainer}>
                        {!isPlayer1GacoConfirmed ? (
                          <TouchableOpacity
                            style={[styles.confirmButton, styles.confirmButtonOnline]}
                            onPress={() => handleConfirmGaco(1)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.confirmButtonText, styles.confirmButtonTextOnline]}>
                              Pilih
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.gacoButtonRow}>
                            <View style={styles.confirmedButton}>
                              <Text style={styles.confirmedButtonText}>✓ Dipilih</Text>
                            </View>
                            <TouchableOpacity
                              style={styles.cancelButton} 
                              onPress={() => handleCancelGaco(1)}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.cancelButtonText}>Ganti</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>

                    <Text style={[styles.formLabel, styles.textWhite]}>Server URL</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputOnline]}
                      placeholder="https://server-url.com"
                      placeholderTextColor="#9CA3AF"
                      value={serverUrl}
                      onChangeText={setServerUrl}
                    />

                    <Text style={[styles.formLabel, styles.textWhite]}>Nama Room</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputOnline]}
                      placeholder="Masukkan nama room"
                      placeholderTextColor="#9CA3AF"
                      value={roomName}
                      onChangeText={setRoomName}
                    />

                    <Text style={[styles.formLabel, styles.textWhite]}>Password (Opsional)</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputOnline]}
                      placeholder="Kosongkan jika tidak ada password"
                      placeholderTextColor="#9CA3AF"
                      value={roomPassword}
                      onChangeText={setRoomPassword}
                      secureTextEntry
                    />
                  </View>
                )}

                {/* Gabung Room Form */}
                {onlineRoomType === 'gabung' && (
                  <View style={styles.roomFormSection}>
                    <Text style={[styles.formLabel, styles.textWhite]}>Server URL</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputOnline]}
                      placeholder="https://server-url.com"
                      placeholderTextColor="#9CA3AF"
                      value={serverUrl}
                      onChangeText={setServerUrl}
                    />

                    <Text style={[styles.formLabel, styles.textWhite]}>Kode Room (5 Karakter)</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputOnline]}
                      placeholder="ABCDE"
                      placeholderTextColor="#9CA3AF"
                      value={roomCode}
                      onChangeText={(text) => setRoomCode(text.toUpperCase().slice(0, 5))}
                      maxLength={5}
                      autoCapitalize="characters"
                    />

                    <Text style={[styles.formLabel, styles.textWhite]}>Password (Opsional)</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputOnline]}
                      placeholder="Kosongkan jika tidak ada password"
                      placeholderTextColor="#9CA3AF"
                      value={roomPassword}
                      onChangeText={setRoomPassword}
                      secureTextEntry
                    />
                  </View>
                )}
                </View>
              </View>
            )}

            {/* Start Button */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartGame}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>
                {activeMode === 'online' 
                  ? (onlineRoomType === 'buat' ? 'Buat Room' : 'Gabung Room')
                  : 'Mulai Game'
                }
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
