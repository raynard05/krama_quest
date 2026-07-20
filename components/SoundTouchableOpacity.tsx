import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { SoundManager } from '../utils/SoundManager';

export const SoundTouchableOpacity: React.FC<TouchableOpacityProps> = (props) => {
  const handlePress = (e: any) => {
    // Play button click sound
    SoundManager.playButtonClick();
    
    // Call the original onPress handler if it exists
    if (props.onPress) {
      props.onPress(e);
    }
  };

  return (
    <TouchableOpacity {...props} onPress={handlePress}>
      {props.children}
    </TouchableOpacity>
  );
};
