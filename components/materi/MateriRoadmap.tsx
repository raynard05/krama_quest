import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  LayoutChangeEvent,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import styles from '../../styles/materi/MateriRoadmapStyles';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface RoadmapNode {
  id: number;
  title: string;
  description: string;
  align: 'left' | 'right';
}

const ROADMAP_DATA: RoadmapNode[] = [
  {
    id: 1,
    title: 'Materi Unggah-Unggah',
    description: 'Sinau bab unggah-unggah kayata pangerten, strata basa, panggunaan subjek lan swasana, solah bawa.',
    align: 'left',
  },
  {
    id: 2,
    title: 'Krama Inggil',
    description: 'Tuladha nggunakake krama inggil.',
    align: 'right',
  },
  {
    id: 3,
    title: 'Krama Madya',
    description: 'Tuladha nggunakake krama madya.',
    align: 'left',
  },
  {
    id: 4,
    title: 'Basa Ngoko',
    description: 'Tuladha nggunakake basa ngoko.',
    align: 'right',
  },
];

interface MateriRoadmapProps {
  visitedNodeIds: number[];
  onNodePress: (nodeId: number) => void;
}

export default function MateriRoadmap({ visitedNodeIds, onNodePress }: MateriRoadmapProps) {
  const [containerWidth, setContainerWidth] = useState(320);
  const offsetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Loop the dash offset to animate the dashed line crawling forward
    const animation = Animated.loop(
      Animated.timing(offsetAnim, {
        toValue: -22, // Moves dashes forward (negative direction of path)
        duration: 1200,
        useNativeDriver: false, // SVG props cannot animate with native driver in RN
      })
    );
    animation.start();
    return () => animation.stop();
  }, [offsetAnim]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

  // Node center X coordinates relative to layout width
  const xLeft = containerWidth * 0.22;
  const xRight = containerWidth * 0.78;

  // Center Y coordinates for each of the 4 rows (140px row height)
  const y1 = 70;
  const y2 = 210;
  const y3 = 350;
  const y4 = 490;

  // S-shape serpentine path connecting centers of nodes (y1 -> y2 -> y3 -> y4)
  const pathData = `
    M ${xLeft} ${y1}
    C ${xLeft} ${y1 + 75}, ${xRight} ${y2 - 75}, ${xRight} ${y2}
    C ${xRight} ${y2 + 75}, ${xLeft} ${y3 - 75}, ${xLeft} ${y3}
    C ${xLeft} ${y3 + 75}, ${xRight} ${y4 - 75}, ${xRight} ${y4}
  `;

  return (
    <View style={styles.container} onLayout={handleLayout}>
      
      {/* Animated SVG Path in background */}
      <View style={styles.svgBackground} pointerEvents="none">
        <Svg width={containerWidth} height={560} viewBox={`0 0 ${containerWidth} 560`}>
          <AnimatedPath
            d={pathData}
            fill="transparent"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeDasharray="9, 7"
            strokeDashoffset={offsetAnim}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      {/* Roadmap Rows on top of path */}
      {ROADMAP_DATA.map((node) => {
        const isLeft = node.align === 'left';
        
        return (
          <View key={node.id} style={styles.roadmapRow}>
            {isLeft ? (
              <>
                {/* Left Side: Circle Node */}
                <TouchableOpacity
                  style={styles.circleColumn}
                  activeOpacity={0.85}
                  onPress={() => onNodePress(node.id)}
                >
                  <View style={[
                    styles.nodeCircle,
                    { backgroundColor: visitedNodeIds.includes(node.id) ? '#FF9F0A' : '#1E6FE3' }
                  ]}>
                    <Text style={styles.circleNumber}>{node.id}</Text>
                  </View>
                  <View style={styles.titleBadge}>
                    <Text style={styles.titleBadgeText}>{node.title}</Text>
                  </View>
                </TouchableOpacity>

                {/* Right Side: Description */}
                <View style={[styles.textColumn, { alignItems: 'flex-start' }]}>
                  <Text style={styles.descriptionText}>{node.description}</Text>
                </View>
              </>
            ) : (
              <>
                {/* Left Side: Description */}
                <View style={[styles.textColumn, { alignItems: 'flex-end' }]}>
                  <Text style={[styles.descriptionText, { textAlign: 'right' }]}>{node.description}</Text>
                </View>

                {/* Right Side: Circle Node */}
                <TouchableOpacity
                  style={styles.circleColumn}
                  activeOpacity={0.85}
                  onPress={() => onNodePress(node.id)}
                >
                  <View style={[
                    styles.nodeCircle,
                    { backgroundColor: visitedNodeIds.includes(node.id) ? '#FF9F0A' : '#1E6FE3' }
                  ]}>
                    <Text style={styles.circleNumber}>{node.id}</Text>
                  </View>
                  <View style={styles.titleBadge}>
                    <Text style={styles.titleBadgeText}>{node.title}</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        );
      })}

    </View>
  );
}
