import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Text } from 'react-native';
import styles from './BoardStyle';
import { Player } from '../../types';
import { PercentPosition, getPercentPosition, ANIMATION_SPEED } from '../../constants';

interface BoardProps {
  players?: Player[];
  profiles?: Record<number, { avatarId: string; bgId: string; gacoId: string }>;
}

export function getGacoImageSource(gacoId: string) {
  switch (gacoId) {
    case '1': return require('../../assets/dolanan_assets/1.png');
    case '2': return require('../../assets/dolanan_assets/2.png');
    case '3': return require('../../assets/dolanan_assets/3.png');
    case '4': return require('../../assets/dolanan_assets/4.png');
    case '5': return require('../../assets/dolanan_assets/5.png');
    case '6': return require('../../assets/dolanan_assets/6.png');
    case '7': return require('../../assets/dolanan_assets/7.png');
    case '8': return require('../../assets/dolanan_assets/8.png');
    default: return require('../../assets/dolanan_assets/1.png');
  }
}

function getPlayerOffsetPosition(cell: number, playerId: number, players: Player[]): PercentPosition {
  const basePos = getPercentPosition(cell);
  if (cell === 0) {
    const playersAtStart = players.filter(p => p.position === 0);
    const index = playersAtStart.findIndex(p => p.id === playerId);
    if (index === -1) return basePos;
    // Posisikan di sebelah kiri kotak 1 (kotak 1 y: ~88%, x: ~18.9%)
    const startX = 3.5;
    const spacing = 4.5;
    return { x: startX + index * spacing, y: 88 };
  }
  const playersAtCell = players.filter(p => p.position === cell);
  const index = playersAtCell.findIndex(p => p.id === playerId);
  if (index <= 0 || playersAtCell.length <= 1) return basePos;

  const offsetDistanceX = 2.2;
  const offsetDistanceY = 4.5;
  if (playersAtCell.length === 2) {
    return {
      x: basePos.x + (index === 0 ? -offsetDistanceX : offsetDistanceX),
      y: basePos.y + (index === 0 ? -offsetDistanceY : offsetDistanceY),
    };
  }
  return basePos; // Simplified offset logic
}

function Token({ player, players, profiles }: { player: Player; players: Player[]; profiles?: any }) {
  const targetPos = getPlayerOffsetPosition(player.position, player.id, players);
  const animX = useRef(new Animated.Value(targetPos.x)).current;
  const animY = useRef(new Animated.Value(targetPos.y)).current;
  const animPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animX, { toValue: targetPos.x, friction: ANIMATION_SPEED.SPRING_FRICTION, tension: ANIMATION_SPEED.SPRING_TENSION, useNativeDriver: false }),
      Animated.spring(animY, { toValue: targetPos.y, friction: ANIMATION_SPEED.SPRING_FRICTION, tension: ANIMATION_SPEED.SPRING_TENSION, useNativeDriver: false }),
    ]).start();
  }, [targetPos.x, targetPos.y]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animPulse, { toValue: 1.4, duration: 1000, useNativeDriver: false }),
        Animated.timing(animPulse, { toValue: 1, duration: 1000, useNativeDriver: false })
      ])
    ).start();
  }, []);

  let gacoId = (player as any).gacoId || player.icon;
  if (profiles && profiles[player.id]) {
    gacoId = profiles[player.id].gacoId;
  }
  const gacoSource = getGacoImageSource(gacoId);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: 46,
          height: 56,
          marginLeft: -23,
          marginTop: -28,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 5,
        },
        {
          left: animX.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          top: animY.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
        },
      ]}
    >
      {/* Pulsing Aura / Pointer */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 2,
          width: 32,
          height: 12,
          borderRadius: 16,
          backgroundColor: player.id === 1 ? 'rgba(0, 191, 255, 0.6)' : 'rgba(255, 69, 0, 0.6)',
          transform: [{ scale: animPulse }],
          shadowColor: player.id === 1 ? '#00BFFF' : '#FF4500',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 10,
          elevation: 6,
        }}
      />
      <Image source={gacoSource} style={{ width: 46, height: 56 }} resizeMode="contain" />
    </Animated.View>
  );
}

export default function Board({ players = [], profiles }: BoardProps) {
  return (
    <View style={styles.boardContainer}>
      <Image
        source={require('../../assets/dolanan_assets/board_fix2.png')}
        style={styles.boardImage}
        resizeMode="stretch"
      />

      {/* SIMULATOR OVERLAY */}
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, pointerEvents: 'none', zIndex: 3, opacity: 0 }}>
        {Array.from({ length: 50 }).map((_, i) => {
          const cell = i + 1;
          const pos = getPercentPosition(cell);
          return (
            <View
              key={`sim-${cell}`}
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: 24,
                height: 24,
                marginLeft: -12,
                marginTop: -12,
                backgroundColor: 'rgba(255, 255, 0, 0.5)',
                borderWidth: 1,
                borderColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#000' }}>{cell}</Text>
            </View>
          );
        })}
      </View>

      {players.map((player) => (
        <Token key={`token-${player.id}`} player={player} players={players} profiles={profiles} />
      ))}
    </View>
  );
}
