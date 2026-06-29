import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Animated } from 'react-native';
import { getAvatarSource } from '../profile/ProfileAvatars';
import { getBatikSource } from '../profile/ProfileAvatars';
import { vw, rs, scaleFont, vh } from '../../utils/responsive';
import { Scale } from 'lucide-react-native';
interface DaduProps {
  value: number;
  onRoll: () => void;
  disabled?: boolean;
  avatarId?: string;
  batikId?: string;
  userName?: string;
}

export default function Dadu({ value, onRoll, disabled = false, avatarId, userName , batikId }: DaduProps) {
  // Animation for shining effect
  const shinePosition = useRef(new Animated.Value(-410)).current;

  // Animation for GIF rotation (triggered on tap)
  const gifRotateAnim = useRef(new Animated.Value(0)).current;

  // Animation for batik swing left-right (looping)
  const batikSwingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Loop animation: 3 shine lines moving from top to bottom
    Animated.loop(
      Animated.sequence([
        Animated.timing(shinePosition, {
          toValue: 440,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shinePosition, {
          toValue: -440,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(700), // Pause before next loop
      ])
    ).start();

    // Loop animation: batik swing left-right
    Animated.loop(
      Animated.sequence([
        Animated.timing(batikSwingAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(batikSwingAnim, {
          toValue: -1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(batikSwingAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Trigger GIF rotate on tap
  const handleTap = () => {
    gifRotateAnim.setValue(0);
    Animated.timing(gifRotateAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      gifRotateAnim.setValue(0);
    });
  };

  // Interpolate gif rotate: 0 -> 360deg
  const gifSpin = gifRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Interpolate batik swing: -1 -> -10deg, 0 -> 0deg, 1 -> 10deg
  const batikSwing = batikSwingAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  // Render dots based on dice value
  const renderDots = () => {
    const dots = [];
    
    // Dot positions for each number (1-6)
    const dotPatterns: Record<number, string[]> = {
      1: ['center'],
      2: ['topLeft', 'bottomRight'],
      3: ['topLeft', 'center', 'bottomRight'],
      4: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
      5: ['topLeft', 'topRight', 'center', 'bottomLeft', 'bottomRight'],
      6: ['topLeft', 'topRight', 'middleLeft', 'middleRight', 'bottomLeft', 'bottomRight'],
    };

    const pattern = dotPatterns[value] || [];
    


       
   



    return (
      <View style={styles.dotsContainer}>
        {/* Top Row */}
        <View style={styles.dotRow}>
          <View style={[styles.dot, pattern.includes('topLeft') && styles.dotVisible]} />
          <View style={[styles.dot, pattern.includes('topCenter') && styles.dotVisible]} />
          <View style={[styles.dot, pattern.includes('topRight') && styles.dotVisible]} />
        </View>

        {/* Middle Row */}
        <View style={styles.dotRow}>
          <View style={[styles.dot, pattern.includes('middleLeft') && styles.dotVisible]} />
          <View style={[styles.dot, pattern.includes('center') && styles.dotVisible]} />
          <View style={[styles.dot, pattern.includes('middleRight') && styles.dotVisible]} />
        </View>

        {/* Bottom Row */}
        <View style={styles.dotRow}>
          <View style={[styles.dot, pattern.includes('bottomLeft') && styles.dotVisible]} />
          <View style={[styles.dot, pattern.includes('bottomCenter') && styles.dotVisible]} />
          <View style={[styles.dot, pattern.includes('bottomRight') && styles.dotVisible]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.outerDarkBlueLayer} onTouchStart={handleTap}>
      <View style={styles.shineContainer}>
        <TouchableOpacity
          style={[styles.daduContainer, disabled && styles.daduDisabled]}
          onPress={onRoll}
          disabled={disabled}
          activeOpacity={1}
        >
          {/* Avatar Profile */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarRing}>
              <Image
                source={getAvatarSource(avatarId)}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>
          </View>

         <Animated.Image
            source={getBatikSource(batikId)}
            style={[styles.batikBackground, { transform: [{ rotate: batikSwing }] }]}
            resizeMode="cover"
          />
         <Animated.Image
            source={getBatikSource(batikId)}
            style={[styles.batikBackground2, { transform: [{ rotate: batikSwing }] }]}
            resizeMode="cover"
          />

          {/* User Name */}
          {userName && (
            <Text style={styles.userNameText} numberOfLines={1}>
             #{userName}
            </Text>
          )}

            
          <View>
            <Animated.Image
              source={require('../../assets/dolanan_assets/snake_motion2.gif')}
              style={[styles.snakegifcontainer, { transform: [{ rotate: gifSpin }] }]}
              resizeMode="contain"
            />
          </View>
          <View>
            <Animated.Image
              source={require('../../assets/dolanan_assets/snake_motion2.gif')}
              style={[styles.snakegifcontainer2, { transform: [{ rotate: '0deg' }, { scaleX: -1 }, { rotate: gifSpin }] }]}
              resizeMode="contain"
            />
          </View>
      
          {/* Multi-layer Border: White → Black → Dice */}
          <View style={styles.whiteBorderLayer}>
            <View style={styles.blackBorderLayer}>
              <View style={styles.daduFace}>
                {renderDots()}
              </View>
            </View>
          </View>

          <Text style={styles.rollText}>
            {disabled ? 'Tunggu...' : 'Kocok Dadu'}
          </Text>
        </TouchableOpacity>

        {/* Animated Shine Overlay - 3 Vertical Lines */}
        <Animated.View
          style={[
            styles.shineOverlay,
            {
              transform: [{ translateY: shinePosition }],
            },
          ]}
        >
          {/* Shine Line 1 */}
          <View style={styles.shineLine} />
          {/* Shine Line 2 */}
          <View style={[styles.shineLine, { top: 200 }]} />
          {/* Shine Line 3 */}
          <View style={[styles.shineLine, { top: 400 }]} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Outer layer: Dark Blue border
  outerDarkBlueLayer: {
    width: 315,
    borderWidth: 9,
    borderColor: '#1a5a8f', // Dark blue
    borderRadius: 60,
   
    justifyContent:"center",
    alignItems:"center",
    marginTop: -645,
    left:vh(2),
       transform: [{ scale: 1.05 }],
  },
  shineContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  daduContainer: {
    backgroundColor: '#2976BF',
    height: 440,
    width: 300,
    borderWidth: 15,
    borderColor: '#ffffff', // White border (already exists)
 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,


  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    pointerEvents: 'none',
  },
  shineLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#f4f4f4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    borderWidth:3.5,
    borderColor:"#ffffff32",

  },
  daduDisabled: {
    opacity: 1,
  },
  avatarContainer: {
    zIndex:2,
    position:"absolute",
    marginBottom: 8,
    marginTop: -290,
    right:9,
    
  },
  avatarRing: {
    zIndex:2,
    width: 90,
    height: 90,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userNameText: {
    position:"absolute",
    zIndex:2,
    fontSize: 19,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginTop:-150,
    paddingHorizontal: 10,
  },
  // White border layer around dice
  whiteBorderLayer: {
    padding: 6,
    borderRadius: 18,
  },
  // Black border layer around dice
  blackBorderLayer: {
    padding: 3,
    borderRadius: 15,
  },
  daduFace: {
    marginTop:30,
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 1,
  },
  dotsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
  dotVisible: {
    backgroundColor: '#1F2937',
    borderRadius: 50,
  },
  rollText: {
    paddingTop: 5,
    fontSize: 19,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },


  snakegifcontainer: {
    zIndex: 2,
    width: 75,
    height: 75,
    marginTop: -110,
    left: -80,
    backgroundColor: '#2976BF',
    borderRadius: 30,
    transform: [{ rotate: '0deg' }],
  },

  snakegifcontainer2: {
    position:"absolute",
    zIndex: 2,
    width: 75,
    height: 75,
    bottom:-260,
    right:-120,
    backgroundColor: '#2976BF',
    borderRadius: 30,
    transform: [{ rotate: '0deg' }, { scaleX: -1 }], 
  },

  batikBackground :{
    position: "absolute",
    zIndex:2,
    width:150,
    height:33.5,
    borderRadius:2,
    borderWidth:3.5,
    borderColor:"#ffff",
    bottom:20,
    left:20,
    borderTopRightRadius:20,

    borderBottomLeftRadius:20,
  },
  batikBackground2 :{
    position: "absolute",
    zIndex:2,
    width:150,
    height:33.5,
    borderRadius:2,
    borderWidth:3.5,
    borderColor:"#ffff",
    bottom:70,
    left:20,
    borderTopRightRadius:20,
    borderBottomLeftRadius:20,


  }

});


