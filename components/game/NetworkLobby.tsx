import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Platform 
} from 'react-native';
import { Player, NetworkRole, NetworkStatus } from '../../types';
import { MODERN_COLORS, AVATAR_ICONS } from '../../constants';
import { ChevronLeft } from 'lucide-react-native';
import Lobby from './Lobby';
import { GameNetwork, NetworkEvent } from '../../services/GameNetwork';

interface NetworkLobbyProps {
  onStartLocalGame: (players: Player[]) => void;
  onStartNetworkGame: (players: Player[], role: NetworkRole, localPlayerId: number) => void;
  onBack?: () => void;
}

export default function NetworkLobby({ onStartLocalGame, onStartNetworkGame, onBack }: NetworkLobbyProps) {
  const [lobbyMode, setLobbyMode] = useState<'local' | 'network'>('local');
  const [networkRole, setNetworkRole] = useState<'host' | 'client'>('host');
  
  // Connection states
  const [roomName, setRoomName] = useState('Room Ular Tangga');
  const [password, setPassword] = useState('');
  const [serverUrl, setServerUrl] = useState('http://192.168.1.30:3000');
  const [roomCode, setRoomCode] = useState('');
  const [statusText, setStatusText] = useState('');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('idle');
  const [errorText, setErrorText] = useState('');

  // Player setup (for Host Player 1 or Client Player)
  const [myName, setMyName] = useState('Pemain');
  const [myColor, setMyColor] = useState(MODERN_COLORS[0].value);
  const [myIcon, setMyIcon] = useState(AVATAR_ICONS[0]);

  // List of connected players in the multiplayer lobby
  const [netPlayers, setNetPlayers] = useState<Player[]>([]);
  const [localClientId, setLocalClientId] = useState<number>(0);

  // Clean socket listener on unmount — tidak hapus koneksi karena masih dipakai saat gameplay
  // Tidak perlu apa-apa di sini karena listener di-handle per effect di bawah
  useEffect(() => {
    return () => {
      // Nothing to do here — listener cleanup handled per useEffect below
    };
  }, []);

  // Listen for socket events
  useEffect(() => {
    if (lobbyMode !== 'network') return;

    const handler = (event: NetworkEvent) => {
      switch (event.type) {
        case 'room_created':
          if (networkRole === 'host') {
            setRoomCode(event.roomCode);
            setNetworkStatus('hosting');
            setStatusText('Kamar aktif! Menunggu pemain terhubung...');
            setErrorText('');
          }
          break;

        case 'connection_status':
          if (event.status === 'error') {
            setNetworkStatus('error');
            setErrorText(event.error || 'Terjadi kesalahan jaringan.');
            setStatusText('');
          } else if (event.status === 'disconnected') {
            setNetworkStatus('idle');
            setStatusText('Koneksi terputus.');
          }
          break;

        case 'client_join_request':
          // We are Host, receive client join request
          if (networkRole === 'host') {
            setNetPlayers((currentPlayers) => {
              const exists = currentPlayers.some(p => p.name === event.payload.name);
              if (exists) {
                // Reject duplicate name
                GameNetwork.confirmClientJoin(event.socket, 0, false, 'Nama sudah digunakan pemain lain.');
                return currentPlayers;
              }

              if (currentPlayers.length >= 4) {
                // Reject full room
                GameNetwork.confirmClientJoin(event.socket, 0, false, 'Kamar sudah penuh (Maks 4 pemain).');
                return currentPlayers;
              }

              // Allocate new Player ID
              const newId = currentPlayers.length + 1;
              const newPlayer: Player = {
                id: newId,
                name: event.payload.name,
                color: event.payload.color,
                icon: event.payload.icon,
                position: 0,
                type: 'human',
                isWinner: false
              };

              // Accept client connection
              GameNetwork.confirmClientJoin(event.socket, newId, true);

              // Broadcast updated player list to all clients
              const updatedPlayers = [...currentPlayers, newPlayer];
              setTimeout(() => {
                GameNetwork.broadcastState({
                  players: updatedPlayers,
                  currentPlayerIndex: 0,
                  status: 'lobby',
                  dieValue: 1,
                  isRolling: false,
                  logs: [],
                  winner: null
                });
              }, 100);

              return updatedPlayers;
            });
          }
          break;

        case 'client_disconnected':
          if (networkRole === 'host') {
            setNetPlayers((currentPlayers) => {
              const updated = currentPlayers.filter(p => p.id !== event.playerId);
              const reindexed = updated.map((p, idx) => ({ ...p, id: idx + 1 }));
              GameNetwork.broadcastState({
                players: reindexed,
                currentPlayerIndex: 0,
                status: 'lobby',
                dieValue: 1,
                isRolling: false,
                logs: [],
                winner: null
              });
              return reindexed;
            });
          }
          break;

        case 'join_result':
          // We are Client, receive accept/reject from Host
          if (networkRole === 'client') {
            if (event.success && event.playerId) {
              setNetworkStatus('connected');
              setLocalClientId(event.playerId);
              setStatusText(`Berhasil masuk! Anda adalah Pemain ${event.playerId}`);
              setErrorText('');
            } else {
              setNetworkStatus('error');
              setErrorText(event.error || 'Ditolak masuk oleh Host.');
              GameNetwork.closeAll();
            }
          }
          break;

        case 'state_synced':
          if (networkRole === 'client') {
            setNetPlayers(event.state.players);
            if (event.state.status === 'playing') {
              onStartNetworkGame(event.state.players, 'client', localClientId);
            }
          }
          break;
      }
    };

    GameNetwork.registerListener(handler);

    return () => {
      GameNetwork.unregisterListener(handler);
    };
  }, [lobbyMode, networkRole, localClientId]);


  // Host: Create Room on central server
  const handleHostStartRoom = () => {
    if (!serverUrl.trim()) {
      setErrorText('Masukkan alamat server!');
      return;
    }
    setErrorText('');
    setNetworkStatus('connecting');
    setStatusText('Membuat room di server...');
    
    // Add Host as Player 1
    const hostPlayer: Player = {
      id: 1,
      name: myName.trim() || 'Host',
      color: myColor,
      icon: myIcon,
      position: 0,
      type: 'human',
      isWinner: false
    };

    setNetPlayers([hostPlayer]);
    setLocalClientId(1);

    // Start Socket connection & room registration
    GameNetwork.startServer(serverUrl.trim(), password.trim() || undefined);
  };

  // Client: Connect to Room Code
  const handleClientConnect = () => {
    if (!serverUrl.trim()) {
      setErrorText('Masukkan alamat server!');
      return;
    }
    if (!roomCode.trim()) {
      setErrorText('Masukkan kode room!');
      return;
    }

    setErrorText('');
    setNetworkStatus('connecting');
    setStatusText('Menghubungkan ke server...');

    const clientInfo = {
      name: myName.trim() || 'Client',
      color: myColor,
      icon: myIcon
    };

    GameNetwork.connectToServer(
      serverUrl.trim(),
      roomCode.toUpperCase().trim(),
      password.trim(),
      clientInfo
    );
  };

  // Host: Launch Game
  const handleHostLaunchGame = () => {
    if (netPlayers.length < 2) {
      setErrorText('Dibutuhkan minimal 2 pemain untuk memulai permainan!');
      return;
    }

    // Broadcast play status to trigger clients' screens
    const initialPlayers = netPlayers;
    GameNetwork.broadcastState({
      players: initialPlayers,
      currentPlayerIndex: 0,
      status: 'playing',
      dieValue: 1,
      isRolling: false,
      logs: [{
        id: 'start-multi',
        playerId: 0,
        playerName: 'Sistem',
        playerColor: '#00F2FE',
        message: 'Permainan Multiplayer dimulai!',
        timestamp: new Date(),
        type: 'roll'
      }],
      winner: null
    });

    onStartNetworkGame(initialPlayers, 'host', 1);
  };

  // Cancel / Close networking
  const handleDisconnect = () => {
    GameNetwork.closeAll();
    setNetworkStatus('idle');
    setNetPlayers([]);
    setLocalClientId(0);
    setRoomCode('');
    setStatusText('');
    setErrorText('');
  };

  // If local play, render standard single-player Lobby
  if (lobbyMode === 'local') {
    return (
      <View style={styles.flexContainer}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={[styles.backBtn, { paddingHorizontal: 20 }]} activeOpacity={0.7}>
            <ChevronLeft color="#00F2FE" size={24} />
            <Text style={styles.backBtnText}>Kembali ke Menu</Text>
          </TouchableOpacity>
        )}

        {/* Modern Tab Selector at top */}
        <View style={[styles.topTabBar, onBack ? { marginTop: 10 } : { marginTop: 25 }]}>
          <TouchableOpacity 
            style={[styles.tabSelector, styles.tabActive]}
            onPress={() => setLobbyMode('local')}
          >
            <Text style={[styles.tabSelectorText, styles.tabTextActive]}>Main Lokal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tabSelector}
            onPress={() => setLobbyMode('network')}
          >
            <Text style={styles.tabSelectorText}>Multiplayer Hotspot</Text>
          </TouchableOpacity>
        </View>

        <Lobby onStartGame={onStartLocalGame} />
      </View>
    );
  }

  // Else, render Host/Client multiplayer networking setup
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={[styles.backBtn, { marginBottom: 15 }]} activeOpacity={0.7}>
          <ChevronLeft color="#00F2FE" size={24} />
          <Text style={styles.backBtnText}>Kembali ke Menu</Text>
        </TouchableOpacity>
      )}

      {/* Tab Selector */}
      <View style={[styles.topTabBar, onBack && { marginTop: 10 }]}>
        <TouchableOpacity 
          style={styles.tabSelector}
          onPress={() => {
            handleDisconnect();
            setLobbyMode('local');
          }}
        >
          <Text style={styles.tabSelectorText}>Main Lokal</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabSelector, styles.tabActive]}
          onPress={() => setLobbyMode('network')}
        >
          <Text style={[styles.tabSelectorText, styles.tabTextActive]}>Multiplayer Hotspot</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.mainTitle}>LOBI MULTIPLAYER</Text>

      {networkStatus === 'idle' || networkStatus === 'error' ? (
        <>
          {/* Role select */}
          <View style={styles.roleToggleGroup}>
            <TouchableOpacity
              style={[styles.roleBtn, networkRole === 'host' && styles.roleBtnActive]}
              onPress={() => setNetworkRole('host')}
            >
              <Text style={[styles.roleBtnText, networkRole === 'host' && styles.roleBtnTextActive]}>
                Buat Room (Host)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, networkRole === 'client' && styles.roleBtnActive]}
              onPress={() => setNetworkRole('client')}
            >
              <Text style={[styles.roleBtnText, networkRole === 'client' && styles.roleBtnTextActive]}>
                Gabung Room (Client)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Setup Profile Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Profil Anda</Text>
            
            <Text style={styles.inputLabel}>Nama Anda</Text>
            <TextInput
              style={styles.textInput}
              value={myName}
              onChangeText={setMyName}
              maxLength={12}
              placeholder="Ketik nama Anda..."
              placeholderTextColor="#8F8F9F"
            />

            <Text style={styles.inputLabel}>Warna Bidak</Text>
            <View style={styles.colorRow}>
              {MODERN_COLORS.map((c) => (
                <TouchableOpacity
                  key={c.value}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: c.value },
                    myColor === c.value && [styles.colorCircleSelected, { borderColor: '#FFF' }],
                  ]}
                  onPress={() => setMyColor(c.value)}
                />
              ))}
            </View>

            <Text style={styles.inputLabel}>Pilih Avatar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarScroll}>
              {AVATAR_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.avatarItem,
                    myIcon === icon && styles.avatarItemSelected,
                  ]}
                  onPress={() => setMyIcon(icon)}
                >
                  <Text style={styles.avatarIconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Configuration Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Pengaturan Room</Text>

            <Text style={styles.inputLabel}>Alamat Server</Text>
            <TextInput
              style={styles.textInput}
              value={serverUrl}
              onChangeText={setServerUrl}
              placeholder="Contoh: http://192.168.1.30:3000"
              placeholderTextColor="#8F8F9F"
              autoCapitalize="none"
            />

            {networkRole === 'host' ? (
              <>
                <Text style={styles.inputLabel}>Nama Room</Text>
                <TextInput
                  style={styles.textInput}
                  value={roomName}
                  onChangeText={setRoomName}
                  maxLength={20}
                  placeholderTextColor="#8F8F9F"
                />
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Kode Room (5 Karakter)</Text>
                <TextInput
                  style={styles.textInput}
                  value={roomCode}
                  onChangeText={setRoomCode}
                  placeholder="Ketik kode 5 karakter..."
                  placeholderTextColor="#8F8F9F"
                  autoCapitalize="characters"
                  maxLength={5}
                />
              </>
            )}

            <Text style={styles.inputLabel}>Password Room (Opsional)</Text>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Kosongkan jika tanpa sandi"
              placeholderTextColor="#8F8F9F"
            />
          </View>

          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

          {/* Connect Action Button */}
          <TouchableOpacity
            style={[styles.actionBtn, { shadowColor: myColor }]}
            onPress={networkRole === 'host' ? handleHostStartRoom : handleClientConnect}
          >
            <Text style={styles.actionBtnText}>
              {networkRole === 'host' ? 'AKTIFKAN LOBI' : 'SAMBUNG SEKARANG'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        /* Waiting / Connection active screen */
        <View style={styles.waitingCard}>
          <Text style={styles.waitingRoomTitle}>{roomName.toUpperCase()}</Text>
          
          {networkRole === 'host' ? (
            <View style={styles.ipContainer}>
              <Text style={styles.ipInfoText}>📢 KAMAR MULTIPLAYER AKTIF!</Text>
              <Text style={styles.ipSubText}>
                Bagikan kode kamar ini kepada teman Anda untuk bergabung:
              </Text>
              <Text style={styles.ipHighlight}>{roomCode || 'Mendapatkan kode...'}</Text>
            </View>
          ) : (
            <View style={styles.ipContainer}>
              <Text style={styles.ipInfoText}>📢 TERHUBUNG KE KAMAR</Text>
              <Text style={styles.ipSubText}>
                Anda bergabung di kamar dengan kode:
              </Text>
              <Text style={styles.ipHighlight}>{roomCode}</Text>
            </View>
          )}

          {networkStatus === 'connecting' && (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color="#00F2FE" />
              <Text style={styles.spinnerText}>{statusText}</Text>
            </View>
          )}

          {networkStatus !== 'connecting' && (
            <>
              <Text style={styles.joinedTitle}>Pemain Terhubung ({netPlayers.length}/4)</Text>
              
              <View style={styles.playerList}>
                {netPlayers.map((player) => (
                  <View key={player.id} style={styles.playerRow}>
                    <View style={styles.playerLeft}>
                      <Text style={styles.playerIcon}>{player.icon}</Text>
                      <Text style={[styles.playerName, { color: player.color }]}>
                        {player.name} {player.id === localClientId ? '(Anda)' : ''}
                      </Text>
                    </View>
                    <Text style={styles.playerRoleText}>
                      Pemain {player.id}
                    </Text>
                  </View>
                ))}
              </View>

              {statusText ? <Text style={styles.statusText}>{statusText}</Text> : null}
              {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

              {/* Host Start Game button */}
              {networkRole === 'host' && (
                <TouchableOpacity
                  style={[
                    styles.launchBtn, 
                    netPlayers.length < 2 && styles.launchBtnDisabled
                  ]}
                  onPress={handleHostLaunchGame}
                  disabled={netPlayers.length < 2}
                >
                  <Text style={styles.launchBtnText}>MULAI PERMAINAN</Text>
                </TouchableOpacity>
              )}

              {/* Client Waiting Info */}
              {networkRole === 'client' && (
                <View style={styles.clientWaitingBox}>
                  <ActivityIndicator size="small" color="#FFDE43" style={{ marginRight: 10 }} />
                  <Text style={styles.clientWaitingText}>Menunggu Host memulai permainan...</Text>
                </View>
              )}

              {/* Disconnect button */}
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleDisconnect}
              >
                <Text style={styles.cancelBtnText}>BATALKAN / KELUAR</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: 'stretch',
    backgroundColor: '#0A0A12',
  },
  topTabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabSelector: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabSelectorText: {
    color: '#8F8F9F',
    fontWeight: 'bold',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 20,
    textShadowColor: 'rgba(189, 0, 255, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  roleToggleGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  roleBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  roleBtnText: {
    color: '#8F8F9F',
    fontWeight: 'bold',
    fontSize: 12,
  },
  roleBtnTextActive: {
    color: '#FFFFFF',
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
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  inputLabel: {
    fontSize: 11,
    color: '#8F8F9F',
    fontWeight: 'bold',
    marginTop: 8,
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
    fontSize: 14,
    marginBottom: 10,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  colorCircleSelected: {
    borderWidth: 2,
  },
  avatarScroll: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  avatarItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
  avatarIconText: {
    fontSize: 20,
  },
  actionBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  actionBtnText: {
    color: '#0A0A12',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
  },
  errorText: {
    color: '#FF3366',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 8,
  },
  statusText: {
    color: '#00F2FE',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 8,
  },
  waitingCard: {
    backgroundColor: 'rgba(30, 30, 50, 0.45)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'stretch',
  },
  waitingRoomTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1.5,
  },
  ipContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.15)',
  },
  ipInfoText: {
    color: '#00F2FE',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 6,
  },
  ipSubText: {
    color: '#8F8F9F',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 6,
  },
  ipHighlight: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  spinnerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  spinnerText: {
    color: '#8F8F9F',
    fontSize: 12,
    marginTop: 15,
  },
  joinedTitle: {
    fontSize: 12,
    color: '#8F8F9F',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  playerList: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 8,
    marginBottom: 15,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  playerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  playerName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  playerRoleText: {
    color: '#5F5F6F',
    fontSize: 11,
    fontWeight: 'bold',
  },
  launchBtn: {
    backgroundColor: '#39FF14',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 10,
  },
  launchBtnDisabled: {
    backgroundColor: 'rgba(57, 255, 20, 0.15)',
    opacity: 0.5,
  },
  launchBtnText: {
    color: '#07070F',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  clientWaitingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 222, 67, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 222, 67, 0.15)',
    borderRadius: 12,
    paddingVertical: 14,
    marginVertical: 10,
  },
  clientWaitingText: {
    color: '#FFDE43',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#FF3366',
    fontWeight: 'bold',
    fontSize: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: Platform.OS === 'ios' ? 10 : 25,
  },
  backBtnText: {
    color: '#00F2FE',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
