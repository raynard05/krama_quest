import React, { useState, useRef } from 'react';
import { View, Text, Image, Clipboard, ActivityIndicator, PanResponder, ScrollView } from 'react-native';
import { Copy, Check } from 'lucide-react-native';
import { styles } from '../dolanan/JoinRoomCardStyles';
import { getAvatarSource } from '../profile/ProfileAvatars';
import { GACOS } from '../dolanan/GameConstants';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';

interface RoomPlayerInfo {
  id: number;
  name: string;
  avatarId: string;
  gacoId?: number; // Optional, might be tracked differently
}

interface EvaluasiJoinRoomCardProps {
  roomCode: string;
  statusText: string;
  isConnected: boolean;
  currentUserAvatarId: string | undefined;
  playersList: RoomPlayerInfo[]; // All players in the room including host
  takenGacoIds: number[]; // Array of gaco IDs taken by other players
  onCancel: () => void;
  onConfirmGaco: (gacoId: number) => Promise<boolean>;
  onReadyChange: (isReady: boolean) => void;
}

export default function EvaluasiJoinRoomCard({
  roomCode,
  statusText,
  isConnected,
  currentUserAvatarId,
  playersList = [],
  takenGacoIds = [],
  onCancel,
  onConfirmGaco,
  onReadyChange,
}: EvaluasiJoinRoomCardProps) {
  const [copied, setCopied] = useState(false);
  const [selectedGacoIndex, setSelectedGacoIndex] = useState(0);
  const [isGacoConfirmed, setIsGacoConfirmed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSavingGaco, setIsSavingGaco] = useState(false);

  const handleCopy = () => {
    if (roomCode && roomCode !== 'Menghubungkan...') {
      Clipboard.setString(roomCode);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleGacoPrev = () => {
    setSelectedGacoIndex((prev) => (prev - 1 + GACOS.length) % GACOS.length);
  };

  const handleGacoNext = () => {
    setSelectedGacoIndex((prev) => (prev + 1) % GACOS.length);
  };

  const isCurrentGacoTaken = takenGacoIds.includes(selectedGacoIndex + 1);

  const handleConfirmGacoSelection = async () => {
    if (isCurrentGacoTaken) return;
    setIsSavingGaco(true);
    const gacoId = selectedGacoIndex + 1; // 1-indexed to match assets
    const success = await onConfirmGaco(gacoId);
    setIsSavingGaco(false);
    if (success) {
      setIsGacoConfirmed(true);
    } else {
      alert('Gagal menyimpan pilihan gaco ke database.');
    }
  };

  const handleReadyClick = () => {
    setIsReady(true);
    onReadyChange(true);
  };

  // Pan responder for swipe gesture in client selector
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 && !isGacoConfirmed;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 30) {
          handleGacoPrev();
        } else if (gestureState.dx < -30) {
          handleGacoNext();
        }
      },
    })
  ).current;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.titleLabel}>Kode Room</Text>
      
      <View style={styles.codeRow}>
        <Text style={styles.roomCodeText}>{roomCode}</Text>
        {roomCode && roomCode !== 'Menghubungkan...' && (
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

      <Text style={styles.statusText}>{statusText}</Text>

      <View style={[styles.avatarsContainer, { flexWrap: 'wrap', rowGap: 24 }]}>
        {!isConnected && (
           <View style={styles.avatarWrapper}>
            <View style={[styles.avatarCircle, { opacity: 0.5 }]}>
              <ActivityIndicator color="#FFFFFF" size="small" />
            </View>
            <Text style={styles.avatarLabel}>Menghubungkan...</Text>
          </View>
        )}

        {isConnected && playersList.map((player, index) => (
          <View key={player.id} style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Image
                source={getAvatarSource(player.avatarId)}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.avatarLabel} numberOfLines={1}>{player.name}</Text>
            {index === 0 && <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 4, color: '#34D399', fontFamily: 'Poppins-Bold' }}>✓ Host</Text>}
          </View>
        ))}
      </View>

      {/* Gaco Selection (Client Side) */}
      {isConnected && (
        <>
          {!isGacoConfirmed ? (
            <View style={styles.gacoSection}>
              <Text style={styles.sectionTitle}>Geser & Pilih Gaco Kamu</Text>
              
              <View style={styles.gacoSelector} {...panResponder.panHandlers}>
                {/* Previous Gaco (Left) */}
                <View style={styles.gacoDisplaySide}>
                  <Image
                    source={GACOS[(selectedGacoIndex - 1 + GACOS.length) % GACOS.length].image}
                    style={styles.gacoImageSide}
                    resizeMode="contain"
                  />
                </View>

                {/* Active Gaco (Center) */}
                <View style={styles.gacoDisplayCenter}>
                  <Image
                    source={GACOS[selectedGacoIndex].image}
                    style={styles.gacoImageCenter}
                    resizeMode="contain"
                  />
                  <Text style={styles.gacoName}>{GACOS[selectedGacoIndex].name}</Text>
                  {isCurrentGacoTaken && (
                    <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: '700', fontFamily: 'Poppins-Bold', marginTop: 2 }}>Terpakai</Text>
                  )}
                </View>

                {/* Next Gaco (Right) */}
                <View style={styles.gacoDisplaySide}>
                  <Image
                    source={GACOS[(selectedGacoIndex + 1) % GACOS.length].image}
                    style={styles.gacoImageSide}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <SoundTouchableOpacity
                style={[styles.confirmButton, (isCurrentGacoTaken || isSavingGaco) && { opacity: 0.5 }]}
                onPress={handleConfirmGacoSelection}
                disabled={isCurrentGacoTaken || isSavingGaco}
                activeOpacity={0.8}
              >
                {isSavingGaco ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {isCurrentGacoTaken ? 'Sudah Dipakai Orang' : 'Konfirmasi Gaco'}
                  </Text>
                )}
              </SoundTouchableOpacity>
            </View>
          ) : (
            <View style={styles.confirmedGacoContainer}>
              <Text style={styles.confirmedGacoText}>
                Gaco Terpilih: {GACOS[selectedGacoIndex].name}
              </Text>
              
              {!isReady ? (
                <SoundTouchableOpacity
                  style={styles.readyButton}
                  onPress={handleReadyClick}
                  activeOpacity={0.8}
                >
                  <Text style={styles.readyButtonText}>Siap Bermain</Text>
                </SoundTouchableOpacity>
              ) : (
                <View style={styles.readyBadge}>
                  <Text style={styles.readyBadgeText}>✓ Anda Siap</Text>
                </View>
              )}
            </View>
          )}
        </>
      )}

      {isConnected && isReady && (
        <View style={styles.waitingContainer}>
          <ActivityIndicator size="small" color="#FFDE43" />
          <Text style={styles.waitingText}>Menunggu Host memulai permainan...</Text>
        </View>
      )}

      <SoundTouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelButtonText}>Keluar Room</Text>
      </SoundTouchableOpacity>
    </View>
  );
}
