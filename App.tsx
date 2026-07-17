import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  BackHandler
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationBar } from 'expo-navigation-bar';
import { 
  useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold, 
  Poppins_700Bold, 
  Poppins_800ExtraBold 
} from '@expo-google-fonts/poppins';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { SquadaOne_400Regular } from '@expo-google-fonts/squada-one';
import { Player, GameStatus, GameLog, NetworkRole } from './types';
import { TOTAL_CELLS, SNAKES, LADDERS } from './constants';
import NetworkLobby from './components/game/NetworkLobby';
import Board from './components/game/Board';
import Die from './components/game/Die';
import GameHeader from './components/game/GameHeader';
import GameLogs from './components/game/GameLogs';
import { GameNetwork, NetworkEvent } from './services/GameNetwork';
import LoginScreen from './components/auth/LoginScreen';
import RegisterScreen from './components/auth/RegisterScreen';
import type { UserAccount } from './services/AuthService';
import DashboardMenu from './components/dashboard/DashboardMenu';
import DolananOptions from './components/game/DolananOptions';
import CustomSplashScreen from './components/splash/CustomSplashScreen';
import CustomLoadingScreen from './components/splash/CustomLoadingScreen';
import ProfileMain from './components/profile/ProfileMain';
import { ProfileService } from './services/ProfileService';
import MateriScreen from './components/materi/MateriScreen';
import CpTpScreen from './components/cptp/CpTpScreen';
import DolananScreen from './components/dolanan/DolananScreen';
import GameScreen from './components/gameadvance/GameScreen';
import { SoundManager } from './utils/SoundManager';


