import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';

const { width: windowWidth } = Dimensions.get('window');
// container has paddingHorizontal: 20 -> 40 total padding.
const ITEM_WIDTH = windowWidth - 40;

const CAROUSEL_IMAGES = [
  { id: '1', source: require('../../assets/dashboard_assets/carousel1.png') },
  { id: '2', source: require('../../assets/dashboard_assets/carousel2.png') },
  { id: '3', source: require('../../assets/dashboard_assets/carousel3.png') },
];

interface DashboardCarouselProps {
  onSelectDolanan: () => void;
  onOpenProfile: () => void;
  onSelectMateri: () => void;
}

export default function DashboardCarousel({ onSelectDolanan, onOpenProfile, onSelectMateri }: DashboardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = (currentIndex + 1) % CAROUSEL_IMAGES.length;
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePress = (index: number) => {
    if (index === 0) onSelectDolanan();
    else if (index === 1) onOpenProfile();
    else if (index === 2) onSelectMateri();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <FlatList
          ref={flatListRef}
          data={CAROUSEL_IMAGES}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item, index }) => (
            <TouchableOpacity activeOpacity={0.9} onPress={() => handlePress(index)}>
              <Image
                source={item.source}
                style={[styles.image, { width: ITEM_WIDTH }]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.dotsContainer}>
        {CAROUSEL_IMAGES.map((_, index) => {
          const isActive = currentIndex === index;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                isActive ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',

  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
    paddingBottom: 25,
  },
  dot: {
    width: 22,
    height: 12,
    borderRadius: 9,
    marginHorizontal: 8,
  },
  activeDot: {
    backgroundColor: '#a65e00ff',
    width: 55,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    width: 55,
  },
});
