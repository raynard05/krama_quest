import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { GameLog } from '../types';

interface GameLogsProps {
  logs: GameLog[];
}

export default function GameLogs({ logs }: GameLogsProps) {
  const flatListRef = useRef<FlatList>(null);

  // Auto scroll to the end when a new log arrives
  useEffect(() => {
    if (logs.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [logs.length]);

  const getLogStyle = (type: GameLog['type']) => {
    switch (type) {
      case 'ladder':
        return { borderColor: '#39FF14', backgroundColor: 'rgba(57, 255, 20, 0.05)' };
      case 'snake':
        return { borderColor: '#FF3366', backgroundColor: 'rgba(255, 51, 102, 0.05)' };
      case 'bounce':
        return { borderColor: '#FF8C00', backgroundColor: 'rgba(255, 140, 0, 0.05)' };
      case 'win':
        return { borderColor: '#FFDE43', backgroundColor: 'rgba(255, 222, 67, 0.08)' };
      default:
        return { borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(255, 255, 255, 0.01)' };
    }
  };

  const renderItem = ({ item }: { item: GameLog }) => {
    const cardStyle = getLogStyle(item.type);
    
    return (
      <View style={[styles.logCard, cardStyle]}>
        <View style={styles.logLeft}>
          <Text style={[styles.playerTag, { backgroundColor: item.playerColor }]}>
            {item.playerName[0].toUpperCase()}
          </Text>
          <View style={styles.textContainer}>
            <Text style={styles.logMessage}>
              <Text style={[styles.playerNameText, { color: item.playerColor }]}>{item.playerName}</Text>{' '}
              {item.message}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Permainan</Text>
      
      {logs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Mulai mengocok dadu untuk bermain!</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={logs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(30, 30, 50, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    maxHeight: 180, // constraints vertical space so everything fits
  },
  title: {
    fontSize: 12,
    color: '#8F8F9F',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#5F5F6F',
    fontSize: 12,
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 5,
  },
  logCard: {
    borderLeftWidth: 3,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerTag: {
    color: '#0A0A12',
    fontWeight: 'bold',
    fontSize: 10,
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  logMessage: {
    color: '#D0D0E0',
    fontSize: 12,
    lineHeight: 16,
  },
  playerNameText: {
    fontWeight: 'bold',
  },
});