type AuthScreen = 'login' | 'register';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Poppins-ExtraBold': Poppins_800ExtraBold,
    'BebasNeue': BebasNeue_400Regular,
    'SquadaOne': SquadaOne_400Regular,
  });

  useEffect(() => {
    // Delay audio init so all native modules are fully registered first
    const timer = setTimeout(() => {
      SoundManager.init();
    }, 2000);
    return () => {
      clearTimeout(timer);
      SoundManager.stopBackgroundMusic();
    };
  }, []);

  // ── Auth state ──────────────────────────────────────────────────────────
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<(UserAccount & { avatarId?: string; avatarBgId?: string }) | null>(null);
  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const [showDolananOptions, setShowDolananOptions] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showMateri, setShowMateri] = useState<boolean>(false);
  const [showCpTp, setShowCpTp] = useState<boolean>(false);
  const [showDolanan, setShowDolanan] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(false);
  const [showGameScreen, setShowGameScreen] = useState<boolean>(false);
  

  const handleUpdateAvatar = async (avatarId: string) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, avatarId } : null);
      await ProfileService.updateUserAvatar(currentUser.id, avatarId);
    }
  };

  const handleUpdateAvatarBg = async (avatarBgId: string) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, avatarBgId } : null);
      await ProfileService.updateUserAvatarBg(currentUser.id, avatarBgId);
    }
  };

  const handleLoginSuccess = (user: UserAccount) => {
    // Transition screen state immediately to prevent lockups
    setIsAuthenticated(true);
    setIsLoadingScreen(true);
    setShowDashboard(false);
    
    // Play background sound immediately on login interaction
    SoundManager.playBackgroundMusic();

    // Fetch avatar and background asynchronously in the background
    Promise.all([
      ProfileService.fetchUserAvatar(user.id),
      ProfileService.fetchUserAvatarBg(user.id)
    ])
      .then(([avatarId, avatarBgId]) => {
        setCurrentUser({ ...user, avatarId, avatarBgId });
      })
      .catch(() => {
        setCurrentUser(user);
      });
  };

  const handleRegisterSuccess = (user: UserAccount) => {
    // Transition screen state immediately to prevent lockups
    setIsAuthenticated(true);
    setIsLoadingScreen(true);
    setShowDashboard(false);

    // Play background sound immediately on registration interaction
    SoundManager.playBackgroundMusic();

    // Fetch avatar and background asynchronously in the background
    Promise.all([
      ProfileService.fetchUserAvatar(user.id),
      ProfileService.fetchUserAvatarBg(user.id)
    ])
      .then(([avatarId, avatarBgId]) => {
        setCurrentUser({ ...user, avatarId, avatarBgId });
      })
      .catch(() => {
        setCurrentUser(user);
      });
  };

  const handleLogout = () => {
    // Stop background music on logout
    SoundManager.stopBackgroundMusic();

    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowDashboard(true);
    setShowDolananOptions(false);
    setShowProfile(false);
    setShowMateri(false);
    setShowCpTp(false);
    setShowDolanan(false);
    setAuthScreen('login');
    setIsLoadingScreen(false);
  };

  // ── Game state ──────────────────────────────────────────────────────────
  const [status, setStatus] = useState<GameStatus>('lobby');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [dieValue, setDieValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isRollCooldown, setIsRollCooldown] = useState<boolean>(false);
  const [logs, setLogs] = useState<GameLog[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  // Network State
  const [networkRole, setNetworkRole] = useState<NetworkRole>('local');
  const [localPlayerId, setLocalPlayerId] = useState<number>(0);
  const [playerProfiles, setPlayerProfiles] = useState<Record<number, { avatarId: string; bgId: string; gacoId: string }>>({});

  // Keep a ref to the moving state to prevent double rolling or race conditions
  const isMovingRef = useRef<boolean>(false);

  // Helper to add logs
  const addLog = (
    playerId: number,
    playerName: string,
    playerColor: string,
    message: string,
    type: GameLog['type']
  ) => {
    const newLog: GameLog = {
      id: Math.random().toString(36).substring(2, 9),
      playerId,
      playerName,
      playerColor,
      message,
      timestamp: new Date(),
      type,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const fetchProfilesForGame = async (configuredPlayers: Player[]) => {
    const profiles: Record<number, { avatarId: string; bgId: string; gacoId: string }> = {};
    for (const p of configuredPlayers) {
      const userId = parseInt(p.icon, 10);
      if (!isNaN(userId) && userId > 0) {
        try {
          const profile = await ProfileService.fetchUserFullProfile(userId);
          profiles[p.id] = profile;
        } catch (err) {
          console.warn(`Failed to fetch profile for user ${userId}:`, err);
          profiles[p.id] = { avatarId: '1', bgId: '1', gacoId: '1' };
        }
      } else {
        profiles[p.id] = { avatarId: '1', bgId: '1', gacoId: '1' };
      }
    }
    setPlayerProfiles(profiles);
  };

  // Start a new game from the lobby configuration (Local)
  const handleStartGame = (configuredPlayers: Player[]) => {
    fetchProfilesForGame(configuredPlayers);
    setNetworkRole('local');
    setLocalPlayerId(0);
    setPlayers(configuredPlayers);
    setCurrentPlayerIndex(0);
    setDieValue(1);
    setIsRolling(false);
    setWinner(null);
    setLogs([]);
    setStatus('playing');
    isMovingRef.current = false;
    setIsMoving(false);

    // Log the starting event
    const firstPlayer = configuredPlayers[0];
    const startingMsg = `Permainan dimulai! Giliran pertama: ${firstPlayer.name}`;
    
    const startLog: GameLog = {
      id: 'start-log',
      playerId: 0,
      playerName: 'Sistem',
      playerColor: '#00F2FE',
      message: startingMsg,
      timestamp: new Date(),
      type: 'roll',
    };
    setLogs([startLog]);
  };

  // Start a new multiplayer game
  const handleStartNetworkGame = (configuredPlayers: Player[], role: NetworkRole, assignedId: number) => {
    fetchProfilesForGame(configuredPlayers);
    setNetworkRole(role);
    setLocalPlayerId(assignedId);
    setPlayers(configuredPlayers);
    setCurrentPlayerIndex(0);
    setDieValue(1);
    setIsRolling(false);
    setWinner(null);
    setLogs([]);
    setStatus('playing');
    isMovingRef.current = false;
    setIsMoving(false);
  };

  // Reset the current game with the same players
  const handleResetGame = () => {
    if (networkRole === 'client') {
      // Send request to Host
      GameNetwork.requestAction('reset', localPlayerId);
      return;
    }

    const resetPlayers = players.map((p) => ({
      ...p,
      position: 0,
      isWinner: false,
    }));
    setPlayers(resetPlayers);
    setCurrentPlayerIndex(0);
    setDieValue(1);
    setIsRolling(false);
    setWinner(null);
    setLogs([]);
    setStatus('playing');
    isMovingRef.current = false;
    setIsMoving(false);

    const resetLog: GameLog = {
      id: 'reset-log',
      playerId: 0,
      playerName: 'Sistem',
      playerColor: '#00F2FE',
      message: `Permainan diulang! Giliran pertama: ${resetPlayers[0].name}`,
      timestamp: new Date(),
      type: 'roll',
    };
    setLogs([resetLog]);
  };

  // Go back to lobby
  const handleBackToLobby = () => {
    if (networkRole === 'client') {
      GameNetwork.requestAction('back', localPlayerId);
    }
    
    // Close connections
    GameNetwork.closeAll();
    setNetworkRole('local');
    setLocalPlayerId(0);
    
    setStatus('lobby');
    setPlayers([]);
    setWinner(null);
    setLogs([]);
    isMovingRef.current = false;
    setIsMoving(false);
  };

  // Calculate cell-by-cell path including bounce back if roll exceeds cell 50
  const getMovementPath = (start: number, roll: number): number[] => {
    const path: number[] = [];
    let current = start;
    let forward = true;

    for (let i = 0; i < roll; i++) {
      if (forward) {
        current++;
        // If they hit cell 50 and still have remaining moves, bounce back
        if (current === TOTAL_CELLS && i < roll - 1) {
          forward = false;
        }
      } else {
        current--;
      }
      path.push(current);
    }
    return path;
  };

  const handleRollDie = async () => {
    if (isRolling || isMovingRef.current || winner || isRollCooldown) return;
 
    if (networkRole === 'client') {
      // Lock locally for 2 seconds to prevent button spam during network latency
      setIsRollCooldown(true);
      setTimeout(() => setIsRollCooldown(false), 2000);

      // Request Host to execute roll
      console.log(`[Multiplayer] Client (P${localPlayerId}) requesting roll action...`);
      GameNetwork.requestAction('roll', localPlayerId);
      return;
    }

    // Host also gets a temporary cooldown lock for safety
    setIsRollCooldown(true);
    setTimeout(() => setIsRollCooldown(false), 1500);

    setIsRolling(true);
    isMovingRef.current = true;
    setIsMoving(true);

    // Simulate dice rolling with rapid value switching
    const activePlayer = players[currentPlayerIndex];
    let finalRoll = 1;
    
    // Cycle random numbers for visual roll delay
    for (let i = 0; i < 8; i++) {
      finalRoll = Math.floor(Math.random() * 6) + 1;
      setDieValue(finalRoll);
      await sleep(70);
    }

    setIsRolling(false);
    
    addLog(
      activePlayer.id, 
      activePlayer.name, 
      activePlayer.color, 
      `mengocok dadu dan mendapatkan angka [ ${finalRoll} ]`, 
      'roll'
    );

    // Calculate path
    const startPos = activePlayer.position;
    const path = getMovementPath(startPos, finalRoll);
    const endPos = path[path.length - 1];

    // Check if they bounced back from 50
    const bounced = path.includes(TOTAL_CELLS) && endPos < TOTAL_CELLS;

    // Animate stepping cell-by-cell
    for (let step = 0; step < path.length; step++) {
      const stepCell = path[step];
      
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === activePlayer.id ? { ...p, position: stepCell } : p
        )
      );

      // Brief pause at each box
      await sleep(250);
    }

    if (bounced) {
      addLog(
        activePlayer.id,
        activePlayer.name,
        activePlayer.color,
        `memantul kembali ke kotak ${endPos} karena kelebihan dadu!`,
        'bounce'
      );
      await sleep(400);
    }

    // Now check if they landed on a Snake or Ladder
    let finalCell = endPos;
    
    if (SNAKES[endPos]) {
      const tail = SNAKES[endPos];
      addLog(
        activePlayer.id,
        activePlayer.name,
        activePlayer.color,
        `digigit Ular di kotak ${endPos}! Turun ke kotak ${tail} 🐍`,
        'snake'
      );
      await sleep(600);
      
      // Animate slide
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === activePlayer.id ? { ...p, position: tail } : p
        )
      );
      finalCell = tail;
      await sleep(800);
    } else if (LADDERS[endPos]) {
      const top = LADDERS[endPos];
      addLog(
        activePlayer.id,
        activePlayer.name,
        activePlayer.color,
        `menemukan Tangga di kotak ${endPos}! Naik ke kotak ${top} 🪜`,
        'ladder'
      );
      await sleep(600);

      // Animate slide
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === activePlayer.id ? { ...p, position: top } : p
        )
      );
      finalCell = top;
      await sleep(800);
    }

    // Verify victory condition
    if (finalCell === TOTAL_CELLS) {
      const updatedPlayer = { ...activePlayer, position: TOTAL_CELLS, isWinner: true };
      setPlayers((prev) =>
        prev.map((p) => (p.id === activePlayer.id ? updatedPlayer : p))
      );
      setWinner(updatedPlayer);
      addLog(
        activePlayer.id,
        activePlayer.name,
        activePlayer.color,
        `mencapai kotak 50 dan MENANG! 🏆`,
        'win'
      );
      setStatus('victory');
      isMovingRef.current = false;
      setIsMoving(false);
      return;
    }

    // Turn rotation delay to prevent spamming
    await sleep(1500);

    // Turn rotation
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    isMovingRef.current = false;
    setIsMoving(false);
  };

  // Host: Broadcast state updates to clients
  useEffect(() => {
    if (networkRole === 'host' && status === 'playing') {
      GameNetwork.broadcastState({
        players,
        currentPlayerIndex,
        status,
        dieValue,
        isRolling,
        isMoving,
        logs,
        winner
      });
    }
  }, [players, currentPlayerIndex, status, dieValue, isRolling, isMoving, logs, winner, networkRole]);

  // Network event listener during active gameplay
  useEffect(() => {
    if (networkRole === 'local' || status !== 'playing') return;

    GameNetwork.registerListener((event: NetworkEvent) => {
      switch (event.type) {
        case 'action_requested':
          console.log(`[Multiplayer] Host received action request: "${event.action}" from Player ${event.playerId}`);
          if (networkRole === 'host') {
            const activePlayer = players[currentPlayerIndex];
            console.log(`[Multiplayer] Current turn index: ${currentPlayerIndex}, Active Player ID: ${activePlayer?.id}`);
            
            if (event.action === 'roll') {
              if (event.playerId == activePlayer?.id) {
                console.log(`[Multiplayer] Action APPROVED! Executing die roll for Player ${activePlayer.id}`);
                handleRollDie();
              } else {
                console.warn(`[Multiplayer] Action REJECTED! Roll requested by Player ${event.playerId} but active player is ${activePlayer?.id}`);
              }
            } else if (event.action === 'reset') {
              console.log('[Multiplayer] Reset request approved.');
              handleResetGame();
            } else if (event.action === 'back') {
              console.log('[Multiplayer] Back request approved.');
              handleBackToLobby();
            }
          }
          break;

        case 'state_synced':
          if (networkRole === 'client') {
            // Overwrite state from Host broadcast
            setPlayers(event.state.players);
            setCurrentPlayerIndex(event.state.currentPlayerIndex);
            setDieValue(event.state.dieValue);
            setIsRolling(event.state.isRolling);
            if (event.state.isMoving !== undefined) {
              setIsMoving(event.state.isMoving);
            }
            setLogs(event.state.logs);
            setWinner(event.state.winner);
            setStatus(event.state.status);
          }
          break;

        case 'client_disconnected':
          if (networkRole === 'host') {
            // If client disconnects mid-game, convert their player to AI
            setPlayers((currentPlayers) => {
              const disconnected = currentPlayers.find(p => p.id === event.playerId);
              if (disconnected) {
                addLog(
                  0,
                  'Sistem',
                  '#FF3366',
                  `${disconnected.name} terputus. Mengubah peran menjadi Komputer (AI).`,
                  'bounce'
                );
                return currentPlayers.map(p =>
                  p.id === event.playerId ? { ...p, type: 'computer' as const } : p
                );
              }
              return currentPlayers;
            });
          }
          break;

        case 'connection_status':
          if (event.status === 'disconnected' || event.status === 'error') {
            // Return to lobby if connection cuts out
            handleBackToLobby();
          }
          break;
      }
    });

    return () => {
      GameNetwork.registerListener(() => {});
    };
  }, [networkRole, status, players, currentPlayerIndex]);

  // AI Autoplay effect (only host or local rolls for computer bots)
  useEffect(() => {
    if (status !== 'playing' || winner || isRolling || isMovingRef.current || networkRole === 'client') return;

    const activePlayer = players[currentPlayerIndex];
    if (activePlayer && activePlayer.type === 'computer') {
      const timer = setTimeout(() => {
        handleRollDie();
      }, 1300); // 1.3s delay makes it easy for the human to read logs before AI rolls
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayerIndex, status, isRolling, winner, networkRole]);

  // Helper to determine if it is my turn to roll (Local can roll all, Host rolls P1, Client rolls Pn)
  const isMyTurn = 
    networkRole === 'local'
      ? players[currentPlayerIndex]?.type === 'human'
      : (networkRole === 'host' && currentPlayerIndex === 0) || (networkRole === 'client' && players[currentPlayerIndex]?.id === localPlayerId);

  // Global hardware back button handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Don't handle back button on splash screen
      if (showSplash) {
        return false;
      }

      // Handle back button based on current screen state
      if (isLoadingScreen) {
        return true; // Prevent back during loading
      }

      if (!isAuthenticated) {
        // On auth screens, allow back only on register screen
        if (authScreen === 'register') {
          setAuthScreen('login');
          return true;
        }
        return false; // Allow exit app from login
      }

      // Authenticated screens
      if (showProfile) {
        setShowProfile(false);
        setShowDashboard(true);
        return true;
      }

      if (showMateri) {
        setShowMateri(false);
        setShowDashboard(true);
        return true;
      }

      if (showDolanan) {
        setShowDolanan(false);
        setShowDashboard(true);
        return true;
      }

      if (showGameScreen) {
        // Biarkan komponen GameScreen menangani tombol back sendiri
        return false;
      }

      if (showCpTp) {
        setShowCpTp(false);
        setShowDashboard(true);
        return true;
      }

      if (showDolananOptions) {
        setShowDolananOptions(false);
        setShowDashboard(true);
        return true;
      }

      if (status === 'lobby') {
        setShowDolananOptions(true);
        setStatus('lobby');
        return true;
      }

      if (status === 'playing' || status === 'victory') {
        handleBackToLobby();
        return true;
      }

      if (showDashboard) {
        return false; // Allow exit app from dashboard
      }

      return false;
    });

    return () => backHandler.remove();
  }, [
    showSplash,
    isLoadingScreen,
    isAuthenticated,
    authScreen,
    showProfile,
    showMateri,
    showDolanan,
    showGameScreen,
    showCpTp,
    showDolananOptions,
    showDashboard,
    status
  ]);

  // Return loader if fonts aren't loaded yet and splash screen is gone
  if (!fontsLoaded && !showSplash) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#07070F' }}>
        <ActivityIndicator size="large" color="#00F2FE" />
      </View>
    );
  }


  // Helper to render content with proper safe area and navigation bar styles
  const renderContent = () => {
    if (isLoadingScreen) {
      return (
        <CustomLoadingScreen
          onFinish={() => {
            setIsLoadingScreen(false);
            setShowDashboard(true);
          }}
        />
      );
    }

    // ── Auth screens ─────────────────────────────────────────────────────
    if (!isAuthenticated) {
      return (
        <View style={{ flex: 1, backgroundColor: '#E6F4FE' }}>
          {authScreen === 'login' ? (
            <LoginScreen
              onNavigateToRegister={() => setAuthScreen('register')}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <RegisterScreen
              onNavigateToLogin={() => setAuthScreen('login')}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}
          <StatusBar style="dark" />
          <NavigationBar style="dark" />
        </View>
      );
    }

    // Render Profile screen
    if (showProfile) {
      return (
        <>
          <ProfileMain
            currentUser={currentUser}
            onBack={() => {
              setShowProfile(false);
              setShowDashboard(true);
            }}
            onUpdateAvatar={handleUpdateAvatar}
            onUpdateAvatarBg={handleUpdateAvatarBg}
          />
          <StatusBar style="light" />
          <NavigationBar style="light" />
        </>
      );
    }

    // Render Materi screen
    if (showMateri) {
      return (
        <>
          <MateriScreen
            onBack={() => {
              setShowMateri(false);
              setShowDashboard(true);
            }}
          />
          <StatusBar style="light" />
          <NavigationBar style="light" />
        </>
      );
    }

    // Render Dolanan screen
    if (showDolanan) {
      return (
        <>
          <DolananScreen
            currentUser={currentUser}
            onBack={() => {
              setShowDolanan(false);
              setShowDashboard(true);
            }}
            onStartLocalGame={(configuredPlayers) => {
              setShowDolanan(false);
              handleStartGame(configuredPlayers);
            }}
            onStartNetworkGame={(configuredPlayers, role, assignedId) => {
              setShowDolanan(false);
              handleStartNetworkGame(configuredPlayers, role, assignedId);
            }}
            onNavigateToPemantik={() => {
              setShowDolanan(false);
              setShowGameScreen(true);
            }}
          />
          <StatusBar style="light" />
          <NavigationBar style="light" />
        </>
      );
    }

    // Render GameScreen (Pemantik)
    if (showGameScreen) {
      return (
        <>
          <GameScreen
            currentUser={currentUser}
            onBack={() => {
              setShowGameScreen(false);
              setShowDolanan(true);
            }}
          />
          <StatusBar style="light" />
          <NavigationBar style="light" />
        </>
      );
    }

    // Render CP & TP screen
    if (showCpTp) {
      return (
        <>
          <CpTpScreen
            onBack={() => {
              setShowCpTp(false);
              setShowDashboard(true);
            }}
          />
          <StatusBar style="light" />
          <NavigationBar style="light" />
        </>
      );
    }

    // Render Dashboard screen
    if (showDashboard) {
      return (
        <>
          <DashboardMenu
            currentUser={currentUser}
            onSelectDolanan={() => {
              setShowDashboard(false);
              setShowDolanan(true);
            }}
            onLogout={handleLogout}
            onOpenProfile={() => {
              setShowDashboard(false);
              setShowProfile(true);
            }}
            onSelectMateri={() => {
              setShowDashboard(false);
              setShowMateri(true);
            }}
            onSelectCpTp={() => {
              setShowDashboard(false);
              setShowCpTp(true);
            }}
          />
          <StatusBar style="dark" />
          <NavigationBar style="dark" />
        </>
      );
    }

    // Render Dolanan Options screen
    if (showDolananOptions) {
      return (
        <>
          <DolananOptions
            onBack={() => {
              setShowDolananOptions(false);
              setShowDashboard(true);
            }}
            onSelectGame={() => {
              setShowDolananOptions(false);
              setStatus('lobby');
            }}
          />
          <StatusBar style="dark" />
          <NavigationBar style="dark" />
        </>
      );
    }

    // Render Lobby screen
    if (status === 'lobby') {
      return (
        <SafeAreaView style={styles.safeArea}>
          {/* Glow Aurora Blobs */}
          <View style={[styles.glowBlob, styles.glowCyan, { top: -50, left: -50 }]} />
          <View style={[styles.glowBlob, styles.glowPurple, { bottom: -100, right: -50 }]} />
          
          <NetworkLobby 
            onStartLocalGame={handleStartGame} 
            onStartNetworkGame={handleStartNetworkGame} 
            onBack={() => {
              setShowDolananOptions(true);
            }}
          />
          <StatusBar style="light" />
          <NavigationBar style="light" />
        </SafeAreaView>
      );
    }

    // Render gameplay and victory screens
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* Glow Aurora Blobs */}
        <View style={[styles.glowBlob, styles.glowCyan, { top: -80, right: -50 }]} />
        <View style={[styles.glowBlob, styles.glowPurple, { bottom: -80, left: -50 }]} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GameHeader
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            onBackToLobby={handleBackToLobby}
            onResetGame={handleResetGame}
            winner={winner}
            profiles={playerProfiles}
          />

          <Board players={players} profiles={playerProfiles} />

          {/* Action Panel */}
          <View style={styles.actionPanel}>
            {status === 'victory' && winner ? (
              <View style={styles.victoryPanel}>
                {networkRole !== 'client' && (
                  <TouchableOpacity
                    style={[styles.victoryBtn, { backgroundColor: winner.color }]}
                    onPress={handleResetGame}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.victoryBtnText}>Main Lagi (Ulangi)</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={styles.lobbyBtn}
                  onPress={handleBackToLobby}
                  activeOpacity={0.8}
                >
                  <Text style={styles.lobbyBtnText}>
                    {networkRole === 'client' ? 'Keluar Lobi' : 'Kembali Ke Lobby'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Die
                value={dieValue}
                isRolling={isRolling}
                onRoll={handleRollDie}
                disabled={!isMyTurn || isRolling || isMoving || isRollCooldown}
                color={players[currentPlayerIndex]?.color}
              />
            )}
          </View>

          <GameLogs logs={logs} />
        </ScrollView>
        <StatusBar style="light" />
        <NavigationBar style="light" />
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaProvider>
      {showSplash ? (
        <CustomSplashScreen
          fontsLoaded={fontsLoaded}
          onFinish={() => setShowSplash(false)}
        />
      ) : (
        renderContent()
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#07070F',
    position: 'relative',
    overflow: 'hidden',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  glowBlob: {
    width: 250,
    height: 250,
    borderRadius: 125,
    position: 'absolute',
    opacity: 0.08,
  },
  glowCyan: {
    backgroundColor: '#00F2FE',
  },
  glowPurple: {
    backgroundColor: '#BD00FF',
  },
  actionPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  victoryPanel: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 15,
  },
  victoryBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  victoryBtnText: {
    color: '#07070F',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1.2,
  },
  lobbyBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  lobbyBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
