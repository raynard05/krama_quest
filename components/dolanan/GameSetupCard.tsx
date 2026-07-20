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
  PanResponder,
  ImageBackground,
} from 'react-native';
import { Users, Cpu } from 'lucide-react-native';
import { styles } from './GameSetupCardStyles';
import WaitingRoomCard from './WaitingRoomCard';
import JoinRoomCard from './JoinRoomCard';
import { GameNetwork, NetworkEvent } from '../../services/GameNetwork';
import { ProfileService } from '../../services/ProfileService';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';

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
  currentUserAvatarId?: string;
  availablePlayers?: Player[];
}

export const GACOS: Gaco[] = [
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
  currentUserAvatarId,
  availablePlayers = []
}: GameSetupCardProps) {
  const currentUserProfile = availablePlayers.find(p => p.id === currentUserId);
  const currentUserName = currentUserProfile?.nama_lengkap || currentUserProfile?.username || 'Anda';
  
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

  // Waiting Room states
  const [isWaitingRoomActive, setIsWaitingRoomActive] = useState(false);
  const [activeRoomCode, setActiveRoomCode] = useState('');
  const [joinedPlayer, setJoinedPlayer] = useState<{
    name: string;
    color: string;
    avatarId: string;
    userId: number;
  } | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);

  // Join Room states
  const [isJoinRoomActive, setIsJoinRoomActive] = useState(false);
  const [joinRoomStatusText, setJoinRoomStatusText] = useState('');
  const [joinRoomIsConnected, setJoinRoomIsConnected] = useState(false);
  const [joinedHostPlayer, setJoinedHostPlayer] = useState<{
    name: string;
    avatarId: string;
  } | null>(null);
  const [assignedPlayerId, setAssignedPlayerId] = useState<number>(2);
  const [hostGacoId, setHostGacoId] = useState<number | null>(null);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const cleanServerUrl = (url: string) => {
    let cleaned = url.trim();
    if (!cleaned) return '';
    // Prepend http:// for local IPs, otherwise https://
    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      const isLocal = cleaned.startsWith('localhost') || 
                      cleaned.startsWith('192.168.') || 
                      cleaned.startsWith('10.') || 
                      cleaned.startsWith('172.');
      cleaned = (isLocal ? 'http://' : 'https://') + cleaned;
    }
    // Remove trailing slash if present
    if (cleaned.endsWith('/')) {
      cleaned = cleaned.slice(0, -1);
    }
    return cleaned;
  };

  const handleStartButtonPress = async () => {
    if (activeMode === 'online') {
      const cleanedUrl = cleanServerUrl(serverUrl);
      if (onlineRoomType === 'buat') {
        if (!cleanedUrl) {
          alert('Masukkan Server URL terlebih dahulu!');
          return;
        }
        
        try {
          // Save Host Gaco (selectedPlayer1Gaco + 1) directly to database gaco_num
          const hostGacoId = selectedPlayer1Gaco + 1;
          await ProfileService.updateUserGaco(currentUserId, String(hostGacoId));
        } catch (err) {
          console.warn('Failed to save host gaco to Supabase:', err);
        }

        setActiveRoomCode('Menghubungkan...');
        setIsWaitingRoomActive(true);
        GameNetwork.startServer(cleanedUrl, roomPassword.trim() || undefined);
      } else {
        // onlineRoomType === 'gabung'
        if (!cleanedUrl) {
          alert('Masukkan Server URL terlebih dahulu!');
          return;
        }
        if (!roomCode.trim() || roomCode.trim().length < 5) {
          alert('Masukkan Kode Room 5 Karakter!');
          return;
        }
        setJoinRoomStatusText('Menghubungkan ke server...');
        setJoinRoomIsConnected(false);
        setIsJoinRoomActive(true);

        const clientInfo = {
          name: currentUserName,
          color: '#2976BF',
          icon: String(currentUserId) // send current user's DB ID in the icon slot!
        };
        GameNetwork.connectToServer(
          cleanedUrl,
          roomCode.toUpperCase().trim(),
          roomPassword.trim(),
          clientInfo
        );
      }
    } else {
      handleStartGame();
    }
  };

  const handleLaunchOnlineGame = () => {
    const opponentName = joinedPlayer?.name || 'Pemain 2';
    const opponentColor = joinedPlayer?.color || '#EF4444';
    const opponentUserId = joinedPlayer?.userId || 0;

    // Broadcast play status to all connected clients
    GameNetwork.broadcastState({
      players: [
        { id: 1, name: currentUserName, color: '#2976BF', icon: String(currentUserId), position: 0, type: 'human', isWinner: false },
        { 
          id: 2, 
          name: opponentName, 
          color: opponentColor, 
          icon: String(opponentUserId), 
          position: 0, 
          type: 'human', 
          isWinner: false 
        }
      ],
      currentPlayerIndex: 0,
      status: 'playing',
      dieValue: 1,
      isRolling: false,
      logs: [{
        id: 'start-online',
        playerId: 0,
        playerName: 'Sistem',
        playerColor: '#00F2FE',
        message: 'Permainan Multiplayer dimulai!',
        timestamp: new Date(),
        type: 'roll'
      }],
      winner: null
    });

    if (onStartGame) {
      onStartGame({
        mode: 'online',
        player1Gaco: selectedPlayer1Gaco,
        player2Gaco: selectedPlayer2Gaco,
        opponentType: 'online',
        opponentPlayerId: selectedOpponentPlayer,
        networkRole: 'host',
        localPlayerId: 1,
        playersList: [
          { id: 1, name: currentUserName, color: '#2976BF', icon: String(currentUserId), position: 0, type: 'human', isWinner: false },
          { id: 2, name: opponentName, color: opponentColor, icon: String(opponentUserId), position: 0, type: 'human', isWinner: false }
        ]
      });
    }
  };

  const handleCancelWaitingRoom = () => {
    GameNetwork.closeAll();
    setIsWaitingRoomActive(false);
    setJoinedPlayer(null);
    setIsClientReady(false);
  };

  const handleCancelJoinRoom = () => {
    GameNetwork.closeAll();
    setIsJoinRoomActive(false);
    setJoinedHostPlayer(null);
    setJoinRoomIsConnected(false);
    setHostGacoId(null);
  };

  const handleConfirmClientGaco = async (gacoId: number): Promise<boolean> => {
    try {
      const success = await ProfileService.updateUserGaco(currentUserId, String(gacoId));
      return success;
    } catch (err) {
      console.warn('Failed to update client gaco in DB:', err);
      return false;
    }
  };

  const handleClientReadyChange = (isReady: boolean) => {
    if (isReady) {
      GameNetwork.requestAction('ready', assignedPlayerId);
    }
  };

  // Listen for socket events
  useEffect(() => {
    if (!isWaitingRoomActive && !isJoinRoomActive) return;

    const handler = (event: NetworkEvent) => {
      // Host side events
      if (isWaitingRoomActive) {
        switch (event.type) {
          case 'room_created':
            setActiveRoomCode(event.roomCode);
            break;

          case 'client_join_request':
            // Accept the client as Player 2
            GameNetwork.confirmClientJoin(event.socket, 2, true);
            
            const clientUserId = parseInt(event.payload.icon, 10);
            setIsClientReady(false); // Reset ready status

            // Query client profile from DB instead of using sent values directly
            ProfileService.fetchUserFullProfile(clientUserId).then((profile) => {
              const opponentInfo = {
                name: event.payload.name || 'Pemain 2',
                color: event.payload.color || '#EF4444',
                avatarId: profile.avatarId,
                userId: clientUserId,
              };
              setJoinedPlayer(opponentInfo);

              // Broadcast lobby state to client
              setTimeout(() => {
                GameNetwork.broadcastState({
                  players: [
                    { id: 1, name: currentUserName, color: '#2976BF', icon: String(currentUserId), position: 0, type: 'human', isWinner: false },
                    { id: 2, name: opponentInfo.name, color: opponentInfo.color, icon: String(clientUserId), position: 0, type: 'human', isWinner: false }
                  ],
                  currentPlayerIndex: 0,
                  status: 'lobby',
                  dieValue: 1,
                  isRolling: false,
                  logs: [],
                  winner: null
                });
              }, 150);
            }).catch(err => {
              console.warn('Lobby fetch client profile error:', err);
              const opponentInfo = {
                name: event.payload.name || 'Pemain 2',
                color: event.payload.color || '#EF4444',
                avatarId: '2',
                userId: clientUserId,
              };
              setJoinedPlayer(opponentInfo);
            });
            break;

          case 'action_requested':
            if (event.action === 'ready' && event.playerId === 2) {
              setIsClientReady(true);
            }
            break;

          case 'client_disconnected':
            setJoinedPlayer(null);
            setIsClientReady(false);
            break;

          case 'connection_status':
            if (event.status === 'error') {
              alert(event.error || 'Terjadi kesalahan jaringan.');
              handleCancelWaitingRoom();
            } else if (event.status === 'disconnected') {
              handleCancelWaitingRoom();
            }
            break;
        }
      }

      // Client side events
      if (isJoinRoomActive) {
        switch (event.type) {
          case 'join_result':
            if (event.success) {
              setJoinRoomIsConnected(true);
              setJoinRoomStatusText('Berhasil masuk! Pilih gaco dan klik Siap...');
              if (event.playerId) {
                setAssignedPlayerId(event.playerId);
              }
            } else {
              alert(event.error || 'Ditolak masuk ke room.');
              handleCancelJoinRoom();
            }
            break;

          case 'state_synced':
            // Find the Host player (id: 1)
            const host = event.state.players.find(p => p.id === 1);
            if (host) {
              const hostUserId = parseInt(host.icon, 10);
              if (!isNaN(hostUserId)) {
                ProfileService.fetchUserFullProfile(hostUserId).then((profile) => {
                  setJoinedHostPlayer({
                    name: host.name,
                    avatarId: profile.avatarId
                  });
                  setHostGacoId(parseInt(profile.gacoId, 10)); // Save host's selected gaco ID
                }).catch(err => {
                  console.warn('Lobby fetch host profile error:', err);
                  setJoinedHostPlayer({
                    name: host.name,
                    avatarId: '1'
                  });
                });
              } else {
                setJoinedHostPlayer({
                  name: host.name,
                  avatarId: '1'
                });
              }
            }

            // If the host starts playing, transition our screen!
            if (event.state.status === 'playing') {
              if (onStartGame) {
                onStartGame({
                  mode: 'online',
                  player1Gaco: selectedPlayer1Gaco,
                  player2Gaco: selectedPlayer2Gaco,
                  opponentType: 'online',
                  opponentPlayerId: selectedOpponentPlayer,
                  networkRole: 'client',
                  localPlayerId: assignedPlayerId,
                  playersList: event.state.players
                });
              }
            }
            break;

          case 'connection_status':
            if (event.status === 'error') {
              alert(event.error || 'Terjadi kesalahan jaringan.');
              handleCancelJoinRoom();
            } else if (event.status === 'disconnected') {
              handleCancelJoinRoom();
            }
            break;
        }
      }
    };

    GameNetwork.registerListener(handler);

    return () => {
      GameNetwork.unregisterListener(handler);
    };
  }, [isWaitingRoomActive, isJoinRoomActive, currentUserAvatarId, joinedPlayer, joinedHostPlayer, assignedPlayerId, isClientReady]);

  // Animation values for mode tabs
  const lokalScale = useRef(new Animated.Value(1)).current;
  const lokalTranslateY = useRef(new Animated.Value(0)).current;
  const onlineScale = useRef(new Animated.Value(1)).current;
  const onlineTranslateY = useRef(new Animated.Value(0)).current;

  // Animation values for player tabs
  const player1Scale = useRef(new Animated.Value(1)).current;
  const player2Scale = useRef(new Animated.Value(1)).current;

  // Pan responder for swipe gesture on Player 1 gaco
  const panResponderPlayer1 = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 && !isPlayer1GacoConfirmed;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 30) {
          handleGacoPrev(1);
        } else if (gestureState.dx < -30) {
          handleGacoNext(1);
        }
      },
    })
  ).current;

  // Pan responder for swipe gesture on Player 2 gaco
  const panResponderPlayer2 = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 && !isPlayer2GacoConfirmed;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 30) {
          handleGacoPrev(2);
        } else if (gestureState.dx < -30) {
          handleGacoNext(2);
        }
      },
    })
  ).current;

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
    if (playerNum === 1) {
      setSelectedPlayer1Gaco(prev => (prev - 1 + GACOS.length) % GACOS.length);
      setIsPlayer1GacoConfirmed(false);
    } else {
      setSelectedPlayer2Gaco(prev => (prev - 1 + GACOS.length) % GACOS.length);
      setIsPlayer2GacoConfirmed(false);
    }
  };

  const handleGacoNext = (playerNum: 1 | 2) => {
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

  return (
    <View style={styles.cardWrapper}>
      {isWaitingRoomActive ? (
        <WaitingRoomCard
          roomCode={activeRoomCode}
          currentUserAvatarId={currentUserAvatarId}
          currentUserName={currentUserName}
          player2Name={joinedPlayer?.name}
          player2AvatarId={joinedPlayer?.avatarId}
          isPlayer2Ready={isClientReady}
          onStartGame={handleLaunchOnlineGame}
          onCancel={handleCancelWaitingRoom}
        />
      ) : isJoinRoomActive ? (
        <JoinRoomCard
          roomCode={roomCode.toUpperCase()}
          statusText={joinRoomStatusText}
          isConnected={joinRoomIsConnected}
          currentUserAvatarId={currentUserAvatarId}
          hostName={joinedHostPlayer?.name}
          hostAvatarId={joinedHostPlayer?.avatarId}
          takenGacoId={hostGacoId || undefined}
          onCancel={handleCancelJoinRoom}
          onConfirmGaco={handleConfirmClientGaco}
          onReadyChange={handleClientReadyChange}
        />
      ) : (
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
              <SoundTouchableOpacity
                style={[
                  styles.tabButton,
                  styles.tabButtonLeft,
                  activeMode !== 'lokal' && styles.tabInactiveLeft,
                  { paddingVertical: 0, overflow: 'hidden' }
                ]}
                onPress={() => handleModePress('lokal')}
                activeOpacity={1}
              >
                <ImageBackground
                  source={require('../../assets/texture/texture2.png')}
                  style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 21 }}
                  resizeMode="cover"
                >
                  <Text style={styles.tabTextLokal}>Offline</Text>
                </ImageBackground>
              </SoundTouchableOpacity>
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
              <SoundTouchableOpacity
                style={[
                  styles.tabButton,
                  styles.tabButtonRight,
                  activeMode !== 'online' && styles.tabInactiveRight,
                  { paddingVertical: 0, overflow: 'hidden' }
                ]}
                onPress={() => handleModePress('online')}
                activeOpacity={1}
              >
                <ImageBackground
                  source={require('../../assets/texture/texture1.png')}
                  style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 21 }}
                  resizeMode="cover"
                >
                  <Text style={styles.tabTextOnline}>Online</Text>
                </ImageBackground>
              </SoundTouchableOpacity>
            </Animated.View>
          </View>

          <ImageBackground 
            source={activeMode === 'lokal' ? require('../../assets/texture/texture2.png') : require('../../assets/texture/texture1.png')}
            style={[
              styles.contentSection,
              { overflow: 'hidden' }
            ]}
            resizeMode="cover"
          >
          {/* Player Tabs: Player 1 / Player 2 - Only for Lokal Mode */}
          {activeMode === 'lokal' && (
            <View style={styles.playerTabContainer}>
              <Animated.View style={{ transform: [{ scale: player1Scale }] }}>
                <SoundTouchableOpacity
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
                </SoundTouchableOpacity>
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: player2Scale }] }}>
                <SoundTouchableOpacity
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
                </SoundTouchableOpacity>
              </Animated.View>
            </View>
          )}

          <View>
            {/* Player 1 Content - Lokal Mode */}
            {activePlayer === 'player1' && activeMode === 'lokal' && (
              <View style={styles.playerContent}>
                <Text style={styles.sectionTitle}>
                  Pilih Gaco Kamu
                </Text>

                <View style={styles.gacoSelector}>

                  <View style={styles.gacoCarousel} {...panResponderPlayer1.panHandlers}>
                    {/* Previous Gaco (Left) */}
                    <Animated.View style={[
                      styles.gacoDisplaySide,
                      { opacity: isPlayer1GacoConfirmed ? 0.3 : 0.4 }
                    ]}>
                      <Image
                        source={GACOS[(selectedPlayer1Gaco - 1 + GACOS.length) % GACOS.length].image}
                        style={styles.gacoImageSide}
                        resizeMode="contain"
                      />
                    </Animated.View>

                    {/* Active Gaco (Center) */}
                    <Animated.View style={styles.gacoDisplayCenter}>
                      <View style={[
                        styles.gacoImageWrapper,
                        isGacoTaken(selectedPlayer1Gaco, 1) && styles.gacoImageWrapperTaken
                      ]}>
                        <Image
                          source={GACOS[selectedPlayer1Gaco].image}
                          style={[
                            styles.gacoImageCenter,
                            isGacoTaken(selectedPlayer1Gaco, 1) && styles.gacoImageTaken
                          ]}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.gacoName}>
                        {GACOS[selectedPlayer1Gaco].name}
                      </Text>
                      {isGacoTaken(selectedPlayer1Gaco, 1) && (
                        <Text style={styles.gacoTakenText}>Sudah Dipakai Player 2</Text>
                      )}
                    </Animated.View>

                    {/* Next Gaco (Right) */}
                    <Animated.View style={[
                      styles.gacoDisplaySide,
                      { opacity: isPlayer1GacoConfirmed ? 0.3 : 0.4 }
                    ]}>
                      <Image
                        source={GACOS[(selectedPlayer1Gaco + 1) % GACOS.length].image}
                        style={styles.gacoImageSide}
                        resizeMode="contain"
                      />
                    </Animated.View>

                    {/* Swipe GIF Indicator */}
                    {!isPlayer1GacoConfirmed && (
                      <Image
                        source={require('../../assets/dolanan_assets/swipe3.gif')}
                        style={styles.swipeGif}
                        resizeMode="contain"
                      />
                    )}
                  </View>

                </View>

                {/* Confirm/Cancel Buttons */}
                <View style={styles.gacoButtonContainer}>
                  {!isPlayer1GacoConfirmed ? (
                    <SoundTouchableOpacity
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
                    </SoundTouchableOpacity>
                  ) : (
                    <View style={styles.gacoButtonRow}>
                      <View style={styles.confirmedButton}>
                        <Text style={styles.confirmedButtonText}>✓ Dipilih</Text>
                      </View>
                      <SoundTouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => handleCancelGaco(1)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.cancelButtonText}>Ganti</Text>
                      </SoundTouchableOpacity>
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
                  <SoundTouchableOpacity
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
                  </SoundTouchableOpacity>

                  <SoundTouchableOpacity
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
                  </SoundTouchableOpacity>
                </View>

                {/* Player Selection for "Pemain" */}
                {opponentType === 'pemain' && (
                  <View style={styles.playerSelectionSection}>
                    <Text style={styles.sectionTitle}>Pilih Pemain Lawan</Text>

                    <SoundTouchableOpacity
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

                    </SoundTouchableOpacity>

                    {showPlayerDropdown && (
                      <View style={styles.dropdown}>
                        <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                          {availablePlayers
                            .filter(p => p.id !== currentUserId)
                            .map(player => (
                              <SoundTouchableOpacity
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
                              </SoundTouchableOpacity>
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

                    <View style={styles.gacoCarousel} {...panResponderPlayer2.panHandlers}>
                      {/* Previous Gaco (Left) */}
                      <Animated.View style={[
                        styles.gacoDisplaySide,
                        { opacity: isPlayer2GacoConfirmed ? 0.3 : 0.4 }
                      ]}>
                        <Image
                          source={GACOS[(selectedPlayer2Gaco - 1 + GACOS.length) % GACOS.length].image}
                          style={styles.gacoImageSide}
                          resizeMode="contain"
                        />
                      </Animated.View>

                      {/* Active Gaco (Center) */}
                      <Animated.View style={styles.gacoDisplayCenter}>
                        <View style={[
                          styles.gacoImageWrapper,
                          isGacoTaken(selectedPlayer2Gaco, 2) && styles.gacoImageWrapperTaken
                        ]}>
                          <Image
                            source={GACOS[selectedPlayer2Gaco].image}
                            style={[
                              styles.gacoImageCenter,
                              isGacoTaken(selectedPlayer2Gaco, 2) && styles.gacoImageTaken
                            ]}
                            resizeMode="contain"
                          />
                        </View>
                        <Text style={styles.gacoName}>{GACOS[selectedPlayer2Gaco].name}</Text>
                        {isGacoTaken(selectedPlayer2Gaco, 2) && (
                          <Text style={styles.gacoTakenText}>Sudah Dipakai</Text>
                        )}
                      </Animated.View>

                      {/* Next Gaco (Right) */}
                      <Animated.View style={[
                        styles.gacoDisplaySide,
                        { opacity: isPlayer2GacoConfirmed ? 0.3 : 0.4 }
                      ]}>
                        <Image
                          source={GACOS[(selectedPlayer2Gaco + 1) % GACOS.length].image}
                          style={styles.gacoImageSide}
                          resizeMode="contain"
                        />
                      </Animated.View>

                      {/* Swipe GIF Indicator */}
                      {!isPlayer2GacoConfirmed && (
                        <Image
                          source={require('../../assets/dolanan_assets/swipe3.gif')}
                          style={styles.swipeGif}
                          resizeMode="contain"
                        />
                      )}
                    </View>

                  </View>

                  {/* Confirm/Cancel Buttons */}
                  <View style={styles.gacoButtonContainer}>
                    {!isPlayer2GacoConfirmed ? (
                      <SoundTouchableOpacity
                        style={[
                          styles.confirmButton,
                          isGacoTaken(selectedPlayer2Gaco, 2) && styles.confirmButtonDisabled
                        ]}
                        onPress={() => handleConfirmGaco(2)}
                        disabled={isGacoTaken(selectedPlayer2Gaco, 2)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.confirmButtonText}>Pilih</Text>
                      </SoundTouchableOpacity>
                    ) : (
                      <View style={styles.gacoButtonRow}>
                        <View style={styles.confirmedButton}>
                          <Text style={styles.confirmedButtonText}>✓ Dipilih</Text>
                        </View>
                        <SoundTouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => handleCancelGaco(2)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.cancelButtonText}>Ganti</Text>
                        </SoundTouchableOpacity>
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
                    <SoundTouchableOpacity
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
                    </SoundTouchableOpacity>

                    <SoundTouchableOpacity
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
                    </SoundTouchableOpacity>
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

                          <View style={styles.gacoCarousel} {...panResponderPlayer1.panHandlers}>
                            {/* Previous Gaco (Left) */}
                            <Animated.View style={[
                              styles.gacoDisplaySide,
                              { opacity: isPlayer1GacoConfirmed ? 0.3 : 0.4 }
                            ]}>
                              <Image
                                source={GACOS[(selectedPlayer1Gaco - 1 + GACOS.length) % GACOS.length].image}
                                style={styles.gacoImageSide}
                                resizeMode="contain"
                              />
                            </Animated.View>

                            {/* Active Gaco (Center) */}
                            <Animated.View style={styles.gacoDisplayCenter}>
                              <View style={styles.gacoImageWrapper}>
                                <Image
                                  source={GACOS[selectedPlayer1Gaco].image}
                                  style={styles.gacoImageCenter}
                                  resizeMode="contain"
                                />
                              </View>
                              <Text style={[styles.gacoName, styles.textWhite]}>
                                {GACOS[selectedPlayer1Gaco].name}
                              </Text>
                            </Animated.View>

                            {/* Next Gaco (Right) */}
                            <Animated.View style={[
                              styles.gacoDisplaySide,
                              { opacity: isPlayer1GacoConfirmed ? 0.3 : 0.4 }
                            ]}>
                              <Image
                                source={GACOS[(selectedPlayer1Gaco + 1) % GACOS.length].image}
                                style={styles.gacoImageSide}
                                resizeMode="contain"
                              />
                            </Animated.View>

                            {/* Swipe GIF Indicator */}
                            {!isPlayer1GacoConfirmed && (
                              <Image
                                source={require('../../assets/dolanan_assets/swipe3.gif')}
                                style={styles.swipeGif}
                                resizeMode="contain"
                              />
                            )}
                          </View>

                        </View>

                        {/* Confirm/Cancel Buttons */}
                        <View style={styles.gacoButtonContainer}>
                          {!isPlayer1GacoConfirmed ? (
                            <SoundTouchableOpacity
                              style={[styles.confirmButton, styles.confirmButtonOnline]}
                              onPress={() => handleConfirmGaco(1)}
                              activeOpacity={0.8}
                            >
                              <Text style={[styles.confirmButtonText, styles.confirmButtonTextOnline]}>
                                Pilih
                              </Text>
                            </SoundTouchableOpacity>
                          ) : (
                            <View style={styles.gacoButtonRow}>
                              <View style={styles.confirmedButton}>
                                <Text style={styles.confirmedButtonText}>✓ Dipilih</Text>
                              </View>
                              <SoundTouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => handleCancelGaco(1)}
                                activeOpacity={0.8}
                              >
                                <Text style={styles.cancelButtonText}>Ganti</Text>
                              </SoundTouchableOpacity>
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
            <SoundTouchableOpacity
              style={styles.startButton}
              onPress={handleStartButtonPress}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>
                {activeMode === 'online'
                  ? (onlineRoomType === 'buat' ? 'Buat Room' : 'Gabung Room')
                  : 'Mulai Game'
                }
              </Text>
            </SoundTouchableOpacity>
          </View>
        </ImageBackground>
      </View>
      )}
    </View>
  );
}