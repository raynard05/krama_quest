import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  PanResponder,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { styles } from './GacoSelectorStyles'
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';

interface Gaco {
  id: number;
  name: string;
  image: any;
}

interface GacoSelectorProps {
  gacos: Gaco[];
  selectedIndex: number;
  isConfirmed: boolean;
  isTaken?: boolean;
  takenMessage?: string;
  onPrev: () => void;
  onNext: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  mode?: 'lokal' | 'online';
}

export default function GacoSelector({
  gacos,
  selectedIndex,
  isConfirmed,
  isTaken = false,
  takenMessage,
  onPrev,
  onNext,
  onConfirm,
  onCancel,
  mode = 'lokal',
}: GacoSelectorProps) {
  const gacoOpacity = useRef(new Animated.Value(1)).current;

  // Pan responder for swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // More sensitive threshold - activate on any horizontal movement > 5px
        return Math.abs(gestureState.dx) > 5 && !isConfirmed;
      },
      onPanResponderRelease: (_, gestureState) => {
        // Reduced swipe distance requirement from 50 to 30 pixels
        if (gestureState.dx > 30) {
          // Swipe right - go to previous
          onPrev();
        } else if (gestureState.dx < -30) {
          // Swipe left - go to next
          onNext();
        }
      },
    })
  ).current;

  const isOnlineMode = mode === 'online';
  const arrowColor = isOnlineMode ? '#FFFFFF' : '#1F2937';

  return (
    <View>
      <Text style={[
        styles.sectionTitle,
        isOnlineMode && styles.textWhite
      ]}>
        Pilih Gaco Kamu
      </Text>
      
      <View style={styles.gacoSelector}>
        <SoundTouchableOpacity 
          style={[
            styles.gacoArrow,
            isOnlineMode && styles.gacoArrowOnline,
            isConfirmed && styles.gacoArrowDisabled
          ]}
          onPress={onPrev}
          disabled={isConfirmed}
        >
          <ChevronLeft color={arrowColor} size={32} />
        </SoundTouchableOpacity>

        <View style={styles.gacoCarousel} {...panResponder.panHandlers}>
          {/* Previous Gaco (Left) */}
          <Animated.View style={[
            styles.gacoDisplaySide,
            { opacity: isConfirmed ? 0.3 : 0.4 }
          ]}>
            <Image 
              source={gacos[(selectedIndex - 1 + gacos.length) % gacos.length].image} 
              style={styles.gacoImageSide}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Active Gaco (Center) */}
          <Animated.View style={[
            styles.gacoDisplayCenter,
            { opacity: gacoOpacity },
            isTaken && styles.gacoTaken
          ]}>
            <Image 
              source={gacos[selectedIndex].image} 
              style={[
                styles.gacoImageCenter,
                isTaken && styles.gacoImageTaken
              ]}
              resizeMode="contain"
            />
            <Text style={[
              styles.gacoName,
              isOnlineMode && styles.textWhite
            ]}>
              {gacos[selectedIndex].name}
            </Text>
            {isTaken && takenMessage && (
              <Text style={styles.gacoTakenText}>{takenMessage}</Text>
            )}
          </Animated.View>

          {/* Next Gaco (Right) */}
          <Animated.View style={[
            styles.gacoDisplaySide,
            { opacity: isConfirmed ? 0.3 : 0.4 }
          ]}>
            <Image 
              source={gacos[(selectedIndex + 1) % gacos.length].image} 
              style={styles.gacoImageSide}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        <SoundTouchableOpacity 
          style={[
            styles.gacoArrow,
            isOnlineMode && styles.gacoArrowOnline,
            isConfirmed && styles.gacoArrowDisabled
          ]}
          onPress={onNext}
          disabled={isConfirmed}
        >
          <ChevronRight color={arrowColor} size={32} />
        </SoundTouchableOpacity>
      </View>

      {/* Confirm/Cancel Buttons */}
      <View style={styles.gacoButtonContainer}>
        {!isConfirmed ? (
          <SoundTouchableOpacity
            style={[
              styles.confirmButton,
              isOnlineMode && styles.confirmButtonOnline,
              isTaken && styles.confirmButtonDisabled
            ]}
            onPress={onConfirm}
            disabled={isTaken}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.confirmButtonText,
              isOnlineMode && styles.confirmButtonTextOnline
            ]}>
              Pilih
            </Text>
          </SoundTouchableOpacity>
        ) : (
          <View style={styles.gacoButtonRow}>
            <View style={styles.confirmedButton}>
              <Text style={styles.confirmedButtonText}>✓ Dipilih</Text>
            </View>
            <SoundTouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Ganti</Text>
            </SoundTouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
