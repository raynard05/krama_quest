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
import { styles } from '../dolanan/GameSetupCardStyles';
import EvaluasiWaitingRoomCard, { JoinedPlayerInfo } from './EvaluasiWaitingRoomCard';
import EvaluasiJoinRoomCard from './EvaluasiJoinRoomCard';
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
  currentUser?: any;
}

import { GACOS } from '../dolanan/GameConstants';

export default function EvaluasiSetupCard({
  onStartGame,
  currentUser,
}: GameSetupCardProps) {
  const currentUserId = currentUser?.id || 0;
  const currentUserAvatarId = currentUser?.avatarId;
  const currentUserName = currentUser?.username || 'Anda';
  
  const [activeMode, setActiveMode] = useState<ModeType>('online');
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
  const [joinedPlayers, setJoinedPlayers] = useState<JoinedPlayerInfo[]>([]);

  // Join Room states
  const [isJoinRoomActive, setIsJoinRoomActive] = useState(false);
  const [joinRoomStatusText, setJoinRoomStatusText] = useState('');
  const [joinRoomIsConnected, setJoinRoomIsConnected] = useState(false);
  const [playersList, setPlayersList] = useState<any[]>([]);
  const [takenGacoIds, setTakenGacoIds] = useState<number[]>([]);
  
  const [assignedPlayerId, setAssignedPlayerId] = useState<number | null>(null);
  const assignedPlayerIdRef = useRef<number | null>(null);

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
    const gamePlayers: any[] = [
      { id: 1, name: currentUserName, color: '#2976BF', icon: String(currentUserId), position: 0, type: 'human', isWinner: false }
    ];
    joinedPlayers.forEach(p => {
      gamePlayers.push({
        id: p.playerId,
        name: p.name,
        color: p.color,
        icon: String(p.userId),
        position: 0,
        type: 'human',
        isWinner: false
      });
    });

    // Broadcast play status to all connected clients
    GameNetwork.broadcastState({
      players: gamePlayers,
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
        playersList: gamePlayers
      });
    }
  };

  const handleCancelWaitingRoom = () => {
    GameNetwork.closeAll();
    setIsWaitingRoomActive(false);
    setJoinedPlayers([]);
  };

  const handleCancelJoinRoom = () => {
    GameNetwork.closeAll();
    setIsJoinRoomActive(false);
    setPlayersList([]);
    setTakenGacoIds([]);
    setJoinRoomIsConnected(false);
  };

  const handleConfirmClientGaco = async (gacoId: number): Promise<boolean> => {
    if (joinRoomIsConnected) {
      GameNetwork.sendRelay('pj', { type: 'update_gaco', playerId: assignedPlayerId, gacoId });
      return true;
    }
    return false;
  };

  const handleClientReadyChange = (isReady: boolean) => {
    if (isReady && assignedPlayerId !== null) {
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
            setJoinedPlayers(prev => {
              if (prev.length >= 4) {
                GameNetwork.confirmClientJoin(event.socket, -1, false, "Room penuh");
                return prev;
              }
              const newPlayerId = prev.length === 0 ? 2 : Math.max(...prev.map(p => p.playerId)) + 1;
              GameNetwork.confirmClientJoin(event.socket, newPlayerId, true);
              
              const clientUserId = parseInt(event.payload.icon, 10);
              const newPlayer: JoinedPlayerInfo = {
                name: event.payload.name || `Pemain ${newPlayerId}`,
                color: event.payload.color || '#EF4444',
                avatarId: '2',
                userId: clientUserId,
                isReady: false,
                socketId: event.socket,
                playerId: newPlayerId
              };
              
              ProfileService.fetchUserFullProfile(clientUserId).then((profile) => {
                setJoinedPlayers(current => 
                  current.map(p => p.socketId === event.socket ? { ...p, avatarId: profile.avatarId } : p)
                );
              }).catch(err => console.warn('Lobby fetch client profile error:', err));
              
              setTimeout(() => {
                setJoinedPlayers(latestJoined => {
                  const lobbyPlayers: any[] = [
                     { id: 1, name: currentUserName, color: '#2976BF', icon: String(currentUserId), position: 0, type: 'human', isWinner: false, gacoId: selectedPlayer1Gaco + 1 },
                     ...latestJoined.map(p => ({
                       id: p.playerId,
                       name: p.name,
                       color: p.color,
                       icon: String(p.userId),
                       position: 0,
                       type: 'human',
                       isWinner: false,
                       gacoId: p.gacoId
                     }))
                  ];
                  GameNetwork.broadcastState({
                    players: lobbyPlayers,
                    currentPlayerIndex: 0,
                    status: 'lobby',
                    dieValue: 1,
                    isRolling: false,
                    logs: [],
                    winner: null
                  });
                  return latestJoined;
                });
              }, 150);

              return [...prev, newPlayer];
            });
            break;

          case 'action_requested':
            if (event.action === 'ready') {
              setJoinedPlayers(prev => prev.map(p => p.playerId === event.playerId ? { ...p, isReady: true } : p));
            }
            break;

          case 'relay_pj':
            if (event.payload?.type === 'update_gaco') {
              const { playerId, gacoId } = event.payload;
              setJoinedPlayers(prev => {
                const updated = prev.map(p => p.playerId === playerId ? { ...p, gacoId } : p);
                // Re-broadcast state so all clients get the new gacoIds
                const lobbyPlayers: any[] = [
                   { id: 1, name: currentUserName, color: '#2976BF', icon: String(currentUserId), position: 0, type: 'human', isWinner: false, gacoId: selectedPlayer1Gaco + 1 },
                   ...updated.map(p => ({
                     id: p.playerId,
                     name: p.name,
                     color: p.color,
                     icon: String(p.userId),
                     position: 0,
                     type: 'human',
                     isWinner: false,
                     gacoId: p.gacoId
                   }))
                ];
                GameNetwork.broadcastState({
                  players: lobbyPlayers,
                  currentPlayerIndex: 0,
                  status: 'lobby',
                  dieValue: 1,
                  isRolling: false,
                  logs: [],
                  winner: null
                });
                return updated;
              });
            }
            break;

          case 'client_disconnected':
            setJoinedPlayers(prev => prev.filter(p => p.socketId !== event.socket && p.playerId !== event.playerId));
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
                assignedPlayerIdRef.current = event.playerId;
              }
            } else {
              alert(event.error || 'Ditolak masuk ke room.');
              handleCancelJoinRoom();
            }
            break;

          case 'state_synced':
            if (event.state.players) {
              const newList: any[] = [];
              const newTakenIds: number[] = [];
              
              const fetchPromises = event.state.players.map(async (p) => {
                const pUserId = parseInt(p.icon, 10);
                let avatarId = '1';
                
                // Add gacoId from synced state directly (except for ourselves, so we don't block our own current selection)
                if (p.gacoId && p.id !== assignedPlayerIdRef.current) {
                  const parsedGacoId = parseInt(p.gacoId as any, 10);
                  console.log(`[Join Room] Player ${p.id} has gacoId ${parsedGacoId}. Adding to takenGacoIds.`);
                  newTakenIds.push(parsedGacoId);
                }

                if (!isNaN(pUserId)) {
                  try {
                    const profile = await ProfileService.fetchUserFullProfile(pUserId);
                    avatarId = profile.avatarId;
                  } catch (e) { }
                }
                
                newList.push({
                  id: p.id,
                  name: p.name,
                  avatarId: avatarId
                });
              });
              
              Promise.all(fetchPromises).then(() => {
                setPlayersList(newList.sort((a, b) => a.id - b.id));
                setTakenGacoIds(newTakenIds);
              });
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
  }, [isWaitingRoomActive, isJoinRoomActive, currentUserAvatarId, joinedPlayers, playersList, assignedPlayerId]);

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
        mode: 'online',
        player1Gaco: selectedPlayer1Gaco,
        player2Gaco: selectedPlayer2Gaco,
        opponentType: 'online',
        opponentPlayerId: selectedOpponentPlayer,
      });
    }
  };

  return (
    <View style={styles.cardWrapper}>
      {isWaitingRoomActive ? (
        <EvaluasiWaitingRoomCard
          roomCode={activeRoomCode}
          currentUserAvatarId={currentUserAvatarId}
          currentUserName={currentUserName}
          joinedPlayers={joinedPlayers}
          onStartGame={handleLaunchOnlineGame}
          onCancel={handleCancelWaitingRoom}
        />
      ) : isJoinRoomActive ? (
        <EvaluasiJoinRoomCard
          roomCode={roomCode.toUpperCase()}
          statusText={joinRoomStatusText}
          isConnected={joinRoomIsConnected}
          currentUserAvatarId={currentUserAvatarId}
          playersList={playersList}
          takenGacoIds={takenGacoIds}
          onCancel={handleCancelJoinRoom}
          onConfirmGaco={handleConfirmClientGaco}
          onReadyChange={handleClientReadyChange}
        />
      ) : (
        <View style={styles.cardContainer}>
          {/* Mode Tabs: Only Online, Centered */}
          <View style={[styles.tabContainer, { justifyContent: 'center' }]}>
            <Animated.View
              style={[
                styles.tabButtonWrapper,
                {
                  flex: 0,
                  width: '50%',
                  transform: [
                    { scale: 1 },
                    { translateY: 0 },
                  ],
                  zIndex: 2,
                },
              ]}
            >
              <View
                style={[
                  styles.tabButton,
                  { 
                    paddingVertical: 0, 
                    overflow: 'hidden',
                    borderTopLeftRadius: 32,
                    borderTopRightRadius: 32,
                  }
                ]}
              >
                <ImageBackground
                  source={require('../../assets/texture/texture1.png')}
                  style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 21 }}
                  resizeMode="cover"
                >
                  <Text style={styles.tabTextOnline}>Online</Text>
                </ImageBackground>
              </View>
            </Animated.View>
          </View>

          <ImageBackground 
            source={require('../../assets/texture/texture1.png')}
            style={[
              styles.contentSection,
              { overflow: 'hidden', borderTopLeftRadius: 24, borderTopRightRadius: 24 }
            ]}
            resizeMode="cover"
          >

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
                {onlineRoomType === 'buat' ? 'Buat Room' : 'Gabung Room'}
              </Text>
            </SoundTouchableOpacity>
          </ImageBackground>
        </View>
      )}
    </View>
  );
}