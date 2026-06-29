import React from 'react';
import { View, Image } from 'react-native';
import styles from './BoardStyle';

export default function Board() {
  return (
    <View style={styles.boardContainer}>
      <Image
        source={require('../../assets/dolanan_assets/board2.png')}
        style={styles.boardImage}
        resizeMode="contain"
      />
    </View>
  );
}
