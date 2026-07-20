import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import { Player } from '../../types';
import { getGacoImageSource } from './Board';
import BackButton from '../BackButton';
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';

interface GameHeaderProps {
  players: Player[];
  currentPlayerIndex: number;
  onBackToLobby: () => void;
  onResetGame: () => void;
  winner: Player | null;
  profiles?: Record<number, { avatarId: string; bgId: string; gacoId: string }>;
}

export default function GameHeader({
  players,
  currentPlayerIndex,
  onBackToLobby,
  onResetGame,
  winner,
  profiles,
}: GameHeaderProps) {
  const activePlayer = players[currentPlayerIndex];

  // Sort players by position descending to show ranking
  const rankedPlayers = [...players].sort((a, b) => b.position - a.position);

  const renderPlayerIcon = (player: Player, size = 18) => {
    let gacoId = player.icon;
    if (profiles && profiles[player.id]) {
      gacoId = profiles[player.id].gacoId;
    }
    const source = getGacoImageSource(gacoId);
    if (source) {
      return <Image source={source} style={{ width: size, height: size, marginRight: 6 }} resizeMode="contain" />;
    }
    return <Text style={[styles.standingIcon, { color: player.color, fontSize: size - 4, marginRight: 4 }]}>{player.icon}</Text>;
  };

  return (
    <View style={styles.container}>
      {/* Top Bar Navigation */}
      <View style={styles.topBar}>
        <BackButton onPress={onBackToLobby} />

        <SoundTouchableOpacity style={styles.iconButton} onPress={onResetGame} activeOpacity={0.7}>
          <RotateCcw color="#FFFFFF" size={16} />
          <Text style={styles.backText}>Reset</Text>
        </SoundTouchableOpacity>
      </View>

      {/* Turn Indicator */}
      <View style={styles.turnCard}>
        {winner ? (
          <View style={styles.winnerSection}>
            <Text style={styles.victoryTitle}>🎉 KEMENANGAN! 🎉</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              {renderPlayerIcon(winner, 24)}
              <Text style={[styles.winnerName, { color: winner.color, marginTop: 0 }]}>
                {winner.name} Menang!
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.turnSection}>
            <Text style={styles.turnTitle}>Giliran Sekarang</Text>
            <View style={styles.currentPlayerInfo}>
              <View style={[styles.colorIndicator, { backgroundColor: activePlayer.color, shadowColor: activePlayer.color }]} />
              {renderPlayerIcon(activePlayer, 20)}
              <Text style={styles.currentPlayerName}>
                {activePlayer.name}
              </Text>
              <Text style={styles.playerTypeBadge}>
                {activePlayer.type === 'computer' ? '🤖 AI' : '👤 Anda'}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Mini Standings */}
      <View style={styles.standingsContainer}>
        {rankedPlayers.map((player, idx) => {
          const isCurrent = player.id === activePlayer.id && !winner;
          return (
            <View
              key={player.id}
              style={[
                styles.playerStanding,
                isCurrent && { borderColor: player.color, backgroundColor: 'rgba(255,255,255,0.03)' },
              ]}
            >
              <View style={styles.standingLeft}>
                <Text style={styles.rankText}>#{idx + 1}</Text>
                {renderPlayerIcon(player, 16)}
                <Text style={styles.standingName} numberOfLines={1}>
                  {player.name}
                </Text>
              </View>
              <Text style={[styles.positionText, { color: player.color }]}>
                Kotak {player.position}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  turnCard: {
    backgroundColor: 'rgba(30, 30, 50, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  turnSection: {
    alignItems: 'center',
  },
  turnTitle: {
    fontSize: 11,
    color: '#8F8F9F',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  currentPlayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
  },
  currentPlayerName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerTypeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#A0A0B0',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  winnerSection: {
    alignItems: 'center',
  },
  victoryTitle: {
    fontSize: 14,
    color: '#FFDE43',
    fontWeight: '900',
    letterSpacing: 2,
  },
  winnerName: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  standingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  playerStanding: {
    width: '48.5%', // two items per row
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 6,
  },
  standingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankText: {
    color: '#5F5F6F',
    fontSize: 9,
    fontWeight: 'bold',
    marginRight: 4,
  },
  standingIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  standingName: {
    color: '#D0D0E0',
    fontSize: 11,
    fontWeight: 'bold',
    flex: 1,
  },
  positionText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
