import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimeoutProps {
  isEnabled?: boolean;
  onTimeUp?: () => void;
}

export default function Timeout({ isEnabled = true, onTimeUp }: TimeoutProps) {
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    if (!isEnabled) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEnabled, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  if (!isEnabled) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{`${minutes}:${seconds}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,

  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins-Bold',
  }
});
