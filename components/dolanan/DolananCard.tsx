import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  ImageBackground,
} from 'react-native';
import { Lightbulb, Gamepad2 } from 'lucide-react-native';
import { styles } from "./DolananCardStyles";
import { SoundTouchableOpacity } from '../SoundTouchableOpacity';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

export type TabType = 'pemantik' | 'dolanan';

interface DolananCardProps {
  onPemantikStart?: () => void;
  onDolananStart?: () => void;
}

export default function DolananCard({
  onPemantikStart,
  onDolananStart
}: DolananCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pemantik');

  // Animation values for tabs
  const pemantikScale = useRef(new Animated.Value(1)).current;
  const pemantikTranslateY = useRef(new Animated.Value(0)).current;
  const dolananScale = useRef(new Animated.Value(1)).current;
  const dolananTranslateY = useRef(new Animated.Value(8)).current;

  // Animation values for icon
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const tabData = {
    pemantik: {
      title: 'Pemantik',
      description: 'Mangsuli pitakonan pemantik dhisik kanggo pembuka pasinaon unggah ungguh basa jawa',
      buttonText: 'Mulai Pemantik',
      onPress: onPemantikStart,
      icon: Lightbulb,
      iconColor: '#000000ff',
      bgColor: '#FFFFFF',
      tabBgColor: '#FFFFFF',
      tabTextColor: '#1F2937',

    },
    dolanan: {
      title: 'Dolanan',
      description: 'Ayo dolanan bareng kanca kanca lan uji pemahaman basa kramamu ing kene!',
      buttonText: 'Mulai Dolanan',
      onPress: onDolananStart,
      icon: Gamepad2,
      iconColor: '#FFFFFF',
      bgColor: '#2976BF',
      tabBgColor: '#2976BF',
      tabTextColor: '#FFFFFF',

    },
  };

  const currentTab = tabData[activeTab];
  const IconComponent = currentTab.icon;

  // Pulse animation effect for icon
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  // Rotation animation on tab change
  useEffect(() => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);

  // 3D Tab animation effect
  useEffect(() => {
    if (activeTab === 'pemantik') {
      // Pemantik to front, Dolanan to back
      Animated.parallel([
        Animated.timing(pemantikScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pemantikTranslateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(dolananScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(dolananTranslateY, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Dolanan to front, Pemantik to back
      Animated.parallel([
        Animated.timing(pemantikScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pemantikTranslateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(dolananScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(dolananTranslateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeTab]);

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);

    // Scale animation for content
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.cardWrapper}>
      {/* Unified Card Container */}
      <View style={styles.cardContainer}>
        {/* Tab Switcher Header with 3D Effect */}
        <View style={styles.tabContainer}>
          <Animated.View
            style={[
              styles.tabButtonWrapper,
              {
                transform: [
                  { scale: pemantikScale },
                  { translateY: pemantikTranslateY },
                ],
                zIndex: activeTab === 'pemantik' ? 2 : 1,
              },
            ]}
          >
            <SoundTouchableOpacity
              style={[
                styles.tabButton,
                styles.tabButtonLeft,
                activeTab !== 'pemantik' && styles.tabInactiveLeft,
                { paddingVertical: 0, overflow: 'hidden' }
              ]}
              onPress={() => handleTabPress('pemantik')}
              activeOpacity={1}
            >
              <ImageBackground
                source={require('../../assets/texture/texture2.png')}
                style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 21 }}
                resizeMode="cover"
              >
                <Text style={styles.tabTextPemantik}>
                  Pemantik
                </Text>
              </ImageBackground>
            </SoundTouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.tabButtonWrapper,
              {
                transform: [
                  { scale: dolananScale },
                  { translateY: dolananTranslateY },
                ],
                zIndex: activeTab === 'dolanan' ? 2 : 1,
              },
            ]}
          >
            <SoundTouchableOpacity
              style={[
                styles.tabButton,
                styles.tabButtonRight,
                activeTab !== 'dolanan' && styles.tabInactiveRight,
                { paddingVertical: 0, overflow: 'hidden' }
              ]}
              onPress={() => handleTabPress('dolanan')}
              activeOpacity={1}
            >
              <ImageBackground
                source={require('../../assets/texture/texture1.png')}
                style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 21 }}
                resizeMode="cover"
              >
                <Text style={styles.tabTextDolanan}>
                  Dolanan
                </Text>
              </ImageBackground>
            </SoundTouchableOpacity>
          </Animated.View>
        </View>

        {/* Content Section with Dynamic Background */}
        <AnimatedImageBackground
          source={activeTab === 'pemantik' ? require('../../assets/texture/texture2.png') : require('../../assets/texture/texture1.png')}
          style={[
            styles.contentSection,
            {
              transform: [{ scale: scaleAnim }],
              overflow: 'hidden',
            },
          ]}
          resizeMode="cover"
        >
          {/* Animated Icon */}
          <View style={styles.iconContainer}>
            <Animated.View
              style={{
                transform: [
                  { rotate: spin },
                  { scale: pulseAnim },
                ],
              }}
            >
              <IconComponent
                color={currentTab.iconColor}
                size={60}
                strokeWidth={2}
              />
            </Animated.View>
          </View>

          <Text
            style={[
              styles.contentTitle,
              activeTab === 'dolanan' && styles.contentTitleWhite,
            ]}
          >
            {currentTab.title}
          </Text>

          <Text
            style={[
              styles.contentDescription,
              activeTab === 'dolanan' && styles.contentDescriptionWhite,
            ]}
          >
            {currentTab.description}
          </Text>

          {/* Start Button */}
          <SoundTouchableOpacity
            style={styles.startButton}
            onPress={currentTab.onPress}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>{currentTab.buttonText}</Text>
          </SoundTouchableOpacity>
        </AnimatedImageBackground>
      </View>
    </View>
  );
}
