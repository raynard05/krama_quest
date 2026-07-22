import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { SoundManager } from '../../utils/SoundManager';
import BackButton from '../BackButton';
import { styles } from './MatchGameScreenStyles';

const { width, height } = Dimensions.get('window');

const WORD_PAIRS = [
  { id: 0, left: 'Nedha', right: 'Dhahar', explanation: 'Tembung Krama Aluse "mangan" / "nedha" yaiku "dhahar".' },
  { id: 1, left: 'Tilem', right: 'Sare', explanation: 'Tembung Krama Aluse "turu" / "tilem" yaiku "sare".' },
  { id: 2, left: 'Wangsul', right: 'Kondur', explanation: 'Tembung Krama Aluse "bali" / "wangsul" yaiku "kondur".' },
  { id: 3, left: 'Matur', right: 'Ngendika', explanation: 'Tembung Krama Aluse "omong" / "matur" yaiku "ngendika".' },
  { id: 4, left: 'Ningali', right: 'Mirsani', explanation: 'Tembung Krama Aluse "ndeleng" / "ningali" yaiku "mirsani".' },
  { id: 5, left: 'Sowan', right: 'Rawuh', explanation: 'Tembung Krama Aluse "teka" / "sowan" yaiku "rawuh".' },
  { id: 6, left: 'Ngadeg', right: 'Jumeneng', explanation: 'Tembung Krama Aluse "ngadeg" yaiku "jumeneng".' },
  { id: 7, left: 'Adus', right: 'Siram', explanation: 'Tembung Krama Aluse "adus" yaiku "siram".' },
  { id: 8, left: 'Mbeta', right: 'Ngasta', explanation: 'Tembung Krama Aluse "nggawa" / "mbeta" yaiku "ngasta".' },
  { id: 9, left: 'Tangi', right: 'Wungu', explanation: 'Tembung Krama Aluse "tangi" yaiku "wungu".' },
  { id: 10, left: 'Nyuwun', right: 'Mundhut', explanation: 'Tembung Krama Aluse "njaluk" / "nyuwun" yaiku "mundhut".' },
  { id: 11, left: 'Sakit', right: 'Gerah', explanation: 'Tembung Krama Aluse "lara" / "sakit" yaiku "gerah".' },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface MatchGameScreenProps {
  onBack: () => void;
}

export default function MatchGameScreen({ onBack }: MatchGameScreenProps) {
  const [round, setRound] = useState(0);
  const [leftItems, setLeftItems] = useState<any[]>([]);
  const [rightItems, setRightItems] = useState<any[]>([]);

  // Bounding boxes relative to gameArea
  const leftLayouts = useRef<{ [id: number]: { x: number, y: number, w: number, h: number, cx: number, cy: number } }>({});
  const rightLayouts = useRef<{ [id: number]: { x: number, y: number, w: number, h: number, cx: number, cy: number } }>({});

  const [completedLines, setCompletedLines] = useState<{ id: number, x1: number, y1: number, x2: number, y2: number }[]>([]);
  const [activeLine, setActiveLine] = useState<{ id: number, x1: number, y1: number, x2: number, y2: number } | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ visible: boolean, type: 'correct' | 'wrong' | 'victory' | null, pairId?: number }>({
    visible: false,
    type: null
  });

  useEffect(() => {
    startRound(0);
  }, []);

  // Track offset of the right column
  const rightColumnOffset = useRef({ x: 0, y: 0 });

  const startRound = (r: number) => {
    if (r * 4 >= WORD_PAIRS.length) {
      // Game Complete!
      SoundManager.playVictorySound();
      setSnackbar({ visible: true, type: 'victory' });
      return;
    }
    const currentPairs = WORD_PAIRS.slice(r * 4, r * 4 + 4);
    setLeftItems(shuffleArray([...currentPairs]));
    setRightItems(shuffleArray([...currentPairs]));
    setCompletedLines([]);
    setActiveLine(null);
    setSnackbar({ visible: false, type: null });
    leftLayouts.current = {};
    rightLayouts.current = {};
  };

  const isPointInRect = (px: number, py: number, rect: { x: number, y: number, w: number, h: number }) => {
    // Add some padding to hit target for easier playability
    const pad = 10;
    return px >= rect.x - pad && px <= rect.x + rect.w + pad && py >= rect.y - pad && py <= rect.y + rect.h + pad;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !snackbar.visible, // block interactions if snackbar is visible
      onPanResponderGrant: (evt) => {
        if (snackbar.visible) return;
        const { locationX, locationY } = evt.nativeEvent;
        // Check if touched a left item
        for (const [idStr, rect] of Object.entries(leftLayouts.current)) {
          const id = Number(idStr);
          if (isPointInRect(locationX, locationY, rect)) {
            if (!completedLines.find(line => line.id === id)) {
              setActiveLine({ id, x1: rect.cx, y1: rect.cy, x2: locationX, y2: locationY });
              SoundManager.playButtonClick();
            }
            break;
          }
        }
      },
      onPanResponderMove: (evt) => {
        if (snackbar.visible) return;
        const { locationX, locationY } = evt.nativeEvent;
        setActiveLine(prev => {
          if (!prev) return null;
          return { ...prev, x2: locationX, y2: locationY };
        });
      },
      onPanResponderRelease: (evt) => {
        if (snackbar.visible) return;
        const { locationX, locationY } = evt.nativeEvent;
        
        setActiveLine(prev => {
          if (!prev) return null;
          
          let matchedRightId = -1;
          let matchedRightRect = null;
          for (const [idStr, rect] of Object.entries(rightLayouts.current)) {
            if (isPointInRect(locationX, locationY, rect)) {
              matchedRightId = Number(idStr);
              matchedRightRect = rect;
              break;
            }
          }

          if (matchedRightId === prev.id) {
            SoundManager.playCorrectSound(); 
            setSnackbar({ visible: true, type: 'correct', pairId: prev.id });
            setCompletedLines(lines => {
              return [...lines, { id: prev.id, x1: prev.x1, y1: prev.y1, x2: matchedRightRect!.cx, y2: matchedRightRect!.cy }];
            });
          } else {
            SoundManager.playWrongSound(); 
            setSnackbar({ visible: true, type: 'wrong', pairId: prev.id });
          }
          return null;
        });
      },
      onPanResponderTerminate: () => setActiveLine(null),
    })
  ).current;

  const handleSnackbarClose = () => {
    if (snackbar.type === 'victory') {
      setSnackbar({ visible: false, type: null });
      onBack();
    } else if (snackbar.type === 'correct') {
      if (completedLines.length === 4) {
        setRound(r => {
          startRound(r + 1);
          return r + 1;
        });
      } else {
        setSnackbar({ visible: false, type: null });
      }
    } else {
      setSnackbar({ visible: false, type: null });
    }
  };

  const getSnackbarContent = () => {
    if (!snackbar.visible) return null;
    
    if (snackbar.type === 'correct') {
      return (
        <View style={[styles.snackbarContainer, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.snackbarTitle, { color: '#4CAF50' }]}>Kerja Bagus!</Text>
          <TouchableOpacity style={styles.snackbarButton} onPress={handleSnackbarClose}>
            <Text style={styles.snackbarButtonText}>Lanjut</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (snackbar.type === 'wrong') {
      const pair = WORD_PAIRS.find(p => p.id === snackbar.pairId);
      return (
        <View style={[styles.snackbarContainer, { backgroundColor: '#FADADA' }]}>
          <Text style={[styles.snackbarTitle, { color: '#D32F2F' }]}>ⓧ Kurang Trep!</Text>
          <Text style={styles.snackbarSubtitle}>Mestine ngene :</Text>
          <Text style={styles.snackbarText}>{pair?.left} = {pair?.right}</Text>
          
          <Text style={[styles.snackbarSubtitle, { marginTop: 10 }]}>Katrangan :</Text>
          <Text style={styles.snackbarText}>{pair?.explanation}</Text>
          
          <TouchableOpacity style={styles.snackbarButton} onPress={handleSnackbarClose}>
            <Text style={styles.snackbarButtonText}>Ngerti</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (snackbar.type === 'victory') {
      return (
        <View style={[styles.snackbarContainer, { backgroundColor: '#F5E6D3' }]}>
          <Text style={[styles.snackbarTitle, { color: '#5D4037' }]}>🎉 Sae Sanget!</Text>
          <Text style={[styles.snackbarSubtitle, { color: '#5D4037', fontSize: 16, marginTop: 10 }]}>Sugeng! Sedaya tembung sampun trep.</Text>
          
          <TouchableOpacity style={[styles.snackbarButton, { backgroundColor: '#5D4037' }]} onPress={handleSnackbarClose}>
            <Text style={styles.snackbarButtonText}>Rampung</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/dolanan_assets/match_dolanan.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Latihan Menjodohkan</Text>
            <Text style={styles.subtitle}>
              Gathukake tembung Madya karo Krama Inggil.
            </Text>
            <Text style={styles.roundText}>Ronde {Math.min(round + 1, 3)}/3</Text>
          </View>
        </View>

        <View 
          style={styles.gameArea}
          {...(snackbar.visible ? {} : panResponder.panHandlers)}
        >
          {/* SVG Overlay */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width="100%" height="100%">
              {completedLines.map(line => (
                <Line
                  key={`comp-${line.id}`}
                  x1={line.x1} y1={line.y1}
                  x2={line.x2} y2={line.y2}
                  stroke="#4CAF50"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              ))}
              {activeLine && (
                <Line
                  x1={activeLine.x1} y1={activeLine.y1}
                  x2={activeLine.x2} y2={activeLine.y2}
                  stroke="#FFC107"
                  strokeWidth="6"
                  strokeDasharray="10, 10"
                  strokeLinecap="round"
                />
              )}
            </Svg>
          </View>

          {/* Left Column */}
          <View style={styles.columnLeft} pointerEvents="none">
            {leftItems.map((item) => {
              const isCompleted = completedLines.some(l => l.id === item.id);
              return (
                <View
                  key={`left-${item.id}`}
                  style={[styles.wordBox, isCompleted && styles.wordBoxCompleted]}
                  onLayout={(e) => {
                    const { x, y, width, height } = e.nativeEvent.layout;
                    leftLayouts.current[item.id] = { 
                      x, y, w: width, h: height, 
                      cx: x + width, // connect from right edge of left box
                      cy: y + height / 2 
                    };
                  }}
                >
                  <Text style={[styles.wordText, isCompleted && styles.wordTextCompleted]}>{item.left}</Text>
                </View>
              );
            })}
          </View>

          {/* Right Column */}
          <View style={styles.columnRight} pointerEvents="none" onLayout={(e) => {
            const { x, y } = e.nativeEvent.layout;
            rightColumnOffset.current = { x, y };
          }}>
            {rightItems.map((item) => {
              const isCompleted = completedLines.some(l => l.id === item.id);
              return (
                <View
                  key={`right-${item.id}`}
                  style={[styles.wordBox, isCompleted && styles.wordBoxCompleted]}
                  onLayout={(e) => {
                    const { x, y, width, height } = e.nativeEvent.layout;
                    const absoluteX = rightColumnOffset.current.x + x;
                    const absoluteY = rightColumnOffset.current.y + y;
                    rightLayouts.current[item.id] = { 
                      x: absoluteX, 
                      y: absoluteY, 
                      w: width, 
                      h: height, 
                      cx: absoluteX, // connect to left edge of right box
                      cy: absoluteY + height / 2 
                    };
                  }}
                >
                  <Text style={[styles.wordText, isCompleted && styles.wordTextCompleted]}>{item.right}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {snackbar.visible && (
          <View style={styles.snackbarOverlayWrapper}>
            {getSnackbarContent()}
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}
