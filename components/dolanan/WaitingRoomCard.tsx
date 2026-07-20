import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Clipboard, ActivityIndicator } from 'react-native';
import { Copy, Check } from 'lucide-react-native';
import { styles } from './WaitingRoomCardStyles';
import { getAvatarSource } from '../profile/ProfileAvatars';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';

interface WaitingRoomCardProps {
  roomCode: string;
  currentUserAvatarId: string | undefined;
  currentUserName?: string;
  player2Name?: string;
  player2AvatarId?: string;
  isPlayer2Ready?: boolean;
  onStartGame: () => void;
  onCancel: () => void;
}

export default function WaitingRoomCard({
  roomCode,
  currentUserAvatarId,
  currentUserName,
  player2Name,
  player2AvatarId,
  isPlayer2Ready = false,
  onStartGame,
  onCancel,
}: WaitingRoomCardProps) {
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

  const isPlayer2Connected = !!player2Name;
  const isStartButtonEnabled = isPlayer2Connected && isPlayer2Ready;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.titleLabel}>Kode Room</Text>
      
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
        {!isPlayer2Connected 
          ? 'Menunggu Pemain ...' 
          : (isPlayer2Ready ? 'Pemain Sudah Siap!' : 'Menunggu Pemain Siap...')}
      </Text>

      <View style={styles.avatarsContainer}>
        {/* Current User ("Anda") */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Image
              source={getAvatarSource(currentUserAvatarId || '1')}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.avatarLabel}>{currentUserName || 'Anda'}</Text>
          <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 4, color: '#34D399', fontFamily: 'Poppins-Bold' }}>✓ Siap</Text>
        </View>

        {/* Second Player ("Pemain 1") */}
        <View style={styles.avatarWrapper}>
          <View style={[styles.avatarCircle, !isPlayer2Connected && { opacity: 0.5 }]}>
            {isPlayer2Connected ? (
              <Image
                source={getAvatarSource(player2AvatarId || '2')}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            ) : (
              <ActivityIndicator color="#FFFFFF" size="small" />
            )}
          </View>
          <Text style={styles.avatarLabel}>
            {isPlayer2Connected ? player2Name : 'Menunggu...'}
          </Text>
          {isPlayer2Connected && (
            <Text style={{ 
              fontSize: 12, 
              fontWeight: '700', 
              marginTop: 4, 
              color: isPlayer2Ready ? '#34D399' : '#F59E0B', 
              fontFamily: 'Poppins-Bold' 
            }}>
              {isPlayer2Ready ? '✓ Siap' : 'Belum Siap'}
            </Text>
          )}
        </View>
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
