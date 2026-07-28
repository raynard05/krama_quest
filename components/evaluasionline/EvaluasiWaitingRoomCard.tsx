import React, { useState } from 'react';
import { View, Text, Image, Clipboard, ActivityIndicator, ScrollView } from 'react-native';
import { Copy, Check } from 'lucide-react-native';
import { styles } from '../dolanan/WaitingRoomCardStyles';
import { getAvatarSource } from '../profile/ProfileAvatars';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';

export interface JoinedPlayerInfo {
  name: string;
  color: string;
  avatarId: string;
  userId: number;
  isReady: boolean;
  socketId: string;
  playerId: number;
  gacoId?: number;
}

interface EvaluasiWaitingRoomCardProps {
  roomCode: string;
  currentUserAvatarId: string | undefined;
  currentUserName?: string;
  joinedPlayers: JoinedPlayerInfo[]; // Array of clients (excluding host)
  onStartGame: () => void;
  onCancel: () => void;
}

export default function EvaluasiWaitingRoomCard({
  roomCode,
  currentUserAvatarId,
  currentUserName,
  joinedPlayers,
  onStartGame,
  onCancel,
}: EvaluasiWaitingRoomCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (roomCode && roomCode !== 'Menghubungkan...') {
      Clipboard.setString(roomCode);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // Need at least 2 clients for a 3-player game (1 Host + 2 Clients = 3)
  const isMinPlayersMet = joinedPlayers.length >= 2;
  const areAllClientsReady = joinedPlayers.length > 0 && joinedPlayers.every(p => p.isReady);
  const isStartButtonEnabled = isMinPlayersMet && areAllClientsReady;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.titleLabel}>Kode Room (Max 5 Pemain)</Text>
      
      <View style={styles.codeRow}>
        <Text style={styles.roomCodeText}>{roomCode}</Text>
        {roomCode !== 'Menghubungkan...' && (
          <SoundTouchableOpacity
            style={styles.copyButton}
            onPress={handleCopy}
            activeOpacity={0.7}
          >
            {copied ? (
              <Check color="#FFFFFF" size={20} />
            ) : (
              <Copy color="#FFFFFF" size={20} />
            )}
          </SoundTouchableOpacity>
        )}
      </View>

      <Text style={styles.statusText}>
        {!isMinPlayersMet 
          ? `Menunggu Pemain Minimal (${joinedPlayers.length + 1}/3)...` 
          : (areAllClientsReady ? 'Semua Pemain Sudah Siap!' : 'Menunggu Pemain Siap...')}
      </Text>

      <View style={[styles.avatarsContainer, { flexWrap: 'wrap', rowGap: 24 }]}>
        {/* Current User ("Host") */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Image
              source={getAvatarSource(currentUserAvatarId || '1')}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.avatarLabel} numberOfLines={1}>{currentUserName || 'Anda'}</Text>
          <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 4, color: '#34D399', fontFamily: 'Poppins-Bold' }}>✓ Host</Text>
        </View>

        {/* Render Joined Clients */}
        {joinedPlayers.map((player) => (
          <View key={player.playerId} style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Image
                source={getAvatarSource(player.avatarId || '2')}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.avatarLabel} numberOfLines={1}>
              {player.name}
            </Text>
            <Text style={{ 
              fontSize: 12, 
              fontWeight: '700', 
              marginTop: 4, 
              color: player.isReady ? '#34D399' : '#F59E0B', 
              fontFamily: 'Poppins-Bold' 
            }}>
              {player.isReady ? '✓ Siap' : 'Belum Siap'}
            </Text>
          </View>
        ))}

        {/* Render Empty Slots up to 4 clients (since max 5 players = 1 host + 4 clients) */}
        {Array.from({ length: 4 - joinedPlayers.length }).map((_, idx) => (
          <View key={`empty-${idx}`} style={styles.avatarWrapper}>
            <View style={[styles.avatarCircle, { opacity: 0.5 }]}>
              <ActivityIndicator color="#FFFFFF" size="small" />
            </View>
            <Text style={[styles.avatarLabel, { opacity: 0.5 }]} numberOfLines={1}>
              Kosong
            </Text>
          </View>
        ))}
      </View>

      <SoundTouchableOpacity
        style={[styles.startButton, !isStartButtonEnabled && { opacity: 0.5 }]}
        onPress={onStartGame}
        disabled={!isStartButtonEnabled}
        activeOpacity={0.8}
      >
        <Text style={styles.startButtonText}>Mulai Game</Text>
      </SoundTouchableOpacity>

      <SoundTouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelButtonText}>Batalkan Room</Text>
      </SoundTouchableOpacity>
    </View>
  );
}
