import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Clipboard, ActivityIndicator, PanResponder } from 'react-native';
import { Copy, Check } from 'lucide-react-native';
import { styles } from './JoinRoomCardStyles';
import { getAvatarSource } from '../profile/ProfileAvatars';
import { GACOS } from './GameSetupCard';

interface JoinRoomCardProps {
  roomCode: string;
  statusText: string;
  isConnected: boolean;
  currentUserAvatarId: string | undefined;
  hostName?: string;
  hostAvatarId?: string;
  takenGacoId?: number;
  onCancel: () => void;
  onConfirmGaco: (gacoId: number) => Promise<boolean>;
  onReadyChange: (isReady: boolean) => void;
}

export default function JoinRoomCard({
  roomCode,
  statusText,
  isConnected,
  currentUserAvatarId,
  hostName = 'Host',
  hostAvatarId = '1',
  takenGacoId,
  onCancel,
  onConfirmGaco,
  onReadyChange,
}: JoinRoomCardProps) {
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

  const isCurrentGacoTaken = takenGacoId === (selectedGacoIndex + 1);

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
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopy}
            activeOpacity={0.7}
          >
            {copied ? (
              <Check color="#FFFFFF" size={20} />
            ) : (
              <Copy color="#FFFFFF" size={20} />
            )}
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.statusText}>{statusText}</Text>

      <View style={styles.avatarsContainer}>
        {/* Host ("Pemain 1" / creator) */}
        <View style={styles.avatarWrapper}>
          <View style={[styles.avatarCircle, !isConnected && { opacity: 0.5 }]}>
            {isConnected ? (
              <Image
                source={getAvatarSource(hostAvatarId)}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            ) : (
              <ActivityIndicator color="#FFFFFF" size="small" />
            )}
          </View>
          <Text style={styles.avatarLabel}>{isConnected ? hostName : 'Menghubungkan...'}</Text>
        </View>

        {/* Current User ("Anda") */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Image
              source={getAvatarSource(currentUserAvatarId || '1')}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.avatarLabel}>Anda</Text>
        </View>
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

              <TouchableOpacity
                style={[styles.confirmButton, (isCurrentGacoTaken || isSavingGaco) && { opacity: 0.5 }]}
                onPress={handleConfirmGacoSelection}
                disabled={isCurrentGacoTaken || isSavingGaco}
                activeOpacity={0.8}
              >
                {isSavingGaco ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {isCurrentGacoTaken ? 'Sudah Dipakai Host' : 'Konfirmasi Gaco'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.confirmedGacoContainer}>
              <Text style={styles.confirmedGacoText}>
                Gaco Terpilih: {GACOS[selectedGacoIndex].name}
              </Text>
              
              {!isReady ? (
                <TouchableOpacity
                  style={styles.readyButton}
                  onPress={handleReadyClick}
                  activeOpacity={0.8}
                >
                  <Text style={styles.readyButtonText}>Siap Bermain</Text>
                </TouchableOpacity>
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

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelButtonText}>Keluar Room</Text>
      </TouchableOpacity>
    </View>
  );
}
